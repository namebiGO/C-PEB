import React, { useState } from 'react';
import { Sparkles, TrendingUp, DollarSign, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './JoinCreator.css';
import SEO from '../components/SEO';
import creatorImg from '../assets/creator_hero.jpg';

export default function JoinCreator() {
  // Earnings Estimator State
  const [calcFollowers, setCalcFollowers] = useState(50000);
  const [calcPlatform, setCalcPlatform] = useState('instagram');

  const getEstimatedEarnings = () => {
    let rate = 0;
    if (calcPlatform === 'youtube') rate = 0.8;
    else if (calcPlatform === 'instagram') rate = 0.4;
    else if (calcPlatform === 'linkedin') rate = 1.2;
    else rate = 0.3;
    
    let multiplier = 1;
    if (calcFollowers > 100000) multiplier = 1.2;
    if (calcFollowers > 500000) multiplier = 1.5;
    
    return Math.floor(calcFollowers * rate * multiplier).toLocaleString('en-IN');
  };

  return (
    <div className="creator-page">
      <SEO 
        title="Join as a Creator | C-PEB" 
        description="Join India's fastest-growing creator network. Monetize your audience on your terms, work with premium startups, and get guaranteed timely payouts." 
      />
      {/* ── Hero Section ── */}
      <section className="creator-hero">
        <div className="container creator-hero-inner">
          <div className="creator-hero-copy">
            <p className="section-eyebrow">FOR CREATORS</p>
            <h1>Turn Your Creativity Into Your Next Opportunity.</h1>
            <p>Build your audience, showcase your work, and connect with brands and people who value what you create.</p>
            <div className="creator-hero-actions">
              <Link to="/for-creators/register" className="btn btn-primary btn-lg">Apply as Creator <ArrowRight size={18} /></Link>
              <Link to="/for-creators" className="btn-secondary btn-lg btn-minimal">Explore Creators</Link>
            </div>
            <div className="creator-trust-mini">
              <div className="avatars-group">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop" alt="User" />
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop" alt="User" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop" alt="User" />
              </div>
              <span>Join 10,000+ top creators</span>
            </div>
          </div>
          <div className="creator-hero-visual">
            <div className="creator-img-container">
              <img src={creatorImg} alt="Content Creator" className="creator-hero-photo" />
              <div className="ui-overlay ui-overlay-top">
                <div className="ui-icon green-icon">↗</div>
                <div className="ui-text">
                  <span className="ui-label">Follower Growth</span>
                  <span className="ui-val">+12.4% This Month</span>
                </div>
              </div>
              <div className="ui-overlay ui-overlay-bottom">
                <div className="ui-icon blue-icon">✨</div>
                <div className="ui-text">
                  <span className="ui-label">New Brand Invite</span>
                  <span className="ui-val-brand">TechFlow Startup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="creator-benefits bg-alt">
        <div className="container">
          <div className="section-header text-center">
            <h2>Why Creators Choose C-PEB</h2>
            <p>We fix the things you hate about influencer marketing.</p>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="b-icon"><DollarSign size={24} /></div>
              <h3>Guaranteed Payouts</h3>
              <p>No more chasing invoices for months. We guarantee payment within 15 days of campaign completion, period.</p>
            </div>
            <div className="benefit-card">
              <div className="b-icon"><Sparkles size={24} /></div>
              <h3>Premium Brands</h3>
              <p>Work with funded startups and verified businesses. No shady apps, no questionable products.</p>
            </div>
            <div className="benefit-card">
              <div className="b-icon"><Users size={24} /></div>
              <h3>Dedicated Manager</h3>
              <p>You get a 1:1 talent manager who pitches you to brands, negotiates your rates, and handles all the boring contracts.</p>
            </div>
            <div className="benefit-card">
              <div className="b-icon"><TrendingUp size={24} /></div>
              <h3>Creative Freedom</h3>
              <p>We don't force scripts. You know your audience best. We brief you on the goals and let you work your magic.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Earnings Estimator ── */}
      <section className="creator-estimator bg-alt">
        <div className="container">
          <div className="estimator-wrapper">
            <div className="estimator-text">
              <h2>Calculate Your Potential</h2>
              <p>Stop guessing your worth. See how much you could be earning every month with exclusive campaigns through C-PEB.</p>
            </div>
            
            <div className="estimator-card glass-card">
              <div className="ec-platforms">
                <button 
                  className={`ec-platform-btn ${calcPlatform === 'instagram' ? 'active' : ''}`}
                  onClick={() => setCalcPlatform('instagram')}
                >Instagram</button>
                <button 
                  className={`ec-platform-btn ${calcPlatform === 'youtube' ? 'active' : ''}`}
                  onClick={() => setCalcPlatform('youtube')}
                >YouTube</button>
                <button 
                  className={`ec-platform-btn ${calcPlatform === 'linkedin' ? 'active' : ''}`}
                  onClick={() => setCalcPlatform('linkedin')}
                >LinkedIn</button>
              </div>

              <div className="ec-slider-group mt-4">
                <div className="ec-slider-labels">
                  <label>Follower Count</label>
                  <span>{calcFollowers >= 1000000 ? (calcFollowers/1000000).toFixed(1) + 'M' : (calcFollowers/1000).toFixed(0) + 'K'} Followers</span>
                </div>
                <input 
                  type="range" 
                  min="10000" 
                  max="1000000" 
                  step="10000" 
                  value={calcFollowers} 
                  onChange={(e) => setCalcFollowers(Number(e.target.value))}
                  className="ec-slider"
                />
              </div>

              <div className="ec-results mt-4">
                <p>Estimated Monthly Earnings</p>
                <h3>₹{getEstimatedEarnings()}<span>/mo</span></h3>
                <p className="ec-disclaimer">*Based on average engagement rates in India. Actual payouts vary by niche and brand budget.</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ── FAQ ── */}
      <section className="creator-faq">
        <div className="container text-center">
          <h2>Got Questions?</h2>
          <p>Don't see your question? <Link to="/contact">Contact our support team.</Link></p>
          <div className="c-faq-grid mt-4 text-left">
            <div className="c-faq-item">
              <h4>Do I have to sign an exclusive contract?</h4>
              <p>No. We operate on a non-exclusive basis. You are free to work with other agencies and brands directly.</p>
            </div>
            <div className="c-faq-item">
              <h4>How do I get paid?</h4>
              <p>Payments are made directly to your registered bank account via NEFT/RTGS within 15 days of campaign completion and invoice submission.</p>
            </div>
            <div className="c-faq-item">
              <h4>What if a brand rejects my content?</h4>
              <p>We ensure clear briefs beforehand. If a brand requests unreasonable changes outside the brief, our talent managers step in to protect your rights.</p>
            </div>
            <div className="c-faq-item">
              <h4>Do you help with my personal branding?</h4>
              <p>Yes! Top-performing creators in our network receive free PR support, feature articles, and networking opportunities with investors.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
