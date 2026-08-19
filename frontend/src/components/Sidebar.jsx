/**
 * Sidebar.jsx — Left navigation panel (shown only when logged in)
 */
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/dashboard',       icon: '🏠', label: 'Dashboard' },
  { path: '/my-flashcards',   icon: '📚', label: 'My Flashcards' },
  { path: '/create',          icon: '➕', label: 'Create Card' },
  { path: '/explore',         icon: '🔍', label: 'Explore' },
  { path: '/learn',           icon: '🧠', label: 'Learn' },
  { path: '/progress',        icon: '📊', label: 'Progress' },
  { path: '/profile',         icon: '👤', label: 'Profile' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <p className="sidebar-section-title">Menu</p>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
