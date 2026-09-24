import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { admin, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [lists, setLists] = useState({
    pendingCreators: [],
    recentLeads: [],
    activeAdvisoryRequests: [],
    recentCreatorActivity: []
  });
  const [loading, setLoading] = useState(true);

  // use admin or user token depending on how auth is structured
  const token = user?.token || admin?.token || JSON.parse(localStorage.getItem('adminToken'))?.token;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        const [statsRes, listsRes] = await Promise.all([
          fetch('/api/admin/stats', { headers }),
          fetch('/api/admin/dashboard-lists', { headers })
        ]);
        
        const statsData = await statsRes.json();
        const listsData = await listsRes.json();

        if (statsData.success) setStats(statsData.data);
        if (listsData.success) setLists(listsData.data);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDashboardData();
  }, [token]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: '2rem', background: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{ margin: '0 0 2rem 0', color: '#0f172a', fontSize: '1.75rem' }}>Welcome, {admin?.name || user?.name || 'Site Admin'}</h1>
      
      {/* KPI STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Total Influencers</h3>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>{stats?.totalInfluencers || 0}</div>
        </div>
        
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #fecaca', borderLeft: '4px solid #ef4444' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#991b1b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Pending Creators</h3>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#ef4444' }}>{stats?.pendingApplications || 0}</div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Approved Influencers</h3>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#10b981' }}>{stats?.approvedInfluencers || 0}</div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Featured Influencers</h3>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#8b5cf6' }}>{stats?.featuredInfluencers || 0}</div>
        </div>
        
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Total Services</h3>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>{stats?.totalServices || 0}</div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Total Leads</h3>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>{stats?.totalLeads || 0}</div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: '4px solid #f59e0b' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#b45309', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>New Leads</h3>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#d97706' }}>{stats?.newLeads || 0}</div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Active Advisory</h3>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>{stats?.activeAdvisoryPlans || 0}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* PENDING CREATOR APPLICATIONS */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Pending Creator Applications</h2>
            <Link to="/admin/creators?filter=PENDING_REVIEW" style={{ fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none' }}>View All &rarr;</Link>
          </div>
          <div>
            {lists.pendingCreators.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No pending applications.</div>
            ) : (
              lists.pendingCreators.map(c => (
                <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {c.profileImage ? <img src={c.profileImage} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0' }}></div>}
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{c.displayName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.primaryCategory || 'Creator'}</div>
                    </div>
                  </div>
                  <Link to={`/admin/creators/${c._id}`} style={{ padding: '0.4rem 0.75rem', background: '#fef9c3', color: '#854d0e', borderRadius: '4px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                    Review &rarr;
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RECENT LEADS */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Recent Leads</h2>
            <Link to="/admin/leads" style={{ fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none' }}>View All &rarr;</Link>
          </div>
          <div>
            {lists.recentLeads.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No recent leads.</div>
            ) : (
              lists.recentLeads.map(l => (
                <div key={l._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{l.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{l.source || 'Website'} &bull; {new Date(l.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '100px', background: l.status === 'New' ? '#dbeafe' : '#f1f5f9', color: l.status === 'New' ? '#1e40af' : '#475569' }}>
                    {l.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ACTIVE ADVISORY REQUESTS */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Active Advisory Plans</h2>
            <Link to="/admin/advisory" style={{ fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none' }}>View All &rarr;</Link>
          </div>
          <div>
            {lists.activeAdvisoryRequests.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No active advisory customers.</div>
            ) : (
              lists.activeAdvisoryRequests.map(adv => (
                <div key={adv._id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{adv.businessName}</div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534', background: '#dcfce3', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Active</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{adv.customerName} &bull; {adv.planTitle}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RECENT CREATOR ACTIVITY */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Recent Creator Activity</h2>
            <Link to="/admin/creators" style={{ fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none' }}>View Directory &rarr;</Link>
          </div>
          <div>
            {lists.recentCreatorActivity.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No recent activity.</div>
            ) : (
              lists.recentCreatorActivity.map(c => (
                <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: 500, color: '#334155', fontSize: '0.9rem' }}>{c.displayName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Updated {new Date(c.updatedAt).toLocaleDateString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
