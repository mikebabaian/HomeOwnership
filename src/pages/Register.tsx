import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  [key: string]: string;
}

const initialForm: FormData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Errors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Enter a valid email address.';
    if (!formData.password) newErrors.password = 'Password is required.';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(formData.email, formData.password);
      // Registration succeeded — send them to sign-in
      navigate('/sign-in', { state: { registered: true } });
    } catch (err: any) {
      setApiError(err?.message ?? 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-block">
      <div className="grid" style={{ justifyContent: 'center' }}>
        <div style={{ width: '100%' }}>
          <h2 style={{ marginBottom: 8 }}>Create Your Account</h2>
          <p className="muted" style={{ marginBottom: 24 }}>Enter your information below to create an account.</p>
          {apiError && (
            <div className="alert alert-danger" style={{ marginBottom: 16 }}>{apiError}</div>
          )}
          <form onSubmit={handleSubmit} noValidate className="register-grid-form">
            <div className="register-grid">
              <div className="register-col">
                <label htmlFor="register-fullName">Full Name</label>
                <input
                  id="register-fullName"
                  name="fullName"
                  type="text"
                  className="form-control"
                  placeholder="John Smith"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                {errors.fullName && <div className="muted" style={{ color: '#b91c1c', marginTop: 2 }}>{errors.fullName}</div>}
              {/* end of left column */}
            </div>
            <div className="register-col">
                <label htmlFor="register-email">Email Address</label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="john@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <div className="muted" style={{ color: '#b91c1c', marginTop: 2 }}>{errors.email}</div>}
              </div>
            </div>
            {/* Password fields at the end, full width */}
            <div style={{ margin: '2rem 0 0.5rem 0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: 'var(--hos-green, #2F7D5C)' }}>Create Password</h3>
            </div>
            <div className="register-password-row" style={{ gridTemplateColumns: '1fr' }}>
              <div style={{ width: '100%' }}>
                <label htmlFor="register-password">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                  <button type="button" aria-label="Show/hide password" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 10, top: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 14 }}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <div className="muted" style={{ color: '#b91c1c', marginTop: 2 }}>{errors.password}</div>}
              </div>
              <div style={{ width: '100%' }}>
                <label htmlFor="register-confirmPassword">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="register-confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                  <button type="button" aria-label="Show/hide confirm password" onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: 10, top: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 14 }}>
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.confirmPassword && <div className="muted" style={{ color: '#b91c1c', marginTop: 2 }}>{errors.confirmPassword}</div>}
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} disabled={submitting}>
              {submitting ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>
          <div style={{ marginTop: 18, textAlign: 'center', fontSize: 15 }}>
            Already have an account?{' '}
            <a href="/sign-in" style={{ color: 'var(--hos-green, #2F7D5C)', textDecoration: 'underline', cursor: 'pointer' }}>Log in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
