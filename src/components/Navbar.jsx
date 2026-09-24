import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.jpg';
import './Navbar.css';

const services = [
  { label: 'Startup Support', path: '/services/startup-support' },
  { label: 'Business Services', path: '/services/business-services' },
  { label: 'Brand Promotion', path: '/services/brand-promotion' },
  { label: 'Digital Marketing', path: '/services/digital-marketing' },
];


const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const [svcOpen, setSvcOpen] = React.useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isHome = location.pathname === '/';

  // Close dropdown on outside click
  const dropRef = React.useRef(null);
  React.useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setSvcOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLink = (href, label) =>
    isHome
      ? <a href={href} onClick={() => setOpen(false)}>{label}</a>
      : <Link to="/" onClick={() => setOpen(false)}>{label}</Link>;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">

        <Link to="/" className="nav-brand">
          <img src={logo} alt="C-PEB" className="brand-logo" />
        </Link>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          {navLink('#home', 'Home')}

          {/* Services dropdown */}
          <div className="nav-dropdown" ref={dropRef}>
            <button
              className={`nav-dropdown-trigger ${svcOpen ? 'active' : ''}`}
              onClick={() => setSvcOpen(!svcOpen)}
            >
              Services <ChevronDown size={14} className={svcOpen ? 'rot' : ''} />
            </button>
            {svcOpen && (
              <div className="nav-dropdown-menu">
                {services.map((s) => (
                  <Link
                    key={s.path}
                    to={s.path}
                    className="nav-dropdown-item"
                    onClick={() => { setSvcOpen(false); setOpen(false); }}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/case-studies" className="nav-link-direct" onClick={() => setOpen(false)}>Our Work</Link>
          <Link to="/startup-business-advisory" className="nav-link-direct" onClick={() => setOpen(false)}>Pricing</Link>
          <Link to="/tools" className="nav-link-direct" onClick={() => setOpen(false)}>Free Tools</Link>
          <Link to="/creators" className="nav-link-direct" onClick={() => setOpen(false)}>For Creators</Link>
        </div>

        <div className="nav-right">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle Dark Mode"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-1)',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {/* <button className="btn btn-secondary">Log In</button> */}
          <Link to="/contact" className="btn btn-primary" onClick={() => setOpen(false)}>Contact Us</Link>
          <button className="mobile-menu-btn" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;