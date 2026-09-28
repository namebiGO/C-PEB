import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, AlertCircle, Clock, ExternalLink, Settings, LogOut } from 'lucide-react';
import './CreatorDashboard.css';

const CreatorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      } else {
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

  const completionPercentage = useMemo(() => {
    if (!profile) return 0;
    const requiredFields = [
      'fullName', 'displayName', 'city', 'state', 'primaryPlatform', 
      'primaryCategory', 'audienceLocation', 'audienceAgeRange'
    ];
    let filled = 0;
    requiredFields.forEach(f => {
      if (profile[f] && profile[f].length > 0) filled++;
    });
    return Math.round((filled / requiredFields.length) * 100);
  }, [profile]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-3)' }}>Loading dashboard...</p>
      </div>
    );
  }

  const getStatusDisplay = () => {
    const status = profile?.status || 'DRAFT';
    switch (status) {
      case 'APPROVED':
        return { icon: <CheckCircle2 size={20} color="#16a34a" />, text: 'APPROVED', color: '#16a34a' };
      case 'PENDING_REVIEW':
      case 'UNDER_REVIEW':
        return { icon: <Clock size={20} color="#d97706" />, text: 'UNDER REVIEW', color: '#d97706' };
      case 'CHANGES_REQUESTED':
        return { icon: <AlertCircle size={20} color="#dc2626" />, text: 'CHANGES REQUESTED', color: '#dc2626' };
      case 'REJECTED':
        return { icon: <AlertCircle size={20} color="#dc2626" />, text: 'REJECTED', color: '#dc2626' };
      default:
        return { icon: <Settings size={20} color="#64748b" />, text: 'DRAFT', color: '#64748b' };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="creator-dashboard-page" style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 80px)', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-head)', color: 'var(--text-1)', marginBottom: '0.25rem' }}>
              Welcome, {profile?.displayName || user?.name}
            </h1>
            <p style={{ color: 'var(--text-2)', fontSize: '1rem' }}>Manage your creator profile and opportunities.</p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={16} /> Log out
          </button>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>{error}</div>}

        {/* STATUS BANNER */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: statusInfo.color }}>
                {statusInfo.icon} {statusInfo.text}
              </div>
              <span style={{ color: 'var(--text-3)' }}>|</span>
              <div style={{ fontWeight: 600, color: 'var(--text-1)' }}>
                Profile Completion: {completionPercentage}%
              </div>
            </div>
            
            <p style={{ color: 'var(--text-2)', margin: 0, maxWidth: '600px' }}>
              {!profile || profile.status === 'DRAFT' && 'Your profile is incomplete. Finish your profile to become discoverable by brands.'}
              {(profile?.status === 'PENDING_REVIEW' || profile?.status === 'UNDER_REVIEW') && 'Your profile is currently under review by our team. We will notify you once it is approved.'}
              {profile?.status === 'CHANGES_REQUESTED' && 'The review team has requested some changes to your profile before it can be approved.'}
              {profile?.status === 'APPROVED' && 'Your profile is live and visible to brands looking for creators.'}
            </p>
          </div>

          <div>
            {(!profile || profile?.status === 'DRAFT') && (
              <button className="btn btn-primary" onClick={() => navigate('/creator/onboarding')}>Continue Profile</button>
            )}
            {profile?.status === 'CHANGES_REQUESTED' && (
              <button className="btn btn-primary" onClick={() => navigate('/creator/onboarding')}>View Feedback</button>
            )}
            {profile?.status === 'APPROVED' && (
              <a href={`/creators/${profile.slug}`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                View Public Profile <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>

        {/* DASHBOARD CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Profile Status</h3>
            <div style={{ color: 'var(--text-2)', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Visibility:</span>
                <strong>{profile?.isPublished ? 'Public' : 'Hidden'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Category:</span>
                <strong>{profile?.primaryCategory || 'Not set'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Location:</span>
                <strong>{profile?.city || 'Not set'}</strong>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Social Accounts</h3>
            <div style={{ color: 'var(--text-2)', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Primary Platform:</span>
                <strong>{profile?.primaryPlatform || 'Not set'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Followers:</span>
                <strong>{profile?.followersDisplay || 'Not set'}</strong>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-1)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Collaboration Preferences</h3>
            <div style={{ color: 'var(--text-2)', fontSize: '0.95rem' }}>
              {profile?.collaborationInterests?.length > 0 ? (
                <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                  {profile.collaborationInterests.map(interest => (
                    <li key={interest} style={{ marginBottom: '0.25rem' }}>{interest}</li>
                  ))}
                </ul>
              ) : (
                <span>No preferences set.</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
