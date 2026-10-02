import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import './AdminCreators.css';

const getToken = () => JSON.parse(localStorage.getItem('adminToken'))?.token || '';

const PRIORITY_COLORS = {
  LOW: { bg: '#f1f5f9', text: '#64748b' },
  MEDIUM: { bg: '#dbeafe', text: '#1e40af' },
  HIGH: { bg: '#fef9c3', text: '#854d0e' },
  URGENT: { bg: '#fee2e2', text: '#991b1b' },
};

const STATUS_COLORS = {
  OPEN: { bg: '#fef9c3', text: '#854d0e' },
  IN_PROGRESS: { bg: '#dbeafe', text: '#1e40af' },
  RESOLVED: { bg: '#dcfce7', text: '#166534' },
  CLOSED: { bg: '#f1f5f9', text: '#475569' },
};

const Badge = ({ label, color }) => (
  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px', background: color.bg, color: color.text, letterSpacing: '0.04em' }}>
    {label}
  </span>
);

const AdminQueries = () => {
  const [queries, setQueries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const socket = useSocket();
  const navigate = useNavigate();

  const fetchQueries = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
        ...(priorityFilter !== 'ALL' && { priority: priorityFilter }),
        ...(search && { search }),
      });

      const [qRes, sRes] = await Promise.all([
        fetch(`/api/queries/admin?${params}`, { headers }),
        fetch('/api/queries/admin/stats/summary', { headers }),
      ]);

      const [qData, sData] = await Promise.all([qRes.json(), sRes.json()]);
      if (qData.success) { setQueries(qData.data); setPagination(qData.pagination); }
      if (sData.success) setSummary(sData.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, search, page]);

  useEffect(() => { fetchQueries(); }, [fetchQueries]);

  useEffect(() => {
    if (!socket) return;
    socket.on('update_query', fetchQueries);
    return () => socket.off('update_query', fetchQueries);
  }, [socket, fetchQueries]);

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>Query Resolution</h1>
          <p style={{ margin: 0, color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>Manage and resolve user support tickets.</p>
        </div>
      </div>

      {/* Summary cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
          {[
            { label: 'Open', value: summary.open, icon: 'var(--admin-warning)', bg: 'var(--admin-warning-bg)' },
            { label: 'In Progress', value: summary.inProgress, icon: 'var(--admin-primary)', bg: 'var(--admin-primary-bg)' },
            { label: 'Resolved', value: summary.resolved, icon: 'var(--admin-success)', bg: 'var(--admin-success-bg)' },
            { label: 'Closed', value: summary.closed, icon: 'var(--admin-text-muted)', bg: 'var(--admin-bg)' },
            { label: 'Urgent', value: summary.urgent, icon: 'var(--admin-danger)', bg: 'var(--admin-danger-bg)' },
          ].map(({ label, value, icon, bg }) => (
            <div key={label} className="admin-card" style={{ padding: '1.25rem', borderTop: `4px solid ${icon}` }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{label}</div>
              <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Table Card */}
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search name, email, subject…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)', fontSize: '0.875rem' }}
            />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)', fontSize: '0.875rem', background: 'var(--admin-surface)' }}>
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setPage(1); }} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)', fontSize: '0.875rem', background: 'var(--admin-surface)' }}>
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-premium-table">
            <thead>
              <tr>
                <th>Query</th>
                <th>User</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Received</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading…</td></tr>
              ) : queries.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--admin-text-primary)', marginBottom: '0.5rem' }}>No queries found</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>There are currently no user queries matching your filters.</div>
                  </td>
                </tr>
              ) : queries.map(q => (
                <tr key={q._id}>
                  <td>
                    <div className="font-semibold text-sm">{q.subject}</div>
                    <div className="text-muted" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>#{q._id.slice(-6).toUpperCase()}</div>
                  </td>
                  <td>
                    <div className="font-medium text-sm">{q.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{q.email}</div>
                  </td>
                  <td className="text-muted text-sm">{q.category.replace(/_/g, ' ')}</td>
                  <td><span className={`admin-status ${q.priority === 'URGENT' ? 'admin-status-danger' : q.priority === 'HIGH' ? 'admin-status-warning' : 'admin-status-neutral'}`}>{q.priority}</span></td>
                  <td><span className={`admin-status ${q.status === 'OPEN' ? 'admin-status-warning' : q.status === 'IN_PROGRESS' ? 'admin-status-info' : q.status === 'RESOLVED' ? 'admin-status-success' : 'admin-status-neutral'}`}>{q.status.replace('_', ' ')}</span></td>
                  <td className="text-muted text-sm" style={{ whiteSpace: 'nowrap' }}>{timeAgo(q.createdAt)}</td>
                  <td>
                    <button className="admin-btn admin-btn-secondary" style={{ padding: '0.4rem 0.75rem' }} onClick={() => navigate(`/admin/queries/${q._id}`)}>Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <button className="admin-btn admin-btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>Page {page} of {pagination.pages}</span>
          <button className="admin-btn admin-btn-secondary" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default AdminQueries;
