import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { Globe, Share2, Link2, Mail } from 'lucide-react';
import logo from '../assets/logo.webp';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-top">

        {/* Brand */}
        <div className="footer-brand">
          <img src={logo} alt="C-PEB" className="footer-logo" />
          <h4 style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-1)', margin: '0 0 0.5rem 0' }}>Let's change the game.</h4>
          <p>Empowering India's creator economy — connecting influencers with brands that matter.</p>
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Website"><Globe size={16} /></a>
            <a href="#" className="social-icon" aria-label="Share"><Share2 size={16} /></a>
            <a href="#" className="social-icon" aria-label="Link"><Link2 size={16} /></a>
            <a href="#" className="social-icon" aria-label="Email"><Mail size={16} /></a>
          </div>
        </div>

        {/* Links */}
        <div className="link-col">
          <h5>Platform</h5>
          <Link to="/case-studies">Our Work</Link>
          <Link to="/join-creator">Creator</Link>
          <Link to="/startup-business-advisory">Pricing Plans</Link>
          <Link to="/tools">Free Tools</Link>
          <Link to="/services/business-services">Business Services</Link>
        </div>

        <div className="link-col">
          <h5>Company</h5>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Careers</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="link-col">
          <h5>Legal</h5>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/cookies">Cookie Policy</Link>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="footer-copyright-info">
          <p>© {new Date().getFullYear()} C-PEB. All rights reserved.</p>
          <p style={{ marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-3)' }}>C-PEB a business consultancy service a unit of brija services private limited</p>
        </div>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/cookies">Cookies</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
