import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, CheckCircle2, Star, Search, BarChart3, Mail, DollarSign, Video, TrendingUp } from 'lucide-react';
import './ServicePage.css';
import SEO from '../components/SEO';

const SERVICES = [
  {
    icon: <Search size={24} />, title: 'SEO & Content Marketing',
    desc: 'Rank higher, reach further. Content strategies that bring organic traffic from searches your customers are already making.',
    points: ['Keyword research & strategy', 'On-page & technical SEO', 'Blog & long-form content', 'Backlink building campaigns'],
  },
  {
    icon: <Star size={24} />, title: 'Social Media Management',
    desc: 'Consistent, on-brand presence across Instagram, YouTube, LinkedIn, and X — managed by people who live on these platforms.',
    points: ['Content calendar & scheduling', 'Community management & replies', 'Platform-native content formats', 'Monthly performance reports'],
  },
  {
    icon: <Video size={24} />, title: 'Video Marketing',
    desc: 'Short-form and long-form video content produced by our creator network — from product demos to brand documentaries.',
    points: ['Reels, Shorts & TikTok-style content', 'YouTube video strategy', 'Product demo & explainer videos', 'Creator-generated UGC content'],
  },
  {
    icon: <Mail size={24} />, title: 'Email & WhatsApp Campaigns',
    desc: 'Direct-to-audience campaigns with personalised messaging, automated drip sequences, and analytics.',
    points: ['Audience segmentation & targeting', 'Automated drip sequences', 'WhatsApp Business integration', 'Open rate & CTR optimisation'],
  },
  {
    icon: <DollarSign size={24} />, title: 'Paid Media Strategy',
    desc: 'Maximise your ad spend with influencer-amplified paid campaigns. Creator-led ads consistently outperform traditional display ads.',
    points: ['Google Ads & Meta Ads management', 'Creator-amplified paid social', 'Retargeting & lookalike audiences', 'ROAS-focused campaign management'],
  },
  {
    icon: <BarChart3 size={24} />, title: 'Analytics & Reporting',
    desc: 'Monthly reports with metrics that matter — conversions, ROAS, CAC — so you always know what\'s working.',
    points: ['Custom reporting dashboards', 'CAC, ROAS & LTV tracking', 'Funnel analysis & drop-off audit', 'Competitor benchmarking'],
  },
];

const PACKAGES = [
  {
    name: 'Essential', price: '₹19,999', period: '/month', badge: null,
    desc: 'Great for businesses getting started with digital marketing',
    features: ['2 channels managed (any)', 'Content: 12 posts/month', 'Basic SEO (on-page)', 'Monthly report', 'Email support'],
    cta: 'Get Started',
  },
  {
    name: 'Performance', price: '₹49,999', period: '/month', badge: 'Most Popular',
    desc: 'For growth-focused businesses serious about leads and conversions',
    features: ['4 channels managed', 'Content: 30 posts/month', 'Full SEO + backlinking', 'Paid ads management (up to ₹1L spend)', 'Weekly reports', 'WhatsApp campaigns', 'Dedicated strategist', 'Competitor tracking'],
    cta: 'Start Performing',
  },
  {
    name: 'Full Stack', price: 'Custom', period: '', badge: null,
    desc: 'Complete digital marketing transformation for ambitious brands',
    features: ['All channels managed', 'Unlimited content production', 'Full SEO + PR + Influencer', 'Unlimited paid ads budget', 'Daily reporting', 'Dedicated team of 4', 'Video content production', 'CMO-level strategy sessions', '24/7 priority support'],
    cta: 'Talk to Us',
  },
];

const RESULTS = [
  { metric: '3.2×', label: 'Avg Organic Growth' },
  { metric: '12+', label: 'Channels Managed' },
  { metric: '₹2Cr+', label: 'Ad Spend Managed' },
  { metric: '280+', label: 'Active Clients' },
];

const STEPS = [
  { num: '01', title: 'Digital Audit', desc: 'We review your current digital presence, competitors, and identify your biggest growth opportunities.', icon: '🔍' },
  { num: '02', title: 'Custom Strategy', desc: 'A tailored roadmap built around your business goals, budget, and target audience — not a template.', icon: '🗺️' },
  { num: '03', title: 'Campaign Execution', desc: 'Our team executes across channels simultaneously — content, ads, SEO, and social — with full coordination.', icon: '⚡' },
  { num: '04', title: 'Continuous Optimisation', desc: 'A/B testing, data analysis, and weekly iterations keep your campaigns improving every cycle.', icon: '📈' },
  { num: '05', title: 'Results & Scaling', desc: 'We report clearly on what\'s working and scale the winning strategies for maximum ROI.', icon: '🚀' },
];

