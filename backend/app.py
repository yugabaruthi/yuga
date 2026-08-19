"""
FlashLearn Backend — main entry point
Run with:  python app.py
"""
import os
from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db, jwt

# Import route Blueprints
from routes.auth       import auth_bp
from routes.flashcards import flashcards_bp
from routes.dashboard  import dashboard_bp
from routes.progress   import progress_bp

# Import models so SQLAlchemy can create the tables
from models.user      import User      # noqa: F401
from models.flashcard import Flashcard # noqa: F401
from models.progress  import Progress  # noqa: F401


def create_app():
    """Application factory — creates and configures the Flask app."""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions with the app
    db.init_app(app)
    jwt.init_app(app)
    
    # Universal CORS: allows local dev + all Vercel deployments automatically
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    
    # Register blueprints (route groups)
    app.register_blueprint(auth_bp,       url_prefix='/api/auth')
    app.register_blueprint(flashcards_bp, url_prefix='/api/flashcards')
    app.register_blueprint(dashboard_bp,  url_prefix='/api/dashboard')
    app.register_blueprint(progress_bp,   url_prefix='/api/progress')
    
    # Create database tables if they don't exist yet
    with app.app_context():
        db_folder = os.path.join(os.path.dirname(__file__), '..', 'database')
        os.makedirs(db_folder, exist_ok=True)
        db.create_all()
        print('[OK] Database tables created/verified.')
    
    return app


# Create the app
app = create_app()

if __name__ == '__main__':
    print('[START] FlashLearn Backend starting on http://localhost:5000')
    app.run(debug=True, port=5000)
