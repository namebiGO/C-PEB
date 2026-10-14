import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import './ServiceHero.css';

const InstagramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export const HERO_SERVICES = [
  {
    id: 'influencer',
    number: '01',
    navLabel: 'Influencer Management',
    shortLabel: 'Influencer',
    titleLine1: "Creator",
    titleLine2: "Economy",
    aboutSubtitle: "About Influencer Management",
    description: "C-PEB connects funded startups and ambitious brands with 25,000+ top creators across India — from mega stars to niche voices across YouTube and Instagram.",
    ctaText: "Explore Creators",
    ctaLink: "/for-creators/register",
    image: "/images/hero/influencer.jpg",
    tags: ["25K+ Creators", "₹5Cr+ Paid Out", "500+ Brand Partners"],
    locationTag: "PAN-India",
  },
  {
    id: 'events',
    number: '02',
    navLabel: 'Event Management',
    shortLabel: 'Events',
    titleLine1: "Event",
    titleLine2: "Experiences",
    aboutSubtitle: "About Event Management",
    description: "From corporate conferences and product launches to experiential brand activations, we turn your corporate events into immersive experiences that matter.",
    ctaText: "Plan Your Event",
    ctaLink: "/contact",
    image: "/images/hero/event.jpg",
    tags: ["300+ Events Delivered", "15+ Tier-1 Cities", "Turnkey Production"],
    locationTag: "Corporate & Activations",
  },
  {
    id: 'it-services',
    number: '03',
    navLabel: 'IT Services',
    shortLabel: 'IT Services',
    titleLine1: "Performance Marketing &",
    titleLine2: "Tech Solutions",
    aboutSubtitle: "About IT Services",
    description: "Build a stronger digital presence with high-performance web development, UI/UX product design, search engine optimization, and measurable digital marketing.",
    ctaText: "Explore IT Services",
    ctaLink: "/services/digital-marketing",
    image: "/images/hero/it-services.jpg",
    tags: ["50+ Platforms Built", "UI/UX & Web Dev", "SEO & Performance"],
    locationTag: "Enterprise Solutions",
  },
  {
    id: 'brand',
    number: '04',
    navLabel: 'Brand Promotion',
    shortLabel: 'Brand Growth',
    titleLine1: "Strategic",
    titleLine2: "Brand Growth",
    aboutSubtitle: "About Brand Promotion",
    description: "Make your brand impossible to ignore through creative promotional campaigns, consistent brand storytelling, and targeted cross-channel audience engagement.",
    ctaText: "Promote Your Brand",
    ctaLink: "/contact",
    image: "/images/hero/brand-promotion.jpg",
    tags: ["100M+ Impressions", "3.8x Average ROAS", "Omnichannel Reach"],
    locationTag: "Brand Amplification",
  }
];

