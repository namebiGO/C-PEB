import React, { useState, useEffect } from 'react';

const AdminInfluencers = () => {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentInfluencer, setCurrentInfluencer] = useState(null);

  const emptyForm = {
    name: '', slug: '', bio: '', profileImage: '', category: '', location: '',
    instagramUrl: '', youtubeUrl: '', tiktokUrl: '',
    followers: '', following: '', engagementRate: '', averageReach: '',
    isActive: true, isFeatured: false, featuredOrder: 0
  };

  const [formData, setFormData] = useState(emptyForm);

  const fetchInfluencers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const res = await fetch('/api/admin/influencers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setInfluencers(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
    const url = isEditing 
      ? `/api/admin/influencers/${currentInfluencer._id}`
      : '/api/admin/influencers';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        setFormData(emptyForm);
        setCurrentInfluencer(null);
        fetchInfluencers();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (inf) => {
    setCurrentInfluencer(inf);
    setFormData(inf);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this influencer?')) return;
    
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      await fetch(`/api/admin/influencers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInfluencers();
    } catch (error) {
      console.error(error);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData(emptyForm);
    setCurrentInfluencer(null);
  };

  if (loading) return <div>Loading influencers...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>Influencers</h1>
          <p style={{ margin: 0, color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>Manage the list of curated platform influencers.</p>
        </div>
        {!isEditing && (
          <button className="admin-btn admin-btn-primary" onClick={() => setIsEditing(true)}>+ Add Influencer</button>
        )}
      </div>

      {isEditing ? (
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">{currentInfluencer ? 'Edit Influencer' : 'Add New Influencer'}</h2>
          </div>
          <div className="admin-card-body">
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: '1fr 1fr' }}>
              
              <div style={{ gridColumn: '1 / -1' }}><h3 style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Basic Info</h3></div>
              <div><label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }} /></div>
              <div><label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>Slug (URL friendly)</label><input type="text" name="slug" value={formData.slug} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }} /></div>
              <div><label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>Category</label><input type="text" name="category" value={formData.category} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }} /></div>
              <div><label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>Location</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>Profile Image URL</label><input type="text" name="profileImage" value={formData.profileImage} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>Short Bio</label><textarea name="bio" value={formData.bio} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }} rows="3" /></div>

              <div style={{ gridColumn: '1 / -1' }}><h3 style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem', margin: '1rem 0 0.5rem 0', fontSize: '1rem' }}>Social & Stats</h3></div>
              <div><label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>YouTube URL</label><input type="text" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }} /></div>
              <div><label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>Instagram URL</label><input type="text" name="instagramUrl" value={formData.instagramUrl} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }} /></div>
              <div><label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>Followers (e.g. 1.2M)</label><input type="text" name="followers" value={formData.followers} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }} /></div>
              <div><label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>Engagement Rate (e.g. 4.8%)</label><input type="text" name="engagementRate" value={formData.engagementRate} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }} /></div>
              <div><label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>Audience Quality / Reach</label><input type="text" name="averageReach" value={formData.averageReach} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }} /></div>
              
              <div style={{ gridColumn: '1 / -1' }}><h3 style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem', margin: '1rem 0 0.5rem 0', fontSize: '1rem' }}>System</h3></div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} /> Active Profile
                </label>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} /> Show as Top Influencer (Homepage)
                </label>
              </div>
              <div><label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>Featured Position (Order)</label><input type="number" name="featuredOrder" value={formData.featuredOrder} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }} /></div>

              <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button type="submit" className="admin-btn admin-btn-primary">Save Influencer</button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={cancelEdit}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-premium-table">
              <thead>
                <tr>
                  <th>Influencer</th>
                  <th>Category</th>
                  <th>Followers</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {influencers.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)' }}>No influencers found.</td></tr>
                ) : (
                  influencers.map(inf => (
                    <tr key={inf._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '600', color: 'var(--admin-text-primary)' }}>
                          {inf.profileImage ? (
                            <img src={inf.profileImage} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--admin-border)' }} />
                          )}
                          {inf.name}
                        </div>
                      </td>
                      <td className="text-muted text-sm">{inf.category}</td>
                      <td className="font-medium text-sm">{inf.followers}</td>
                      <td>
                        <span className={`admin-status ${inf.isActive ? 'admin-status-success' : 'admin-status-danger'}`}>
                          {inf.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-muted text-sm">{inf.isFeatured ? 'Yes' : '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleEdit(inf)} className="admin-btn admin-btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>Edit</button>
                          <button onClick={() => handleDelete(inf._id)} className="admin-btn" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', color: 'var(--admin-danger)', background: 'transparent', border: '1px solid transparent' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInfluencers;
