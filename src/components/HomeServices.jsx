import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import './HomeServices.css';

const SERVICES_DATA = [
  {
    id: "startup-support",
    number: "01",
    title: "Startup Support",
    tagline: "From idea to visibility.",
    description: "Helping early-stage startups establish their presence, connect with the right creators, and build the momentum needed to move from unknown to known.",
    capabilities: ["Startup Positioning", "Creator Strategy", "Launch Campaigns", "Growth Planning", "Audience Development"],
    href: "/services/startup-support",
    visualType: "startup"
  },
  {
    id: "business-services",
    number: "02",
    title: "Business Services",
    tagline: "Build a stronger business foundation.",
    description: "Practical business solutions designed to help companies operate efficiently, strengthen their processes, and create the foundation for sustainable growth.",
    capabilities: ["Business Consulting", "Process Support", "Growth Planning", "Business Development", "Strategic Solutions"],
    href: "/services/business-services",
    visualType: "business"
  },
  {
    id: "brand-promotion",
    number: "03",
    title: "Brand Promotion",
    tagline: "Put your brand in front of the right people.",
    description: "Connect your brand with relevant creators and audiences through strategic campaigns designed to generate attention, credibility, and meaningful engagement.",
    capabilities: ["Influencer Campaigns", "Creator Partnerships", "Product Promotion", "Campaign Strategy", "Audience Reach"],
    href: "/services/brand-promotion",
    visualType: "brand"
  },
  {
    id: "digital-marketing",
    number: "04",
    title: "Digital Marketing",
    tagline: "Turn attention into measurable growth.",
    description: "Performance-focused digital strategies that help businesses reach the right audience, build stronger digital presence, and convert attention into meaningful results.",
    capabilities: ["SEO", "Social Media Marketing", "Paid Campaigns", "Content Strategy", "Performance Marketing"],
    href: "/services/digital-marketing",
    visualType: "digital"
  }
];

const ServiceVisual = ({ type }) => {
  if (type === 'startup') {
    return (
      <div className="sv-container sv-startup">
        <div className="sv-node">IDEA</div>
        <div className="sv-connector" />
        <div className="sv-node sv-active">VISIBILITY</div>
        <div className="sv-connector sv-connector-active" />
        <div className="sv-node sv-highlight">TRACTION</div>
      </div>
    );
  }
  if (type === 'business') {
    return (
      <div className="sv-container sv-business">
        <div className="sv-b-node">Strategy</div>
        <ArrowRight className="sv-b-arrow" size={16} />
        <div className="sv-b-node">Operations</div>
        <ArrowRight className="sv-b-arrow" size={16} />
        <div className="sv-b-node sv-b-highlight">Growth</div>
      </div>
    );
  }
  if (type === 'brand') {
    return (
      <div className="sv-container sv-brand">
        <div className="sv-br-node">BRAND</div>
        <div className="sv-br-line" />
        <div className="sv-br-node">CREATORS</div>
        <div className="sv-br-line" />
        <div className="sv-br-node">AUDIENCE</div>
        <div className="sv-br-line" />
        <div className="sv-br-node sv-br-highlight">ATTENTION</div>
      </div>
    );
  }
  if (type === 'digital') {
    return (
      <div className="sv-container sv-digital">
        <div className="sv-d-node">REACH</div>
        <div className="sv-d-line" />
        <div className="sv-d-node">ENGAGEMENT</div>
        <div className="sv-d-line" />
        <div className="sv-d-node">CONVERSION</div>
        <div className="sv-d-line highlight" />
        <div className="sv-d-node sv-d-highlight">GROWTH</div>
      </div>
    );
  }
  return null;
};

