/**
 * Navbar.jsx — Top navigation bar
 * Shows branding + links depending on whether user is logged in.
 */
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/');
  }

  // Check if the current path matches the link
  function isActive(path) {
    return location.pathname === path ? 'active' : '';
  }

  return (
    <nav className="navbar">
      {/* Brand */}
      <Link to="/" className="navbar-brand">
        <span>🧠</span> FlashLearn
      </Link>

      {/* Right side */}
      <div className="navbar-right">
        {user ? (
          // Logged in: show name + logout
          <>
            <div className="navbar-links">
              <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
              <Link to="/explore"   className={isActive('/explore')}>Explore</Link>
            </div>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)', padding: '0 8px' }}>
              Hi, <strong>{user.name.split(' ')[0]}</strong>
            </span>
            <button className="btn btn-sm btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          // Logged out: show login/register
          <div className="navbar-links">
            <Link to="/explore" className={isActive('/explore')}>Explore</Link>
            <Link to="/login"   className={isActive('/login')}>Login</Link>
            <Link to="/register">
              <button className="btn btn-sm btn-primary">Get Started</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
