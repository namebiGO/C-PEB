import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { Globe, Share2, Link2, Mail } from 'lucide-react';
import logo from '../assets/logo.jpg';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-top">

        {/* Brand */}
        <div className="footer-brand">
          <img src={logo} alt="C-PEB" className="footer-logo" />
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
          <Link to="/creators">For Creators</Link>
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
        <p>© {new Date().getFullYear()} C-PEB. Let's change the game.</p>
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
