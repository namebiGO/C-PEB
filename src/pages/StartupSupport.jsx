import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, CheckCircle2, Star, Rocket, Users, FileText, Lightbulb, Package, TrendingUp, Lock } from 'lucide-react';
import './ServicePage.css';
import './StartupAdvisory.css';
import SEO from '../components/SEO';
import TestimonialsScroll from '../components/TestimonialsScroll';

const SERVICES = [
  {
    icon: <Rocket size={24} />, title: 'Launch Visibility Campaigns',
    desc: 'First-mover buzz is everything. We design influencer campaigns that make your launch impossible to miss in your target market.',
    points: ['Pre-launch teaser campaigns', 'Launch day influencer blitz', 'Product seeding to key creators', 'PR outreach to media & blogs'],
  },
  {
    icon: <Users size={24} />, title: 'Creator-Led PR',
    desc: 'Skip traditional PR. Authentic creator endorsements carry more weight — and reach — than any press release.',
    points: ['Media kit & pitch creation', 'Creator & journalist outreach', 'Story placement in niche publications', 'Online reputation building'],
  },
  {
    icon: <Star size={24} />, title: 'Product Reviews & Unboxings',
    desc: 'Build trust through honest, creator-generated content. Real reviews from people your audience already follows.',
    points: ['Curated reviewer selection', 'Unboxing & first-impression videos', 'Long-form review content', 'Review aggregation & amplification'],
  },
  {
    icon: <Lightbulb size={24} />, title: 'Investor-Ready Storytelling',
    desc: 'Craft a compelling brand narrative — not just for customers, but for VCs and angel investors too.',
    points: ['Brand story & positioning', 'Pitch deck narrative support', 'Founder personal brand building', 'Thought leadership content'],
  },
  {
    icon: <TrendingUp size={24} />, title: 'Growth Mentorship',
    desc: 'Get paired with experienced founders and creators who\'ve built audiences from scratch. Monthly 1:1 sessions included.',
    points: ['Monthly 1:1 founder sessions', 'Marketing strategy reviews', 'Network introductions', 'Community of startup founders'],
  },
  {
    icon: <Package size={24} />, title: 'Flexible Startup Packages',
    desc: 'Budget-friendly packages designed for early-stage startups. Start small, scale as you grow — no long-term lock-ins.',
    points: ['Pre-launch packages available', 'Pay-as-you-scale model', 'Equity-for-services discussions', 'Monthly billing, no annual lock-in'],
  },
];

const PACKAGES = [
  {
    name: 'Launchpad', price: '₹14,999', period: '/month', badge: null,
    desc: 'For startups ready to make their first noise in the market',
    features: ['2 creator collaborations/month', 'Launch campaign strategy', 'Social media presence setup', 'Basic PR outreach (5 contacts)', 'Monthly strategy call', 'Founder branding guide'],
    cta: 'Launch Now',
  },
  {
    name: 'Scale Up', price: '₹34,999', period: '/month', badge: 'Best for Startups',
    desc: 'Serious traction for startups in their first growth phase',
    features: ['6 creator collaborations/month', 'Full launch + ongoing campaigns', 'PR outreach (25 contacts)', 'Investor storytelling support', 'Bi-weekly strategy calls', 'Founder personal branding', 'Growth mentorship (monthly)', 'Community access'],
    cta: 'Start Scaling',
  },
  {
    name: 'Series Ready', price: 'Custom', period: '', badge: null,
    desc: 'For funded startups ready to dominate their category',
    features: ['Unlimited creator campaigns', 'Celebrity & macro creators', 'Full PR & media relations', 'Investor-ready brand narrative', 'Weekly strategy sessions', 'Dedicated 3-person team', 'Podcast & speaking placements', 'Board-level reporting', 'Priority 24/7 support'],
    cta: 'Let\'s Talk',
  },
];

const RESULTS = [
  { metric: '200+', label: 'Startups Supported' },
  { metric: '6×', label: 'Faster Traction vs Traditional' },
  { metric: '₹9,999', label: 'Plans Starting From' },
  { metric: '92%', label: 'Client Retention Rate' },
];

const STEPS = [
  { num: '01', title: 'Discovery Session', desc: 'We do a deep-dive into your product, market, funding stage, and who you\'re trying to reach. This shapes everything.', icon: '🔭' },
  { num: '02', title: 'Pilot Campaign', desc: 'A small, targeted campaign to validate messaging and find which creators and channels resonate with your audience.', icon: '🧪' },
  { num: '03', title: 'Launch Execution', desc: 'We execute your launch or growth campaign across chosen channels simultaneously for maximum impact.', icon: '🚀' },
  { num: '04', title: 'Scale Winners', desc: 'Double down on what works — more creators, more budget, more channels — based on real pilot data.', icon: '📈' },
  { num: '05', title: 'Build Community', desc: 'The final phase: help you build a loyal creator community that advocates for your startup long-term.', icon: '🤝' },
];

