/**
 * Home.jsx — Landing page with hero, features, CTA
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '📚', title: 'Create',       desc: 'Make flashcards for any topic in seconds.' },
  { icon: '🔄', title: 'Exchange',     desc: 'Explore and learn from flashcards shared by others.' },
  { icon: '🧠', title: 'Learn',        desc: 'Interactive quiz mode — one card at a time.' },
  { icon: '🎯', title: 'Track',        desc: 'Watch your progress grow day by day.' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* ---- HERO ---- */}
      <section className="hero">
        <span className="hero-tag">🚀 Micro-Learning Platform</span>
        <h1>
          Learn Small.<br />
          <span>Remember More.</span>
        </h1>
        <p className="hero-desc">
          Create, exchange and learn through beautifully simple flashcards.
          Master any subject with bite-sized micro-learning.
        </p>
        <div className="hero-buttons">
          {user ? (
            <>
              <Link to="/dashboard">
                <button className="btn btn-primary btn-lg">Go to Dashboard</button>
              </Link>
              <Link to="/learn">
                <button className="btn btn-white btn-lg">Start Learning 🧠</button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/register">
                <button className="btn btn-primary btn-lg">Start Learning Free</button>
              </Link>
              <Link to="/explore">
                <button className="btn btn-white btn-lg">Explore Flashcards</button>
              </Link>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="hero-stats">
          {[
            { num: '100+', label: 'Flashcards Created' },
            { num: '7',    label: 'Categories' },
            { num: '∞',    label: 'Learning Possibilities' },
          ].map(s => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-num">{s.num}</span>
              <p className="hero-stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- FEATURES ---- */}
      <section className="features-section">
        <h2 className="section-title">Everything You Need to Learn</h2>
        <p className="section-subtitle">A complete micro-learning toolkit built for students</p>
        <div className="features-grid">
          {features.map(f => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section style={{ background: 'var(--bg-card)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="section-title">How FlashLearn Works</h2>
          <p className="section-subtitle">Three simple steps to master any topic</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginTop: 40 }}>
            {[
              { step: '01', title: 'Create Cards', desc: 'Add questions and answers on any topic you want to study.' },
              { step: '02', title: 'Explore & Learn', desc: 'Browse cards created by others and use quiz mode to test yourself.' },
              { step: '03', title: 'Track Progress', desc: 'Mark cards as known or for review. Watch your percentage grow.' },
            ].map(s => (
              <div key={s.step}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), #2D2770)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 800, margin: '0 auto 16px'
                }}>{s.step}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="cta-section">
        <h2>Ready to Start Learning?</h2>
        <p>Join FlashLearn today and master any subject with micro-learning.</p>
        <Link to={user ? '/dashboard' : '/register'}>
          <button className="btn btn-white btn-lg">
            {user ? 'Go to Dashboard' : 'Create Free Account'}
          </button>
        </Link>
      </section>
    </div>
  );
}
