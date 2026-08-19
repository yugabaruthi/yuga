from extensions import db
from datetime import datetime

class Progress(db.Model):
    """Tracks whether a user knows or needs to review a specific flashcard."""
    
    __tablename__ = 'progress'
    
    id           = db.Column(db.Integer, primary_key=True)
    user_id      = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    flashcard_id = db.Column(db.Integer, db.ForeignKey('flashcards.id'), nullable=False)
    
    # 'known' = user clicked "I Know", 'review' = user clicked "Review Again"
    status       = db.Column(db.String(20), nullable=False, default='review')
    review_count = db.Column(db.Integer, default=0)
    updated_at   = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id':           self.id,
            'user_id':      self.user_id,
            'flashcard_id': self.flashcard_id,
            'status':       self.status,
            'review_count': self.review_count,
            'updated_at':   self.updated_at.isoformat()
        }
