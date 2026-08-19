/**
 * Profile.jsx — User profile page
 * Shows account info and allows updating name.
 */
import { useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name,       setName]       = useState(user?.name || '');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [editing,    setEditing]    = useState(false);

  // Get first letter of name for avatar
  const initials = user?.name?.charAt(0).toUpperCase() || '?';

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) return setError('Name cannot be empty.');
    setLoading(true);
    setError('');
    try {
      const data = await authAPI.updateProfile(name.trim());
      setUser(data.user);
      setSuccessMsg('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Format date nicely
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">👤 Profile</h1>
        <p className="page-subtitle">Your FlashLearn account</p>
      </div>

      {error      && <ErrorMessage message={error} />}
      {successMsg && <div className="alert alert-success">✅ {successMsg}</div>}

      {/* Profile card */}
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        {/* Avatar */}
        <div className="profile-avatar">{initials}</div>

        {editing ? (
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="profileName">Your Name</label>
              <input
                id="profileName"
                type="text"
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ textAlign: 'center' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : '💾 Save'}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => { setEditing(false); setName(user?.name || ''); }}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 6 }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>{user?.email}</p>
            <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 24 }}>
              Member since {joinDate}
            </p>
            <button className="btn btn-secondary" onClick={() => setEditing(true)}>
              ✏️ Edit Name
            </button>
          </>
        )}
      </div>

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
        {[
          { label: 'Email',        value: user?.email,      icon: '📧' },
          { label: 'Member Since', value: joinDate,          icon: '📅' },
        ].map(item => (
          <div key={item.label} className="card" style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{item.label}</p>
            <p style={{ fontWeight: 600, fontSize: 14, wordBreak: 'break-all' }}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
