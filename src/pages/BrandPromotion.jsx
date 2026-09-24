import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, CheckCircle2, Star, Users, Target, BarChart3, Video, Globe, MessageSquare } from 'lucide-react';
import './ServicePage.css';
import SEO from '../components/SEO';

/* ── Data ── */
const SERVICES = [
  {
    icon: <Target size={24} />, title: 'Influencer Partnerships',
    desc: 'Match your brand with the right creators — micro, macro, or mega. We handle vetting, negotiation, and campaign delivery end-to-end.',
    points: ['Creator vetting & brand safety checks', 'Exclusive negotiation on rates', 'Contract & deliverable management', 'Content review before publishing'],
  },
  {
    icon: <Video size={24} />, title: 'Campaign Amplification',
    desc: 'Structured campaigns across YouTube, Instagram, and Shorts that build real brand recall.',
    points: ['Multi-platform coordination', 'Hashtag & trend strategy', 'Reels, Stories, and long-form videos', 'Paid amplification of organic content'],
  },
  {
    icon: <BarChart3 size={24} />, title: 'Performance Tracking',
    desc: 'Live dashboards showing reach, impressions, engagement, and conversion — what your CMO actually cares about.',
    points: ['Real-time campaign dashboards', 'Weekly performance reports', 'ROI and ROAS tracking', 'Competitor benchmarking'],
  },
  {
    icon: <Users size={24} />, title: 'Long-term Brand Deals',
    desc: 'Build lasting creator relationships that feel authentic to audiences. Move beyond one-off posts.',
    points: ['Brand ambassador programmes', 'Exclusivity agreements', 'Quarterly review calls', 'Creator community building'],
  },
  {
    icon: <MessageSquare size={24} />, title: 'Content Strategy',
    desc: 'Our creative team works with influencers to craft brand narratives that feel native — not like ads.',
    points: ['Content calendar planning', 'Script & brief creation', 'Platform-specific formats', 'A/B content testing'],
  },
  {
    icon: <Globe size={24} />, title: 'Multi-Platform Reach',
    desc: 'YouTube vlogs to Instagram Reels to podcast mentions — we coordinate your brand message everywhere.',
    points: ['YouTube, Instagram, X (Twitter)', 'Podcast sponsorships', 'LinkedIn B2B campaigns', 'Emerging platform pilots'],
  },
];

const PACKAGES = [
  {
    name: 'Starter', price: '₹24,999', period: '/month', badge: null,
    desc: 'Perfect for brands just entering influencer marketing',
    features: ['3 micro-influencer collaborations', 'Instagram + 1 platform', 'Monthly performance report', 'Campaign brief support', 'Basic content review'],
    cta: 'Get Started',
  },
  {
    name: 'Growth', price: '₹59,999', period: '/month', badge: 'Most Popular',
    desc: 'For brands ready to scale with consistent influencer activity',
    features: ['8 influencer collaborations', 'All major platforms covered', 'Weekly performance reports', 'Dedicated campaign manager', 'Advanced content strategy', 'Paid amplification included', 'Competitor benchmarking'],
    cta: 'Start Growing',
  },
  {
    name: 'Enterprise', price: 'Custom', period: '', badge: null,
    desc: 'Full-service brand promotion for large-scale campaigns',
    features: ['Unlimited influencer campaigns', 'Celebrity & macro creators', 'Daily reporting & alerts', 'Dedicated team (3 people)', 'Custom content production', 'PR & media coverage', 'Quarterly brand audits', 'Priority support 24/7'],
    cta: 'Talk to Us',
  },
];

const RESULTS = [
  { metric: '500+', label: 'Brand Campaigns Delivered' },
  { metric: '4.8×', label: 'Average ROI for Brands' },
  { metric: '48 hrs', label: 'Brief to Creator Match' },
  { metric: '10K+', label: 'Creators in Our Network' },
];

