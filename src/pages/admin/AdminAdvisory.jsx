import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Search,
  Filter,
  X,
  Send,
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  CreditCard
} from 'lucide-react';
import AdminAdvisoryPlans from './AdminAdvisoryPlans';

const AdminAdvisory = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    expiringSoon: 0,
    newPurchases: 0,
    openRequests: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, expiring, new, requests
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSub, setSelectedSub] = useState(null);

  // Modal actions
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [replyText, setReplyText] = useState('');
  const [selectedReqIndex, setSelectedReqIndex] = useState(0);

  const fetchSubscriptions = async (activeFilter = filter) => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const res = await fetch(`/api/advisory/admin/subscriptions?filter=${activeFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSubscriptions(data.data || []);
        if (data.stats) setStats(data.stats);
        return;
      }
      throw new Error('API request unsuccessful');
    } catch {
      // Offline fallback: load from local storage
      const localSubs = JSON.parse(localStorage.getItem('cpeb_advisory_subs') || '[]');
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      let activeCount = 0;
      let expiringSoonCount = 0;
      let newPurchasesCount = 0;
      let openRequestsCount = 0;
      let totalRevenue = 0;

      localSubs.forEach((sub) => {
        if (sub.supportStatus === 'ACTIVE') activeCount++;
        if (sub.supportStatus === 'EXPIRING_SOON') expiringSoonCount++;
        if (new Date(sub.startDate || sub.createdAt) >= sevenDaysAgo) newPurchasesCount++;
        if (sub.paymentStatus === 'PAID') totalRevenue += (sub.amount || 0);

        if (sub.requests && sub.requests.length) {
          sub.requests.forEach((r) => {
            if (['OPEN', 'IN REVIEW'].includes(r.status)) openRequestsCount++;
          });
        }
      });

      setStats({
        totalPlans: localSubs.length,
        activePlans: activeCount,
        expiringSoon: expiringSoonCount,
        newPurchases: newPurchasesCount,
        openRequests: openRequestsCount,
        totalRevenue
      });

      let filtered = localSubs;
      if (activeFilter === 'active') filtered = localSubs.filter((s) => s.supportStatus === 'ACTIVE');
      else if (activeFilter === 'expiring') filtered = localSubs.filter((s) => s.supportStatus === 'EXPIRING_SOON');
      else if (activeFilter === 'new') filtered = localSubs.filter((s) => new Date(s.startDate) >= sevenDaysAgo);
      else if (activeFilter === 'requests') filtered = localSubs.filter((s) => s.requests?.some((r) => ['OPEN', 'IN REVIEW'].includes(r.status)));

      setSubscriptions(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions(filter);
  }, [filter]);

  const handleSelectSub = (sub) => {
    setSelectedSub(sub);
    setAdminNote(sub.adminNotes || '');
    setReplyText('');
    setSelectedReqIndex(0);
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedSub) return;
    try {
      setUpdatingStatus(true);
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const res = await fetch(`http://localhost:5001/api/advisory/admin/subscriptions/${selectedSub._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ supportStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedSub(data.data);
        fetchSubscriptions(filter);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedSub) return;
    try {
      setUpdatingStatus(true);
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const res = await fetch(`http://localhost:5001/api/advisory/admin/subscriptions/${selectedSub._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ adminNotes: adminNote })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedSub(data.data);
        fetchSubscriptions(filter);
        alert('Notes saved successfully');
      }
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdateRequestStatus = async (reqId, newStatus) => {
    if (!selectedSub) return;
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const res = await fetch(`http://localhost:5001/api/advisory/admin/subscriptions/${selectedSub._id}/requests/${reqId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedSub(data.data);
        fetchSubscriptions(filter);
      }
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const handleSendReply = async (reqId) => {
    if (!selectedSub || !replyText.trim()) return;
    try {
      const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
      const res = await fetch(`http://localhost:5001/api/advisory/admin/subscriptions/${selectedSub._id}/requests/${reqId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ replyMessage: replyText.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedSub(data.data);
        setReplyText('');
        fetchSubscriptions(filter);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      sub.customerName?.toLowerCase().includes(term) ||
      sub.businessName?.toLowerCase().includes(term) ||
      sub.email?.toLowerCase().includes(term) ||
      sub.orderId?.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Startup & Business Advisory
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Manage active client advisory subscriptions, priority support requests, and billing status.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            ACTIVE PLANS
          </span>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginTop: '0.25rem' }}>
            {stats.activePlans}
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#10b981' }}>
            Priority Support Active
          </p>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            EXPIRING SOON
          </span>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b', marginTop: '0.25rem' }}>
            {stats.expiringSoon}
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
            Within next 7 days
          </p>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            NEW PURCHASES
          </span>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#3b82f6', marginTop: '0.25rem' }}>
            {stats.newPurchases}
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
            Last 7 days
          </p>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            SUPPORT REQUESTS
          </span>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ef4444', marginTop: '0.25rem' }}>
            {stats.openRequests}
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#ef4444' }}>
            Pending in queue
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.35rem', borderRadius: '10px' }}>
          {[
            { key: 'all', label: 'All Plans' },
            { key: 'active', label: 'Active' },
            { key: 'expiring', label: 'Expiring Soon' },
            { key: 'new', label: 'New Purchases' },
            { key: 'requests', label: 'With Open Requests' },
            { key: 'plans', label: 'Manage Plans' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                border: 'none',
                background: filter === tab.key ? '#fff' : 'transparent',
                color: filter === tab.key ? '#0f172a' : '#64748b',
                fontWeight: filter === tab.key ? '700' : '500',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: filter === tab.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                fontSize: '0.85rem'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search customer, business, order..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem 0.55rem 2.25rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem'
            }}
          />
        </div>
      </div>

      {filter === 'plans' ? (
        <AdminAdvisoryPlans />
      ) : (
        <>
          {/* Subscriptions Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '1rem 1.25rem' }}>Customer</th>
              <th style={{ padding: '1rem 1.25rem' }}>Business</th>
              <th style={{ padding: '1rem 1.25rem' }}>Plan</th>
              <th style={{ padding: '1rem 1.25rem' }}>Amount</th>
              <th style={{ padding: '1rem 1.25rem' }}>Start Date</th>
              <th style={{ padding: '1rem 1.25rem' }}>End Date</th>
              <th style={{ padding: '1rem 1.25rem' }}>Payment</th>
              <th style={{ padding: '1rem 1.25rem' }}>Support Status</th>
              <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
                  Loading advisory records...
                </td>
              </tr>
            ) : filteredSubscriptions.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
                  No advisory subscriptions found matching this filter.
                </td>
              </tr>
            ) : (
              filteredSubscriptions.map((sub) => {
                const hasOpenReq = sub.requests && sub.requests.some((r) => ['OPEN', 'IN REVIEW'].includes(r.status));
                return (
                  <tr
                    key={sub._id}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.15s ease' }}
                    onClick={() => handleSelectSub(sub)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{sub.customerName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{sub.email}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: '500', color: '#334155' }}>
                      {sub.businessName}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          background: sub.plan === 'THREE_MONTHS' ? '#eef9f2' : '#f1f5f9',
                          color: sub.plan === 'THREE_MONTHS' ? '#0a7c3e' : '#334155'
                        }}
                      >
                        {sub.duration}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#0f172a' }}>
                      ₹{sub.amount?.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.85rem' }}>
                      {new Date(sub.startDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.85rem' }}>
                      {new Date(sub.endDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: '100px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: '#dcfce7',
                          color: '#15803d'
                        }}
                      >
                        {sub.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: '100px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            background:
                              sub.supportStatus === 'ACTIVE'
                                ? '#dcfce7'
                                : sub.supportStatus === 'EXPIRING_SOON'
                                ? '#fef3c7'
                                : '#fee2e2',
                            color:
                              sub.supportStatus === 'ACTIVE'
                                ? '#15803d'
                                : sub.supportStatus === 'EXPIRING_SOON'
                                ? '#b45309'
                                : '#b91c1c'
                          }}
                        >
                          {sub.supportStatus}
                        </span>
                        {hasOpenReq && (
                          <span
                            title="Pending Support Request"
                            style={{
                              background: '#ef4444',
                              color: '#fff',
                              fontSize: '0.7rem',
                              fontWeight: '700',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px'
                            }}
                          >
                            REQ
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectSub(sub);
                        }}
                        style={{
                          background: 'none',
                          border: '1px solid #cbd5e1',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          color: '#0f172a'
                        }}
                      >
                        Manage &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Subscription & Support Request Detail Drawer / Modal */}
      {selectedSub && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setSelectedSub(null)}
        >
          <div
            style={{
              background: '#fff',
              width: '100%',
              maxWidth: '680px',
              height: '100vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.08em' }}>
                  ADVISORY SUBSCRIPTION
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '0.2rem 0' }}>
                  {selectedSub.businessName}
                </h2>
                <div style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '0.85rem' }}>
                  Ref: {selectedSub.orderId}
                </div>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Overview Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>CUSTOMER</span>
                <div style={{ fontWeight: '600', color: '#0f172a' }}>{selectedSub.customerName}</div>
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>{selectedSub.email}</div>
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>{selectedSub.phone}</div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>PLAN & DATES</span>
                <div style={{ fontWeight: '700', color: '#0a7c3e' }}>
                  {selectedSub.planTitle || selectedSub.duration} (₹{selectedSub.amount})
                </div>
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  Start: {new Date(selectedSub.startDate).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  End: {new Date(selectedSub.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Initial Intake Requirement */}
            <div style={{ marginBottom: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', padding: '1rem 1.25rem', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                INITIAL INTAKE REQUIREMENT
              </span>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.92rem', color: '#1e293b', lineHeight: 1.5 }}>
                {selectedSub.requirement}
              </p>
            </div>

            {/* Status Change Controls */}
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Support Status:</span>
              {['ACTIVE', 'EXPIRING_SOON', 'EXPIRED'].map((st) => (
                <button
                  key={st}
                  disabled={updatingStatus}
                  onClick={() => handleUpdateStatus(st)}
                  style={{
                    background: selectedSub.supportStatus === st ? '#0f172a' : '#f1f5f9',
                    color: selectedSub.supportStatus === st ? '#fff' : '#475569',
                    border: 'none',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Private Internal Admin Notes */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                PRIVATE INTERNAL NOTES (Admin Only)
              </label>
              <textarea
                rows={3}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                placeholder="Internal assessment, assigned advisor, background notes..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
              <button
                onClick={handleSaveNotes}
                disabled={updatingStatus}
                style={{
                  marginTop: '0.5rem',
                  background: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  padding: '0.45rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Save Notes
              </button>
            </div>

            {/* Support Requests Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                  Support Requests ({selectedSub.requests?.length || 0})
                </h3>
              </div>

              {!selectedSub.requests || selectedSub.requests.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No support requests submitted yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {selectedSub.requests.map((req, reqIdx) => (
                    <div
                      key={req._id || reqIdx}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '1.25rem',
                        background: selectedReqIndex === reqIdx ? '#fafaf9' : '#fff'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{req.subject}</strong>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            {new Date(req.createdAt).toLocaleString()} · Priority Handling
                          </div>
                        </div>

                        {/* Request Status Selector */}
                        <select
                          value={req.status}
                          onChange={(e) => handleUpdateRequestStatus(req._id, e.target.value)}
                          style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            background: req.status === 'OPEN' ? '#fee2e2' : req.status === 'IN REVIEW' ? '#fef3c7' : '#dcfce7',
                            color: req.status === 'OPEN' ? '#b91c1c' : req.status === 'IN REVIEW' ? '#b45309' : '#15803d'
                          }}
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="IN REVIEW">IN REVIEW</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5, margin: '0 0 1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '6px' }}>
                        {req.requirement}
                      </p>

                      {/* Replies List */}
                      {req.replies && req.replies.length > 0 && (
                        <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                            REPLY THREAD:
                          </span>
                          {req.replies.map((reply, repIdx) => (
                            <div
                              key={repIdx}
                              style={{
                                background: reply.sender === 'ADMIN' ? '#eef9f2' : '#f1f5f9',
                                borderLeft: `3px solid ${reply.sender === 'ADMIN' ? '#10b981' : '#64748b'}`,
                                padding: '0.6rem 0.85rem',
                                borderRadius: '0 6px 6px 0',
                                fontSize: '0.85rem'
                              }}
                            >
                              <div style={{ fontWeight: '700', fontSize: '0.75rem', color: '#0f172a', marginBottom: '0.2rem' }}>
                                {reply.sender === 'ADMIN' ? 'C-PEB Advisor' : 'Customer'} ·{' '}
                                <span style={{ fontWeight: '400', color: '#64748b' }}>
                                  {new Date(reply.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                              <div style={{ color: '#334155' }}>{reply.message}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Box */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="Type an advisory reply to this request..."
                          value={selectedReqIndex === reqIdx ? replyText : ''}
                          onFocus={() => setSelectedReqIndex(reqIdx)}
                          onChange={(e) => setReplyText(e.target.value)}
                          style={{
                            flex: 1,
                            padding: '0.55rem 0.85rem',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.85rem'
                          }}
                        />
                        <button
                          onClick={() => handleSendReply(req._id)}
                          style={{
                            background: '#0a7c3e',
                            color: '#fff',
                            border: 'none',
                            padding: '0.55rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <Send size={14} /> Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default AdminAdvisory;
