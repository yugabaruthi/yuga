from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.user import User

# Blueprint groups all auth-related routes under /api/auth
auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user. Expects JSON: { name, email, password }"""
    data = request.get_json()
    
    # --- Validation ---
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    name     = data.get('name', '').strip()
    email    = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()
    
    if not name:
        return jsonify({'message': 'Name is required'}), 400
    if not email:
        return jsonify({'message': 'Email is required'}), 400
    if not password:
        return jsonify({'message': 'Password is required'}), 400
    if len(password) < 6:
        return jsonify({'message': 'Password must be at least 6 characters'}), 400
    
    # Check if email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'An account with this email already exists'}), 409
    
    # Hash the password — never store plain text!
    hashed_password = generate_password_hash(password)
    
    # Create and save the new user
    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    # Generate JWT token so the user is immediately logged in after registering
    token = create_access_token(identity=str(new_user.id))
    
    return jsonify({
        'message': 'Account created successfully! Welcome to FlashLearn!',
        'token':   token,
        'user':    new_user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login an existing user. Expects JSON: { email, password }"""
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    email    = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    
    # Look up user by email
    user = User.query.filter_by(email=email).first()
    
    # Check password (use Werkzeug's check_password_hash)
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Generate JWT token
    token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'message': f'Welcome back, {user.name}!',
        'token':   token,
        'user':    user.to_dict()
    }), 200


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get the logged-in user's profile. Requires Authorization header with Bearer token."""
    user_id = get_jwt_identity()
    user    = User.query.get(int(user_id))
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify({'user': user.to_dict()}), 200


@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update the user's name. Expects JSON: { name }"""
    user_id = get_jwt_identity()
    user    = User.query.get(int(user_id))
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    data = request.get_json()
    name = data.get('name', '').strip() if data else ''
    
    if not name:
        return jsonify({'message': 'Name is required'}), 400
    
    user.name = name
    db.session.commit()
    
    return jsonify({'message': 'Profile updated!', 'user': user.to_dict()}), 200
