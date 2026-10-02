import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import './AdminCreators.css'; 

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const socket = useSocket();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const res = await fetch('/api/admin/creators/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setApplications(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    socket.on('new_creator_application', (newApp) => {
      // It sends id, creatorName, instagram, category, city. Let's just refetch to get the full object,
      // or we can just refetch on new application to keep it simple.
      fetchApplications();
    });

    socket.on('update_creator_application', (updatedApp) => {
      setApplications(prev => prev.map(app => app._id === updatedApp._id ? updatedApp : app));
      if (selectedApp && selectedApp._id === updatedApp._id) {
        setSelectedApp(updatedApp);
      }
    });

    return () => {
      socket.off('new_creator_application');
      socket.off('update_creator_application');
    };
  }, [socket, selectedApp]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      await fetch(`/api/admin/creators/applications/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchApplications();
      if (selectedApp && selectedApp._id === id) {
        setSelectedApp(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotesChange = async () => {
    if (!selectedApp) return;
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      await fetch(`/api/admin/creators/applications/${selectedApp._id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ adminNotes: selectedApp.adminNotes })
      });
      alert('Notes saved successfully.');
      fetchApplications();
    } catch (error) {
      console.error(error);
      alert('Error saving notes.');
    }
  };

  const filteredApps = applications.filter(a => {
    if (filter !== 'ALL' && a.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!a.creatorName.toLowerCase().includes(q) && 
          !a.instagram.toLowerCase().includes(q) && 
          !a.category.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING_REVIEW': return 'badge-warning';
      case 'APPROVED': return 'badge-success';
      case 'CHANGES_REQUESTED': return 'badge-info';
      case 'REJECTED': return 'badge-error';
      default: return 'badge-default';
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h2>Creator Applications (New)</h2>
      </div>

      <div className="admin-subnav">
        {['ALL', 'PENDING_REVIEW', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED'].map(f => (
          <button 
            key={f} 
            className={`subnav-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="admin-controls-row">
        <input 
          type="text" 
          placeholder="Search name, handle, category..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedApp ? '2fr 1fr' : '1fr', gap: '2rem' }}>
        
        <div className="admin-table-container" style={{ alignSelf: 'start' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>CREATOR</th>
                <th>INSTAGRAM</th>
                <th>CATEGORY & CITY</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
              ) : filteredApps.length > 0 ? filteredApps.map(app => (
                <tr key={app._id} style={{ background: selectedApp?._id === app._id ? '#f8fafc' : 'white' }}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{app.creatorName}</div>
                    {app.email && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.email}</div>}
                  </td>
                  <td>
                    <a href={`https://instagram.com/${app.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: '#2563eb' }}>
                      {app.instagram}
                    </a>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>{app.category}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>{app.city}</div>
                  </td>
                  <td>
                    <span className={`admin-badge ${getStatusBadge(app.status)}`}>{app.status.replace('_', ' ')}</span>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => setSelectedApp(app)} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                      Review &rarr;
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No applications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedApp && (
          <div className="admin-section" style={{ position: 'sticky', top: '2rem', alignSelf: 'start', padding: '1.5rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Application Details</h3>
              <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a' }}>{selectedApp.creatorName}</h4>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.2rem' }}>Email: <a href={`mailto:${selectedApp.email}`} style={{ color: '#2563eb' }}>{selectedApp.email || '-'}</a></div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.2rem' }}>WhatsApp: <a href={`https://wa.me/${selectedApp.whatsapp}`} style={{ color: '#2563eb' }}>{selectedApp.whatsapp || '-'}</a></div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>City: <strong>{selectedApp.city || '-'}</strong></div>
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Social Media</div>
              <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.2rem' }}>Instagram: <a href={`https://instagram.com/${selectedApp.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>{selectedApp.instagram}</a></div>
              <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.2rem' }}>YouTube: <a href={selectedApp.youtube} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>{selectedApp.youtube || '-'}</a></div>
              <div style={{ fontSize: '0.85rem', color: '#334155' }}>Other: <a href={selectedApp.otherSocial} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>{selectedApp.otherSocial || '-'}</a></div>
              
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', marginTop: '1rem' }}>Category</div>
              <div style={{ fontSize: '0.9rem', color: '#334155' }}>{selectedApp.category}</div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Review Status</label>
              <select 
                value={selectedApp.status} 
                onChange={(e) => handleStatusChange(selectedApp._id, e.target.value)} 
                className="admin-select"
              >
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="APPROVED">Approved</option>
                <option value="CHANGES_REQUESTED">Changes Requested</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Admin Notes</label>
              <textarea 
                rows="4" 
                className="admin-input" 
                placeholder="Internal notes..."
                value={selectedApp.adminNotes || ''}
                onChange={(e) => setSelectedApp({ ...selectedApp, adminNotes: e.target.value })}
              ></textarea>
              <button className="btn-save" style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', width: '100%' }} onClick={handleNotesChange}>
                Save Notes
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminApplications;