const FAQS = [
  { q: 'We\'re pre-revenue. Can you still help us?', a: 'Yes. Pre-revenue and even pre-launch startups are a sweet spot for us. We help you build buzz, get your first 1,000 customers, and create the social proof that helps with fundraising.' },
  { q: 'How do you find creators that fit our niche?', a: 'We use a combination of our creator database (10,000+ vetted creators) and manual research. For very niche startups, we identify relevant micro-creators who often have higher engagement and trust with specific communities.' },
  { q: 'Will influencer marketing work for a B2B startup?', a: 'Absolutely. For B2B, we focus on LinkedIn thought leaders, podcast appearances, and niche YouTube channels. Founder personal branding is also very effective for B2B startups.' },
  { q: 'How is this different from hiring a marketing agency?', a: 'We specialise in early-stage startups and combine influencer marketing with PR, content strategy, and growth mentorship. Traditional agencies are built for established brands with large budgets — we\'re built for fast-moving startups.' },
  { q: 'Can influencer activity help with fundraising?', a: 'Yes, indirectly but powerfully. Strong social proof, viral moments, and growing community numbers are metrics that impress investors. We also help with founder personal branding and investor-facing content.' },
  { q: 'What if our product isn\'t ready yet for PR?', a: 'We can start with a "stealth mode" strategy — building your founder\'s personal brand, engaging early adopters, and preparing your launch playbook — so you\'re ready to explode on day one.' },
];

