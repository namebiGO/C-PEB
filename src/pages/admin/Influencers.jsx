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
      const res = await fetch('http://localhost:5001/api/admin/influencers', {
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
      ? `http://localhost:5001/api/admin/influencers/${currentInfluencer._id}`
      : 'http://localhost:5001/api/admin/influencers';
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
      await fetch(`http://localhost:5001/api/admin/influencers/${id}`, {
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Influencers</h1>
        {!isEditing && (
          <button className="btn-admin btn-admin-primary" onClick={() => setIsEditing(true)}>+ Add Influencer</button>
        )}
      </div>

      {isEditing ? (
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0 }}>{currentInfluencer ? 'Edit Influencer' : 'Add New Influencer'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            
            <div style={{ gridColumn: '1 / -1' }}><h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', margin: '1rem 0 0.5rem 0' }}>Basic Info</h3></div>
            <div><label>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }} /></div>
            <div><label>Slug (URL friendly)</label><input type="text" name="slug" value={formData.slug} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }} /></div>
            <div><label>Category</label><input type="text" name="category" value={formData.category} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }} /></div>
            <div><label>Location</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }} /></div>
            <div style={{ gridColumn: '1 / -1' }}><label>Profile Image URL</label><input type="text" name="profileImage" value={formData.profileImage} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }} /></div>
            <div style={{ gridColumn: '1 / -1' }}><label>Short Bio</label><textarea name="bio" value={formData.bio} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }} rows="3" /></div>

            <div style={{ gridColumn: '1 / -1' }}><h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', margin: '1rem 0 0.5rem 0' }}>Social & Stats</h3></div>
            <div><label>YouTube URL</label><input type="text" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }} /></div>
            <div><label>Instagram URL</label><input type="text" name="instagramUrl" value={formData.instagramUrl} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }} /></div>
            <div><label>Followers (e.g. 1.2M)</label><input type="text" name="followers" value={formData.followers} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }} /></div>
            <div><label>Engagement Rate (e.g. 4.8%)</label><input type="text" name="engagementRate" value={formData.engagementRate} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }} /></div>
            <div><label>Audience Quality / Reach</label><input type="text" name="averageReach" value={formData.averageReach} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }} /></div>
            
            <div style={{ gridColumn: '1 / -1' }}><h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', margin: '1rem 0 0.5rem 0' }}>System</h3></div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} /> Active Profile
              </label>
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} /> Show as Top Influencer (Homepage)
              </label>
            </div>
            <div><label>Featured Position (Order)</label><input type="number" name="featuredOrder" value={formData.featuredOrder} onChange={handleInputChange} style={{ width: '100%', padding: '0.5rem' }} /></div>

            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-admin btn-admin-primary">Save Influencer</button>
              <button type="button" className="btn-admin" onClick={cancelEdit} style={{ background: '#e2e8f0' }}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <table>
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
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No influencers found.</td></tr>
            ) : (
              influencers.map(inf => (
                <tr key={inf._id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '500' }}>
                    {inf.profileImage ? (
                      <img src={inf.profileImage} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#cbd5e1' }} />
                    )}
                    {inf.name}
                  </td>
                  <td>{inf.category}</td>
                  <td>{inf.followers}</td>
                  <td>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '100px', fontSize: '0.75rem', background: inf.isActive ? '#dcfce7' : '#fee2e2', color: inf.isActive ? '#166534' : '#991b1b' }}>
                      {inf.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{inf.isFeatured ? 'Yes' : '-'}</td>
                  <td>
                    <button onClick={() => handleEdit(inf)} style={{ marginRight: '0.5rem', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: '600' }}>Edit</button>
                    <button onClick={() => handleDelete(inf._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: '600' }}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminInfluencers;
