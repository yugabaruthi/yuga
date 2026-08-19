from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.progress import Progress
from models.flashcard import Flashcard
from sqlalchemy import func

progress_bp = Blueprint('progress', __name__)


@progress_bp.route('', methods=['GET'])
@jwt_required()
def get_progress():
    """
    Get the learning progress for the logged-in user.
    Returns overall stats and per-category breakdown.
    """
    user_id = get_jwt_identity()
    
    # All progress records for this user
    all_progress = Progress.query.filter_by(user_id=int(user_id)).all()
    
    known_count  = sum(1 for p in all_progress if p.status == 'known')
    review_count = sum(1 for p in all_progress if p.status == 'review')
    total_seen   = len(all_progress)
    
    # Total flashcards in the whole system
    total_cards = Flashcard.query.count()
    remaining   = total_cards - total_seen
    
    # Percentage
    progress_pct = round((known_count / total_cards * 100), 1) if total_cards > 0 else 0
    
    # Category-wise breakdown
    category_progress = (
        db.session.query(
            Flashcard.category,
            func.count(Flashcard.id).label('total'),
            func.sum(
                db.case((Progress.status == 'known', 1), else_=0)
            ).label('known')
        )
        .join(Progress, Progress.flashcard_id == Flashcard.id, isouter=True)
        .filter(db.or_(Progress.user_id == int(user_id), Progress.user_id == None))
        .group_by(Flashcard.category)
        .all()
    )
    
    categories = []
    for cat, total, known in category_progress:
        known    = known or 0
        cat_pct  = round((known / total * 100), 1) if total > 0 else 0
        categories.append({
            'category':     cat,
            'total':        total,
            'known':        known,
            'percentage':   cat_pct
        })
    
    return jsonify({
        'total_cards':    total_cards,
        'total_seen':     total_seen,
        'known_count':    known_count,
        'review_count':   review_count,
        'remaining':      max(0, remaining),
        'progress_pct':   progress_pct,
        'categories':     categories,
        'all_progress':   [p.to_dict() for p in all_progress]
    }), 200


@progress_bp.route('', methods=['POST'])
@jwt_required()
def update_progress():
    """
    Update or create a progress record for a flashcard.
    Expects JSON: { flashcard_id, status }   status = 'known' or 'review'
    """
    user_id = get_jwt_identity()
    data    = request.get_json()
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    flashcard_id = data.get('flashcard_id')
    status       = data.get('status', 'review')
    
    if not flashcard_id:
        return jsonify({'message': 'flashcard_id is required'}), 400
    if status not in ('known', 'review'):
        return jsonify({'message': 'Status must be "known" or "review"'}), 400
    
    # Make sure the flashcard exists
    card = Flashcard.query.get(flashcard_id)
    if not card:
        return jsonify({'message': 'Flashcard not found'}), 404
    
    # Find existing progress or create new
    progress = Progress.query.filter_by(
        user_id=int(user_id),
        flashcard_id=flashcard_id
    ).first()
    
    if progress:
        progress.status       = status
        progress.review_count += 1
    else:
        progress = Progress(
            user_id=int(user_id),
            flashcard_id=flashcard_id,
            status=status,
            review_count=1
        )
        db.session.add(progress)
    
    db.session.commit()
    
    return jsonify({
        'message':  'Progress updated!',
        'progress': progress.to_dict()
    }), 200
