import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, Star, Sparkles, TrendingUp } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import './LatestServices.css';

// ─── Fallback data (used when API returns empty or fails) ───────────────────
const fallbackServices = [
  {
    _id: 'service_1',
    name: 'Dedicated YouTube Integration (3–5 mins)',
    shortDescription: 'Full brand integration within a video — scripted, on-camera, genuine and compelling.',
    category: 'Entertainment',
    image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=800&q=80',
    featured: true,
    rating: 4.9,
    reviewCount: 124,
    price: '4,50,000',
    currency: '₹',
    subServices: [{ name: 'Script review' }, { name: '1080p delivery' }, { name: 'Analytics report' }],
  },
  {
    _id: 'service_2',
    name: 'Instagram Reel + 2 Story Shoutouts',
    shortDescription: 'High-reach reel with dedicated story frames targeting niche fashion audiences.',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    featured: false,
    rating: 4.8,
    reviewCount: 89,
    price: '75,000',
    currency: '₹',
    subServices: [{ name: 'Swipe-up link' }, { name: 'Branded hashtags' }],
  },
  {
    _id: 'service_3',
    name: 'Dedicated PC / Mobile Game Review',
    shortDescription: 'Authentic gameplay-integrated review by a top gaming creator with massive Gen-Z reach.',
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    featured: true,
    rating: 5.0,
    reviewCount: 215,
    price: '3,00,000',
    currency: '₹',
    subServices: [{ name: 'Gameplay footage' }, { name: 'Thumbnail rights' }, { name: 'Community post' }],
  },
  {
    _id: 'service_4',
    name: 'Original Brand Anthem / Jingle',
    shortDescription: 'Professionally composed original track featuring your brand — ideal for long-term campaigns.',
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=800&q=80',
    featured: false,
    rating: 4.9,
    reviewCount: 42,
    price: '1,50,000',
    currency: '₹',
    subServices: [{ name: 'Full rights transfer' }, { name: '2 revisions' }],
  },
  {
    _id: 'service_5',
    name: 'Podcast Sponsorship (Pre-roll)',
    shortDescription: 'Premium pre-roll spot in a top-ranked podcast episode with 800K+ monthly listeners.',
    category: 'Roasting',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    featured: false,
    rating: 4.8,
    reviewCount: 310,
    price: '5,00,000',
    currency: '₹',
    subServices: [{ name: 'Script included' }, { name: 'Social amplification' }],
  },
  {
    _id: 'service_6',
    name: 'Unboxing & Product Review Video',
    shortDescription: 'Real-time first-impression unboxing with detailed product review for e-commerce brands.',
    category: 'Entertainment',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    featured: false,
    rating: 4.7,
    reviewCount: 67,
    price: '60,000',
    currency: '₹',
    subServices: [{ name: 'B-roll footage' }, { name: 'Raw files' }],
  },
];

// ─── Skeleton card ─────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="svc-card svc-card--skeleton" aria-hidden="true">
    <div className="svc-card__img-wrap svc-skeleton-block" />
    <div className="svc-card__body">
      <div className="svc-skeleton-line svc-skeleton-line--short" />
      <div className="svc-skeleton-line svc-skeleton-line--long" />
      <div className="svc-skeleton-line svc-skeleton-line--mid" />
      <div className="svc-card__footer-skeleton">
        <div className="svc-skeleton-line svc-skeleton-line--price" />
        <div className="svc-skeleton-line svc-skeleton-line--btn" />
      </div>
    </div>
  </div>
);

