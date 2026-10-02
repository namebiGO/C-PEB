import React, { useState, useEffect, useCallback } from 'react';
import './AdminCreators.css';

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

  const maxSearches = Math.max(...searchesOverTime.map(d => d.count), 1);

  const StatCard = ({ label, value, accent }) => (
    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', borderLeft: `4px solid ${accent || '#e2e8f0'}` }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{value ?? '—'}</div>
    </div>
  );

  const RankList = ({ data, keyField, valueField, label }) => (
    <div>
      {data.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>Not enough data yet.</div>
      ) : data.map((item, idx) => {
        const maxVal = data[0][valueField] || 1;
        const pct = Math.round((item[valueField] / maxVal) * 100);
        return (
          <div key={idx} style={{ padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', flexShrink: 0 }}>{idx + 1}</span>
                <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{item[keyField] || '(unknown)'}</span>
              </div>
              <span style={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>{item[valueField].toLocaleString()}</span>
            </div>
            <div style={{ background: '#f1f5f9', borderRadius: '4px', height: '5px' }}>
              <div style={{ background: '#3b82f6', height: '5px', borderRadius: '4px', width: `${pct}%`, transition: 'width 0.4s ease' }} />
            </div>
            {label && <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem', paddingLeft: '34px' }}>{label(item)}</div>}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h2>Search Analytics</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {DAYS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              className={`subnav-btn ${days === opt.value ? 'active' : ''}`}
              style={{ padding: '0.35rem 0.75rem' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading analytics…</div>
      ) : (
        <>
          {/* KPI Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard label="Total Searches" value={summary?.totalSearches?.toLocaleString()} accent="#3b82f6" />
            <StatCard label="Profile Views" value={summary?.totalProfileViews?.toLocaleString()} accent="#8b5cf6" />
            <StatCard label="Searches Today" value={summary?.todaySearches?.toLocaleString()} accent="#10b981" />
            <StatCard label="Unique Queries" value={summary?.uniqueQueries?.toLocaleString()} accent="#f59e0b" />
          </div>

          {/* Searches over time chart */}
          <div className="admin-section" style={{ marginBottom: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', color: '#0f172a' }}>Searches Over Time</h3>
            {searchesOverTime.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Not enough data yet. Searches will appear here once users browse the site.</div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '120px', paddingBottom: '1.5rem', position: 'relative' }}>
                {searchesOverTime.map((d, i) => {
                  const barH = Math.max(4, Math.round((d.count / maxSearches) * 100));
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div title={`${d.date}: ${d.count} searches`} style={{ width: '100%', height: `${barH}px`, background: '#3b82f6', borderRadius: '3px 3px 0 0', minHeight: '4px', cursor: 'default' }} />
                      <div style={{ fontSize: '0.55rem', color: '#94a3b8', transform: 'rotate(-45deg)', whiteSpace: 'nowrap', marginTop: '4px' }}>
                        {d.date.slice(5)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Four column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="admin-section" style={{ margin: 0 }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Most Viewed Creators</h3>
              <RankList
                data={topCreators}
                keyField="displayName"
                valueField="count"
                label={(item) => `${item.primaryCategory || 'Creator'} • ${item.city || ''}`}
              />
            </div>

            <div className="admin-section" style={{ margin: 0 }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Top Search Queries</h3>
              <RankList data={topQueries} keyField="query" valueField="count" />
            </div>

            <div className="admin-section" style={{ margin: 0 }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Top Categories Browsed</h3>
              <RankList data={topCategories} keyField="category" valueField="count" />
            </div>

            <div className="admin-section" style={{ margin: 0 }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Top Locations Searched</h3>
              <RankList data={topLocations} keyField="location" valueField="count" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
