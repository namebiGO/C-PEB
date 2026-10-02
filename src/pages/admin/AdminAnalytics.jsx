import React, { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Eye, Users, FileText } from 'lucide-react';
import './AdminLayout.css';

const DAYS_OPTIONS = [
  { label: 'Today', value: 1 },
  { label: '7 Days', value: 7 },
  { label: '30 Days', value: 30 },
  { label: '3 Months', value: 90 },
  { label: 'All Time', value: 365 },
];

const getToken = () => JSON.parse(localStorage.getItem('adminToken'))?.token || '';

const AdminAnalytics = () => {
  const [days, setDays] = useState(30);
  const [summary, setSummary] = useState(null);
  const [topCreators, setTopCreators] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [topQueries, setTopQueries] = useState([]);
  const [searchesOverTime, setSearchesOverTime] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const headers = { Authorization: `Bearer ${getToken()}` };
    try {
      const [summaryRes, creatorsRes, catRes, locRes, queriesRes, timeRes] = await Promise.all([
        fetch(`/api/analytics/admin/summary?days=${days}`, { headers }),
        fetch(`/api/analytics/admin/top-creators?days=${days}&limit=10&eventType=PROFILE_VIEW`, { headers }),
        fetch(`/api/analytics/admin/top-categories?days=${days}&limit=8`, { headers }),
        fetch(`/api/analytics/admin/top-locations?days=${days}&limit=8`, { headers }),
        fetch(`/api/analytics/admin/top-queries?days=${days}&limit=10`, { headers }),
        fetch(`/api/analytics/admin/searches-over-time?days=${days}`, { headers }),
      ]);

      const [s, c, cat, loc, q, t] = await Promise.all([
        summaryRes.json(), creatorsRes.json(), catRes.json(),
        locRes.json(), queriesRes.json(), timeRes.json(),
      ]);

      if (s.success) setSummary(s.data);
      if (c.success) setTopCreators(c.data);
      if (cat.success) setTopCategories(cat.data);
      if (loc.success) setTopLocations(loc.data);
      if (q.success) setTopQueries(q.data);
      if (t.success) setSearchesOverTime(t.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const StatCard = ({ label, value, icon: Icon, color, bg }) => (
    <div className="admin-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem 0' }}>{label}</h3>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>{value ?? '—'}</div>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--admin-radius-md)', background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );

  const RankList = ({ data, keyField, valueField, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {data.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>Not enough data yet.</div>
      ) : data.map((item, idx) => {
        const maxVal = data[0][valueField] || 1;
        const pct = Math.round((item[valueField] / maxVal) * 100);
        return (
          <div key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--admin-text-secondary)', flexShrink: 0 }}>{idx + 1}</span>
                <span style={{ fontWeight: 600, color: 'var(--admin-text-primary)', fontSize: '0.875rem' }}>{item[keyField] || '(unknown)'}</span>
              </div>
              <span style={{ fontWeight: 600, color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>{item[valueField].toLocaleString()}</span>
            </div>
            <div style={{ background: 'var(--admin-border-subtle)', borderRadius: '4px', height: '6px' }}>
              <div style={{ background: 'var(--admin-primary)', height: '6px', borderRadius: '4px', width: `${pct}%`, transition: 'width 0.4s ease' }} />
            </div>
            {label && <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.35rem', paddingLeft: '34px' }}>{label(item)}</div>}
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>Search Analytics</h1>
          <p style={{ margin: 0, color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>Monitor user search behavior and platform intelligence.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--admin-surface)', padding: '0.25rem', borderRadius: 'var(--admin-radius-md)', border: '1px solid var(--admin-border)' }}>
          {DAYS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              className={`admin-btn ${days === opt.value ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              style={{ padding: '0.35rem 0.75rem', border: 'none', background: days === opt.value ? 'var(--admin-primary)' : 'transparent', color: days === opt.value ? '#fff' : 'var(--admin-text-secondary)' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--admin-border)', borderTopColor: 'var(--admin-primary)', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <>
          {/* KPI Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <StatCard label="Total Searches" value={summary?.totalSearches?.toLocaleString()} icon={Search} color="var(--admin-primary)" bg="var(--admin-primary-bg)" />
            <StatCard label="Profile Views" value={summary?.totalProfileViews?.toLocaleString()} icon={Eye} color="var(--admin-info)" bg="var(--admin-info-bg)" />
            <StatCard label="Searches Today" value={summary?.todaySearches?.toLocaleString()} icon={Users} color="var(--admin-success)" bg="var(--admin-success-bg)" />
            <StatCard label="Unique Queries" value={summary?.uniqueQueries?.toLocaleString()} icon={FileText} color="var(--admin-warning)" bg="var(--admin-warning-bg)" />
          </div>

          {/* Searches over time chart */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Search Volume ({days} Days)</h2>
            </div>
            <div className="admin-card-body" style={{ height: '350px' }}>
              {searchesOverTime.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: '4rem', color: 'var(--admin-text-muted)' }}>Not enough data yet. Searches will appear here once users browse the site.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={searchesOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              )}
            </div>
          </div>

          {/* Four column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">Most Viewed Creators</h2>
              </div>
              <div className="admin-card-body">
                <RankList
                  data={topCreators}
                  keyField="displayName"
                  valueField="count"
                  label={(item) => `${item.primaryCategory || 'Creator'} • ${item.city || ''}`}
                />
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">Top Search Queries</h2>
              </div>
              <div className="admin-card-body">
                <RankList data={topQueries} keyField="query" valueField="count" />
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">Top Categories Browsed</h2>
              </div>
              <div className="admin-card-body">
                <RankList data={topCategories} keyField="category" valueField="count" />
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">Top Locations Searched</h2>
              </div>
              <div className="admin-card-body">
                <RankList data={topLocations} keyField="location" valueField="count" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
