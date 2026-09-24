import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Briefcase, Layout, MessageSquare, Settings, LogOut, ShieldCheck } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>ADMIN</h2>
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          <div className="admin-nav-section">CONTENT</div>
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

          <div className="admin-nav-section">LEADS</div>
          <NavLink to="/admin/leads" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <MessageSquare size={18} /> Leads
          </NavLink>

          <div className="admin-nav-section">SYSTEM</div>
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
