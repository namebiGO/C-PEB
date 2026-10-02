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
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h2>Query Resolution</h2>
      </div>

      {/* Summary cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Open', value: summary.open, accent: '#f59e0b' },
            { label: 'In Progress', value: summary.inProgress, accent: '#3b82f6' },
            { label: 'Resolved', value: summary.resolved, accent: '#10b981' },
            { label: 'Closed', value: summary.closed, accent: '#94a3b8' },
            { label: '🔴 Urgent', value: summary.urgent, accent: '#ef4444' },
          ].map(({ label, value, accent }) => (
            <div key={label} style={{ background: '#fff', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: `3px solid ${accent}` }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search name, email, subject…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="admin-search-input"
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select className="admin-select" style={{ width: 'auto' }} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select className="admin-select" style={{ width: 'auto' }} value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setPage(1); }}>
          <option value="ALL">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>SUBJECT</th>
              <th>FROM</th>
              <th>CATEGORY</th>
              <th>PRIORITY</th>
              <th>STATUS</th>
              <th>RECEIVED</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading…</td></tr>
            ) : queries.length === 0 ? (
              <tr><td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No queries found</div>
                <div style={{ fontSize: '0.85rem' }}>There are currently no user queries matching your filters.</div>
              </td></tr>
            ) : queries.map(q => (
              <tr key={q._id}>
                <td style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>#{q._id.slice(-6).toUpperCase()}</td>
                <td>
                  <div style={{ fontWeight: 600, color: '#0f172a', maxWidth: '240px' }}>{q.subject}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>{q.category.replace('_', ' ')}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{q.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{q.email}</div>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#475569' }}>{q.category.replace(/_/g, ' ')}</td>
                <td><Badge label={q.priority} color={PRIORITY_COLORS[q.priority] || PRIORITY_COLORS.LOW} /></td>
                <td><Badge label={q.status.replace('_', ' ')} color={STATUS_COLORS[q.status] || STATUS_COLORS.OPEN} /></td>
                <td style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>{timeAgo(q.createdAt)}</td>
                <td>
                  <button
                    className="btn-secondary"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                    onClick={() => navigate(`/admin/queries/${q._id}`)}
                  >
                    Open →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button className="btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '0.4rem 0.75rem' }}>← Prev</button>
          <span style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', color: '#64748b' }}>Page {page} of {pagination.pages}</span>
          <button className="btn-secondary" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)} style={{ padding: '0.4rem 0.75rem' }}>Next →</button>
        </div>
      )}
    </div>
  );
};

export default AdminQueries;
