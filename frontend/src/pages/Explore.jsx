/**
 * Explore.jsx — Browse all flashcards created by all users
 * Supports search and category filter
 */
import { useState, useEffect, useCallback } from 'react';
import { flashcardsAPI, CATEGORIES } from '../services/api';
import FlashcardItem from '../components/FlashcardItem';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Explore() {
  const [cards,      setCards]    = useState([]);
  const [loading,    setLoading]  = useState(true);
  const [error,      setError]    = useState('');
  const [search,     setSearch]   = useState('');
  const [category,   setCategory] = useState('');

  // Fetch cards whenever search or category changes
  const fetchCards = useCallback(() => {
    setLoading(true);
    flashcardsAPI.getAll(category, search)
      .then(data => setCards(data.flashcards))
      .catch(err  => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, category]);

  useEffect(() => {
    // Debounce search: wait 400ms after user stops typing
    const timer = setTimeout(fetchCards, 400);
    return () => clearTimeout(timer);
  }, [fetchCards]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🔍 Explore Flashcards</h1>
        <p className="page-subtitle">Browse flashcards shared by the FlashLearn community</p>
      </div>

      {/* Search bar */}
      <div className="search-bar-wrapper">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search questions and answers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category filter chips */}
      <div className="filter-chips">
        <button
          className={`chip ${category === '' ? 'active' : ''}`}
          onClick={() => setCategory('')}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`chip ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat === category ? '' : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {error   && <ErrorMessage message={error} />}
      {loading ? (
        <LoadingSpinner message="Searching flashcards..." />
      ) : cards.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🔎</span>
          <h3>No flashcards found</h3>
          <p>Try a different search term or category.</p>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Found <strong>{cards.length}</strong> flashcard{cards.length !== 1 ? 's' : ''}
            {category && ` in "${category}"`}
            {search   && ` for "${search}"`}
          </p>
          <div className="flashcard-grid">
            {cards.map(card => (
              <FlashcardItem key={card.id} card={card} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
