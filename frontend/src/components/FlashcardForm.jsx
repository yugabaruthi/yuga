/**
 * FlashcardForm.jsx — Create / Edit flashcard form
 * Props: initialData (for edit), onSubmit(data), onCancel, loading
 */
import { useState } from 'react';
import { CATEGORIES } from '../services/api';
import ErrorMessage from './ErrorMessage';

export default function FlashcardForm({ initialData = null, onSubmit, onCancel, loading }) {
  const [question, setQuestion] = useState(initialData?.question || '');
  const [answer,   setAnswer]   = useState(initialData?.answer   || '');
  const [category, setCategory] = useState(initialData?.category || 'Python');
  const [error,    setError]    = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!question.trim()) return setError('Please enter a question.');
    if (!answer.trim())   return setError('Please enter an answer.');

    onSubmit({ question: question.trim(), answer: answer.trim(), category });
  }

  return (
    <form onSubmit={handleSubmit}>
      <ErrorMessage message={error} />

      {/* Category */}
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          className="form-control"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Question */}
      <div className="form-group">
        <label htmlFor="question">Question</label>
        <textarea
          id="question"
          className="form-control"
          rows={3}
          placeholder="What is the question you want to learn?"
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />
      </div>

      {/* Answer */}
      <div className="form-group">
        <label htmlFor="answer">Answer</label>
        <textarea
          id="answer"
          className="form-control"
          rows={4}
          placeholder="What is the answer?"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button className="btn btn-primary" type="submit" disabled={loading} style={{ flex: 1 }}>
          {loading ? 'Saving...' : initialData ? '✏️ Update Flashcard' : '✨ Create Flashcard'}
        </button>
        {onCancel && (
          <button className="btn btn-secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
