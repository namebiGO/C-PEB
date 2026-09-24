import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CreatorDashboard.css';

const CreatorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [latestReview, setLatestReview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/creators/profile/me', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        if (data.data.latestReview) {
          setLatestReview(data.data.latestReview);
        }
      } else {
        // If 404, it means no profile exists yet (DRAFT basically).
        if (res.status !== 404) {
          setError(data.error || 'Failed to fetch profile');
        }
      }
    } catch (err) {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/for-creators/login');
  };

  if (loading) {
    return <div className="creator-dashboard-container">Loading...</div>;
  }

  const getStatusBanner = () => {
    if (!profile || profile.status === 'DRAFT') {
      return (
        <div className="status-banner draft">
          <div>
            <h3>Profile Incomplete</h3>
            <p>Your profile is in draft mode. Complete the application so brands can discover you.</p>
          </div>
          <Link to="/creator/onboarding" className="primary-action-btn">Continue Application &rarr;</Link>
        </div>
      );
    }
    
    switch (profile.status) {
      case 'PENDING_REVIEW':
        return (
          <div className="status-banner pending_review">
            <div>
              <h3>Your profile is under review.</h3>
              <p>Thank you for applying to join C-PEB. Our team will review your profile before it appears publicly.</p>
            </div>
            <Link to="/creator/onboarding?step=4" className="secondary-action-btn">Preview Application &rarr;</Link>
          </div>
        );
      case 'CHANGES_REQUESTED':
        return (
          <div className="status-banner changes_requested">
            <div>
              <h3>Changes Requested</h3>
              <p>{latestReview?.note || 'Please update your creator profile details and submit again for review.'}</p>
            </div>
            <Link to="/creator/onboarding?edit=true" className="primary-action-btn">UPDATE PROFILE &rarr;</Link>
          </div>
        );
      case 'APPROVED':
        return (
          <div className="status-banner approved">
            <div>
              <h3>Your creator profile is now live on C-PEB.</h3>
              <p>Brands can now discover you in the creator directory.</p>
            </div>
            <Link to={`/creators/${profile.slug}`} className="secondary-action-btn" style={{ borderColor: '#065F46', color: '#065F46' }}>
              VIEW PUBLIC PROFILE &rarr;
            </Link>
          </div>
        );
      case 'REJECTED':
        return (
          <div className="status-banner rejected">
            <div>
              <h3>Profile Rejected</h3>
              <p>{latestReview?.note || 'Your profile was not approved at this time.'}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="creator-dashboard-container">
      <div className="creator-dashboard-header">
        <h1>Welcome, {profile?.displayName || user?.name}</h1>
        <button className="creator-logout-btn" onClick={handleLogout}>Log Out</button>
      </div>

      {error && <div className="creator-error">{error}</div>}

      {getStatusBanner()}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Profile Overview</h3>
          {profile ? (
            <div>
              <p><strong>Display Name:</strong> {profile.displayName}</p>
              <p><strong>Primary Category:</strong> {profile.primaryCategory || 'Not set'}</p>
              <p><strong>Primary Platform:</strong> {profile.primaryPlatform || 'Not set'}</p>
              <p><strong>Location:</strong> {[profile.city, profile.state, profile.country].filter(Boolean).join(', ') || 'Not set'}</p>
              
              {profile.status === 'CHANGES_REQUESTED' && latestReview?.note && (
                <div className="admin-notes-section">
                  <h4>Admin Review Message</h4>
                  <p>"{latestReview.note}"</p>
                </div>
              )}

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/creator/onboarding?edit=true" className="secondary-action-btn">
                  Edit Profile Details &rarr;
                </Link>
                {profile.status === 'APPROVED' && (
                  <Link to={`/creators/${profile.slug}`} className="primary-action-btn">
                    View Live Profile ↗
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <p>Welcome to C-PEB! Start by creating your creator profile so brands can discover you.</p>
          )}
        </div>

        <div className="dashboard-card">
          <h3>Quick Management</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><Link to="/creator/onboarding?step=1" style={{ color: 'var(--color-primary-green)', textDecoration: 'none', fontWeight: 500 }}>About You &rarr;</Link></li>
            <li><Link to="/creator/onboarding?step=2" style={{ color: 'var(--color-primary-green)', textDecoration: 'none', fontWeight: 500 }}>Content &amp; Niche Preferences &rarr;</Link></li>
            <li><Link to="/creator/onboarding?step=3" style={{ color: 'var(--color-primary-green)', textDecoration: 'none', fontWeight: 500 }}>Social Accounts &amp; Portfolio &rarr;</Link></li>
            <li><Link to="/creator/onboarding?step=4" style={{ color: 'var(--color-primary-green)', textDecoration: 'none', fontWeight: 500 }}>Review &amp; Status &rarr;</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