const STEPS = [
  { num: '01', title: 'Brief', desc: 'Tell us your brand goals, target audience, and budget. We take a deep-dive briefing session.', icon: '📋' },
  { num: '02', title: 'Creator Match', desc: 'We identify the best-fit creators from our verified network using our proprietary matching algorithm.', icon: '🎯' },
  { num: '03', title: 'Content Creation', desc: 'Influencers produce content; we review, approve, and ensure brand safety on your behalf.', icon: '🎬' },
  { num: '04', title: 'Launch & Amplify', desc: 'Go live, track results in real-time, and amplify top-performing content with paid media.', icon: '🚀' },
  { num: '05', title: 'Report & Optimise', desc: 'Detailed reporting on what worked and a refined strategy for the next campaign cycle.', icon: '📊' },
];

const FAQS = [
  { q: 'What types of influencers do you work with?', a: 'We work with all tiers — nano (1K–10K), micro (10K–100K), macro (100K–1M), and mega (1M+) influencers across YouTube, Instagram, LinkedIn, Podcast, and emerging platforms. Our network includes 10,000+ vetted creators across 50+ categories.' },
  { q: 'How do you ensure brand safety?', a: 'Every creator goes through a 3-step vetting process: content audit (last 90 days), engagement authenticity check (to detect fake followers), and brand alignment review. We reject creators that don\'t meet our standards.' },
  { q: 'What is the minimum budget to start?', a: 'Our Starter package begins at ₹24,999/month which includes 3 micro-influencer collaborations. For custom one-off campaigns, budgets typically start from ₹15,000 depending on creator tier and deliverables.' },
  { q: 'How long before I see results?', a: 'Brand awareness metrics (reach, impressions) show results within the first campaign cycle (2–4 weeks). Conversion and ROI metrics typically crystallise over 2–3 campaign cycles as the strategy is optimised.' },
  { q: 'Do you handle the influencer payments?', a: 'Yes. We handle all creator payments on your behalf. You pay us one consolidated invoice and we manage individual creator payouts, contracts, and tax documentation (TDS compliance).' },
  { q: 'Can I approve content before it goes live?', a: 'Absolutely. All content passes through a review portal where you can approve, request edits, or reject before it is published. This is included in all packages.' },
];

const TESTIMONIALS = [
  { name: 'Rohan Mehta', role: 'CMO, FreshCart India', text: 'C-PEB connected us with 12 food creators in 48 hours. Our launch week saw 3.2× our target impressions. The campaign management was completely hands-off for my team.', stars: 5 },
  { name: 'Priya Iyer', role: 'Founder, GlowSkin Co.', text: 'As a D2C beauty brand, authenticity matters everything. The micro-influencers they matched us with genuinely loved our product. Conversion rate was 6.7% — unheard of for us.', stars: 5 },
  { name: 'Vikram Nair', role: 'Head of Growth, EduTech Startup', text: 'We tried 2 other agencies before C-PEB. The difference? They actually understood our audience. Monthly reporting is clear, actionable, and honest.', stars: 5 },
];

/* ── Sub-components ── */
const FAQItem = ({ faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`svc-faq-item ${open ? 'open' : ''}`}>
      <button className="svc-faq-q" onClick={() => setOpen(!open)}>
        <span>{faq.q}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <p className="svc-faq-a">{faq.a}</p>}
    </div>
  );
};

