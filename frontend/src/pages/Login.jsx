/**
 * Login.jsx — Login page
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email.trim())    return setError('Please enter your email.');
    if (!password.trim()) return setError('Please enter your password.');

    setLoading(true);
    try {
      const data = await authAPI.login(email.trim(), password);
      login(data.token, data.user);       // save to context + localStorage
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* Left decorative panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <span className="auth-illustration">🧠</span>
          <h2>Welcome Back!</h2>
          <p>Log in to continue your learning journey with FlashLearn.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right">
        <div className="auth-form-container">
          <h1 className="auth-title">Log In</h1>
          <p className="auth-subtitle">Enter your credentials to continue</p>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit}>
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
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button
              className="btn btn-primary w-full"
              type="submit"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? 'Logging in...' : '🔓 Log In'}
            </button>
          </form>

          <p className="auth-link-text">
            Don't have an account?{' '}
            <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
