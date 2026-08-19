from extensions import db
from datetime import datetime

# Allowed categories for flashcards
CATEGORIES = [
    'Python', 'Java', 'C++', 'DBMS',
    'Web Development', 'Computer Networks', 'General'
]

class Flashcard(db.Model):
    """Represents a single flashcard with a question, answer and category."""
    
    __tablename__ = 'flashcards'
    
    id         = db.Column(db.Integer, primary_key=True)
    question   = db.Column(db.Text, nullable=False)
    answer     = db.Column(db.Text, nullable=False)
    category   = db.Column(db.String(50), nullable=False, default='General')
    user_id    = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to progress
    progress_entries = db.relationship('Progress', backref='flashcard', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, creator_name=None):
        """Return dictionary suitable for JSON API response."""
        return {
            'id':           self.id,
            'question':     self.question,
            'answer':       self.answer,
            'category':     self.category,
            'user_id':      self.user_id,
            'creator_name': creator_name or (self.creator.name if self.creator else 'Unknown'),
            'created_at':   self.created_at.isoformat()
        }
