import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminCreators.css';

const AdminCreatorReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Review modals
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [note, setNote] = useState('');

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
        setFormData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/creators/profiles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token || ''}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        alert('Profile saved successfully!');
      } else {
        alert('Error saving profile');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleReviewAction = async (action) => {
    if (action !== 'APPROVED' && !note.trim()) {
      alert('Please provide a reason/note.');
      return;
    }
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
        setNote('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="admin-page-container">Loading...</div>;
  if (!profile) return <div className="admin-page-container">Profile not found.</div>;

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <button onClick={() => navigate('/admin/creators')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '1rem' }}>
          &larr; Back to Creators
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Manage Creator: {profile.displayName}</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" onClick={() => window.open(`/creators/${profile.slug}`, '_blank')}>
              PREVIEW PUBLIC PROFILE &rarr;
            </button>
            <button className="btn-save" onClick={handleSave}>
              {saving ? 'SAVING...' : 'SAVE ALL CHANGES'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* LEFT COLUMN: EDIT SECTIONS */}
        <div>
          {/* SECTION 1: BASIC PROFILE */}
          <section className="admin-section">
            <h3>Section 1 — Basic Profile</h3>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label>Display Name</label>
                <input name="displayName" value={formData.displayName || ''} onChange={handleInputChange} className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label>Username (Slug)</label>
                <input name="slug" value={formData.slug || ''} onChange={handleInputChange} className="admin-input" />
              </div>
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Bio</label>
                <textarea name="bio" value={formData.bio || ''} onChange={handleInputChange} className="admin-input" rows="4"></textarea>
              </div>
            </div>
          </section>

          {/* SECTION 3 & 4: CATEGORY & LOCATION */}
          <section className="admin-section">
            <h3>Category & Location</h3>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label>Primary Category</label>
                <select name="primaryCategory" value={formData.primaryCategory || ''} onChange={handleInputChange} className="admin-select">
                  <option value="">Select Category...</option>
                  <option value="Cinema">Cinema</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Music">Music</option>
                  <option value="Vloggers">Vloggers</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>City</label>
                <input name="city" value={formData.city || ''} onChange={handleInputChange} className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label>State</label>
                <input name="state" value={formData.state || ''} onChange={handleInputChange} className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label>Country</label>
                <input name="country" value={formData.country || ''} onChange={handleInputChange} className="admin-input" />
              </div>
            </div>
          </section>

          {/* SECTION: FOLLOWER DATA */}
          <section className="admin-section">
            <h3>Social Reach</h3>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label>Followers Display (e.g. 21.5M)</label>
                <input name="followersDisplay" value={formData.followersDisplay || ''} onChange={handleInputChange} className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label>Followers Exact</label>
                <input type="number" name="followersExact" value={formData.followersExact || 0} onChange={handleInputChange} className="admin-input" />
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: STATUS, VISIBILITY, IMAGE */}
        <div>
          {/* CREATOR STATUS & VISIBILITY */}
          <section className="admin-section" style={{ background: '#f8fafc' }}>
            <h3>Creator Status</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <strong>Current Status: </strong>
              <span className={`admin-badge badge-${profile.status === 'APPROVED' ? 'success' : 'warning'}`}>
                {profile.status}
              </span>
            </div>

            {profile.status === 'PENDING_REVIEW' && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button className="btn-save" style={{ background: '#166534' }} onClick={() => handleReviewAction('APPROVED')}>APPROVE & PUBLISH</button>
                <button className="btn-secondary" onClick={() => setShowChangesModal(true)}>REQUEST CHANGES</button>
                <button className="btn-secondary" style={{ color: '#991b1b' }} onClick={() => setShowRejectModal(true)}>REJECT</button>
              </div>
            )}

            <hr style={{ margin: '1.5rem 0', borderColor: '#e2e8f0' }} />

            <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
              <label>Public Visibility</label>
              <select name="visibility" value={formData.visibility || 'HIDDEN'} onChange={handleInputChange} className="admin-select">
                <option value="VISIBLE">VISIBLE</option>
                <option value="HIDDEN">HIDDEN</option>
              </select>
              <small style={{ color: '#64748b' }}>If approved + visible, creator appears on site.</small>
            </div>

            <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
              <label>Featured Creator</label>
              <select name="featured" value={formData.featured ? 'true' : 'false'} onChange={(e) => setFormData(p => ({...p, featured: e.target.value === 'true'}))} className="admin-select">
                <option value="true">YES</option>
                <option value="false">NO</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Directory Priority (01, 02...)</label>
              <input type="number" name="priority" value={formData.priority || 999} onChange={handleInputChange} className="admin-input" />
            </div>

          </section>

          {/* PROFILE IMAGE & CROP */}
          <section className="admin-section">
            <h3>Profile Image</h3>
            {formData.profileImage ? (
              <div style={{ width: '100%', aspectRatio: '20/21', overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem', background: '#e2e8f0' }}>
                <img 
                  src={formData.profileImage} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: formData.imagePosition || 'center' }} 
                />
              </div>
            ) : (
              <div style={{ padding: '2rem', background: '#f1f5f9', textAlign: 'center', borderRadius: '8px', marginBottom: '1rem' }}>
                No image provided
              </div>
            )}
            
            <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
              <label>Image URL</label>
              <input name="profileImage" value={formData.profileImage || ''} onChange={handleInputChange} className="admin-input" />
            </div>

            <div className="admin-form-group">
              <label>Crop / Image Position</label>
              <input name="imagePosition" value={formData.imagePosition || 'center'} onChange={handleInputChange} placeholder="e.g. 50% 20%, top, center" className="admin-input" />
              <small style={{ color: '#64748b' }}>Adjust to fix face framing (e.g., 'top', 'center', '50% 10%').</small>
            </div>
          </section>
        </div>
      </div>
      
      {/* Modals for Rejection / Changes */}
      {(showRejectModal || showChangesModal) && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}>
            <h3>{showRejectModal ? 'Reject Creator' : 'Request Changes'}</h3>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Reason or requested changes..."
              className="admin-input"
              rows="4"
              style={{ width: '100%', margin: '1rem 0' }}
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => { setShowRejectModal(false); setShowChangesModal(false); }}>Cancel</button>
              <button className="btn-save" onClick={() => handleReviewAction(showRejectModal ? 'REJECTED' : 'CHANGES_REQUESTED')}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCreatorReview;
