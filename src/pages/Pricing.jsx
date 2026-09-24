import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Shield, HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Pricing.css';
import SEO from '../components/SEO';

const BRAND_PACKAGES = [
  {
    name: 'Starter', price: '₹24,999', period: '/month', badge: null,
    desc: 'Perfect for brands just entering influencer marketing',
    features: ['3 micro-influencer collaborations', 'Instagram + 1 platform', 'Monthly performance report', 'Campaign brief support', 'Basic content review'],
    cta: 'Get Started', link: '/contact'
  },
  {
    name: 'Growth', price: '₹59,999', period: '/month', badge: 'Most Popular',
    desc: 'For brands ready to scale with consistent influencer activity',
    features: ['8 influencer collaborations', 'All major platforms covered', 'Weekly performance reports', 'Dedicated campaign manager', 'Advanced content strategy', 'Paid amplification included', 'Competitor benchmarking'],
    cta: 'Start Growing', link: '/contact'
  },
  {
    name: 'Enterprise', price: 'Custom', period: '', badge: null,
    desc: 'Full-service brand promotion for large-scale campaigns',
    features: ['Unlimited influencer campaigns', 'Celebrity & macro creators', 'Daily reporting & alerts', 'Dedicated team (3 people)', 'Custom content production', 'PR & media coverage', 'Quarterly brand audits', 'Priority support 24/7'],
    cta: 'Talk to Us', link: '/contact'
  }
];

const DIGITAL_PACKAGES = [
  {
    name: 'Essential', price: '₹19,999', period: '/month', badge: null,
    desc: 'Great for businesses getting started with digital marketing',
    features: ['2 channels managed (any)', 'Content: 12 posts/month', 'Basic SEO (on-page)', 'Monthly report', 'Email support'],
    cta: 'Get Started', link: '/contact'
  },
  {
    name: 'Performance', price: '₹49,999', period: '/month', badge: 'Most Popular',
    desc: 'For growth-focused businesses serious about leads and conversions',
    features: ['4 channels managed', 'Content: 30 posts/month', 'Full SEO + backlinking', 'Paid ads management (up to ₹1L spend)', 'Weekly reports', 'WhatsApp campaigns', 'Dedicated strategist', 'Competitor tracking'],
    cta: 'Start Performing', link: '/contact'
  },
  {
    name: 'Full Stack', price: 'Custom', period: '', badge: null,
    desc: 'Complete digital marketing transformation for ambitious brands',
    features: ['All channels managed', 'Unlimited content production', 'Full SEO + PR + Influencer', 'Unlimited paid ads budget', 'Daily reporting', 'Dedicated team of 4', 'Video content production', 'CMO-level strategy sessions', '24/7 priority support'],
    cta: 'Talk to Us', link: '/contact'
  }
];

const STARTUP_PACKAGES = [
  {
    name: 'Launchpad', price: '₹14,999', period: '/month', badge: null,
    desc: 'For startups ready to make their first noise in the market',
    features: ['2 creator collaborations/month', 'Launch campaign strategy', 'Social media presence setup', 'Basic PR outreach (5 contacts)', 'Monthly strategy call', 'Founder branding guide'],
    cta: 'Launch Now', link: '/contact'
  },
  {
    name: 'Scale Up', price: '₹34,999', period: '/month', badge: 'Best for Startups',
    desc: 'Serious traction for startups in their first growth phase',
    features: ['6 creator collaborations/month', 'Full launch + ongoing campaigns', 'PR outreach (25 contacts)', 'Investor storytelling support', 'Bi-weekly strategy calls', 'Founder personal branding', 'Growth mentorship (monthly)', 'Community access'],
    cta: 'Start Scaling', link: '/contact'
  },
  {
    name: 'Series Ready', price: 'Custom', period: '', badge: null,
    desc: 'For funded startups ready to dominate their category',
    features: ['Unlimited creator campaigns', 'Celebrity & macro creators', 'Full PR & media relations', 'Investor-ready brand narrative', 'Weekly strategy sessions', 'Dedicated 3-person team', 'Podcast & speaking placements', 'Board-level reporting', 'Priority 24/7 support'],
    cta: 'Let\'s Talk', link: '/contact'
  }
];

const FAQS = [
  { q: 'Are there any setup fees or hidden costs?', a: 'No, we believe in radical transparency. The prices you see are what you pay. Any media spend (like ad budgets or influencer payouts beyond the package) is billed separately at cost, with zero markup.' },
  { q: 'Is there a minimum contract period?', a: 'Most of our standard packages operate on a month-to-month basis because we believe in retaining clients through results, not contracts. Enterprise packages may require a 3-6 month commitment depending on the complexity of setup.' },
  { q: 'Can I switch between packages?', a: 'Absolutely. You can upgrade or downgrade your plan at the end of your billing cycle as your business needs evolve.' },
  { q: 'What happens if I need a custom combination of services?', a: 'No problem! We frequently build bespoke packages for businesses that need a mix of Brand Promotion, Digital Marketing, and Startup Support. Just book a call with us.' },
];

