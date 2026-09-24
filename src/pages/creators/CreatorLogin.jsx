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
        setError('Cannot connect to server. Please try the demo account button.');
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
    <div className="creator-auth-container">
      <div className="creator-auth-box">
        <h2>Welcome Back</h2>
        <p className="creator-auth-subtitle">Log in to your creator dashboard or complete your application.</p>
        
        {/* Demo Account Box */}
        <div style={{
          background: '#EEF9F2',
          border: '1px solid #A7F3D0',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0a7c3e', letterSpacing: '0.08em' }}>
              ⚡ DEMO INFLUENCER ACCOUNT
            </span>
          </div>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#1E293B' }}>
            <strong>Email:</strong> <code>creator@cpeb.com</code><br/>
            <strong>Password:</strong> <code>password123</code>
          </p>
          <button 
            type="button" 
            onClick={handleQuickDemo}
            style={{
              width: '100%',
              background: '#0a7c3e',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.6rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              letterSpacing: '0.04em'
            }}
          >
            ⚡ LOG IN AS DEMO INFLUENCER &rarr;
          </button>
        </div>

        {error && <div className="creator-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="creator-form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="creator-form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="creator-btn-submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="creator-auth-footer">
          Don't have a profile yet? <Link to="/for-creators/register">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default CreatorLogin;