const FAQS = [
  { q: 'What channels do you manage?', a: 'We manage all major digital channels: Instagram, Facebook, YouTube, LinkedIn, X (Twitter), Google (Search & Display), Meta Ads, Email marketing, and WhatsApp Business. Custom channel additions are available.' },
  { q: 'How do I know my ad spend is being used properly?', a: 'You get real-time access to your ad accounts and a dedicated dashboard showing spend, conversions, ROAS, and CAC updated daily. Monthly strategy calls review performance against targets.' },
  { q: 'Do you create the content or do I?', a: 'We handle all content creation — copywriting, graphic design, and video production. You get an approval workflow where you review and approve before anything is published.' },
  { q: 'How long until I see results from SEO?', a: 'Paid ads show results within days. Social media traction typically builds over 4–8 weeks. SEO results are typically visible in 3–6 months as Google indexes and ranks new content.' },
  { q: 'Is there a minimum contract period?', a: 'No long-term contracts. All packages are month-to-month. We retain clients because of results, not contracts. You can upgrade, downgrade, or cancel with 30 days\' notice.' },
  { q: 'Can I start with just one channel?', a: 'Yes. You can start with a single channel (e.g., just Instagram or just SEO) and expand as you see results. We\'ll recommend the best starting point based on your business type and goals.' },
];

const TESTIMONIALS = [
  { name: 'Anika Sharma', role: 'Founder, CraftBox India', text: 'Within 3 months our organic Instagram followers grew from 2K to 28K. The content team understood our aesthetic immediately. Worth every rupee.', stars: 5 },
  { name: 'Suresh Reddy', role: 'CEO, TechHire Solutions', text: 'Our Google Ads ROAS went from 1.2× to 4.7× in 60 days. The paid media team genuinely knows what they\'re doing. Best investment we\'ve made.', stars: 5 },
  { name: 'Meera Joshi', role: 'Marketing Head, NaturalEats', text: 'The monthly reports are a breath of fresh air — honest, clear, and actually tell you what to do next. Previous agencies gave us vanity metrics.', stars: 5 },
];

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

export default function DigitalMarketing() {
  return (
    <div className="service-page">
      <SEO
        title="Digital Marketing Services | C-PEB"
        description="Full-funnel digital marketing that converts. Beyond likes and followers — we build strategies that drive traffic, leads, and revenue."
      />

      <section className="svc-hero svc-hero--digital">
        <div className="container svc-hero-inner">
          <div className="svc-hero-copy">
            <p className="section-eyebrow">Digital Marketing</p>
            <h1>Full-Funnel Digital Marketing That <span className="svc-h1-accent">Converts</span></h1>
            <p>Beyond likes and followers — we build marketing strategies that drive real business outcomes. Traffic, leads, conversions, and revenue.</p>
            <div className="svc-hero-actions">
              <button className="btn btn-primary btn-lg">Get a Strategy Call <ArrowRight size={18} /></button>
              <button className="btn btn-secondary btn-lg">See Our Work</button>
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

      <section className="svc-section">
        <div className="container">
          <div className="svc-section-head">
            <p className="section-eyebrow">Services</p>
            <h2>A Complete Digital Marketing Stack</h2>
            <p>Whether you need one channel managed or a full digital transformation — we handle strategy, execution, and reporting.</p>
          </div>
          <div className="svc-service-grid">
            {SERVICES.map((s, i) => (
              <div className="svc-service-card" key={i}>
                <div className="svc-service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <ul className="svc-service-points">
                  {s.points.map((p, j) => <li key={j}><CheckCircle2 size={13} /> {p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-section svc-section--alt">
        <div className="container">
          <div className="svc-section-head">
            <p className="section-eyebrow">Our Approach</p>
            <h2>Strategy-First, Always</h2>
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

      <section className="svc-section" id="pricing">
        <div className="container">
          <div className="svc-section-head">
            <p className="section-eyebrow">Pricing</p>
            <h2>Transparent Packages, Real Results</h2>
            <p>Month-to-month. No hidden fees. Scale up or down anytime.</p>
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
                  {pkg.features.map((f, j) => <li key={j}><CheckCircle2 size={14} /> {f}</li>)}
                </ul>
                <button className={`btn btn-lg ${pkg.badge ? 'btn-primary' : 'btn-secondary'} svc-pricing-cta`}>
                  {pkg.cta} <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-section svc-section--alt">
        <div className="container">
          <div className="svc-section-head">
            <p className="section-eyebrow">Client Results</p>
            <h2>Don't Take Our Word for It</h2>
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
                  <div><strong>{t.name}</strong><span>{t.role}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-section">
        <div className="container svc-faq-layout">
          <div className="svc-faq-head">
            <p className="section-eyebrow">FAQ</p>
            <h2>Common Questions</h2>
            <p>Everything you want to know before signing up.</p>
            <button className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Ask Us Anything <ArrowRight size={16} />
            </button>
          </div>
          <div className="svc-faq-list">
            {FAQS.map((f, i) => <FAQItem key={i} faq={f} />)}
          </div>
        </div>
      </section>

      <section className="svc-cta-section">
        <div className="container">
          <div className="svc-cta-inner">
            <div>
              <h2>Ready to Scale Your Digital Presence?</h2>
              <p>Get a free 30-minute strategy session with our digital marketing team. No commitment required.</p>
            </div>
            <div className="svc-cta-actions">
              <button className="btn btn-primary btn-lg">Book Free Session <ArrowRight size={18} /></button>
              <Link to="/" className="btn btn-secondary btn-lg">← Back to Home</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
