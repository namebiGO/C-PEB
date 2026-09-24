import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle2, ExternalLink } from 'lucide-react';
import { categoryData } from '../../data/categoryInfluencers';
import SEO from '../../components/SEO';
import './CategoryInfluencers.css';

// Dummy fallback list — replace with real data before production
const dummyInfluencers = [
  { name: 'Priya Sharma',   followers: '1.2M', platform: 'IG', platColor: '#C13584', niche: 'Content Creator', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', verified: true,  engagement: '4.8%' },
  { name: 'Rohan Mehta',    followers: '870K', platform: 'YT', platColor: '#FF0000', niche: 'Content Creator', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',   verified: true,  engagement: '5.1%' },
  { name: 'Anika Singh',    followers: '650K', platform: 'IG', platColor: '#C13584', niche: 'Content Creator', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', verified: false, engagement: '6.3%' },
  { name: 'Vikram Das',     followers: '520K', platform: 'YT', platColor: '#FF0000', niche: 'Content Creator', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',   verified: true,  engagement: '4.2%' },
  { name: 'Meera Patel',    followers: '410K', platform: 'IG', platColor: '#C13584', niche: 'Content Creator', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', verified: false, engagement: '7.0%' },
  { name: 'Arjun Nair',     followers: '380K', platform: 'YT', platColor: '#FF0000', niche: 'Content Creator', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',   verified: true,  engagement: '5.5%' },
];

const CategoryInfluencers = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  // Match URL slug (e.g. "pet-care") to data key (e.g. "Pet Care")
  const categoryKey = Object.keys(categoryData).find(
    (k) => k.toLowerCase().replace(/\s+/g, '-') === category
  );

  const displayName = categoryKey
    || (category ? category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Influencers');

  // Use real data if available, otherwise show dummy list
  const data = categoryData[categoryKey] ?? {
    gradient: 'linear-gradient(135deg, #e8f5e9, #e3f2fd)',
    influencers: dummyInfluencers.map((inf) => ({ ...inf, niche: displayName })),
  };

  return (
    <div className="cat-inf-page">
      <SEO
        title={`${displayName} Influencers | C-PEB`}
        description={`Browse top ${displayName} influencers in India. Find the perfect creator for your brand on C-PEB.`}
      />

      {/* Hero Banner */}
      <section className="cat-inf-hero">
        <div className="container">
          <div className="cat-inf-hero-content">
            <button className="cat-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> All Categories
            </button>
            <p className="section-eyebrow">Creator Directory</p>
            <h1>
              <span className="text-gradient">{displayName}</span> Influencers
            </h1>
            <p className="cat-inf-hero-sub">
              Discover top-tier talent in the {displayName} space. Carefully vetted for audience authenticity, high engagement, and conversion rates.
            </p>
            <div className="cat-hero-stats">
              <div className="cat-h-stat"><strong>{data.influencers.length}</strong> Creators</div>
              <div className="cat-h-divider"></div>
              <div className="cat-h-stat"><strong>24h</strong> Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Influencer Grid */}
      <section className="cat-inf-grid-section">
        <div className="container">
          <div className="cat-inf-grid">
            {data.influencers.map((inf, i) => (
              <div className="cat-inf-card" key={i}>

                {/* Photo */}
                <div className="cat-card-photo-wrap">
                  <img src={inf.img} alt={inf.name} className="cat-card-photo" loading="lazy" />
                  {inf.verified && (
                    <span className="cat-card-verified">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  )}
                  <span className="cat-card-platform" style={{ background: inf.platColor }}>
                    {inf.platform}
                  </span>
                </div>

                {/* Body */}
                <div className="cat-card-body">
                  <h3 className="cat-card-name">{inf.name}</h3>
                  <p className="cat-card-niche">{inf.niche}</p>

                  <div className="cat-card-stats">
                    <div className="cat-stat">
                      <Users size={13} />
                      <span>{inf.followers}</span>
                      <small>Followers</small>
                    </div>
                    <div className="cat-stat-divider" />
                    <div className="cat-stat">
                      <span className="engagement-val">{inf.engagement}</span>
                      <small>Engagement</small>
                    </div>
                  </div>

                  <button onClick={() => navigate('/contact')} className="cat-view-link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    Hire Creator <ArrowLeft size={14} className="cat-arrow-icon" style={{ transform: 'rotate(180deg)' }} />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="cat-inf-cta text-center">
            <p>Can't find the right creator?</p>
            <button className="btn btn-primary" onClick={() => navigate('/contact')}>
              Get Matched by Our Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryInfluencers;
