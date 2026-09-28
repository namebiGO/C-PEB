import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminCreators.css';

const AdminCreatorReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Review modals
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/admin/creators/profiles/${id}`, {
        headers: { Authorization: `Bearer ${user?.token || ''}` }
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setReviews(data.data.reviews || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (action) => {
    if ((action === 'REJECTED' || action === 'CHANGES_REQUESTED') && !note.trim()) {
      alert('Please provide a reason/note.');
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/creators/profiles/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token || ''}`
        },
        body: JSON.stringify({ action, note })
      });
      const data = await res.json();
      if (data.success) {
        fetchProfile();
        setShowRejectModal(false);
        setShowChangesModal(false);
        setShowApproveModal(false);
        setNote('');
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="admin-page-container">Loading...</div>;
  if (!profile) return <div className="admin-page-container">Profile not found.</div>;

  return (
    <div className="admin-page-container" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* HEADER */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate('/admin/creators')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '1rem', fontWeight: 600 }}>
          &larr; Back to Creators
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f1f5f9', overflow: 'hidden' }}>
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No Img</div>
              )}
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', color: '#0f172a' }}>{profile.fullName || profile.displayName}</h2>
              <div style={{ color: '#64748b', marginBottom: '0.5rem' }}>@{profile.displayName.replace(/\s+/g, '').toLowerCase()}</div>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.85rem' }}>
                <span className={`admin-badge badge-${profile.status === 'APPROVED' ? 'success' : profile.status === 'PENDING_REVIEW' ? 'warning' : 'default'}`}>
                  STATUS: {profile.status.replace('_', ' ')}
                </span>
                <span style={{ color: '#64748b' }}>
                  Submitted: {profile.submittedAt ? new Date(profile.submittedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* LEFT COLUMN: REVIEW SECTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="admin-section">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>1. BASIC INFORMATION</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
              <div><strong>Full Name:</strong> {profile.fullName || '-'}</div>
              <div><strong>Display Name:</strong> {profile.displayName || '-'}</div>
              <div><strong>City:</strong> {profile.city || '-'}</div>
              <div><strong>State:</strong> {profile.state || '-'}</div>
              <div style={{ gridColumn: '1 / -1' }}><strong>Languages:</strong> {profile.languages?.join(', ') || '-'}</div>
              <div style={{ gridColumn: '1 / -1' }}><strong>Bio:</strong> <p style={{ margin: '0.5rem 0 0', color: '#475569' }}>{profile.bio || '-'}</p></div>
            </div>
          </div>

          <div className="admin-section">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>2. SOCIAL PLATFORMS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
              <div><strong>Primary Platform:</strong> {profile.primaryPlatform || '-'}</div>
              {/* In a real app, map through connected socialAccounts. Mocking for this view. */}
              <div><strong>Followers:</strong> {profile.followersDisplay || '-'}</div>
            </div>
          </div>

          <div className="admin-section">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>3. AUDIENCE</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
              <div><strong>Top Locations:</strong> {profile.audienceLocation || '-'}</div>
              <div><strong>Age Distribution:</strong> {profile.audienceAgeRange || '-'}</div>
            </div>
          </div>

          <div className="admin-section">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>4. CONTENT</h3>
            <div style={{ fontSize: '0.9rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Categories:</strong>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {profile.primaryCategory && <span style={{ background: '#e2e8f0', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem' }}>{profile.primaryCategory}</span>}
                  {profile.secondaryCategories?.map(cat => (
                    <span key={cat} style={{ background: '#f1f5f9', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem' }}>{cat}</span>
                  ))}
                </div>
              </div>
              <div>
                <strong>Content Formats:</strong>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {profile.contentTypes?.map(type => (
                    <span key={type} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem' }}>{type}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="admin-section">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>5. COLLABORATION PREFERENCES</h3>
            <div style={{ fontSize: '0.9rem' }}>
              <ul style={{ paddingLeft: '1.5rem', color: '#475569', margin: 0 }}>
                {profile.collaborationInterests?.map(collab => (
                  <li key={collab} style={{ marginBottom: '0.25rem' }}>{collab}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ACTIONS & HISTORY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="admin-section" style={{ background: '#f8fafc' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>ADMIN ACTIONS</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                className="btn-save" 
                style={{ background: '#166534', width: '100%', padding: '0.75rem' }} 
                onClick={() => setShowApproveModal(true)}
              >
                Approve Profile
              </button>
              
              <button 
                className="btn-secondary" 
                style={{ width: '100%', padding: '0.75rem' }} 
                onClick={() => setShowChangesModal(true)}
              >
                Request Changes
              </button>
              
              <button 
                className="btn-secondary" 
                style={{ color: '#991b1b', width: '100%', padding: '0.75rem', borderColor: '#fca5a5', background: '#fef2f2' }} 
                onClick={() => setShowRejectModal(true)}
              >
                Reject Profile
              </button>
            </div>
            
            <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
              <div style={{ marginBottom: '0.5rem' }}><strong>Published:</strong> {profile.isPublished ? 'Yes' : 'No'}</div>
              <div><strong>Status:</strong> {profile.status}</div>
            </div>
          </div>

          <div className="admin-section">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>REVIEW HISTORY</h3>
            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.length > 0 ? reviews.map(rev => (
                <div key={rev._id} style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '1rem' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{rev.action.replace('_', ' ')}</div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', margin: '0.25rem 0' }}>
                    {new Date(rev.createdAt).toLocaleString()} by {rev.adminId?.name || 'Admin'}
                  </div>
                  {rev.note && <div style={{ color: '#475569', background: '#f1f5f9', padding: '0.5rem', borderRadius: '4px', marginTop: '0.25rem' }}>"{rev.note}"</div>}
                </div>
              )) : (
                <div style={{ color: '#94a3b8' }}>No review history yet.</div>
              )}
            </div>
          </div>

        </div>
      </div>
      
      {/* APPROVE MODAL */}
      {showApproveModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Approve Creator Profile?</h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Once approved, this profile will become publicly visible on the C-PEB website directory.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setShowApproveModal(false)} disabled={submitting}>Cancel</button>
              <button className="btn-save" style={{ background: '#166534' }} onClick={() => handleReviewAction('APPROVED')} disabled={submitting}>
                {submitting ? 'Approving...' : 'Approve & Publish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT & CHANGES MODALS */}
      {(showRejectModal || showChangesModal) && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}>
            <h3 style={{ marginBottom: '1rem' }}>{showRejectModal ? 'Reject Creator' : 'Request Changes'}</h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              {showRejectModal ? 'Please explain why this profile is being rejected:' : 'Please explain what the creator needs to update:'}
            </p>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={showRejectModal ? 'Your application could not be approved because...' : 'Please connect your Instagram account...'}
              className="admin-input"
              rows="4"
              style={{ width: '100%', marginBottom: '1.5rem', background: '#f8fafc', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => { setShowRejectModal(false); setShowChangesModal(false); }} disabled={submitting}>Cancel</button>
              <button 
                className="btn-save" 
                style={showRejectModal ? { background: '#991b1b' } : {}} 
                onClick={() => handleReviewAction(showRejectModal ? 'REJECTED' : 'CHANGES_REQUESTED')}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : (showRejectModal ? 'Reject Profile' : 'Send Change Request')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCreatorReview;
