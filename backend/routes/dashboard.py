from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User
from models.flashcard import Flashcard
from models.progress import Progress

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('', methods=['GET'])
@jwt_required()
def get_dashboard():
    """
    Return dashboard stats for the logged-in user.
    Includes: total cards created, learned count, progress %, recent cards, category counts.
    """
    user_id = get_jwt_identity()
    user    = User.query.get(int(user_id))
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Count this user's flashcards
    total_cards = Flashcard.query.filter_by(user_id=int(user_id)).count()
    
    # Count progress entries where status = 'known'
    learned_count = Progress.query.filter_by(
        user_id=int(user_id), status='known'
    ).count()
    
    # Total flashcards the user has interacted with
    total_progress = Progress.query.filter_by(user_id=int(user_id)).count()
    
    # Progress percentage based on ALL flashcards available in the system
    total_system_cards = Flashcard.query.count()
    progress_pct = round((learned_count / total_system_cards * 100), 1) if total_system_cards > 0 else 0
    
    # 5 most recent flashcards by this user
    recent_cards = (
        Flashcard.query
        .filter_by(user_id=int(user_id))
        .order_by(Flashcard.created_at.desc())
        .limit(5)
        .all()
    )
    
    # Category breakdown for this user's cards
    from sqlalchemy import func
    category_counts = (
        db.session.query(Flashcard.category, func.count(Flashcard.id))
        .filter_by(user_id=int(user_id))
        .group_by(Flashcard.category)
        .all()
    )
    
    categories = [{'name': cat, 'count': count} for cat, count in category_counts]
    
    return jsonify({
        'user':            user.to_dict(),
        'total_cards':     total_cards,
        'learned_count':   learned_count,
        'reviewed_count':  total_progress - learned_count,
        'progress_pct':    progress_pct,
        'recent_cards':    [card.to_dict() for card in recent_cards],
        'categories':      categories,
        'total_system':    total_system_cards
    }), 200
