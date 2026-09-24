import React from 'react';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import './HeroSection.css';
import { ArrowRight, Users } from 'lucide-react';

const influencers = [
  { name: 'Elvish Yadav', niche: 'Entertainment', followers: '21.5M', platform: 'IG', platColor: '#C13584', img: '/images/creators/elvish-yadav.webp?v=4' },
  { name: 'Rajat Dalal', niche: 'Fitness', followers: '5.4M', platform: 'IG', platColor: '#C13584', img: '/images/creators/rajat-dalal.webp?v=4' },
  { name: 'Pawan Singh', niche: 'Music', followers: '6.6M', platform: 'IG', platColor: '#C13584', img: '/images/creators/pawan-singh.webp?v=4' },
  { name: 'Dinesh Lal Yadav', niche: 'Cinema', followers: '2.45M', platform: 'IG', platColor: '#C13584', img: '/images/creators/dinesh-lal-yadav.webp?v=4' },
  { name: 'Kajal Raghwani', niche: 'Cinema', followers: '5.8M', platform: 'IG', platColor: '#C13584', img: '/images/creators/kajal-raghwani.webp?v=4' },
  { name: 'Neelam Giri', niche: 'Cinema', followers: '6.0M', platform: 'IG', platColor: '#C13584', img: '/images/creators/neelam-giri.webp?v=4' },
  { name: 'Sanjay Pandey', niche: 'Cinema', followers: '1.37M', platform: 'IG', platColor: '#C13584', img: '/images/creators/sanjay-pandey.webp?v=4' },
  { name: 'Avdhesh Mishra', niche: 'Cinema', followers: '1.5M', platform: 'IG', platColor: '#C13584', img: '/images/creators/avdhesh-mishra.webp?v=4' },
  { name: 'Amrapali Dubey', niche: 'Cinema', followers: '6.1M', platform: 'IG', platColor: '#C13584', img: '/images/creators/amrapali-dubey.webp?v=4' },
  { name: 'Wamiqa Gabbi', niche: 'Entertainment', followers: '5.9M', platform: 'IG', platColor: '#C13584', img: '/images/creators/wamiqa-gabbi.webp?v=4' },
  { name: 'Elvish Yadav', niche: 'Entertainment', followers: '21.5M', platform: 'IG', platColor: '#C13584', img: '/images/creators/elvish-yadav.webp?v=4' },
  { name: 'Rajat Dalal', niche: 'Fitness', followers: '5.4M', platform: 'IG', platColor: '#C13584', img: '/images/creators/rajat-dalal.webp?v=4' }
];

const Card = ({ inf }) => (
  <div className="inf-card">
    <div className="inf-card-img-wrap">
      <img src={inf.img} alt={inf.name} className="inf-card-img" loading="lazy" />
      <span className="inf-plat" style={{ background: inf.platColor }}>{inf.platform}</span>
    </div>
    <div className="inf-card-body">
      <h4>{inf.name}</h4>
      <p>{inf.niche}</p>
      <span className="inf-card-followers">
        <Users size={11} /> {inf.followers}
      </span>
    </div>
  </div>
);

const col1 = influencers.slice(0, 4);
const col2 = influencers.slice(4, 8);
const col3 = influencers.slice(8, 12);

const HeroSection = () => {
  return (
    <section className="hero" id="home">
      <div className="container hero-container">

        {/* Left */}
        <div className="hero-copy fade-up">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            25,000+ Creators on the platform
          </div>

          <h1 className="hero-title">
            India's Creator<br />
            <span className="typewriter-container">
              <Typewriter
                options={{
                  strings: ["Economy, Unlocked", "Talent, Empowered", "Reach, Multiplied", "Growth, Accelerated"],
                  autoStart: true,
                  loop: true,
                  delay: 75,
                  deleteSpeed: 40,
                  wrapperClassName: "accent typewriter-text",
                  cursorClassName: "cursor",
                }}
              />
            </span>
          </h1>

          <p className="hero-desc">
            C-PEB connects brands with the right influencers — from mega stars
            to micro-creators — across YouTube, Instagram, and more.
            Let's change the game together.
          </p>

          <div className="hero-actions">
            <Link to="/for-creators/register" className="btn btn-primary btn-lg">
              Join as Creator <ArrowRight size={18} />
            </Link>
            <button className="btn btn-secondary btn-lg">
              I'm a Brand
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">10K+</span>
              <span className="stat-label">Active Creators</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">₹5Cr+</span>
              <span className="stat-label">Paid Out</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">500+</span>
              <span className="stat-label">Brand Partners</span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="hero-visual fade-up delay-2">
          <div className="scroll-cols">
            <div className="v-col v-col-1">
              {[...col1, ...col1].map((inf, i) => <Card key={`c1-${i}`} inf={inf} />)}
            </div>
            <div className="v-col v-col-2">
              {[...col2, ...col2].map((inf, i) => <Card key={`c2-${i}`} inf={inf} />)}
            </div>
            <div className="v-col v-col-3">
              {[...col3, ...col3].map((inf, i) => <Card key={`c3-${i}`} inf={inf} />)}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
