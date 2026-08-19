/**
 * Learn.jsx — Interactive quiz/learning mode
 * Displays one flashcard at a time with flip animation.
 * User can mark as "I Know" or "Review Again".
 */
import { useState, useEffect } from 'react';
import { flashcardsAPI, progressAPI, CATEGORIES } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import CategoryBadge from '../components/CategoryBadge';
import ProgressBar from '../components/ProgressBar';

export default function Learn() {
  const [cards,       setCards]       = useState([]);
  const [index,       setIndex]       = useState(0);
  const [showAnswer,  setShowAnswer]  = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [category,    setCategory]    = useState('');
  const [knownIds,    setKnownIds]    = useState(new Set());
  const [reviewIds,   setReviewIds]   = useState(new Set());
  const [updating,    setUpdating]    = useState(false);
  const [finished,    setFinished]    = useState(false);

  // Load cards based on selected category
  useEffect(() => {
    setLoading(true);
    setIndex(0);
    setShowAnswer(false);
    setFinished(false);
    flashcardsAPI.getAll(category, '')
      .then(data => {
        setCards(data.flashcards);
        if (data.flashcards.length === 0) setFinished(true);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  const current = cards[index];
  const total   = cards.length;
  const done    = knownIds.size + reviewIds.size;
  const pct     = total > 0 ? Math.round((knownIds.size / total) * 100) : 0;

  async function markProgress(status) {
    if (!current || updating) return;
    setUpdating(true);
    try {
      await progressAPI.update(current.id, status);
      if (status === 'known') {
        setKnownIds(prev => new Set([...prev, current.id]));
      } else {
        setReviewIds(prev => new Set([...prev, current.id]));
      }
      nextCard();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  }

  function nextCard() {
    setShowAnswer(false);
    if (index + 1 >= cards.length) {
      setFinished(true);
    } else {
      setIndex(i => i + 1);
    }
  }

  function prevCard() {
    setShowAnswer(false);
    if (index > 0) setIndex(i => i - 1);
  }

  function randomCard() {
    setShowAnswer(false);
    const newIndex = Math.floor(Math.random() * cards.length);
    setIndex(newIndex);
  }

  function restart() {
    setIndex(0);
    setShowAnswer(false);
    setFinished(false);
    setKnownIds(new Set());
    setReviewIds(new Set());
  }

  if (loading) return <LoadingSpinner message="Loading flashcards..." />;

  return (
    <div className="learn-page">
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1 className="page-title">🧠 Learning Mode</h1>
        <p className="page-subtitle">One card at a time — rate your knowledge</p>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Category selector */}
      <div style={{ marginBottom: 24 }}>
        <div className="filter-chips" style={{ justifyContent: 'center' }}>
          <button className={`chip ${category === '' ? 'active' : ''}`} onClick={() => setCategory('')}>
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`chip ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div style={{ marginBottom: 8 }}>
          <ProgressBar percentage={pct} label={`${knownIds.size} of ${total} known`} />
        </div>
      )}
      <p className="learn-progress-info">
        Card {Math.min(index + 1, total)} of {total} •{' '}
        <span style={{ color: 'var(--success)' }}>✅ {knownIds.size} known</span> •{' '}
        <span style={{ color: 'var(--warning)' }}>🔁 {reviewIds.size} reviewing</span>
      </p>

      {/* No cards */}
      {total === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">📭</span>
          <h3>No flashcards found</h3>
          <p>Try a different category or create some flashcards first!</p>
        </div>
      ) : finished ? (
        /* Session complete screen */
        <div className="flip-card" style={{ minHeight: 300 }}>
          <span style={{ fontSize: 60 }}>🎉</span>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '16px 0 8px' }}>Session Complete!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            You went through {total} cards and knew {knownIds.size} of them ({pct}%)
          </p>
          <div className="learn-actions">
            <button className="btn btn-primary" onClick={restart}>🔄 Start Again</button>
          </div>
        </div>
      ) : current ? (
        /* Active learning card */
        <div className="learn-card-wrapper">
          <div className="flip-card">
            <span className="flip-card-category">{current.category}</span>
            <p className="flip-card-question">{current.question}</p>

            {showAnswer ? (
              <>
                <div className="flip-card-answer">{current.answer}</div>
                <div className="learn-actions">
                  <button
                    className="btn btn-primary"
                    disabled={updating}
                    onClick={() => markProgress('known')}
                    style={{ background: 'var(--success)' }}
                  >
                    ✅ I Know This
                  </button>
                  <button
                    className="btn btn-secondary"
                    disabled={updating}
                    onClick={() => markProgress('review')}
                  >
                    🔁 Review Again
                  </button>
                </div>
              </>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={() => setShowAnswer(true)}>
                👁️ Show Answer
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="learn-nav">
            <button className="btn btn-secondary btn-sm" onClick={prevCard} disabled={index === 0}>
              ← Previous
            </button>
            <button className="btn btn-secondary btn-sm" onClick={randomCard}>
              🎲 Random
            </button>
            <button className="btn btn-secondary btn-sm" onClick={nextCard} disabled={index >= total - 1}>
              Next →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
