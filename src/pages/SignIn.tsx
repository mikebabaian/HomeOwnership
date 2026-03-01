import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Show a success banner if redirected from Register
  const justRegistered = (location.state as any)?.registered === true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err?.message ?? 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-block">
      <div className="grid" style={{ justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>
          <h2 style={{ marginBottom: 8 }}>Sign In</h2>
          <p className="muted" style={{ marginBottom: 24 }}>
            Sign in to your Own Well Services account to access your saved information and tools.
          </p>

          {justRegistered && (
            <div className="alert alert-success" style={{ marginBottom: 16 }}>
              Account created successfully! Sign in below.
            </div>
          )}

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: 16 }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="signin-email">Email Address</label>
              <input
                id="signin-email"
                type="email"
                className="form-control"
                placeholder="john@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label htmlFor="signin-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-label="Show/hide password"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#888',
                    fontSize: 14,
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 4 }}
              disabled={submitting}
            >
              {submitting ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 18, textAlign: 'center', fontSize: 15 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--hos-green, #2F7D5C)', textDecoration: 'underline' }}>
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
