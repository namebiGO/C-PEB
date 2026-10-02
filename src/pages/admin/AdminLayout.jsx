import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Briefcase, Layout, MessageSquare, Settings, LogOut, ShieldCheck, UserCheck, Inbox, FileText, BarChart2, HelpCircle, Activity, Bell } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('adminToken'))?.token;
        if (!token) return;
        const res = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const { pendingApplications, newLeads, newContacts, openQueries } = data.data;
          setNotificationCount((pendingApplications || 0) + (newLeads || 0) + (newContacts || 0) + (openQueries || 0));
        }
      } catch (e) {}
    };
    fetchNotifications();
    
    // Poll every 1 minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>ADMIN</h2>
          {notificationCount > 0 && (
            <div title="Items requiring attention" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#ef4444', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              <Bell size={12} /> {notificationCount}
            </div>
          )}
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/analytics" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <BarChart2 size={18} /> Analytics
          </NavLink>

          <div className="admin-nav-section">CONTENT</div>
          <NavLink to="/admin/creators" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <UserCheck size={18} /> Creators
          </NavLink>
          <NavLink to="/admin/creators/applications" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <FileText size={18} /> Applications
          </NavLink>
          <NavLink to="/admin/influencers" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Users size={18} /> Influencers
          </NavLink>
          <NavLink to="/admin/services" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Briefcase size={18} /> Services
          </NavLink>
          <NavLink to="/admin/homepage" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Layout size={18} /> Homepage
          </NavLink>

          <div className="admin-nav-section">ADVISORY</div>
          <NavLink to="/admin/advisory" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <ShieldCheck size={18} /> Advisory Plans
          </NavLink>

          <div className="admin-nav-section">LEADS & CRM</div>
          <NavLink to="/admin/leads" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <MessageSquare size={18} /> Leads
          </NavLink>
          <NavLink to="/admin/contacts" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Inbox size={18} /> Submissions
          </NavLink>
          <NavLink to="/admin/queries" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <HelpCircle size={18} /> User Queries
          </NavLink>

          <div className="admin-nav-section">SYSTEM</div>
          <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Users size={18} /> Staff & Users
          </NavLink>
          <NavLink to="/admin/activity" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Activity size={18} /> Activity Log
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Settings size={18} /> Settings
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
