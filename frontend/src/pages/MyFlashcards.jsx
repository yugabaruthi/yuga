/**
 * MyFlashcards.jsx — View, edit, delete the logged-in user's flashcards
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { flashcardsAPI } from '../services/api';
import FlashcardItem from '../components/FlashcardItem';
import FlashcardForm from '../components/FlashcardForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function MyFlashcards() {
  const [cards,      setCards]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [editCard,   setEditCard]   = useState(null);   // card currently being edited
  const [saving,     setSaving]     = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  function loadCards() {
    setLoading(true);
    flashcardsAPI.getMy()
      .then(data => setCards(data.flashcards))
      .catch(err  => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadCards, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this flashcard?')) return;
    try {
      await flashcardsAPI.delete(id);
      setCards(prev => prev.filter(c => c.id !== id));
      showSuccess('Flashcard deleted!');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(formData) {
    setSaving(true);
    try {
      const data = await flashcardsAPI.update(editCard.id, formData.question, formData.answer, formData.category);
      setCards(prev => prev.map(c => c.id === editCard.id ? data.flashcard : c));
      setEditCard(null);
      showSuccess('Flashcard updated!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function showSuccess(msg) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  if (loading) return <LoadingSpinner message="Loading your flashcards..." />;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">My Flashcards</h1>
          <p className="page-subtitle">You have {cards.length} flashcard{cards.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/create">
          <button className="btn btn-primary">➕ Create New</button>
        </Link>
      </div>

      {error      && <ErrorMessage message={error} />}
      {successMsg && <div className="alert alert-success">✅ {successMsg}</div>}

      {/* Edit Modal */}
      {editCard && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          z: 200, zIndex: 200, padding: 24
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontWeight: 700, marginBottom: 20 }}>✏️ Edit Flashcard</h2>
            <FlashcardForm
              initialData={editCard}
              onSubmit={handleUpdate}
              onCancel={() => setEditCard(null)}
              loading={saving}
            />
          </div>
        </div>
      )}

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">📭</span>
          <h3>No flashcards yet</h3>
          <p>Create your first flashcard to get started!</p>
          <Link to="/create"><button className="btn btn-primary">Create Flashcard</button></Link>
        </div>
      ) : (
        <div className="flashcard-grid">
          {cards.map(card => (
            <FlashcardItem
              key={card.id}
              card={card}
              showActions={true}
              onEdit={setEditCard}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
