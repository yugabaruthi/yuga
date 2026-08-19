/**
 * ProtectedRoute.jsx
 * Wraps pages that require the user to be logged in.
 * Redirects to /login if not authenticated.
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // While checking localStorage token, show a spinner
  if (loading) return <LoadingSpinner />;

  // Not logged in → redirect to login page
  if (!user) return <Navigate to="/login" replace />;

  // Logged in → render the child page
  return children;
}
