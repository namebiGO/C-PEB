import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CreatorAuth.css';

const CreatorRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/creators/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        login(data.data);
        // After successful registration, redirect directly to the creator onboarding application
        navigate('/creator/onboarding');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="creator-auth-page">
      <div className="creator-auth-container">
        <header className="creator-auth-header">
          <h2>Join C-PEB as a Creator</h2>
          <p>Create your creator profile, connect with brands, and discover opportunities that match your audience and content.</p>
        </header>

        {error && <div className="creator-auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="creator-auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Amit Kumar"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a secure password"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              minLength={6}
            />
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '0.75rem', marginTop: '1rem' }}>
            <input 
              type="checkbox" 
              id="agreeTerms" 
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ width: 'auto', marginTop: '0.25rem' }}
            />
            <label htmlFor="agreeTerms" style={{ fontSize: '0.85rem', color: 'var(--text-2)', fontWeight: 'normal' }}>
              I agree to the Terms of Service and Privacy Policy.
            </label>
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Creator Account'}
          </button>
        </form>

        <div className="creator-auth-footer">
          <p>Already have an account? <Link to="/for-creators/login">Log in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default CreatorRegister;
