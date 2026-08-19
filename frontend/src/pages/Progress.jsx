/**
 * Progress.jsx — Learning progress overview page
 */
import { useState, useEffect } from 'react';
import { progressAPI } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Progress() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    progressAPI.get()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading progress..." />;
  if (error)   return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📊 Learning Progress</h1>
        <p className="page-subtitle">Track how much you've learned</p>
      </div>

      {/* Summary stat cards */}
      <div className="progress-stat-grid">
        {[
          { label: 'Total Cards',     value: data?.total_cards   || 0, color: 'var(--primary)',   emoji: '📚' },
          { label: 'Cards Known',     value: data?.known_count   || 0, color: 'var(--success)',   emoji: '✅' },
          { label: 'Under Review',    value: data?.review_count  || 0, color: 'var(--warning)',   emoji: '🔁' },
          { label: 'Cards Remaining', value: data?.remaining     || 0, color: 'var(--secondary)', emoji: '📌' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{s.emoji}</div>
            <div className="progress-big-num" style={{ fontSize: 40 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Overall Progress</h3>
        <ProgressBar percentage={data?.progress_pct || 0} label={`${data?.known_count || 0} of ${data?.total_cards || 0} cards known`} />
        <p style={{ marginTop: 12, fontSize: 14, color: 'var(--text-secondary)' }}>
          {data?.progress_pct === 0
            ? "Start the learning mode to track your progress!"
            : data?.progress_pct >= 80
            ? "🔥 Excellent work! You're almost there!"
            : data?.progress_pct >= 50
            ? "💪 Great progress! Keep going!"
            : "🚀 You're on your way! Keep learning!"}
        </p>
      </div>

      {/* Category breakdown */}
      {data?.categories?.length > 0 && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Progress by Category</h3>
          <div className="category-progress-list">
            {data.categories.map(cat => (
              <div key={cat.category} className="category-progress-item">
                <div className="category-progress-header">
                  <span className="category-name">{cat.category}</span>
                  <span className="category-pct">
                    {cat.known}/{cat.total} cards • {cat.percentage}%
                  </span>
                </div>
                <ProgressBar percentage={cat.percentage} showLabel={false} />
              </div>
            ))}
          </div>
        </div>
      )}

      {!data?.categories?.length && (
        <div className="empty-state">
          <span className="empty-state-icon">📭</span>
          <h3>No progress data yet</h3>
          <p>Go to Learning Mode and start marking cards as known or review!</p>
        </div>
      )}
    </div>
  );
}
