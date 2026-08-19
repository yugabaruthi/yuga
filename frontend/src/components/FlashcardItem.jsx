/**
 * FlashcardItem.jsx — Single flashcard display card
 * Used in My Flashcards and Explore pages.
 * Props: card, showActions (bool), onEdit, onDelete
 */
import { useState } from 'react';
import CategoryBadge from './CategoryBadge';

export default function FlashcardItem({ card, showActions = false, onEdit, onDelete }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className={`flashcard-item ${revealed ? 'revealed' : ''}`}>
      {/* Top row: category badge + actions */}
      <div className="flashcard-item-header">
        <CategoryBadge category={card.category} />
        {showActions && (
          <div className="flashcard-item-actions">
            <button className="btn btn-sm btn-secondary" onClick={() => onEdit && onEdit(card)}>
              ✏️ Edit
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete && onDelete(card.id)}>
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Question */}
      <p className="flashcard-item-question">{card.question}</p>

      {/* Answer (hidden until revealed) */}
      <div className="flashcard-item-answer">{card.answer}</div>

      {/* Creator (shown in explore) */}
      {!showActions && (
        <p className="flashcard-creator">👤 {card.creator_name}</p>
      )}

      {/* Reveal button */}
      <button
        className="btn btn-sm btn-secondary"
        style={{ marginTop: 14, width: '100%' }}
        onClick={() => setRevealed(!revealed)}
      >
        {revealed ? '🙈 Hide Answer' : '👁️ Show Answer'}
      </button>
    </div>
  );
}
