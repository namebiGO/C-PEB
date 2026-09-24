import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminCreators.css';

const AdminCreatorOrder = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      const res = await fetch('/api/admin/creators/profiles?status=APPROVED', {
        headers: { Authorization: `Bearer ${user?.token || ''}` }
      });
      const data = await res.json();
      if (data.success) {
        // Only sort approved creators by their current priority
        const sorted = data.data.sort((a, b) => (a.priority || 999) - (b.priority || 999));
        setCreators(sorted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      const orderData = creators.map((c, index) => ({
        id: c._id,
        priority: index + 1 // 1-based index
      }));

      const res = await fetch('/api/admin/creators/order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token || ''}`
        },
        body: JSON.stringify({ order: orderData })
      });

      const data = await res.json();
      if (data.success) {
        alert('Display order saved successfully!');
        navigate('/admin/creators');
      } else {
        alert('Failed to save order');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving order');
    } finally {
      setSaving(false);
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newArr = [...creators];
    const temp = newArr[index - 1];
    newArr[index - 1] = newArr[index];
    newArr[index] = temp;
    setCreators(newArr);
  };

  const moveDown = (index) => {
    if (index === creators.length - 1) return;
    const newArr = [...creators];
    const temp = newArr[index + 1];
    newArr[index + 1] = newArr[index];
    newArr[index] = temp;
    setCreators(newArr);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <button onClick={() => navigate('/admin/creators')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '1rem' }}>
          &larr; Back to Creators
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Manage Public Display Order</h2>
          <button className="btn-save" onClick={handleSaveOrder} disabled={saving}>
            {saving ? 'SAVING...' : 'SAVE DISPLAY ORDER'}
          </button>
        </div>
        <p style={{ color: '#64748b' }}>Reorder the APPROVED creators to change how they appear on the public directory.</p>
      </div>

      {loading ? (
        <div>Loading creators...</div>
      ) : (
        <div className="admin-table-container" style={{ maxWidth: '800px' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>ORDER</th>
                <th>CREATOR</th>
                <th style={{ width: '150px', textAlign: 'right' }}>MOVE</th>
              </tr>
            </thead>
            <tbody>
              {creators.map((c, index) => (
                <tr key={c._id}>
                  <td><strong>{index + 1}</strong></td>
                  <td>
                    <div className="admin-creator-cell">
                      {c.profileImage ? (
                        <img src={c.profileImage} alt="" className="admin-creator-avatar" />
                      ) : (
                        <div className="admin-creator-avatar-placeholder"></div>
                      )}
                      <div>
                        <strong>{c.displayName}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.followersDisplay || '-'} followers</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-secondary" style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem' }} onClick={() => moveUp(index)} disabled={index === 0}>
                      &uarr;
                    </button>
                    <button className="btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => moveDown(index)} disabled={index === creators.length - 1}>
                      &darr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCreatorOrder;
