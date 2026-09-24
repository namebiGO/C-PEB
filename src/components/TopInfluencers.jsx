import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import './TopInfluencers.css';

const fallbackCreators = [
  {
    _id: 'creator_elvish_yadav',
    slug: 'elvish-yadav',
    name: 'Elvish Yadav',
    category: 'Entertainment / Lifestyle',
    location: 'Gurugram',
    followers: '21.5M',
    platform: 'IG',
    platColor: '#C13584',
    profileImage: '/images/creators/elvish-yadav.webp',
    isVerified: true,
    engagementRate: '5.8%',
    averageReach: '12M'
  },
  {
    _id: 'creator_pawan_singh',
    slug: 'pawan-singh',
    name: 'Pawan Singh',
    category: 'Music / Entertainment',
    location: 'Bihar',
    followers: '6.6M',
    platform: 'IG',
    platColor: '#C13584',
    profileImage: '/images/creators/pawan-singh.webp',
    isVerified: true,
    engagementRate: '6.4%',
    averageReach: '4.2M'
  },
  {
    _id: 'creator_rajat_dalal',
    slug: 'rajat-dalal',
    name: 'Rajat Dalal',
    category: 'Fitness / Lifestyle',
    location: 'Faridabad',
    followers: '5.4M',
    platform: 'IG',
    platColor: '#C13584',
    profileImage: '/images/creators/rajat-dalal.webp',
    isVerified: true,
    engagementRate: '7.1%',
    averageReach: '3.8M'
  },
  {
    _id: 'creator_neelam_giri',
    slug: 'neelam-giri',
    name: 'Neelam Giri',
    category: 'Entertainment / Bhojpuri Cinema',
    location: 'Varanasi',
    followers: '6.0M',
    platform: 'IG',
    platColor: '#C13584',
    profileImage: '/images/creators/neelam-giri.webp',
    isVerified: true,
    engagementRate: '6.8%',
    averageReach: '3.5M'
  },
  {
    _id: 'creator_wamiqa_gabbi',
    slug: 'wamiqa-gabbi',
    name: 'Wamiqa Gabbi',
    category: 'Entertainment / Film',
    location: 'Chandigarh',
    followers: '5.9M',
    platform: 'IG',
    platColor: '#C13584',
    profileImage: '/images/creators/wamiqa-gabbi.webp',
    isVerified: true,
    engagementRate: '5.9%',
    averageReach: '3.2M'
  }
];

const TopInfluencers = () => {
  const [creators, setCreators] = useState(fallbackCreators);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInfluencers = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      
      try {
        const res = await fetch('http://localhost:5001/api/public/featured-influencers', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setCreators(data.data);
        } else {
          setCreators(fallbackCreators);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        setCreators(fallbackCreators);
      } finally {
        setLoading(false);
      }
    };
    fetchInfluencers();

    // Listen for real-time updates
    try {
      const socket = io('http://localhost:5001');
      socket.on('content_updated', (data) => {
        if (data && data.type && data.type.startsWith('influencer_')) {
          fetchInfluencers();
        }
      });
      return () => socket.disconnect();
    } catch {}
  }, []);

  if (loading) return null;
  if (creators.length === 0) return null;

  const featuredCreator = creators[0];
  const supportingCreators = creators.slice(1, 5);

  return (
    <section className="top-inf-section" id="community">
      <div className="container">
        
        <div className="top-inf-header-row">
          <div className="top-inf-head">
            <p className="section-eyebrow">Top Influencers</p>
            <h2>Creators Worth Collaborating With</h2>
            <p className="top-inf-desc">Discover creators selected for their audience quality, engagement, and influence.</p>
          </div>
          <Link to="/creators" className="top-inf-explore-link">
            Explore all creators <ArrowRight size={16} />
          </Link>
        </div>

        <div className="top-inf-layout">
          
          {/* Featured Creator */}
          {featuredCreator && (
            <Link to="/contact" className="featured-creator-card">
              <div className="fc-image-wrap">
                <img 
                  src={featuredCreator.profileImage || featuredCreator.img || 'https://via.placeholder.com/800'} 
                  alt={featuredCreator.name} 
                  className="fc-image" 
                  loading="lazy" 
                />
              </div>
              <div className="fc-content">
                <div className="fc-header">
                  <div className="fc-title-row">
                    <h3 className="fc-name">{featuredCreator.name}</h3>
                    <CheckCircle2 size={18} className="fc-verified" />
                  </div>
                  <p className="fc-meta">{featuredCreator.category} · {featuredCreator.location || 'India'}</p>
                </div>
                
                <div className="fc-stats">
                  <div className="fc-stat">
                    <span className="fc-stat-val">{featuredCreator.followers || '0'}</span>
                    <span className="fc-stat-lbl">Followers</span>
                  </div>
                  <div className="fc-stat">
                    <span className="fc-stat-val">{featuredCreator.engagementRate || '0%'}</span>
                    <span className="fc-stat-lbl">Avg. Engagement</span>
                  </div>
                  <div className="fc-stat">
                    <span className="fc-stat-val">{featuredCreator.averageReach || '0'}</span>
                    <span className="fc-stat-lbl">Monthly Reach</span>
                  </div>
                </div>
                
                <div className="fc-action">
                  <span>Collaborate</span>
                  <ArrowRight size={16} className="fc-arrow" />
                </div>
              </div>
            </Link>
          )}

          {/* Supporting Creators */}
          {supportingCreators.length > 0 && (
            <div className="supporting-creators-grid">
              {supportingCreators.map((creator) => (
                <Link to="/contact" className="supp-creator-card" key={creator._id || creator.slug}>
                  <img 
                    src={creator.profileImage || creator.img || 'https://via.placeholder.com/150'} 
                    alt={creator.name} 
                    className="supp-image" 
                    loading="lazy" 
                  />
                  <div className="supp-content">
                    <h4 className="supp-name">{creator.name}</h4>
                    <p className="supp-meta">{creator.category} · {creator.location || 'India'}</p>
                    <div className="supp-stats">
                      <span className="supp-followers">{creator.followers || '0'} followers</span>
                      <span className="supp-dot">·</span>
                      <span className="supp-er">{creator.engagementRate || '0%'} engagement</span>
                    </div>
                  </div>
                  <div className="supp-arrow-wrap">
                    <ArrowRight size={16} className="supp-arrow" />
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default TopInfluencers;