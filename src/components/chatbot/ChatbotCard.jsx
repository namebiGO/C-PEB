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

/**
 * WhatsApp Handoff Card
 * Displays a summary of the visitor's service request and direct CTA to WhatsApp.
 * Uses a genuine <a> link tag so popup blockers never block the redirection.
 */
export const WhatsAppHandoffCard = ({ handoff, onKeepChatting }) => {
  const { service, requirement, qualifier, name, whatsappUrl } = handoff;
  const targetUrl = whatsappUrl || 'https://wa.me/917079701229';

  const handleWhatsAppClick = (e) => {
    // Attempt window.open first; if popup blocker blocks it, allow standard <a> link navigation
    try {
      const win = window.open(targetUrl, '_blank', 'noopener,noreferrer');
      if (win) {
        e.preventDefault();
      }
    } catch (err) {
      // Natural <a> click handles navigation
    }
  };

  return (
    <div className="cb-wa-handoff-card">
      {/* Header */}
      <div className="cb-wa-handoff-header">
        <div className="cb-wa-handoff-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
        <div>
          <p className="cb-wa-handoff-title">Continue on WhatsApp</p>
          <p className="cb-wa-handoff-sub">+91 70797 01229 • Direct C-PEB Team</p>
        </div>
      </div>

      {/* Requirements summary */}
      <div className="cb-wa-summary">
        {service && (
          <div className="cb-wa-summary-row">
            <span className="cb-wa-summary-label">Service</span>
            <span className="cb-wa-summary-val">{service}</span>
          </div>
        )}
        {requirement && (
          <div className="cb-wa-summary-row">
            <span className="cb-wa-summary-label">Requirement</span>
            <span className="cb-wa-summary-val">{requirement}</span>
          </div>
        )}
        {qualifier && (
          <div className="cb-wa-summary-row">
            <span className="cb-wa-summary-label">Details</span>
            <span className="cb-wa-summary-val">{qualifier}</span>
          </div>
        )}
        {name && (
          <div className="cb-wa-summary-row">
            <span className="cb-wa-summary-label">Name</span>
            <span className="cb-wa-summary-val">{name}</span>
          </div>
        )}
      </div>

      {/* Review note */}
      <p className="cb-wa-review-note">
        Click below to open WhatsApp with your requirements prefilled.
      </p>

      {/* Action buttons */}
      <div className="cb-wa-actions">
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cb-wa-primary-btn"
          onClick={handleWhatsAppClick}
          aria-label="Continue conversation on WhatsApp with prefilled requirements"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>Continue on WhatsApp</span>
          <ExternalLink size={13} style={{ flexShrink: 0 }} />
        </a>
        <button
          type="button"
          className="cb-wa-secondary-btn"
          onClick={onKeepChatting}
          aria-label="Keep chatting in this window"
        >
          Keep Chatting
        </button>
      </div>
    </div>
  );
};

