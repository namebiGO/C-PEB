import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminPayments = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [dataSource, setDataSource] = useState('DATABASE'); // 'DATABASE' or 'RAZORPAY'

  const socket = useSocket();

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      
      if (dataSource === 'DATABASE') {
        const [transRes, statsRes] = await Promise.all([
          fetch(`/api/admin/payments?status=${filter}&search=${search}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/payments/stats', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const transData = await transRes.json();
        const statsData = await statsRes.json();

        if (transData.success) setTransactions(transData.data);
        if (statsData.success) setStats(statsData.data);
      } else {
        const transRes = await fetch(`/api/admin/payments/razorpay?count=50`, { headers: { Authorization: `Bearer ${token}` } });
        const transData = await transRes.json();
        if (transData.success) {
           let filtered = transData.data;
           if (filter !== 'ALL') filtered = filtered.filter(t => t.status === filter);
           if (search) filtered = filtered.filter(t => 
             t.transactionId?.includes(search) || 
             t.customer.name?.toLowerCase().includes(search.toLowerCase()) || 
             t.customer.email?.toLowerCase().includes(search.toLowerCase())
           );
           setTransactions(filtered);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, search, dataSource]);

  useEffect(() => {
    if (!socket) return;
    
    // In a real application, you might emit a socket event when a payment is processed
    socket.on('new_payment', () => fetchData());
    
    return () => {
      socket.off('new_payment');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // Dummy chart data (in real life, fetch time-series data from backend)
  const chartData = [
    { name: 'Mon', Revenue: 4000 },
    { name: 'Tue', Revenue: 3000 },
    { name: 'Wed', Revenue: 2000 },
    { name: 'Thu', Revenue: 2780 },
    { name: 'Fri', Revenue: 1890 },
    { name: 'Sat', Revenue: 2390 },
    { name: 'Sun', Revenue: 3490 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>Payments & Revenue</h1>
          <p style={{ margin: 0, color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>Track all advisory subscriptions and transactions.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--admin-surface)', padding: '0.25rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }}>
          <button 
            onClick={() => setDataSource('DATABASE')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--admin-radius-sm)', border: 'none', background: dataSource === 'DATABASE' ? 'var(--admin-primary)' : 'transparent', color: dataSource === 'DATABASE' ? '#fff' : 'var(--admin-text-secondary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s' }}
          >
            Database
          </button>
          <button 
            onClick={() => setDataSource('RAZORPAY')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--admin-radius-sm)', border: 'none', background: dataSource === 'RAZORPAY' ? '#0288D1' : 'transparent', color: dataSource === 'RAZORPAY' ? '#fff' : 'var(--admin-text-secondary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span style={{width: 14, height: 14, background: '#fff', borderRadius: '2px', display: 'inline-block'}}></span>
            Live Razorpay
          </button>
        </div>
      </div>

      {/* STATS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="admin-card">
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Revenue</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>
              ₹{stats?.totalRevenue?.toLocaleString() || '0'}
            </span>
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Recent (30 Days)</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--admin-primary)' }}>
              ₹{stats?.recentRevenue?.toLocaleString() || '0'}
            </span>
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Successful Payments</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>
              {stats?.successfulTransactions || 0}
            </span>
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Pending / Failed</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>
              {stats?.pendingTransactions || 0} / {stats?.failedTransactions || 0}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* CHART */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Revenue Overview (Last 7 Days)</h2>
          </div>
          <div className="admin-card-body" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--admin-primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--admin-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--admin-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--admin-text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border-subtle)" />
                <Tooltip 
                  contentStyle={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-md)', boxShadow: 'var(--admin-shadow-md)' }}
                  itemStyle={{ color: 'var(--admin-text-primary)', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="Revenue" stroke="var(--admin-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="admin-card">
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="admin-card-title">Recent Transactions</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                style={{ padding: '0.35rem 0.5rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)', fontSize: '0.875rem' }}
              >
                <option value="ALL">All Status</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
              <input 
                type="text" 
                placeholder="Search Txn ID or Customer..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)', fontSize: '0.875rem', minWidth: '200px' }}
              />
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-premium-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer</th>
                  <th>Plan / Item</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading...</td></tr>
                ) : transactions.length > 0 ? (
                  transactions.map(txn => (
                    <tr key={txn._id}>
                      <td className="font-semibold text-sm" style={{ color: 'var(--admin-text-primary)' }}>{txn.transactionId || '-'}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--admin-text-primary)' }}>{txn.customer.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{txn.customer.email}</div>
                      </td>
                      <td className="text-sm">{txn.item}</td>
                      <td className="font-semibold text-sm" style={{ color: 'var(--admin-primary)' }}>₹{txn.amount?.toLocaleString()}</td>
                      <td>
                        <span className={`admin-status ${txn.status === 'PAID' ? 'admin-status-success' : txn.status === 'FAILED' ? 'admin-status-danger' : 'admin-status-warning'}`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="text-muted text-sm">{new Date(txn.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>No transactions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
