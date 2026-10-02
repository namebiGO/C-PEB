import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import './AdminCreators.css'; // Reusing styling

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  
  const socket = useSocket();

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const res = await fetch('/api/contact?limit=100', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setContacts(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    socket.on('new_contact', (newContact) => {
      setContacts(prev => [newContact, ...prev]);
    });

    socket.on('update_contact', (updatedContact) => {
      setContacts(prev => prev.map(c => c._id === updatedContact._id ? updatedContact : c));
      if (selectedContact && selectedContact._id === updatedContact._id) {
        setSelectedContact(updatedContact);
      }
    });

    return () => {
      socket.off('new_contact');
      socket.off('update_contact');
    };
  }, [socket, selectedContact]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchContacts();
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotesChange = async () => {
    if (!selectedContact) return;
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      await fetch(`/api/contact/${selectedContact._id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ notes: selectedContact.notes })
      });
      alert('Notes saved successfully.');
      fetchContacts();
    } catch (error) {
      console.error(error);
      alert('Error saving notes.');
    }
  };

  const filteredContacts = contacts.filter(c => {
    if (filter !== 'ALL' && c.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && 
          !c.email.toLowerCase().includes(q) && 
          !(c.company && c.company.toLowerCase().includes(q))) {
        return false;
      }
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new': return 'badge-info';
      case 'in-progress': return 'badge-warning';
      case 'closed': return 'badge-default';
      default: return 'badge-default';
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h2>Strategy Submissions</h2>
      </div>

      <div className="admin-subnav">
        {['ALL', 'new', 'in-progress', 'closed'].map(f => (
          <button 
            key={f} 
            className={`subnav-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'ALL' ? 'ALL' : f.toUpperCase()}
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

      <div style={{ display: 'grid', gridTemplateColumns: selectedContact ? '2fr 1fr' : '1fr', gap: '2rem' }}>
        
        {/* CONTACTS LIST */}
        <div className="admin-table-container" style={{ alignSelf: 'start' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>CONTACT</th>
                <th>IDENTITY & BUDGET</th>
                <th>GOAL</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
              ) : filteredContacts.length > 0 ? filteredContacts.map(contact => (
                <tr key={contact._id} style={{ background: selectedContact?._id === contact._id ? '#f8fafc' : 'white' }}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{contact.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{contact.email}</div>
                    {contact.company && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{contact.company}</div>}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                      {contact.identity}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>Budget: {contact.budget}</div>
                  </td>
                  <td>
                     <div style={{ fontSize: '0.85rem', color: '#334155', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {contact.goal}
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${getStatusBadge(contact.status)}`}>{contact.status.toUpperCase()}</span>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{new Date(contact.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => setSelectedContact(contact)} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                      View &rarr;
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No submissions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* CONTACT DETAIL PROFILE */}
        {selectedContact && (
          <div className="admin-section" style={{ position: 'sticky', top: '2rem', alignSelf: 'start', padding: '1.5rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Submission Profile</h3>
              <button onClick={() => setSelectedContact(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a' }}>{selectedContact.name}</h4>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.2rem' }}>Email: <a href={`mailto:${selectedContact.email}`} style={{ color: '#2563eb' }}>{selectedContact.email}</a></div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.2rem' }}>Phone: <a href={`tel:${selectedContact.phone}`} style={{ color: '#2563eb' }}>{selectedContact.phone || '-'}</a></div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Company: <strong>{selectedContact.company || '-'}</strong></div>
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Identity: <span style={{ color: '#0f172a' }}>{selectedContact.identity}</span></div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Budget: <span style={{ color: '#0f172a' }}>{selectedContact.budget}</span></div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', marginTop: '1rem' }}>Goal</div>
              <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>{selectedContact.goal}</div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Status</label>
              <select 
                value={selectedContact.status} 
                onChange={(e) => handleStatusChange(selectedContact._id, e.target.value)} 
                className="admin-select"
              >
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Internal Notes</label>
              <textarea 
                rows="4" 
                className="admin-input" 
                placeholder="Add notes about this submission..."
                value={selectedContact.notes || ''}
                onChange={(e) => setSelectedContact({ ...selectedContact, notes: e.target.value })}
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

export default AdminContacts;
