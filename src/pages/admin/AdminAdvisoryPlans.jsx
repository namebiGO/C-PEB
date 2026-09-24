import React, { useState, useEffect } from 'react';
import './AdminCreators.css'; // Reusing admin styling

const AdminAdvisoryPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const emptyForm = {
    name: '', price: 0, duration: '', description: '', prioritySupport: true,
    features: [], status: 'ACTIVE', displayOrder: 0
  };
  const [formData, setFormData] = useState(emptyForm);
  const [featureInput, setFeatureInput] = useState('');

  const fetchPlans = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const res = await fetch('/api/advisory/admin/plans', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setPlans(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFormData(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
    setFeatureInput('');
  };

  const removeFeature = (index) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const url = isEditing ? `/api/advisory/admin/plans/${formData._id}` : '/api/advisory/admin/plans';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        setIsEditing(false);
        setFormData(emptyForm);
        fetchPlans();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (plan) => {
    setFormData({ ...plan });
    setIsEditing(true);
  };

  if (loading) return <div>Loading plans...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '2rem' }}>
      {/* FORM */}
      <section className="admin-section" style={{ alignSelf: 'start', margin: 0 }}>
        <h3 style={{ marginTop: 0 }}>{isEditing ? 'Edit Advisory Plan' : 'Add New Plan'}</h3>
        <form onSubmit={handleSubmit} className="admin-form-group">
          <label>Plan Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="admin-input" style={{ marginBottom: '1rem' }} />

          <label>Price (₹) <small style={{ fontWeight: 'normal', color: '#64748b' }}>TOTAL price, not per month unless stated</small></label>
          <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="admin-input" style={{ marginBottom: '1rem' }} />

          <label>Duration (e.g. "1 Month")</label>
          <input required type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="admin-input" style={{ marginBottom: '1rem' }} />

          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} className="admin-input" rows="2" style={{ marginBottom: '1rem' }}></textarea>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer' }}>
            <input type="checkbox" name="prioritySupport" checked={formData.prioritySupport} onChange={handleInputChange} />
            Includes Priority Support
          </label>

          <label>Display Order</label>
          <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleInputChange} className="admin-input" style={{ marginBottom: '1rem' }} />

          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleInputChange} className="admin-select" style={{ marginBottom: '1.5rem' }}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          <label>Features</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} className="admin-input" placeholder="Add feature..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }} />
            <button type="button" className="btn-secondary" onClick={addFeature}>Add</button>
          </div>
          <ul style={{ padding: 0, margin: '0 0 1.5rem 0', listStyle: 'none' }}>
            {formData.features.map((f, idx) => (
              <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#f8fafc', marginBottom: '0.25rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                <span>{f}</span>
                <button type="button" style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => removeFeature(idx)}>&times;</button>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn-save" style={{ flex: 1 }}>{isEditing ? 'Save Plan' : 'Add Plan'}</button>
            {isEditing && (
              <button type="button" className="btn-secondary" onClick={() => { setIsEditing(false); setFormData(emptyForm); }}>Cancel</button>
            )}
          </div>
        </form>
      </section>

      {/* LIST */}
      <div className="admin-table-container" style={{ alignSelf: 'start' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>PLAN</th>
              <th>PRICE</th>
              <th>DURATION</th>
              <th>STATUS</th>
              <th style={{ textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(p => (
              <tr key={p._id}>
                <td>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.prioritySupport ? 'Priority Support Included' : ''}</div>
                </td>
                <td style={{ fontWeight: 500 }}>₹{p.price.toLocaleString('en-IN')}</td>
                <td>{p.duration}</td>
                <td>
                  <span className={`admin-badge badge-${p.status === 'ACTIVE' ? 'success' : 'default'}`}>{p.status}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => handleEdit(p)} className="btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAdvisoryPlans;
