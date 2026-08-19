/**
 * AuthContext.jsx
 * Global auth state — provides user, login, logout to every component.
 * Wrap the entire app with <AuthProvider> in App.jsx.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true while checking token on load

  // On first load, check if there's a saved token and fetch the profile
  useEffect(() => {
    const token = localStorage.getItem('flashlearn_token');
    if (token) {
      authAPI.getProfile()
        .then(data => setUser(data.user))
        .catch(() => localStorage.removeItem('flashlearn_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Save token and user after login/register
  function login(token, userData) {
    localStorage.setItem('flashlearn_token', token);
    setUser(userData);
  }

  // Clear token and user
  function logout() {
    localStorage.removeItem('flashlearn_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this in any component: const { user, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