// ─── Service card ─────────────────────────────────────────────────────────
const ServiceCard = ({ service, isWishlisted, onWishlist, index }) => {
  const priceCurrency = service.currency === 'USD' ? '$' : (service.currency || '₹');
  const displayPrice = service.price
    ? `${priceCurrency}${service.price}`
    : 'Get quote';

  return (
    <Link
      to="/coming-soon"
      className="svc-card"
      style={{ '--card-index': index }}
      aria-label={`View service: ${service.name}`}
    >
      {/* Image */}
      <div className="svc-card__img-wrap">
        <img
          src={
            service.image ||
            'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80'
          }
          alt={service.name}
          className="svc-card__img"
          loading="lazy"
          decoding="async"
        />

        {/* Badges overlay */}
        <div className="svc-card__overlay-badges">
          {service.featured && (
            <span className="svc-badge svc-badge--featured">
              <Sparkles size={11} />
              Featured
            </span>
          )}
          {service.category && (
            <span className="svc-badge svc-badge--category">{service.category}</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className={`svc-wishlist-btn ${isWishlisted ? 'is-active' : ''}`}
          onClick={(e) => { e.preventDefault(); onWishlist(service._id); }}
          aria-label={isWishlisted ? 'Remove from saved' : 'Save service'}
          aria-pressed={isWishlisted}
        >
          <Bookmark
            size={15}
            fill={isWishlisted ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Body */}
      <div className="svc-card__body">
        {/* Rating */}
        {(service.rating > 0 || service.reviewCount > 0) && (
          <div className="svc-card__rating">
            <Star size={13} fill="currentColor" className="svc-star" />
            <span className="svc-rating-val">
              {service.rating?.toFixed(1) || '—'}
            </span>
            {service.reviewCount > 0 && (
              <span className="svc-rating-count">({service.reviewCount})</span>
            )}
            {service.reviewCount >= 100 && (
              <span className="svc-popular-tag">
                <TrendingUp size={11} />
                Popular
              </span>
            )}
          </div>
        )}

        <h3 className="svc-card__title">{service.name}</h3>

        {service.shortDescription && (
          <p className="svc-card__desc">{service.shortDescription}</p>
        )}

        {/* Sub-services */}
        {service.subServices && service.subServices.length > 0 && (
          <ul className="svc-card__tags" aria-label="Includes">
            {service.subServices.slice(0, 3).map((sub, i) => (
              <li key={i} className="svc-tag">{sub.name}</li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div className="svc-card__footer">
          <div className="svc-card__price">
            <span className="svc-price-from">From</span>
            <span className="svc-price-value">{displayPrice}</span>
          </div>
          <span className="svc-card__cta">
            Book now
            <ArrowRight size={14} className="svc-cta-arrow" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
};

// ─── Main component ─────────────────────────────────────────────────────────
const LatestServices = () => {
  const [services, setServices]     = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [wishlist, setWishlist]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('cpeb_svc_wishlist') || '[]'); }
    catch { return []; }
  });
  const [loading, setLoading]       = useState(true);
  const filterNavRef                = useRef(null);
  const socket                      = useSocket();

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchServices = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 3000);

    try {
      const res  = await fetch('/api/public/featured-services', { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await res.json();

      if (data.success && data.data?.length > 0) {
        setServices(data.data);
        const cats = ['All', ...Array.from(new Set(data.data.map(s => s.category).filter(Boolean)))];
        setCategories(cats);
      } else {
        setServices(fallbackServices);
        const cats = ['All', ...Array.from(new Set(fallbackServices.map(s => s.category)))];
        setCategories(cats);
      }
    } catch {
      clearTimeout(timeoutId);
      setServices(fallbackServices);
      const cats = ['All', ...Array.from(new Set(fallbackServices.map(s => s.category)))];
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  // ── Real-time updates via existing socket context ─────────────────────────
  useEffect(() => {
    if (!socket) return;
    const handler = (data) => {
      if (data?.type?.startsWith('service_')) fetchServices();
    };
    socket.on('content_updated', handler);
    return () => socket.off('content_updated', handler);
  }, [socket, fetchServices]);

  // ── Wishlist ──────────────────────────────────────────────────────────────
  const toggleWishlist = useCallback((id) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem('cpeb_svc_wishlist', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  // ── Category filter ───────────────────────────────────────────────────────
  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    // Scroll active tab into view on mobile
    const btn = filterNavRef.current?.querySelector(`[data-cat="${cat}"]`);
    btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const filtered = activeCategory === 'All'
    ? services
    : services.filter(s => s.category === activeCategory);

  const visible = filtered.slice(0, 6);

  // Don't render section if loading finished and still zero items (unlikely due to fallback)
  if (!loading && services.length === 0) return null;

  return (
    <section className="svc-section" aria-labelledby="svc-heading">
      <div className="container">

        {/* ── Header row ──────────────────────────────────────────────── */}
        <div className="svc-header-row">
          <div className="svc-header-left">
            <p className="section-eyebrow">Our Services</p>
            <h2 id="svc-heading" className="svc-heading">
              Services From Creators
            </h2>
            <p className="svc-subheading">
              Book creators for campaigns, content production,
              collaborations, and brand experiences.
            </p>
          </div>

          <Link to="/coming-soon" className="svc-explore-link">
            Explore all services
            <ArrowRight size={16} className="svc-explore-arrow" aria-hidden="true" />
          </Link>
        </div>

        {/* ── Category navigation ──────────────────────────────────────── */}
        <nav
          className="svc-filter-nav"
          ref={filterNavRef}
          aria-label="Filter services by category"
        >
          {categories.map(cat => (
            <button
              key={cat}
              data-cat={cat}
              className={`svc-filter-btn ${activeCategory === cat ? 'is-active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        <div className="svc-grid" role="list">
          {loading
            ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
            : visible.length > 0
              ? visible.map((svc, i) => (
                  <div key={svc._id} role="listitem">
                    <ServiceCard
                      service={svc}
                      index={i}
                      isWishlisted={wishlist.includes(svc._id)}
                      onWishlist={toggleWishlist}
                    />
                  </div>
                ))
              : (
                <div className="svc-empty">
                  <p>No services in this category yet.</p>
                  <button
                    className="svc-empty-reset"
                    onClick={() => setActiveCategory('All')}
                  >
                    View all services
                  </button>
                </div>
              )
          }
        </div>

        {/* ── Bottom CTA strip ─────────────────────────────────────────── */}
        {!loading && services.length > 0 && (
          <div className="svc-bottom-strip">
            <p className="svc-strip-text">
              Looking for something specific? Our team will match you with the right creator.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Talk to us <ArrowRight size={15} />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

export default LatestServices;