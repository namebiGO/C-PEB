import React from 'react';
import { Target, Users, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './About.css';
import SEO from '../components/SEO';

export default function About() {
  return (
    <div className="about-page">
      <SEO
        title="About Us | C-PEB"
        description="Learn about C-PEB's mission to change the game for Indian startups and creators by democratising access to top-tier marketing and simplifying compliance."
      />
      {/* ── Hero Section ── */}
      <section className="about-hero">
        <div className="container">
          <p className="section-eyebrow">Our Story</p>
          <h1>Changing the Game for <span className="text-gradient">Indian Startups & Creators</span></h1>
          <p>We bridge the gap between brilliant businesses that need growth and authentic creators who can deliver it, all while providing the operational backbone startups need to survive.</p>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="about-mission">
        <div className="container about-mission-inner">
          <div className="mission-content">
            <h2>Why We Exist</h2>
            <p>
              Starting a business in India is complex. Finding the right audience is even harder.
              Traditionally, agencies only worked with massive brands, leaving early-stage startups and MSMEs to fend for themselves.
            </p>
            <p>
              <strong>C-PEB was built to change that.</strong> We realised that the most powerful marketing channel today — the creator economy — was highly fragmented. At the same time, founders were struggling not just with marketing, but with funding, compliance, and legalities.
            </p>
            <p>
              We created a unified ecosystem. A place where a founder can get their GST registered, secure a working capital loan, and launch a viral 50-creator marketing campaign — all under one roof.
            </p>
            <ul className="mission-list">
              <li><CheckCircle2 size={18} className="text-green" /> Democratising access to top-tier creator marketing.</li>
              <li><CheckCircle2 size={18} className="text-green" /> Simplifying government compliance and funding.</li>
              <li><CheckCircle2 size={18} className="text-green" /> Ensuring creators get paid fairly and on time.</li>
            </ul>
          </div>
          <div className="mission-stats">
            <div className="m-stat-card">
              <h3>500+</h3>
              <p>Startups Funded & Scaled</p>
            </div>
            <div className="m-stat-card">
              <h3>10,000+</h3>
              <p>Vetted Creators</p>
            </div>
            <div className="m-stat-card">
              <h3>₹50Cr+</h3>
              <p>Capital Facilitated</p>
            </div>
            <div className="m-stat-card m-stat-card-highlight">
              <h3>0 to 1</h3>
              <p>Our Specialty</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="about-values">
        <div className="container">
          <div className="section-header text-left">
            <p className="section-eyebrow">Our Principles</p>
            <h2>What Drives Us</h2>
            <p className="max-w-600 mt-3 text-2">We don't operate like a traditional agency. We are built for speed, transparency, and actual growth.</p>
          </div>
          
          <div className="values-editorial-list">
            <div className="value-row">
              <div className="v-number">01</div>
              <div className="v-content">
                <h4>Radical Transparency</h4>
                <p>No hidden agency fees. No vanity metrics. We show you exactly where your money goes and what return it brings. Every rupee is accounted for.</p>
              </div>
            </div>
            
            <div className="value-row">
              <div className="v-number">02</div>
              <div className="v-content">
                <h4>Creator-First Ecosystem</h4>
                <p>We treat our influencers as partners, not just distribution channels. We guarantee timely payouts and creative freedom because authentic content converts best.</p>
              </div>
            </div>
            
            <div className="value-row">
              <div className="v-number">03</div>
              <div className="v-content">
                <h4>Relentless Agility</h4>
                <p>Startups move fast. So do we. We execute campaigns in days, not months, adapting to market feedback instantly to maximize your ROI.</p>
              </div>
            </div>
            
            <div className="value-row">
              <div className="v-number">04</div>
              <div className="v-content">
                <h4>Results over Output</h4>
                <p>We don't just care about how many videos were posted. We care about how many customers actually bought your product. Performance is our only metric.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team Section (Placeholder) ── */}
      <section className="about-team">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-eyebrow">The Brains Behind C-PEB</p>
            <h2>Meet the Leadership</h2>
            <p className="max-w-600 mx-auto mt-3">Built by founders who have been in the trenches, grown companies, and understand exactly what you are going through.</p>
          </div>

          <div className="team-grid">
            {/* You can duplicate this card to add actual team members later */}
            <div className="team-card">
              <div className="t-avatar">
                <span className="t-initial">S</span>
              </div>
              <h4>Akash Sharma</h4>
              <p className="t-role">Founder & CEO</p>
              <p className="t-bio">10+ years in digital marketing and startup consulting. Passionate about MSME growth in India.</p>
            </div>

            <div className="team-card">
              <div className="t-avatar">
                <span className="t-initial">N</span>
              </div>
              <h4>Jeet Balraj</h4>
              <p className="t-role">Head of Creator Partnerships</p>
              <p className="t-bio">Managed campaigns for Fortune 500 brands. Now bringing that expertise to early-stage startups.</p>
            </div>

            <div className="team-card">
              <div className="t-avatar">
                <span className="t-initial">R</span>
              </div>
              <h4>Rajesh Kumar</h4>
              <p className="t-role">Director of Financial Services</p>
              <p className="t-bio">Ex-banker helping MSMEs navigate the complex world of government schemes and business loans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta">
        <div className="container text-center">
          <h2>Ready to change the game?</h2>
          <p>Join hundreds of businesses and creators who are already growing with C-PEB.</p>
          <div className="btn-group justify-center mt-4">
            <Link to="/contact" className="btn btn-primary btn-lg">Partner With Us <ArrowRight size={18} /></Link>
            <Link to="/creators" className="btn btn-secondary btn-lg">Join as a Creator</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
