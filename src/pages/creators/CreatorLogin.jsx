import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CreatorAuth.css';

const CreatorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/creators/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        login(data.data);
        navigate('/creator/onboarding');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      // Offline / dev fallback for demo account
      if (email?.toLowerCase() === 'creator@cpeb.com' && password === 'password123') {
        login({
          _id: '654321098765432109876543',
          name: 'Demo Influencer',
          email: 'creator@cpeb.com',
          role: 'CREATOR',
          token: 'demo-token-123'
        });
        navigate('/creator/onboarding');
      } else {
        setError('Cannot connect to server. Please try the demo account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    login({
      _id: '654321098765432109876543',
      name: 'Demo Influencer',
      email: 'creator@cpeb.com',
      role: 'CREATOR',
      token: 'demo-token-123'
    });
    navigate('/creator/onboarding');
  };

  return (
    <div className="creator-auth-page">
      <div className="creator-auth-container">
        <header className="creator-auth-header">
          <h2>Welcome Back</h2>
          <p>Log in to your creator dashboard or complete your profile application.</p>
        </header>

        {/* Demo Account Box */}
        <div style={{
          background: '#EEF9F2',
          border: '1px solid #A7F3D0',
          borderRadius: '8px',
          padding: '1.25rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0a7c3e', letterSpacing: '0.08em' }}>
              ⚡ DEMO INFLUENCER ACCOUNT
            </span>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#1E293B' }}>
            <strong>Email:</strong> <code>creator@cpeb.com</code><br/>
            <strong>Password:</strong> <code>password123</code>
          </p>
          <button 
            type="button" 
            onClick={handleQuickDemo}
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '0.85rem' }}
          >
            ⚡ LOG IN AS DEMO INFLUENCER
          </button>
        </div>

        {error && <div className="creator-auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="creator-auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
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
              placeholder="Enter your password"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="creator-auth-footer">
          <p>Don't have a profile yet? <Link to="/for-creators/register">Create one</Link></p>
        </div>
      </div>
    </div>
  );
};

export default CreatorLogin;