/* ── Page ── */
export default function BrandPromotion() {
  const navigate = useNavigate();

  return (
    <div className="svc-page">
      <SEO 
        title="Brand Promotion & Influencer Marketing | C-PEB" 
        description="Drive massive ROI with India's fastest-growing creator network. We connect your brand with the right influencers for maximum impact." 
      />

      {/* ── Hero ── */}
      <section className="svc-hero svc-hero--brand">
        <div className="container svc-hero-inner">
          <div className="svc-hero-copy">
            <p className="section-eyebrow">Brand Promotion</p>
            <h1>Get Your Brand in Front of <span className="svc-h1-accent">Millions</span></h1>
            <p>India's most trusted influencer marketing platform. We connect brands with creators who genuinely move their audience to act — not just scroll past.</p>
            <div className="svc-hero-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">Start a Campaign <ArrowRight size={18} /></Link>
              <Link to="/case-studies" className="btn btn-secondary btn-lg">See Case Studies</Link>
            </div>
          </div>
          <div className="svc-result-pills">
            {RESULTS.map((r, i) => (
              <div className="svc-result-pill" key={i}>
                <span className="svc-result-metric">{r.metric}</span>
                <span className="svc-result-label">{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="svc-section">
        <div className="container">
          <div className="svc-section-head">
            <p className="section-eyebrow">What We Do</p>
            <h2>Everything Your Brand Promotion Needs</h2>
            <p>From a single product launch to an always-on influencer programme — we've got the creator network and tools.</p>
          </div>
          <div className="svc-service-grid">
            {SERVICES.map((s, i) => (
              <div className="svc-service-card" key={i}>
                <div className="svc-service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <ul className="svc-service-points">
                  {s.points.map((p, j) => (
                    <li key={j}><CheckCircle2 size={13} /> {p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="svc-section svc-section--alt">
        <div className="container">
          <div className="svc-section-head">
            <p className="section-eyebrow">How It Works</p>
            <h2>From Brief to Results in 5 Steps</h2>
          </div>
          <div className="svc-timeline">
            {STEPS.map((s, i) => (
              <div className="svc-timeline-step" key={i}>
                <div className="svc-timeline-icon">{s.icon}</div>
                <div className="svc-timeline-connector" />
                <div className="svc-timeline-content">
                  <span className="svc-step-num">{s.num}</span>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="svc-section" id="pricing">
        <div className="container">
          <div className="svc-section-head">
            <p className="section-eyebrow">Pricing</p>
            <h2>Simple, Transparent Packages</h2>
            <p>No hidden charges. No lock-in contracts. Cancel or upgrade anytime.</p>
          </div>
          <div className="svc-pricing-grid">
            {PACKAGES.map((pkg, i) => (
              <div className={`svc-pricing-card ${pkg.badge ? 'svc-pricing-card--featured' : ''}`} key={i}>
                {pkg.badge && <div className="svc-pricing-badge">{pkg.badge}</div>}
                <h3>{pkg.name}</h3>
                <div className="svc-pricing-price">
                  <span className="svc-price-val">{pkg.price}</span>
                  <span className="svc-price-period">{pkg.period}</span>
                </div>
                <p className="svc-pricing-desc">{pkg.desc}</p>
                <ul className="svc-pricing-features">
                  {pkg.features.map((f, j) => (
                    <li key={j}><CheckCircle2 size={14} /> {f}</li>
                  ))}
                </ul>
                <Link to="/contact" className={`btn btn-lg ${pkg.badge ? 'btn-primary' : 'btn-secondary'} svc-pricing-cta`}>
                  {pkg.cta} <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="svc-section svc-section--alt">
        <div className="container">
          <div className="svc-section-head">
            <p className="section-eyebrow">Results</p>
            <h2>What Our Brand Partners Say</h2>
          </div>
          <div className="svc-testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className="svc-testimonial-card" key={i}>
                <div className="svc-testimonial-stars">
                  {Array(t.stars).fill(0).map((_, j) => <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p className="svc-testimonial-text">"{t.text}"</p>
                <div className="svc-testimonial-author">
                  <div className="svc-testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="svc-section">
        <div className="container svc-faq-layout">
          <div className="svc-faq-head">
            <p className="section-eyebrow">FAQ</p>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know before starting your first campaign.</p>
            <Link to="/contact" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Still have questions? Talk to us <ArrowRight size={16} />
            </Link>
          </div>
          <div className="svc-faq-list">
            {FAQS.map((f, i) => <FAQItem key={i} faq={f} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="svc-cta-section">
        <div className="container">
          <div className="svc-cta-inner">
            <div>
              <h2>Ready to Promote Your Brand?</h2>
              <p>Talk to our team and get a free creator match recommendation within 24 hours.</p>
            </div>
            <div className="svc-cta-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">Book a Free Call <ArrowRight size={18} /></Link>
              <Link to="/" className="btn btn-secondary btn-lg">← Back to Home</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
