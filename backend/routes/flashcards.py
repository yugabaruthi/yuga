from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.flashcard import Flashcard, CATEGORIES
from models.user import User

flashcards_bp = Blueprint('flashcards', __name__)


@flashcards_bp.route('', methods=['GET'])
def get_all_flashcards():
    """
    Get all flashcards — for the Explore page.
    Supports optional query params: ?category=Python&search=flask
    No authentication required (public explore).
    """
    category = request.args.get('category', '').strip()
    search   = request.args.get('search', '').strip()
    
    query = Flashcard.query
    
    if category:
        query = query.filter_by(category=category)
    
    if search:
        # Search in both question and answer fields
        query = query.filter(
            db.or_(
                Flashcard.question.ilike(f'%{search}%'),
                Flashcard.answer.ilike(f'%{search}%')
            )
        )
    
    flashcards = query.order_by(Flashcard.created_at.desc()).all()
    
    return jsonify({
        'flashcards': [card.to_dict() for card in flashcards],
        'total':      len(flashcards),
        'categories': CATEGORIES
    }), 200


@flashcards_bp.route('', methods=['POST'])
@jwt_required()
def create_flashcard():
    """Create a new flashcard. Requires JWT. Expects JSON: { question, answer, category }"""
    user_id = get_jwt_identity()
    data    = request.get_json()
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    question = data.get('question', '').strip()
    answer   = data.get('answer', '').strip()
    category = data.get('category', 'General').strip()
    
    if not question:
        return jsonify({'message': 'Question is required'}), 400
    if not answer:
        return jsonify({'message': 'Answer is required'}), 400
    if category not in CATEGORIES:
        return jsonify({'message': f'Category must be one of: {", ".join(CATEGORIES)}'}), 400
    
    new_card = Flashcard(
        question=question,
        answer=answer,
        category=category,
        user_id=int(user_id)
    )
    db.session.add(new_card)
    db.session.commit()
    
    return jsonify({
        'message':   'Flashcard created!',
        'flashcard': new_card.to_dict()
    }), 201


@flashcards_bp.route('/<int:card_id>', methods=['GET'])
def get_flashcard(card_id):
    """Get a single flashcard by ID."""
    card = Flashcard.query.get(card_id)
    if not card:
        return jsonify({'message': 'Flashcard not found'}), 404
    return jsonify({'flashcard': card.to_dict()}), 200


@flashcards_bp.route('/<int:card_id>', methods=['PUT'])
@jwt_required()
def update_flashcard(card_id):
    """Update a flashcard. Only the creator can edit it."""
    user_id = get_jwt_identity()
    card    = Flashcard.query.get(card_id)
    
    if not card:
        return jsonify({'message': 'Flashcard not found'}), 404
    
    # Authorization: only the owner can edit
    if card.user_id != int(user_id):
        return jsonify({'message': 'You can only edit your own flashcards'}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    question = data.get('question', '').strip()
    answer   = data.get('answer', '').strip()
    category = data.get('category', card.category).strip()
    
    if not question:
        return jsonify({'message': 'Question is required'}), 400
    if not answer:
        return jsonify({'message': 'Answer is required'}), 400
    if category not in CATEGORIES:
        return jsonify({'message': f'Invalid category'}), 400
    
    card.question = question
    card.answer   = answer
    card.category = category
    db.session.commit()
    
    return jsonify({'message': 'Flashcard updated!', 'flashcard': card.to_dict()}), 200


@flashcards_bp.route('/<int:card_id>', methods=['DELETE'])
@jwt_required()
def delete_flashcard(card_id):
    """Delete a flashcard. Only the creator can delete it."""
    user_id = get_jwt_identity()
    card    = Flashcard.query.get(card_id)
    
    if not card:
        return jsonify({'message': 'Flashcard not found'}), 404
    
    # Authorization: only the owner can delete
    if card.user_id != int(user_id):
        return jsonify({'message': 'You can only delete your own flashcards'}), 403
    
    db.session.delete(card)
    db.session.commit()
    
    return jsonify({'message': 'Flashcard deleted!'}), 200


@flashcards_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_flashcards():
    """Get all flashcards created by the currently logged-in user."""
    user_id = get_jwt_identity()
    cards   = Flashcard.query.filter_by(user_id=int(user_id)).order_by(Flashcard.created_at.desc()).all()
    
    return jsonify({
        'flashcards': [card.to_dict() for card in cards],
        'total':      len(cards)
    }), 200
