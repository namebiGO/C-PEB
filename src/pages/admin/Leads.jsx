import React, { useState, useEffect } from 'react';
import './AdminCreators.css'; // Reusing styling

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const res = await fetch('/api/admin/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setLeads(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchLeads();
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotesChange = async () => {
    if (!selectedLead) return;
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      await fetch(`/api/admin/leads/${selectedLead._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ notes: selectedLead.notes })
      });
      alert('Notes saved successfully.');
      fetchLeads();
    } catch (error) {
      console.error(error);
      alert('Error saving notes.');
    }
  };

  const filteredLeads = leads.filter(l => {
    if (filter !== 'ALL' && l.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!l.name.toLowerCase().includes(q) && 
          !l.email.toLowerCase().includes(q) && 
          !(l.company && l.company.toLowerCase().includes(q))) {
        return false;
      }
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return 'badge-info';
      case 'Contacted': return 'badge-warning';
      case 'In Progress': return 'badge-warning';
      case 'Converted': return 'badge-success';
      case 'Closed': return 'badge-default';
      default: return 'badge-default';
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h2>Leads CRM</h2>
      </div>

      <div className="admin-subnav">
        {['ALL', 'New', 'Contacted', 'In Progress', 'Converted', 'Closed'].map(f => (
          <button 
            key={f} 
            className={`subnav-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="admin-controls-row">
        <input 
          type="text" 
          placeholder="Search name, email, company..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedLead ? '2fr 1fr' : '1fr', gap: '2rem' }}>
        
        {/* LEADS LIST */}
        <div className="admin-table-container" style={{ alignSelf: 'start' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>CONTACT</th>
                <th>REQUIREMENT & SOURCE</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
              ) : filteredLeads.length > 0 ? filteredLeads.map(lead => (
                <tr key={lead._id} style={{ background: selectedLead?._id === lead._id ? '#f8fafc' : 'white' }}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{lead.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{lead.email}</div>
                    {lead.company && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{lead.company}</div>}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#334155', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lead.requirement}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>Source: {lead.source || 'Website'}</div>
                  </td>
                  <td>
                    <span className={`admin-badge ${getStatusBadge(lead.status)}`}>{lead.status}</span>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => setSelectedLead(lead)} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                      View &rarr;
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No leads found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* LEAD DETAIL PROFILE */}
        {selectedLead && (
          <div className="admin-section" style={{ position: 'sticky', top: '2rem', alignSelf: 'start', padding: '1.5rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Lead Profile</h3>
              <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a' }}>{selectedLead.name}</h4>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.2rem' }}>Email: <a href={`mailto:${selectedLead.email}`} style={{ color: '#2563eb' }}>{selectedLead.email}</a></div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.2rem' }}>Phone: <a href={`tel:${selectedLead.phone}`} style={{ color: '#2563eb' }}>{selectedLead.phone || '-'}</a></div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Company: <strong>{selectedLead.company || '-'}</strong></div>
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Requirement</div>
              <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>{selectedLead.requirement}</div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>Source: {selectedLead.source || 'Website'}</div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Status</label>
              <select 
                value={selectedLead.status} 
                onChange={(e) => handleStatusChange(selectedLead._id, e.target.value)} 
                className="admin-select"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Internal Notes</label>
              <textarea 
                rows="4" 
                className="admin-input" 
                placeholder="Add notes about this lead..."
                value={selectedLead.notes || ''}
                onChange={(e) => setSelectedLead({ ...selectedLead, notes: e.target.value })}
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

export default AdminLeads;
