import React, { useState, useEffect } from 'react';
import './AdminCreators.css'; 

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'ADMIN' });
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter(u => u._id !== id));
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting user');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({ name: '', email: '', password: '', role: 'ADMIN' });
        fetchUsers();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Error creating user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h2>User Management</h2>
      </div>

      <div className="admin-controls-row">
        <div style={{ flex: 1 }}>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Manage admin staff and creator accounts.</p>
        </div>
        <button className="btn-save" onClick={() => setShowAddModal(true)}>
          + Add User
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>JOINED</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
            ) : users.length > 0 ? users.map(user => (
              <tr key={user._id}>
                <td style={{ fontWeight: 600, color: '#0f172a' }}>{user.name}</td>
                <td style={{ color: '#475569' }}>{user.email}</td>
                <td>
                  <span className={`admin-badge ${user.role === 'ADMIN' ? 'badge-success' : 'badge-default'}`}>
                    {user.role}
                  </span>
                </td>
                <td style={{ fontSize: '0.8rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(user._id)} 
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Add New User</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
                <label>Name</label>
                <input required type="text" className="admin-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
                <label>Email</label>
                <input required type="email" className="admin-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
                <label>Password</label>
                <input required type="password" className="admin-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Role</label>
                <select className="admin-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="ADMIN">Admin</option>
                  <option value="CREATOR">Creator</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn-save" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
