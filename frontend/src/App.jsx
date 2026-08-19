/**
 * App.jsx — Root component
 * Sets up React Router routes.
 * Wraps everything with AuthProvider for global auth state.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout components
import Navbar        from './components/Navbar';
import Sidebar       from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home           from './pages/Home';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Dashboard      from './pages/Dashboard';
import MyFlashcards   from './pages/MyFlashcards';
import CreateFlashcard from './pages/CreateFlashcard';
import Explore        from './pages/Explore';
import Learn          from './pages/Learn';
import Progress       from './pages/Progress';
import Profile        from './pages/Profile';

// Layout wrapper for authenticated pages (with sidebar)
function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Navbar is shown on ALL pages */}
        <Navbar />

        <Routes>
          {/* Public pages */}
          <Route path="/"        element={<Home />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explore" element={
            <AppLayout>
              <Explore />
            </AppLayout>
          } />

          {/* Protected pages (require login) */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/my-flashcards" element={
            <ProtectedRoute>
              <AppLayout><MyFlashcards /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <AppLayout><CreateFlashcard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/learn" element={
            <ProtectedRoute>
              <AppLayout><Learn /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <AppLayout><Progress /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <AppLayout><Profile /></AppLayout>
            </ProtectedRoute>
          } />

          {/* 404 fallback */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '120px 24px' }}>
              <div style={{ fontSize: 80 }}>🔍</div>
              <h2 style={{ fontSize: 28, fontWeight: 800, margin: '16px 0 8px' }}>Page Not Found</h2>
              <p style={{ color: 'var(--text-secondary)' }}>The page you're looking for doesn't exist.</p>
              <a href="/" style={{ display: 'inline-block', marginTop: 20 }}>
                <button className="btn btn-primary">Go Home</button>
              </a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
