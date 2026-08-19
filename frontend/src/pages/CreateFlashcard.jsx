/**
 * CreateFlashcard.jsx — Create a new flashcard
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { flashcardsAPI } from '../services/api';
import FlashcardForm from '../components/FlashcardForm';
import ErrorMessage from '../components/ErrorMessage';

export default function CreateFlashcard() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const navigate  = useNavigate();

  async function handleCreate(formData) {
    setLoading(true);
    setError('');
    try {
      await flashcardsAPI.create(formData.question, formData.answer, formData.category);
      navigate('/my-flashcards');
    } catch (err) {
      setError(err.message || 'Failed to create flashcard.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Create Flashcard ✨</h1>
        <p className="page-subtitle">Add a new question and answer to your collection</p>
      </div>

      <div className="card">
        <ErrorMessage message={error} />
        <FlashcardForm
          onSubmit={handleCreate}
          onCancel={() => navigate('/my-flashcards')}
          loading={loading}
        />
      </div>

      {/* Tip box */}
      <div className="alert alert-info" style={{ marginTop: 20 }}>
        💡 <strong>Tip:</strong> Keep questions short and specific. One concept per card works best!
      </div>
    </div>
  );
}
