import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, UserCheck, Star, FileText, Search, MessageSquare, 
  TrendingUp, TrendingDown, ArrowRight, AlertCircle 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#94a3b8'];

const Dashboard = () => {
  const { admin, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [lists, setLists] = useState({
    pendingCreators: [],
    recentLeads: [],
    activeAdvisoryRequests: [],
    recentCreatorActivity: []
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const token = user?.token || admin?.token || JSON.parse(localStorage.getItem('adminToken'))?.token;

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [statsRes, listsRes, chartRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/dashboard-lists', { headers }),
        fetch('/api/analytics/admin/searches-over-time?days=7', { headers })
      ]);
      
      const statsData = await statsRes.json();
      const listsData = await listsRes.json();
      const chartDataRes = await chartRes.json();

      if (statsData.success) setStats(statsData.data);
      if (listsData.success) setLists(listsData.data);
      if (chartDataRes.success) setChartData(chartDataRes.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDashboardData();
  }, [token]);

  useEffect(() => {
    if (!socket || !token) return;
    const handleUpdate = () => fetchDashboardData();
    socket.on('new_lead', handleUpdate);
    socket.on('new_contact', handleUpdate);
    socket.on('new_creator_application', handleUpdate);
    socket.on('update_creator_profile', handleUpdate);
    socket.on('update_query', handleUpdate);
    return () => {
      socket.off('new_lead', handleUpdate);
      socket.off('new_contact', handleUpdate);
      socket.off('new_creator_application', handleUpdate);
      socket.off('update_creator_profile', handleUpdate);
      socket.off('update_query', handleUpdate);
    };
  }, [socket, token]);

  if (loading) {
    return (
      <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Derived data for charts
  const pieData = [
    { name: 'Approved', value: stats?.approvedInfluencers || 0 },
    { name: 'Pending', value: stats?.pendingApplications || 0 },
    { name: 'Other', value: Math.max(0, (stats?.totalInfluencers || 0) - (stats?.approvedInfluencers || 0)) }
  ].filter(d => d.value > 0);

  const attentionItems = [];
  if (stats?.pendingApplications > 0) attentionItems.push({ type: 'application', label: `${stats.pendingApplications} applications awaiting approval`, link: '/admin/creators?filter=PENDING_REVIEW' });
  if (stats?.openQueries > 0) attentionItems.push({ type: 'query', label: `${stats.openQueries} unresolved user queries`, link: '/admin/queries' });
  if (stats?.newLeads > 0) attentionItems.push({ type: 'lead', label: `${stats.newLeads} new leads require attention`, link: '/admin/leads' });

  const KpiCard = ({ title, value, icon: Icon, trend, color, bg }) => (
    <div className="admin-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem 0' }}>{title}</h3>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>{value}</div>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--admin-radius-md)', background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} />
        </div>
      </div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: trend > 0 ? 'var(--admin-success)' : 'var(--admin-text-muted)' }}>
          {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span style={{ fontWeight: 500 }}>{Math.abs(trend)}%</span> vs last month
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>Good morning, {admin?.name || user?.name || 'Admin'}</h1>
          <p style={{ margin: 0, color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>Here's what's happening across C-PEB today.</p>
        </div>
      </div>

      {/* KPI Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <KpiCard title="Total Influencers" value={stats?.totalInfluencers || 0} icon={Users} color="var(--admin-primary)" bg="var(--admin-primary-bg)" trend={12} />
        <KpiCard title="Pending Approval" value={stats?.pendingApplications || 0} icon={UserCheck} color="var(--admin-warning)" bg="var(--admin-warning-bg)" />
        <KpiCard title="Approved Influencers" value={stats?.approvedInfluencers || 0} icon={Star} color="var(--admin-success)" bg="var(--admin-success-bg)" trend={4} />
        <KpiCard title="Open Queries" value={stats?.openQueries || 0} icon={MessageSquare} color="var(--admin-danger)" bg="var(--admin-danger-bg)" />
      </div>

      {/* Attention Required */}
      <div className="admin-card" style={{ borderLeft: '4px solid var(--admin-danger)' }}>
        <div className="admin-card-header" style={{ padding: '1rem 1.25rem', background: '#fef2f2', borderBottom: 'none' }}>
          <h2 className="admin-card-title" style={{ color: 'var(--admin-danger-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} /> Attention Required
          </h2>
        </div>
        {attentionItems.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {attentionItems.map((item, i) => (
              <div key={i} style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--admin-border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--admin-danger)' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.label}</span>
                </div>
                <button onClick={() => navigate(item.link)} className="admin-btn admin-btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                  Review <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '1.25rem', fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>
            Everything is up to date. No pending actions required.
          </div>
        )}
      </div>

      {/* Main Analytics Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Search Activity (7 Days)</h2>
            <Link to="/admin/analytics" style={{ fontSize: '0.75rem', color: 'var(--admin-primary)', textDecoration: 'none', fontWeight: 500 }}>View Full Report</Link>
          </div>
          <div className="admin-card-body" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--admin-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--admin-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border-subtle)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--admin-text-muted)' }} tickFormatter={(val) => val.slice(5)} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--admin-text-muted)' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--admin-shadow-md)' }} />
                <Area type="monotone" dataKey="count" name="Searches" stroke="var(--admin-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSearches)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Influencer Status</h2>
          </div>
          <div className="admin-card-body" style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--admin-shadow-md)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
              {pieData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--admin-text-secondary)' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[i % COLORS.length] }} />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Operational Tables Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Pending Creators */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Pending Applications</h2>
            <Link to="/admin/creators?filter=PENDING_REVIEW" style={{ fontSize: '0.75rem', color: 'var(--admin-primary)', textDecoration: 'none', fontWeight: 500 }}>View All</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-premium-table">
              <thead>
                <tr>
                  <th>Creator</th>
                  <th>Applied</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lists.pendingCreators.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '2rem' }}>No pending applications.</td></tr>
                ) : (
                  lists.pendingCreators.map(c => (
                    <tr key={c._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={c.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.displayName)}&background=random`} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <div className="font-semibold text-sm">{c.displayName}</div>
                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>{c.primaryCategory || 'Creator'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => navigate(`/admin/creators/${c._id}`)} className="admin-btn admin-btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}>Review</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recent Leads</h2>
            <Link to="/admin/leads" style={{ fontSize: '0.75rem', color: 'var(--admin-primary)', textDecoration: 'none', fontWeight: 500 }}>View All</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-premium-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {lists.recentLeads.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '2rem' }}>No recent leads.</td></tr>
                ) : (
                  lists.recentLeads.map(l => (
                    <tr key={l._id}>
                      <td>
                        <div className="font-semibold text-sm">{l.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{l.source || 'Website'}</div>
                      </td>
                      <td>
                        <span className={`admin-status ${l.status === 'New' ? 'admin-status-info' : 'admin-status-neutral'}`}>{l.status}</span>
                      </td>
                      <td className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(l.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
