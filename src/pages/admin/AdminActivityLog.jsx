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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>Activity Log</h1>
          <p style={{ margin: 0, color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>Audit trail of all administrative actions.</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div style={{ flex: 1 }}>
            <select 
              value={entityType} 
              onChange={e => { setEntityType(e.target.value); setPage(1); }} 
              style={{ padding: '0.5rem 1rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)', fontSize: '0.875rem', background: 'var(--admin-surface)' }}
            >
              <option value="ALL">All Categories</option>
              <option value="CREATOR_PROFILE">Creators</option>
              <option value="QUERY">Queries</option>
              <option value="LEAD">Leads</option>
              <option value="SETTINGS">Settings</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-premium-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Admin</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading...</td></tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--admin-text-primary)', marginBottom: '0.5rem' }}>No activity found</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>No actions have been logged for this filter.</div>
                  </td>
                </tr>
              ) : (
                activities.map((act) => {
                  const link = getEntityLink(act);
                  return (
                    <tr key={act._id}>
                      <td className="text-muted text-sm" style={{ whiteSpace: 'nowrap' }}>
                        {new Date(act.createdAt).toLocaleString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--admin-primary-bg)', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700 }}>
                            {act.adminName ? act.adminName.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <span className="font-medium text-sm">{act.adminName || 'Admin'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="admin-status admin-status-neutral" style={{ textTransform: 'capitalize' }}>
                          {formatAction(act.action)}
                        </span>
                      </td>
                      <td className="text-sm">
                        {link && act.entityName ? (
                          <Link to={link} style={{ color: 'var(--admin-primary)', textDecoration: 'none', fontWeight: 500 }}>{act.entityName}</Link>
                        ) : (
                          <span className="font-medium">{act.entityName || act.entityType}</span>
                        )}
                      </td>
                      <td className="text-muted text-sm">
                        {act.metadata?.note ? <div style={{ marginBottom: '0.2rem' }}>Note: {act.metadata.note}</div> : null}
                        {act.metadata?.oldStatus ? <div>Changed {act.metadata.oldStatus} → {act.metadata.newStatus}</div> : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

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

export default AdminActivityLog;
