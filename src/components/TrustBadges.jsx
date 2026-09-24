import React from 'react';
import './TrustBadges.css';

const CLIENTS = [
  "Startup India",
  "TechFlow",
  "Media Corp",
  "EduKids",
  "FitSnack",
  "GreenBox",
  "CraftBox",
  "FinServe",
  "UrbanGrowth",
  "NextGen AI"
];

export default function TrustBadges() {
  return (
    <section className="trust-badges-section">
      <div className="container">
        <p className="tb-heading">Trusted by 500+ Indian Startups, Creators, and Enterprises</p>
        
        <div className="tb-marquee-wrapper">
          <div className="tb-marquee">
            {/* First set */}
            {CLIENTS.map((client, idx) => (
              <div key={`c1-${idx}`} className="tb-logo-placeholder">
                {client}
              </div>
            ))}
            {/* Second set for continuous loop */}
            {CLIENTS.map((client, idx) => (
              <div key={`c2-${idx}`} className="tb-logo-placeholder">
                {client}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
