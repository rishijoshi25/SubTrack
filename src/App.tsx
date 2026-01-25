import React, { useState } from 'react';
import AuthProvider from './auth/AuthProvider';
import './App.css';
import { useAuth } from './auth/useAuth';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import AddSubscription from './components/sidebar/AddSubscription';
import Subscriptions from './components/sidebar/Subscriptions';

export default function App(){
  function AppRoutes() {
    const {user, loading} = useAuth();

    if(loading){
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: '#6b7280'
        }}>
          Loading...
        </div>
      );
    }

    return (
      <Routes>
        {/* Public route - Auth Form */}
        <Route 
          path="/login" 
          element={!user ? <AuthForm /> : <Navigate to="/dashboard" replace />} 
        />

        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/subscriptions" 
          element={user ? <Subscriptions /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/add-subscription" 
          element={user ? <AddSubscription /> : <Navigate to="/login" replace />} 
        />

        {/* Default redirect - go to dashboard if logged in, login if not */}
        <Route 
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
        />

        {/* Catch all - redirect to home */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    );
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}


const AuthForm = (): React.JSX.Element => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        setError('Check your email for the confirmation link!');
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>

        <div className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className={error.includes('Check your email') ? 'alert alert-success' : 'alert alert-error'}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        <div className="auth-toggle">
          <button onClick={() => setIsSignUp(!isSignUp)} className="link-button">
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}