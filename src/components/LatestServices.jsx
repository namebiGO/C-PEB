import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Bookmark, Star, ArrowRight } from 'lucide-react';
import './LatestServices.css';

const fallbackServices = [
  {
    _id: 'service_1',
    slug: 'dedicated-youtube-integration-bhuvan',
    title: 'Dedicated YouTube Integration (3-5 mins)',
    category: 'Entertainment',
    image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=1000&q=90',
    influencerId: { name: 'Bhuvan Bam' },
    rating: 4.9,
    reviewCount: 124,
    currency: '₹',
    price: '4,50,000'
  },
  {
    _id: 'service_2',
    slug: 'instagram-reel-fashion-nikita',
    title: 'Instagram Reel + 2 Story Shoutouts',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=90',
    influencerId: { name: 'Nikita Kanwar' },
    rating: 4.8,
    reviewCount: 89,
    currency: '₹',
    price: '75,000'
  },
  {
    _id: 'service_3',
    slug: 'dedicated-game-review-ujjwal',
    title: 'Dedicated PC/Mobile Game Review',
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=90',
    influencerId: { name: 'Ujjwal Gamer' },
    rating: 5.0,
    reviewCount: 215,
    currency: '₹',
    price: '3,00,000'
  },
  {
    _id: 'service_4',
    slug: 'brand-anthem-maithili',
    title: 'Original Brand Anthem / Jingle',
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1000&q=90',
    influencerId: { name: 'Maithili Thakur' },
    rating: 4.9,
    reviewCount: 42,
    currency: '₹',
    price: '1,50,000'
  },
  {
    _id: 'service_5',
    slug: 'podcast-sponsorship-carry',
    title: 'Podcast Sponsorship (Pre-roll)',
    category: 'Roasting',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=90',
    influencerId: { name: 'Carry Minati' },
    rating: 4.8,
    reviewCount: 310,
    currency: '₹',
    price: '5,00,000'
  }
];

const LatestServices = () => {
  const [activeCat, setActiveCat] = useState('All');
  const [wishlist, setWishlist] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    const fetchServices = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      try {
        const res = await fetch('http://localhost:5001/api/public/featured-services', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setServices(data.data);
          const cats = new Set(data.data.map(s => s.category));
          setCategories(['All', ...Array.from(cats)]);
        } else {
          setServices(fallbackServices);
          const cats = new Set(fallbackServices.map(s => s.category));
          setCategories(['All', ...Array.from(cats)]);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Failed to fetch services, using fallback', error);
        setServices(fallbackServices);
        const cats = new Set(fallbackServices.map(s => s.category));
        setCategories(['All', ...Array.from(cats)]);
      }
    };
    fetchServices();

    // Listen for real-time updates
    const socket = io('http://localhost:5001');
    socket.on('content_updated', (data) => {
      if (data && data.type && data.type.startsWith('service_')) {
        fetchServices();
      }
    });

    return () => socket.disconnect();
  }, []);

  const toggleWishlist = (id, e) => {
    e.preventDefault();
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(wId => wId !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const filtered = activeCat === 'All' ? services : services.filter(s => s.category === activeCat);

  if (services.length === 0) return null;

  return (
    <section className="latest-services-section">
      <div className="container">
        
        <div className="services-header-row">
          <div className="services-head">
            <p className="section-eyebrow">Our Services</p>
            <h2>Services From Creators</h2>
            <p className="services-desc">Book creators for campaigns, content production, collaborations, and brand experiences.</p>
          </div>
          <Link to="/coming-soon" className="services-explore-link">
            Explore all services <ArrowRight size={16} />
          </Link>
        </div>

        <div className="services-filter-nav">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`services-filter-btn ${activeCat === cat ? 'active' : ''}`}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="services-grid">
          {filtered.slice(0, 6).map((s) => (
            <Link to="/coming-soon" className="service-card" key={s._id}>
              <div className="service-img-wrap">
                <img src={s.image || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80'} alt={s.title} className="service-img" loading="lazy" />
                <button 
                  className={`service-wishlist-btn ${wishlist.includes(s._id) ? 'active' : ''}`} 
                  onClick={(e) => toggleWishlist(s._id, e)}
                  aria-label="Save service"
                >
                  <Bookmark size={16} className="wishlist-icon" fill={wishlist.includes(s._id) ? "currentColor" : "none"} />
                </button>
              </div>
              
              <div className="service-content">
                <div className="service-meta-top">
                  <span className="service-creator">{s.influencerId?.name || 'Creator'} · {s.category}</span>
                </div>
                
                <h3 className="service-title">{s.title}</h3>
                
                <div className="service-rating-row">
                  <Star size={14} className="service-star" fill="currentColor" />
                  <span className="service-rating-val">{s.rating?.toFixed(1) || '0.0'}</span>
                  <span className="service-reviews">({s.reviewCount || 0})</span>
                </div>

                <div className="service-footer">
                  <span className="service-price">From {s.currency === 'USD' ? '$' : s.currency}{s.price}</span>
                  <span className="service-action">
                    Book service <ArrowRight size={14} className="service-arrow" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LatestServices;