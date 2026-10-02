import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './AdminCreators.css';

const getToken = () => JSON.parse(localStorage.getItem('adminToken'))?.token || '';

const AdminActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entityType, setEntityType] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const res = await fetch(`/api/activity?page=${page}&limit=40${entityType !== 'ALL' ? `&entityType=${entityType}` : ''}`, { headers });
      const data = await res.json();
      if (data.success) {
        setActivities(data.data);
        setPagination(data.pagination);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, entityType]);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  const formatAction = (action) => {
    return action.replace(/_/g, ' ').toLowerCase();
  };

  const getEntityLink = (act) => {
    switch(act.entityType) {
      case 'CREATOR_PROFILE': return `/admin/creators/${act.entityId}`;
      case 'QUERY': return `/admin/queries/${act.entityId}`;
      // Add other cases as needed
      default: return null;
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h2>Admin Activity Log</h2>
        <div>
          <select value={entityType} onChange={e => { setEntityType(e.target.value); setPage(1); }} className="admin-select" style={{ width: 'auto' }}>
            <option value="ALL">All Categories</option>
            <option value="CREATOR_PROFILE">Creators</option>
            <option value="QUERY">Queries</option>
            <option value="LEAD">Leads</option>
            <option value="SETTINGS">Settings</option>
          </select>
        </div>
      </div>

      <div className="admin-section" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>TIME</th>
              <th>ADMIN</th>
              <th>ACTION</th>
              <th>ENTITY</th>
              <th>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading...</td></tr>
            ) : activities.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No activity found.</td></tr>
            ) : (
              activities.map((act) => {
                const link = getEntityLink(act);
                return (
                  <tr key={act._id}>
                    <td style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {new Date(act.createdAt).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 600, color: '#334155' }}>{act.adminName || 'Admin'}</td>
                    <td style={{ textTransform: 'capitalize', color: '#0f172a' }}>{formatAction(act.action)}</td>
                    <td>
                      {link && act.entityName ? (
                        <Link to={link} style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>{act.entityName}</Link>
                      ) : (
                        <span style={{ fontWeight: 500 }}>{act.entityName || act.entityType}</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {act.metadata?.note ? `Note: ${act.metadata.note}` : ''}
                      {act.metadata?.oldStatus ? `Changed ${act.metadata.oldStatus} → ${act.metadata.newStatus}` : ''}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button className="btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', color: '#64748b' }}>Page {page} of {pagination.pages}</span>
          <button className="btn-secondary" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
};

export default AdminActivityLog;