export default function ServiceHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Preload background images
  useEffect(() => {
    HERO_SERVICES.forEach((service) => {
      const img = new Image();
      img.src = service.image;
    });
  }, []);

  // Auto change hero section images every 2 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      setIsAnimating(true);
      setActiveIndex((prev) => (prev + 1) % HERO_SERVICES.length);
      setTimeout(() => {
        setIsAnimating(false);
      }, 350);
    }, 2000);

    return () => clearTimeout(timer);
  }, [activeIndex, isPaused]);

  const handleSelectService = useCallback((index) => {
    if (index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  }, [activeIndex]);

  // Keyboard navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleSelectService((index + 1) % HERO_SERVICES.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      handleSelectService((index - 1 + HERO_SERVICES.length) % HERO_SERVICES.length);
    }
  };

  const activeService = HERO_SERVICES[activeIndex];

  return (
    <section className="indotourism-hero" id="home" aria-label="C-PEB Interactive Service Hero">

      {/* ── 1. Full-Bleed Photographic Backgrounds Stack ── */}
      <div className="hero-bg-stack" aria-hidden="true">
        {HERO_SERVICES.map((service, idx) => (
          <div
            key={service.id}
            className={`hero-bg-layer ${idx === activeIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${service.image})` }}
          />
        ))}
        {/* Frosted glass blur behind text for readability on bright images */}
        <div className="hero-blur-panel" />
        {/* Dark gradient overlays for cinematic look and text legibility */}
        <div className="hero-vignette-overlay" />
        <div className="hero-dark-left-gradient" />
      </div>

      {/* ── 2. Left Vertical Social & Accent Bar ── */}
      <aside className="hero-left-rail" aria-label="Social links">
        <div className="hero-rail-line top" />
        <div className="hero-rail-socials">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-rail-icon"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-rail-icon"
            aria-label="LinkedIn"
          >
            <LinkedinIcon />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-rail-icon"
            aria-label="Twitter / X"
          >
            <TwitterIcon />
          </a>
        </div>
        <div className="hero-rail-line bottom" />
      </aside>

      {/* ── 3. Main Stage Content Container ── */}
      <div className="hero-content-stage">

        {/* Left Column: Huge Title, About Subhead, Description & Explore Button */}
        <div className={`hero-main-copy ${isAnimating ? 'text-fade-out' : 'text-fade-in'}`}>

          <h1 className="hero-display-title">
            <span className="title-row">{activeService.titleLine1}</span>
            <span className="title-row">{activeService.titleLine2}</span>
          </h1>

          <div className="hero-about-section">
            <h2 className="hero-about-heading">About</h2>
            <p className="hero-about-desc">
              {activeService.description}
            </p>
          </div>

          <div className="hero-action-row">
            <Link to={activeService.ctaLink} className="hero-explore-btn">
              <span>{activeService.ctaText}</span>
              <ArrowRight size={18} className="explore-arrow" />
            </Link>
          </div>

          {/* Bottom-Left Pill Badges (IndoTourism Location/Metric Pill) */}
          <div className="hero-meta-pill" role="status">
            <MapPin size={15} className="meta-pin-icon" />
            <span className="meta-loc-tag">{activeService.locationTag}</span>
            <span className="meta-separator">|</span>
            <span className="meta-tags-text">
              {activeService.tags.join('  •  ')}
            </span>
          </div>

        </div>

        {/* ── 4. Lower-Right "Photos —" / "Services —" Thumbnail Gallery ── */}
        <div 
          className="hero-photos-gallery-area"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="gallery-header-row">
            <span className="gallery-title-text">Services</span>
            <span className="gallery-title-dash" />
          </div>

          <div
            className="gallery-thumbs-row"
            role="tablist"
            aria-label="Choose a service"
          >
            {HERO_SERVICES.map((service, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={service.id}
                  type="button"
                  role="tab"
                  id={`hero-tab-${service.id}`}
                  aria-selected={isSelected}
                  tabIndex={0}
                  className={`gallery-thumb-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectService(idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  aria-label={`Switch to ${service.navLabel}`}
                >
                  <img
                    src={service.image}
                    alt={service.navLabel}
                    className="gallery-thumb-photo"
                    loading="eager"
                  />
                  <div className="gallery-thumb-overlay" />

                  <div className="gallery-thumb-info">
                    <span className="thumb-idx">{service.number}</span>
                    <span className="thumb-name">{service.shortLabel}</span>
                  </div>

                  {isSelected && <div className="thumb-active-border-glow" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 5. Far-Right Vertical Pagination Indicator ── */}
        <div 
          className="hero-right-rail-nav" 
          aria-label="Service navigation"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {HERO_SERVICES.map((service, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={service.id}
                type="button"
                className={`hero-vertical-nav-item ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectService(idx)}
              >
                <span className="nav-item-label">{service.navLabel}</span>
                <span className="nav-item-marker">
                  <span className="marker-dot" />
                  <span className="marker-line" />
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Subtle Copyright / Watermark matching the reference footer */}
      <div className="hero-watermark">
        <span>© C-PEB India IT Services. All Rights Reserved.</span>
      </div>

    </section>
  );
}
