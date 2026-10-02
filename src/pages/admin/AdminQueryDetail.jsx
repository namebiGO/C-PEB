import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import './AdminCreators.css';

const getToken = () => JSON.parse(localStorage.getItem('adminToken'))?.token || '';

const AdminQueryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const socket = useSocket();
  const messagesEndRef = useRef(null);

  const fetchDetail = async () => {
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const res = await fetch(`/api/queries/admin/${id}`, { headers });
      const data = await res.json();
      if (data.success) {
        setQuery(data.data);
        setMessages(data.data.messages || []);
      } else {
        setError(data.error || 'Failed to load query');
      }
    } catch (e) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetail(); }, [id]);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (update) => {
      if (update.queryId === id) {
        fetchDetail();
      }
    };
    socket.on('update_query', handleUpdate);
    return () => socket.off('update_query', handleUpdate);
  }, [socket, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStatusChange = async (newStatus) => {
    try {
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
      const res = await fetch(`/api/queries/admin/${id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setQuery(prev => ({ ...prev, status: newStatus }));
      }
    } catch (e) { console.error(e); }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
      const res = await fetch(`/api/queries/admin/${id}/priority`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ priority: newPriority })
      });
      const data = await res.json();
      if (data.success) {
        setQuery(prev => ({ ...prev, priority: newPriority }));
      }
    } catch (e) { console.error(e); }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    setSubmitting(true);
    try {
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
      const res = await fetch(`/api/queries/admin/${id}/reply`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: replyText })
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...messages, data.data]);
        setReplyText('');
        if (query.status === 'OPEN') {
          setQuery(prev => ({ ...prev, status: 'IN_PROGRESS' }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: '3rem', textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!query) return null;

  return (
    <div className="admin-page-container">
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/admin/queries" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem' }}>&larr; Back to Queries</Link>
      </div>
      
      <div className="admin-page-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem' }}>{query.subject}</h2>
          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Query #{query._id.slice(-6).toUpperCase()} • From: {query.name} ({query.email})</div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select value={query.priority} onChange={(e) => handlePriorityChange(e.target.value)} className="admin-select" style={{ width: 'auto', fontWeight: 600 }}>
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="URGENT">Urgent Priority</option>
          </select>
          <select value={query.status} onChange={(e) => handleStatusChange(e.target.value)} className="admin-select" style={{ width: 'auto', fontWeight: 600 }}>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Conversation Thread */}
        <div className="admin-section" style={{ margin: 0, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
          <div style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Conversation</h3>
          </div>
          
          <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.map((msg) => {
              const isAdmin = msg.senderType === 'ADMIN';
              return (
                <div key={msg._id} style={{ display: 'flex', flexDirection: 'column', alignItems: isAdmin ? 'flex-end' : 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                      {isAdmin ? (msg.adminName || 'Admin') : query.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    background: isAdmin ? '#eff6ff' : '#f1f5f9',
                    border: `1px solid ${isAdmin ? '#bfdbfe' : '#e2e8f0'}`,
                    maxWidth: '85%',
                    color: '#1e293b',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.message}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '1.5rem', background: '#fff', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
            <form onSubmit={handleReply}>
              <textarea 
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '100px', marginBottom: '1rem', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-primary" disabled={submitting || !replyText.trim()} style={{ padding: '0.6rem 1.5rem' }}>
                  {submitting ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-section" style={{ margin: 0 }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Query Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div><span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Category</span> {query.category.replace('_', ' ')}</div>
              <div><span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Created</span> {new Date(query.createdAt).toLocaleString()}</div>
              <div><span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Status</span> {query.status}</div>
              {query.resolvedAt && <div><span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Resolved At</span> {new Date(query.resolvedAt).toLocaleString()}</div>}
            </div>
          </div>

          <div className="admin-section" style={{ margin: 0 }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>User Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div><span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Name</span> {query.name}</div>
              <div><span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Email</span> <a href={`mailto:${query.email}`} style={{ color: '#3b82f6' }}>{query.email}</a></div>
              {query.phone && <div><span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Phone</span> {query.phone}</div>}
              {query.relatedCreatorSlug && <div><span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Related Creator</span> <Link to={`/directory/${query.relatedCreatorSlug}`} target="_blank" style={{ color: '#3b82f6' }}>{query.relatedCreatorSlug}</Link></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQueryDetail;
