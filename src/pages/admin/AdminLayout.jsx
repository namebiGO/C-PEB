import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Users, Briefcase, Layout, MessageSquare, 
  Settings, LogOut, ShieldCheck, UserCheck, Inbox, FileText, 
  BarChart2, HelpCircle, Activity, Bell, Search, Menu, CreditCard
} from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const [notificationCount, setNotificationCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    if (path === 'admin' || path === '') return 'Overview';
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ display: sidebarOpen ? 'flex' : 'none' }}>
        <div className="admin-sidebar-header">
          <h2><span>C-PEB</span> Admin</h2>
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Overview
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

          <div className="admin-nav-section">FINANCE</div>
          <NavLink to="/admin/payments" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <CreditCard size={18} /> Payments
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
          <div className="admin-user-profile" onClick={handleLogout} title="Click to logout">
            <div className="admin-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">{user?.name || 'Administrator'}</span>
              <span className="admin-user-role">Log out</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="admin-main-wrapper">
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <button className="admin-header-action" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={20} />
            </button>
            <div className="admin-breadcrumb">{getPageTitle()}</div>
          </div>
          
          <div className="admin-header-search">
            <Search size={16} />
            <input type="text" placeholder="Search influencers, queries..." />
          </div>

          <div className="admin-header-right">
            <button className="admin-header-action" onClick={() => navigate('/admin/queries')}>
              <Bell size={20} />
              {notificationCount > 0 && <span className="admin-badge-dot"></span>}
            </button>
            <div className="admin-avatar" style={{ width: '32px', height: '32px', cursor: 'pointer' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