const TESTIMONIALS = [
  { name: 'Arjun Kapoor', role: 'Founder, FitSnack (Seed Stage)', text: 'We went from 0 to 15,000 Instagram followers in our launch month. C-PEB\'s creator network was exactly what a bootstrapped startup like us needed. 10/10.', stars: 5 },
  { name: 'Sneha Patel', role: 'Co-Founder, EduKids App', text: 'The investor storytelling support alone was worth the retainer. We got 3 introductions to angel investors through our content strategy. Genuinely unexpected.', stars: 5 },
  { name: 'Rahul Verma', role: 'CEO, GreenBox Delivery', text: 'Our pre-launch waitlist went from 200 to 4,800 in 6 weeks. The pilot campaign approach is brilliant — test, learn, scale. No wasted budget.', stars: 5 },
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

export default function StartupSupport() {
  return (
    <div className="service-page">
      <SEO 
        title="Startup Support & Growth | C-PEB" 
        description="From zero to known. We help startups break through with influencer-powered growth strategies built specifically for early-stage companies." 
      />

      <section className="svc-hero svc-hero--startup svc-hero--startup-new">
        <div className="container svc-hero-inner svc-hero-inner--startup-new">
          <div className="svc-hero-copy svc-hero-copy--startup-new">
            <p className="section-eyebrow">STARTUP GROWTH • CREATOR-LED</p>
            <h1>
              Turn Your Startup<br />
              Into Something<br />
              <span className="svc-h1-accent">People Talk About.</span>
            </h1>
            <p>From positioning and creator strategy to campaigns that generate real attention — we help early-stage startups become visible, credible, and talked about.</p>
            <div className="svc-hero-actions">
              <button className="btn btn-primary btn-lg">Build My Growth Plan <ArrowRight size={18} /></button>
              <button className="btn btn-secondary btn-lg">Explore Startup Support</button>
            </div>
          </div>
          
          <div className="startup-hero-visual">
            <div className="shv-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                alt="Startup ecosystem and growth" 
                className="shv-image"
              />
              <div className="shv-overlay"></div>
              
              <svg className="shv-connections" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M22,22 L50,50" className="shv-line" vectorEffect="non-scaling-stroke" />
                <path d="M78,17 L50,50" className="shv-line" vectorEffect="non-scaling-stroke" />
                <path d="M15,78 L50,50" className="shv-line" vectorEffect="non-scaling-stroke" />
                <path d="M78,83 L50,50" className="shv-line" vectorEffect="non-scaling-stroke" />
              </svg>
              
              <div className="shv-center-node">STARTUP</div>
              
              <div className="shv-floating-card card-creators">
                <span className="shv-dot"></span> Creators
              </div>
              <div className="shv-floating-card card-content">
                <span className="shv-dot"></span> Content
              </div>
              <div className="shv-floating-card card-community">
                <span className="shv-dot"></span> Community
              </div>
              <div className="shv-floating-card card-growth">
                <span className="shv-dot"></span> Growth
              </div>
            </div>
          </div>
        </div>
        
        <div className="container">
          <div className="startup-proof-strip">
            <p className="sps-label">Built for ambitious early-stage teams</p>
            <div className="sps-metrics">
              {RESULTS.map((r, i) => (
                <div className="sps-metric-item" key={i}>
                  <strong>{r.metric}</strong> <span>{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="svc-section">
        <div className="container">
          <div className="svc-section-head">
            <p className="section-eyebrow">How We Help</p>
            <h2>Built for Startups. Not Big Brands.</h2>
            <p>Tight budgets, fast pivots, and the need to prove traction quickly. Our programmes are designed around that reality.</p>
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
            <p className="section-eyebrow">The Journey</p>
            <h2>A Phased Approach Built for Growth</h2>
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



      {/* ─────────────────────────────────────────────────────────────
          SECTION 6 — PRICING
          ───────────────────────────────────────────────────────────── */}
      <section className="adv-section" id="plans">
        <div className="adv-container">
          <div className="adv-section-head text-center max-w-750">
            <span className="adv-subheading-tag">COMMERCIAL PLANS</span>
            <h2 className="adv-heading">Choose Your Support Period.</h2>
            <p className="adv-lead">
              Two straightforward plans. Both include full priority support for the duration of your selected period.
            </p>
          </div>

          <div className="adv-pricing-grid">
            {/* Plan 1 */}
            <div className="adv-plan-card">
              <div className="adv-plan-head">
                <span className="adv-plan-code">PLAN 01</span>
                <h3 className="adv-plan-title">STARTER ADVISORY</h3>
                <span className="adv-plan-duration">1 MONTH</span>
                <div className="adv-plan-price-wrap">
                  <span className="adv-currency">₹</span>
                  <span className="adv-amount">2,499</span>
                </div>
                <div className="adv-plan-support-tag">
                  <CheckCircle2 size={14} className="text-green" />
                  <span>Priority Support Included</span>
                </div>
              </div>

              <p className="adv-plan-desc">
                Flexible support for founders and businesses that want guidance over the next month.
              </p>

              <div className="adv-plan-action">
                <Link
                  to="/startup-business-advisory?activate=true"
                  className="adv-btn adv-btn-secondary w-full"
                  style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                >
                  BOOK NOW — ₹2,499 →
                </Link>
                <div className="adv-plan-rzp-meta">
                  <Lock size={12} />
                  <span>Secure Razorpay Checkout</span>
                </div>
              </div>
            </div>

            {/* Plan 2 */}
            <div className="adv-plan-card adv-plan-featured">
              <div className="adv-featured-badge">BEST FOR CONTINUOUS SUPPORT</div>
              <div className="adv-plan-head">
                <span className="adv-plan-code">PLAN 02</span>
                <h3 className="adv-plan-title">ONGOING ADVISORY</h3>
                <span className="adv-plan-duration">3 MONTHS</span>
                <div className="adv-plan-price-wrap">
                  <span className="adv-currency">₹</span>
                  <span className="adv-amount">5,999</span>
                </div>
                <div className="adv-plan-total-notice">
                  <strong>₹5,999 TOTAL FOR 3 MONTHS</strong>
                  <span>≈ ₹2,000/month when billed for 3 months</span>
                </div>
                <div className="adv-plan-support-tag">
                  <CheckCircle2 size={14} className="text-green" />
                  <span>Priority Support Included</span>
                </div>
              </div>

              <p className="adv-plan-desc">
                Extended support for businesses that want consistent guidance and ongoing assistance.
              </p>

              <div className="adv-plan-action">
                <Link
                  to="/startup-business-advisory?activate=true"
                  className="adv-btn adv-btn-primary w-full"
                  style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                >
                  BOOK NOW — ₹5,999 →
                </Link>
                <div className="adv-plan-rzp-meta">
                  <Lock size={12} />
                  <span>Secure Razorpay Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsScroll />

      <section className="svc-section">
        <div className="container svc-faq-layout">
          <div className="svc-faq-head">
            <p className="section-eyebrow">FAQ</p>
            <h2>Questions from Founders</h2>
            <p>Real questions we get from early-stage founders before they sign up.</p>
            <button className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Ask Your Question <ArrowRight size={16} />
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
              <h2>Your Startup Deserves to Be Seen.</h2>
              <p>Get a free startup audit and a custom influencer marketing roadmap — no strings attached.</p>
            </div>
            <div className="svc-cta-actions">
              <button className="btn btn-primary btn-lg">Get Free Audit <ArrowRight size={18} /></button>
              <Link to="/" className="btn btn-secondary btn-lg">← Back to Home</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