const FAQItem = ({ faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`pricing-faq-item ${open ? 'open' : ''}`}>
      <button className="pricing-faq-q" onClick={() => setOpen(!open)}>
        <span>{faq.q}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <p className="pricing-faq-a">{faq.a}</p>}
    </div>
  );
};

export default function Pricing() {
  const [activeTab, setActiveTab] = useState('brand');

  const getActivePackages = () => {
    switch(activeTab) {
      case 'brand': return BRAND_PACKAGES;
      case 'digital': return DIGITAL_PACKAGES;
      case 'startup': return STARTUP_PACKAGES;
      default: return BRAND_PACKAGES;
    }
  };

  return (
    <div className="pricing-page">
      <SEO 
        title="Pricing Plans | C-PEB" 
        description="Transparent, results-driven pricing for Brand Promotion, Digital Marketing, and Startup Support. No hidden fees." 
      />

      {/* ── Hero ── */}
      <section className="pricing-hero">
        <div className="container text-center">
          <p className="section-eyebrow">Pricing Plans</p>
          <h1>Simple, Transparent Pricing<br/><span className="text-gradient">For Every Stage of Growth</span></h1>
          <p className="max-w-600 mx-auto mt-3">Whether you're just launching or scaling to Series A, we have a plan built for your exact needs. No hidden agency fees.</p>
        </div>
      </section>

      {/* ── Tabs & Pricing Cards ── */}
      <section className="pricing-main">
        <div className="container">
          
          <div className="pricing-tabs">
            <button className={`pricing-tab ${activeTab === 'brand' ? 'active' : ''}`} onClick={() => setActiveTab('brand')}>
              Brand Promotion
            </button>
            <button className={`pricing-tab ${activeTab === 'digital' ? 'active' : ''}`} onClick={() => setActiveTab('digital')}>
              Digital Marketing
            </button>
            <button className={`pricing-tab ${activeTab === 'startup' ? 'active' : ''}`} onClick={() => setActiveTab('startup')}>
              Startup Support
            </button>
          </div>

          <div className="pricing-grid fade-in">
            {getActivePackages().map((pkg, i) => (
              <div className={`pricing-card ${pkg.badge ? 'featured' : ''}`} key={i}>
                {pkg.badge && <div className="pricing-badge">{pkg.badge}</div>}
                
                <div className="pricing-card-header">
                  <h3>{pkg.name}</h3>
                  <div className="price-display">
                    <span className="price-val">{pkg.price}</span>
                    <span className="price-period">{pkg.period}</span>
                  </div>
                  <p className="price-desc">{pkg.desc}</p>
                </div>

                <div className="pricing-card-body">
                  <ul className="pricing-features">
                    {pkg.features.map((f, j) => (
                      <li key={j}><CheckCircle2 size={16} className="feature-icon" /> <span>{f}</span></li>
                    ))}
                  </ul>
                </div>

                <div className="pricing-card-footer">
                  <Link to={pkg.link} className={`btn btn-lg ${pkg.badge ? 'btn-primary' : 'btn-secondary'} w-full justify-center`}>
                    {pkg.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* ── Concise Startup & Business Advisory Feature Card ── */}
          <div className="pricing-advisory-banner">
            <div className="advisory-banner-content">
              <div className="advisory-banner-badge">
                <Sparkles size={14} className="text-green" />
                <span>STARTUP & BUSINESS ADVISORY</span>
              </div>
              <h3 className="advisory-banner-title">Looking for Ongoing Business Guidance?</h3>
              <p className="advisory-banner-desc">
                Practical support for founders and businesses. Think through decisions, explore next steps, and get priority advisory support when you need it.
              </p>
              <div className="advisory-banner-pricing">
                <span className="advisory-price-item"><strong>₹2,499</strong> / 1 Month</span>
                <span className="advisory-price-divider">or</span>
                <span className="advisory-price-item"><strong>₹5,999</strong> / 3 Months</span>
                <span className="advisory-priority-tag">Priority Support Included</span>
              </div>
            </div>
            <div className="advisory-banner-action">
              <Link to="/startup-business-advisory" className="btn btn-primary btn-lg">
                EXPLORE ADVISORY <ArrowRight size={16} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── Assurance Banner ── */}
      <section className="pricing-assurance">
        <div className="container">
          <div className="assurance-box">
            <Shield size={32} className="assurance-icon" />
            <div className="assurance-text">
              <h3>Need a custom enterprise solution?</h3>
              <p>We build tailored packages including PR, offline activations, and extensive creator networks for large-scale brands.</p>
            </div>
            <Link to="/contact" className="btn btn-primary">Contact Sales <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pricing-faq-section bg-alt">
        <div className="container">
          <div className="section-header text-center">
            <HelpCircle size={32} className="mx-auto mb-3 text-green" />
            <h2>Common Questions</h2>
          </div>
          <div className="pricing-faq-list max-w-800 mx-auto mt-5">
            {FAQS.map((f, i) => <FAQItem key={i} faq={f} />)}
          </div>
        </div>
      </section>

    </div>
  );
}
