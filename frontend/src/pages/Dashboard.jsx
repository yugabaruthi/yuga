/**
 * Dashboard.jsx — Main dashboard page after login
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import FlashcardItem from '../components/FlashcardItem';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Dashboard() {
  const { user } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    dashboardAPI.get()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error)   return <ErrorMessage message={error} />;

  return (
    <div>
      {/* Welcome banner */}
      <div className="welcome-banner">
        <div>
          <h2>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
          <p>Keep up the great work — you're making progress every day!</p>
          <div className="welcome-actions" style={{ marginTop: 16 }}>
            <Link to="/create">
              <button className="btn btn-white btn-sm">➕ Create Flashcard</button>
            </Link>
            <Link to="/learn">
              <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '2px solid rgba(255,255,255,0.3)' }}>
                🧠 Start Learning
              </button>
            </Link>
            <Link to="/explore">
              <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '2px solid rgba(255,255,255,0.3)' }}>
                🔍 Explore Cards
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <StatCard icon="📚" value={data?.total_cards   || 0} label="My Flashcards"   colorClass="purple" />
        <StatCard icon="✅" value={data?.learned_count || 0} label="Cards Learned"   colorClass="green"  />
        <StatCard icon="🔁" value={data?.reviewed_count || 0} label="Under Review"   colorClass="orange" />
        <StatCard icon="📈" value={`${data?.progress_pct || 0}%`} label="Overall Progress" colorClass="pink" />
      </div>

      {/* Dashboard Grid: recent cards + categories */}
      <div className="dashboard-grid">
        {/* Recent Cards */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 18 }}>📋 Recent Flashcards</h3>
            <Link to="/my-flashcards">
              <button className="btn btn-sm btn-secondary">View All</button>
            </Link>
          </div>
          {data?.recent_cards?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.recent_cards.map(card => (
                <div key={card.id} style={{
                  padding: '14px 16px',
                  background: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)'
                }}>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{card.question}</p>
                  <span style={{ fontSize: 12, color: 'var(--text-light)' }}>{card.category}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 32 }}>
              <span className="empty-state-icon" style={{ fontSize: 40 }}>📭</span>
              <p>No flashcards yet. Create your first one!</p>
              <Link to="/create"><button className="btn btn-primary btn-sm">Create Now</button></Link>
            </div>
          )}
        </div>

        {/* Right column: Progress + Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Progress */}
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>📊 Learning Progress</h3>
            <ProgressBar percentage={data?.progress_pct || 0} label="Overall" />
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ textAlign: 'center', padding: 12, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--success)' }}>{data?.learned_count || 0}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Known</div>
              </div>
              <div style={{ textAlign: 'center', padding: 12, background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--warning)' }}>{data?.reviewed_count || 0}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Reviewing</div>
              </div>
            </div>
            <Link to="/learn" style={{ display: 'block', marginTop: 16 }}>
              <button className="btn btn-primary w-full">🚀 Start Learning</button>
            </Link>
          </div>

          {/* Categories */}
          {data?.categories?.length > 0 && (
            <div className="card">
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>🗂️ My Categories</h3>
              {data.categories.map(cat => (
                <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{cat.name}</span>
                  <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700 }}>{cat.count} cards</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
