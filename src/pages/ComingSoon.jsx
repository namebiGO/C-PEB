import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle2, Rocket, ArrowRight, Clock } from 'lucide-react';
import './ComingSoon.css';

const serviceInfo = {
  '/services/startup-support':   { name: 'Startup Support',   icon: <Rocket className="cs-icon-primary" /> },
  '/services/business-services': { name: 'Business Services',  icon: <CheckCircle2 className="cs-icon-primary" /> },
  '/services/brand-promotion':   { name: 'Brand Promotion',   icon: <CheckCircle2 className="cs-icon-primary" /> },
  '/services/digital-marketing': { name: 'Digital Marketing', icon: <CheckCircle2 className="cs-icon-primary" /> },
};

const ComingSoon = () => {
  const { pathname } = useLocation();
  const info = serviceInfo[pathname] || { name: 'This Service', icon: <Clock className="cs-icon-primary" /> };
  
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div className="cs-page">
      <div className="container cs-container">
        
        <div className="cs-content-wrapper fade-up">
          <div className="section-eyebrow">Coming Soon</div>
          
          <h1 className="cs-heading">
            We are launching <br/>
            <span className="text-gradient">{info.name}</span>
          </h1>
          
          <p className="cs-description">
            Our team is working hard to bring you a comprehensive solution tailored for Indian startups. We're putting the final touches on our {info.name} offerings to ensure they meet the highest standards of quality and compliance.
          </p>

          <div className="cs-notify-box glass-card">
            {!submitted ? (
              <>
                <h3 className="cs-box-title">Get early access</h3>
                <p className="cs-box-desc">Leave your email to be the first to know when we go live.</p>
                
                <form className="cs-form" onSubmit={handleNotify}>
                  <div className="cs-input-group">
                    <Mail size={18} className="cs-input-icon" />
                    <input 
                      type="email" 
                      placeholder="Enter your work email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Notify Me
                  </button>
                </form>
              </>
            ) : (
              <div className="cs-success-state">
                <CheckCircle2 size={32} className="cs-success-icon" />
                <h3 className="cs-box-title">You're on the list!</h3>
                <p className="cs-box-desc">We'll send you an update as soon as {info.name} is available.</p>
              </div>
            )}
          </div>

          <div className="cs-actions">
            <Link to="/" className="btn btn-secondary">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              Contact Sales <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ComingSoon;

