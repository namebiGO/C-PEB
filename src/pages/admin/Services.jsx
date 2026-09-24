import React, { useState, useEffect } from 'react';
import './AdminCreators.css'; // Reusing admin styles

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const emptyForm = {
    name: '', slug: '', shortDescription: '', longDescription: '', 
    icon: '', image: '', status: 'ACTIVE', displayOrder: 99, featured: false
  };

  const [formData, setFormData] = useState(emptyForm);

  const fetchData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const res = await fetch('/api/admin/services', { headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      ? `/api/admin/services/${formData._id}`
      : '/api/admin/services';
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
        fetchData();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (svc) => {
    setFormData({ ...svc });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="admin-page-container">Loading...</div>;

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h2>{isEditing ? 'Edit Service' : 'Manage Services'}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* FORM SECTION */}
        <section className="admin-section" style={{ alignSelf: 'start' }}>
          <h3>{isEditing ? 'Edit Service Details' : 'Add New Service'}</h3>
          <form onSubmit={handleSubmit} className="admin-form-group">
            <label>Service Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="admin-input" style={{ marginBottom: '1rem' }} />

            <label>Slug (URL) <small style={{ fontWeight: 'normal', color: '#64748b' }}>Leave blank to auto-generate</small></label>
            <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} className="admin-input" style={{ marginBottom: '1rem' }} />

            <label>Short Description</label>
            <textarea name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} className="admin-input" rows="3" style={{ marginBottom: '1rem' }}></textarea>

            <label>Display Order</label>
            <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleInputChange} className="admin-input" style={{ marginBottom: '1rem' }} />

            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleInputChange} className="admin-select" style={{ marginBottom: '1rem' }}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} />
              Featured Service
            </label>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-save" style={{ flex: 1 }}>{isEditing ? 'Update Service' : 'Add Service'}</button>
              {isEditing && (
                <button type="button" className="btn-secondary" onClick={() => { setIsEditing(false); setFormData(emptyForm); }}>Cancel</button>
              )}
            </div>
          </form>
        </section>

        {/* LIST SECTION */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ORDER</th>
                <th>SERVICE NAME</th>
                <th>STATUS</th>
                <th>FEATURED</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {services.map(svc => (
                <tr key={svc._id}>
                  <td><strong>{svc.displayOrder}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{svc.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>/{svc.slug}</div>
                  </td>
                  <td>
                    <span className={`admin-badge badge-${svc.status === 'ACTIVE' ? 'success' : 'default'}`}>
                      {svc.status}
                    </span>
                  </td>
                  <td>
                    {svc.featured ? <span className="badge-success">YES</span> : <span className="badge-default">NO</span>}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleEdit(svc)} className="btn-secondary" style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem' }}>Edit</button>
                    <button onClick={() => handleDelete(svc._id)} className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fecaca', padding: '0.25rem 0.5rem' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No services found. Add one above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminServices;
