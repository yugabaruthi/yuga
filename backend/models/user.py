from extensions import db
from datetime import datetime

class User(db.Model):
    """Represents a registered user in the FlashLearn system."""
    
    __tablename__ = 'users'
    
    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(100), nullable=False)
    email      = db.Column(db.String(120), unique=True, nullable=False)
    password   = db.Column(db.String(256), nullable=False)   # hashed, never plain text
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    flashcards = db.relationship('Flashcard', backref='creator', lazy=True, cascade='all, delete-orphan')
    progress   = db.relationship('Progress',  backref='user',    lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Return a safe dictionary (no password) for API responses."""
        return {
            'id':         self.id,
            'name':       self.name,
            'email':      self.email,
            'created_at': self.created_at.isoformat()
        }