export default function HomeServices() {
  const [activeId, setActiveId] = useState(SERVICES_DATA[0].id);

  return (
    <section className="home-services">
      {/* Subtle background layers */}
      <div className="hs-bg-elements" aria-hidden="true">
        <div className="hs-glow hs-glow-green" />
        <div className="hs-glow hs-glow-orange" />
        <div className="hs-grid" />
      </div>

      <div className="container hs-container">
        
        {/* Intro */}
        <header className="hs-intro">
          <p className="hs-eyebrow">WHAT WE DO</p>
          <h2 className="hs-title">
            Everything You Need<br />
            to <span className="hs-accent">Build, Grow & Get Noticed.</span>
          </h2>
          <p className="hs-desc">
            From startup growth and business solutions to creator-led brand promotion and digital marketing, we help ambitious businesses move from visibility to meaningful growth.
          </p>
        </header>

        <div className="hs-content">
          
          {/* Desktop / Tablet View */}
          <div className="hs-desktop-view">
            <nav className="hs-nav" aria-label="Services Navigation">
              {SERVICES_DATA.map((srv) => {
                const isActive = activeId === srv.id;
                return (
                  <button 
                    key={srv.id}
                    className={`hs-nav-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveId(srv.id)}
                    onMouseEnter={() => setActiveId(srv.id)}
                    onFocus={() => setActiveId(srv.id)}
                    aria-expanded={isActive}
                    aria-controls={`panel-${srv.id}`}
                  >
                    <span className="hs-nav-num">{srv.number}</span>
                    <div className="hs-nav-text">
                      <h3>{srv.title}</h3>
                      <p>{srv.tagline}</p>
                    </div>
                  </button>
                );
              })}
            </nav>
            
            <div className="hs-display">
              {SERVICES_DATA.map(srv => {
                const isActive = activeId === srv.id;
                return (
                  <div 
                    key={srv.id}
                    id={`panel-${srv.id}`}
                    className={`hs-display-panel ${isActive ? 'active' : ''}`}
                    aria-hidden={!isActive}
                  >
                    <div className="hs-panel-visual" aria-hidden="true">
                       <ServiceVisual type={srv.visualType} />
                    </div>
                    <div className="hs-panel-content">
                       <p className="hs-panel-desc">{srv.description}</p>
                       <ul className="hs-capabilities" aria-label={`Capabilities for ${srv.title}`}>
                         {srv.capabilities.map(cap => (
                            <li key={cap}><CheckCircle2 size={15} className="hs-cap-icon" /> {cap}</li>
                         ))}
                       </ul>
                       <Link to={srv.href} className="btn btn-primary hs-cta" tabIndex={isActive ? 0 : -1}>
                         Explore {srv.title} <ArrowRight size={16} />
                       </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Mobile Accordion View */}
          <div className="hs-mobile-view">
            {SERVICES_DATA.map(srv => {
              const isActive = activeId === srv.id;
              return (
                <div key={srv.id} className={`hs-accordion-item ${isActive ? 'active' : ''}`}>
                   <button 
                     className="hs-accordion-trigger" 
                     onClick={() => setActiveId(isActive ? null : srv.id)}
                     aria-expanded={isActive}
                     aria-controls={`acc-${srv.id}`}
                   >
                     <span className="hs-nav-num">{srv.number}</span>
                     <div className="hs-nav-text">
                       <h3>{srv.title}</h3>
                       <p>{srv.tagline}</p>
                     </div>
                     <ChevronDown className="hs-accordion-icon" size={20} />
                   </button>
                   
                   <div 
                     id={`acc-${srv.id}`} 
                     className="hs-accordion-content"
                     style={{ height: isActive ? 'auto' : 0, overflow: 'hidden' }}
                     aria-hidden={!isActive}
                   >
                     <div className="hs-accordion-inner">
                       <p className="hs-panel-desc">{srv.description}</p>
                       <ul className="hs-capabilities">
                         {srv.capabilities.map(cap => (
                            <li key={cap}><CheckCircle2 size={14} className="hs-cap-icon" /> {cap}</li>
                         ))}
                       </ul>
                       <div className="hs-panel-visual hs-mobile-visual" aria-hidden="true">
                          <ServiceVisual type={srv.visualType} />
                       </div>
                       <Link to={srv.href} className="btn btn-primary hs-cta" tabIndex={isActive ? 0 : -1}>
                          Explore {srv.title} <ArrowRight size={16} />
                       </Link>
                     </div>
                   </div>
                </div>
              );
            })}
          </div>

        </div>
        
        {/* Proof / Trust Element */}
        <div className="hs-proof">
          <p className="hs-proof-label">One ecosystem. Four ways to accelerate your growth.</p>
          <div className="hs-proof-metrics">
            <div className="hs-metric"><strong>200+</strong> <span>Startups Supported</span></div>
            <div className="hs-metric"><strong>10,000+</strong> <span>Creators</span></div>
            <div className="hs-metric"><strong>6×</strong> <span>Faster Traction</span></div>
            <div className="hs-metric"><strong>92%</strong> <span>Client Retention</span></div>
          </div>
        </div>

      </div>
    </section>
  );
}
