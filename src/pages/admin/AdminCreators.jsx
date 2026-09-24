import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminCreators.css';

const AdminCreators = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCreators();
  }, [filter]);

  const fetchCreators = async () => {
    setLoading(true);
    try {
      // In a real app, we'd pass filters to the backend. Here we fetch all and filter client-side for simplicity,
      // or pass the status filter if the backend supports it. The backend supports ?status=
      const url = filter !== 'ALL' && filter !== 'FEATURED' && filter !== 'HIDDEN' 
        ? `/api/admin/creators/profiles?status=${filter}` 
        : '/api/admin/creators/profiles';
        
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${user?.token || ''}` }
      });
      const data = await res.json();
      if (data.success) {
        setCreators(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'PENDING_REVIEW': return 'badge-warning';
      case 'APPROVED': return 'badge-success';
      case 'CHANGES_REQUESTED': return 'badge-info';
      case 'REJECTED': return 'badge-error';
      default: return 'badge-default';
    }
  };

  const handlePriorityChange = async (id, newPriority) => {
    try {
      await fetch(`/api/admin/creators/profiles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token || ''}`
        },
        body: JSON.stringify({ priority: Number(newPriority) })
      });
      fetchCreators();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter creators client-side for search and custom sub-nav
  const filteredCreators = creators.filter(c => {
    if (filter === 'FEATURED' && !c.featured) return false;
    if (filter === 'HIDDEN' && c.visibility !== 'HIDDEN') return false;
    
    if (search) {
      const searchLower = search.toLowerCase();
      const matchName = c.displayName?.toLowerCase().includes(searchLower);
      const matchCategory = c.primaryCategory?.toLowerCase().includes(searchLower);
      const matchCity = c.city?.toLowerCase().includes(searchLower);
      if (!matchName && !matchCategory && !matchCity) return false;
    }
    return true;
  });

  // Sort by priority ASC, then updatedAt DESC
  const sortedCreators = [...filteredCreators].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const totalCount = creators.length;
  const pendingCount = creators.filter(c => c.status === 'PENDING_REVIEW').length;
  const approvedCount = creators.filter(c => c.status === 'APPROVED').length;
  const featuredCount = creators.filter(c => c.featured).length;
  const hiddenCount = creators.filter(c => c.visibility === 'HIDDEN').length;

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h2>Creators</h2>
        <div className="admin-summary-cards">
          <div className="summary-card">
            <span>TOTAL CREATORS</span>
            <strong>{totalCount}</strong>
          </div>
          <div className="summary-card">
            <span>PENDING REVIEW</span>
            <strong>{pendingCount}</strong>
          </div>
          <div className="summary-card">
            <span>APPROVED</span>
            <strong>{approvedCount}</strong>
          </div>
          <div className="summary-card">
            <span>FEATURED</span>
            <strong>{featuredCount}</strong>
          </div>
          <div className="summary-card">
            <span>HIDDEN</span>
            <strong>{hiddenCount}</strong>
          </div>
        </div>
      </div>

      <div className="admin-subnav">
        {['ALL', 'PENDING_REVIEW', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED', 'HIDDEN', 'FEATURED'].map(f => (
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
          placeholder="Search by name, category, location..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
        <button className="btn-secondary" onClick={() => navigate('/admin/creators/order')}>
          Manage Display Order
        </button>
      </div>

      {loading ? (
        <div>Loading creators...</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>PROFILE</th>
                <th>CATEGORY</th>
                <th>LOCATION</th>
                <th>FOLLOWERS</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th>FEATURED</th>
                <th>VISIBILITY</th>
                <th>UPDATED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {sortedCreators.length > 0 ? sortedCreators.map(creator => (
                <tr key={creator._id}>
                  <td>
                    <div className="admin-creator-cell">
                      {creator.profileImage ? (
                        <img src={creator.profileImage} alt="" className="admin-creator-avatar" />
                      ) : (
                        <div className="admin-creator-avatar-placeholder"></div>
                      )}
                      <div>
                        <strong>{creator.displayName}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>@{creator.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>{creator.primaryCategory || '-'}</td>
                  <td>{creator.city ? `${creator.city}, ${creator.country}` : '-'}</td>
                  <td>{creator.followersDisplay || '-'}</td>
                  <td>
                    <input 
                      type="number" 
                      defaultValue={creator.priority} 
                      onBlur={(e) => handlePriorityChange(creator._id, e.target.value)}
                      className="priority-input"
                      style={{ width: '60px', padding: '4px' }}
                    />
                  </td>
                  <td>
                    <span className={`admin-badge ${getStatusBadgeClass(creator.status)}`}>
                      {creator.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    {creator.featured ? <span className="badge-success">YES</span> : <span className="badge-default">NO</span>}
                  </td>
                  <td>
                    {creator.visibility === 'VISIBLE' ? <span className="badge-success">VISIBLE</span> : <span className="badge-default">HIDDEN</span>}
                  </td>
                  <td>{new Date(creator.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/admin/creators/${creator._id}`} className="action-link">
                      Manage &rarr;
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>No creators found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCreators;
