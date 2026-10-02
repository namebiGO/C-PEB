import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import './AdminCreators.css'; // Reusing styling

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  
  const socket = useSocket();

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

  useEffect(() => {
    if (!socket) return;

    socket.on('new_lead', (newLead) => {
      setLeads(prev => [newLead, ...prev]);
    });

    socket.on('update_lead', (updatedLead) => {
      setLeads(prev => prev.map(l => l._id === updatedLead._id ? updatedLead : l));
      if (selectedLead && selectedLead._id === updatedLead._id) {
        setSelectedLead(updatedLead);
      }
    });

    socket.on('delete_lead', (deletedId) => {
      setLeads(prev => prev.filter(l => l._id !== deletedId));
      if (selectedLead && selectedLead._id === deletedId) {
        setSelectedLead(null);
      }
    });

    return () => {
      socket.off('new_lead');
      socket.off('update_lead');
      socket.off('delete_lead');
    };
  }, [socket, selectedLead]);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>Leads CRM</h1>
          <p style={{ margin: 0, color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>Track and convert potential business inquiries.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--admin-surface)', padding: '0.25rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)', width: 'fit-content' }}>
        {['ALL', 'New', 'Contacted', 'In Progress', 'Converted', 'Closed'].map(f => (
          <button 
            key={f} 
            className={`admin-btn ${filter === f ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setFilter(f)}
            style={{ padding: '0.35rem 0.75rem', border: 'none', background: filter === f ? 'var(--admin-primary)' : 'transparent', color: filter === f ? '#fff' : 'var(--admin-text-secondary)' }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <input 
          type="text" 
          placeholder="Search name, email, company..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)', fontSize: '0.875rem' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedLead ? '2fr 1fr' : '1fr', gap: '1.5rem' }}>
        
        {/* LEADS LIST */}
        <div className="admin-card" style={{ alignSelf: 'start' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-premium-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Requirement & Source</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading...</td></tr>
                ) : filteredLeads.length > 0 ? filteredLeads.map(lead => (
                  <tr key={lead._id} style={{ background: selectedLead?._id === lead._id ? 'var(--admin-primary-bg)' : 'transparent' }}>
                    <td>
                      <div className="font-semibold text-sm">{lead.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{lead.email}</div>
                      {lead.company && <div style={{ fontSize: '0.7rem', color: 'var(--admin-primary)' }}>{lead.company}</div>}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-primary)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {lead.requirement}
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>Source: {lead.source || 'Website'}</div>
                    </td>
                    <td>
                      <span className={`admin-status ${lead.status === 'New' ? 'admin-status-info' : lead.status === 'Converted' ? 'admin-status-success' : lead.status === 'Closed' ? 'admin-status-neutral' : 'admin-status-warning'}`}>{lead.status}</span>
                    </td>
                    <td className="text-muted text-sm">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => setSelectedLead(lead)} className="admin-btn admin-btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                        View
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>No leads found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* LEAD DETAIL PROFILE */}
        {selectedLead && (
          <div className="admin-card" style={{ position: 'sticky', top: '2rem', alignSelf: 'start' }}>
            <div className="admin-card-header">
              <h3 className="admin-card-title">Lead Profile</h3>
              <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--admin-text-muted)' }}>&times;</button>
            </div>
            <div className="admin-card-body">
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--admin-text-primary)', fontSize: '1.1rem' }}>{selectedLead.name}</h4>
                <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)', marginBottom: '0.2rem' }}>Email: <a href={`mailto:${selectedLead.email}`} style={{ color: 'var(--admin-primary)', textDecoration: 'none' }}>{selectedLead.email}</a></div>
                <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)', marginBottom: '0.2rem' }}>Phone: <a href={`tel:${selectedLead.phone}`} style={{ color: 'var(--admin-primary)', textDecoration: 'none' }}>{selectedLead.phone || '-'}</a></div>
                <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>Company: <strong style={{ color: 'var(--admin-text-primary)' }}>{selectedLead.company || '-'}</strong></div>
              </div>

              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--admin-bg)', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Requirement</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-primary)', lineHeight: '1.5' }}>{selectedLead.requirement}</div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Source: {selectedLead.source || 'Website'}</div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>Status</label>
                <select 
                  value={selectedLead.status} 
                  onChange={(e) => handleStatusChange(selectedLead._id, e.target.value)} 
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)', background: 'var(--admin-surface)' }}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 500 }}>Internal Notes</label>
                <textarea 
                  rows="4" 
                  placeholder="Add notes about this lead..."
                  value={selectedLead.notes || ''}
                  onChange={(e) => setSelectedLead({ ...selectedLead, notes: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }}
                ></textarea>
                <button className="admin-btn admin-btn-primary" style={{ marginTop: '0.5rem', width: '100%' }} onClick={handleNotesChange}>
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeads;
