/**
 * Register.jsx — Registration page
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function Register() {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim())     return setError('Please enter your name.');
    if (!email.trim())    return setError('Please enter your email.');
    if (!password.trim()) return setError('Please enter a password.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);
    try {
      const data = await authAPI.register(name.trim(), email.trim(), password);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* Left decorative panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <span className="auth-illustration">📚</span>
          <h2>Start Your Journey</h2>
          <p>
            Create your free FlashLearn account and begin mastering
            any subject with micro-learning flashcards.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join FlashLearn — it's free!</p>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                className="form-control"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button
              className="btn btn-primary w-full"
              type="submit"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? 'Creating account...' : '🚀 Create Account'}
            </button>
          </form>

          <p className="auth-link-text">
            Already have an account?{' '}
            <Link to="/login">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
