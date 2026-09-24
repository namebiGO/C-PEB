import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ExternalLink, Sparkles, Clock, Tag, MapPin, Eye, MessageSquare, ShieldCheck } from 'lucide-react';

export const InfluencerCard = ({ influencer, onEnquire, onViewProfile }) => {
  const navigate = useNavigate();

  const handleView = () => {
    if (onViewProfile) {
      onViewProfile(influencer);
    } else if (influencer.profileUrl) {
      navigate(influencer.profileUrl);
    }
  };

  return (
    <div className="cb-influencer-card">
      <div className="cb-card-header">
        <div className="cb-avatar-wrapper">
          <img
            src={influencer.img}
            alt={influencer.name}
            className="cb-avatar-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
            }}
          />
          {influencer.verified && (
            <span className="cb-verified-badge" title="Verified Creator">
              <CheckCircle2 size={13} fill="#17a85a" color="#ffffff" />
            </span>
          )}
        </div>
        <div className="cb-influencer-meta">
          <div className="cb-name-row">
            <h4 className="cb-influencer-name">{influencer.name}</h4>
          </div>
          <div className="cb-platform-badge" style={{ backgroundColor: `${influencer.platColor || '#C13584'}15`, color: influencer.platColor || '#C13584' }}>
            <span className="cb-plat-dot" style={{ backgroundColor: influencer.platColor || '#C13584' }}></span>
            {influencer.platform} • {influencer.followers}
          </div>
        </div>
      </div>

      <div className="cb-card-body">
        <div className="cb-tag-row">
          <span className="cb-niche-pill">{influencer.niche || influencer.category}</span>
          {influencer.engagement && (
            <span className="cb-stat-pill">⚡ {influencer.engagement} ER</span>
          )}
        </div>

        {influencer.location && (
          <div className="cb-location-row">
            <MapPin size={12} className="cb-icon-muted" />
            <span>{influencer.location}</span>
          </div>
        )}
      </div>

      <div className="cb-card-actions">
        <button
          type="button"
          className="cb-btn cb-btn-secondary"
          onClick={handleView}
          title="View creator profile"
        >
          <Eye size={13} />
          <span>View Profile</span>
        </button>
        <button
          type="button"
          className="cb-btn cb-btn-primary"
          onClick={() => onEnquire && onEnquire(influencer)}
        >
          <MessageSquare size={13} />
          <span>Contact / Enquire</span>
        </button>
      </div>
    </div>
  );
};

export const ServiceCard = ({ service, onQuote }) => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    if (service.link) {
      navigate(service.link);
    }
  };

  return (
    <div className="cb-service-card">
      <div className="cb-service-top">
        <span className="cb-category-tag">{service.category}</span>
        {service.timeline && (
          <span className="cb-timeline-tag">
            <Clock size={11} /> {service.timeline}
          </span>
        )}
      </div>

      <h4 className="cb-service-title">{service.title}</h4>
      <p className="cb-service-desc">{service.shortDesc}</p>

      {service.price && (
        <div className="cb-service-price">
          <span className="cb-price-label">Cost:</span>
          <span className="cb-price-val">{service.price}</span>
        </div>
      )}

      <div className="cb-card-actions">
        <button
          type="button"
          className="cb-btn cb-btn-secondary"
          onClick={handleLearnMore}
        >
          <span>Learn More</span>
          <ArrowRight size={13} />
        </button>
        <button
          type="button"
          className="cb-btn cb-btn-primary"
          onClick={() => onQuote && onQuote(service)}
        >
          <Sparkles size={13} />
          <span>Get a Quote</span>
        </button>
      </div>
    </div>
  );
};

export const PricingCard = ({ pkg, onSelect }) => {
  return (
    <div className={`cb-pricing-card ${pkg.badge ? 'highlighted' : ''}`}>
      {pkg.badge && <span className="cb-plan-badge">{pkg.badge}</span>}
      <div className="cb-plan-header">
        <h4 className="cb-plan-name">{pkg.name}</h4>
        <div className="cb-plan-price-row">
          <span className="cb-plan-price">{pkg.price}</span>
          {pkg.period && <span className="cb-plan-period">{pkg.period}</span>}
        </div>
      </div>

      <p className="cb-plan-desc">{pkg.desc}</p>

      <ul className="cb-plan-features">
        {pkg.features.map((feat, idx) => (
          <li key={idx}>
            <CheckCircle2 size={13} className="cb-check-icon" />
            <span>{feat}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="cb-btn cb-btn-primary w-full"
        onClick={() => onSelect && onSelect(pkg)}
      >
        <span>Select Plan</span>
        <ArrowRight size={13} />
      </button>
    </div>
  );
};

export const LeadConfirmationCard = ({ lead }) => {
  return (
    <div className="cb-lead-confirm-card">
      <div className="cb-confirm-header">
        <div className="cb-confirm-icon">
          <ShieldCheck size={20} color="#17a85a" />
        </div>
        <div>
          <h4>Requirement Recorded</h4>
          <span className="cb-confirm-sub">Ref #{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
        </div>
      </div>
      <div className="cb-confirm-details">
        <div className="cb-detail-item">
          <strong>Contact:</strong> {lead.name} {lead.email ? `(${lead.email})` : ''}
        </div>
        {lead.company && (
          <div className="cb-detail-item">
            <strong>Company:</strong> {lead.company}
          </div>
        )}
        {lead.requirement && (
          <div className="cb-detail-item">
            <strong>Scope:</strong> {lead.requirement}
          </div>
        )}
        <div className="cb-detail-badge">
          Status: Assigned to Senior Advisor • Expected Response &lt; 24h
        </div>
      </div>
    </div>
  );
};
