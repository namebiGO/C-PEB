import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './CaseStudies.css';
import projectMockup1 from '../assets/project_mockup_1.jpg';
import projectMockup2 from '../assets/project_mockup_2.jpg';
import TestimonialsScroll from '../components/TestimonialsScroll';

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */

const FILTER_CATS = [
  { id: 'all',                    label: 'All' },
  { id: 'events',                 label: 'Events' },
  { id: 'startup-support',        label: 'Startup Support' },
  { id: 'business-support',       label: 'Business Support' },
  { id: 'influencer-connections', label: 'Influencer Connections' },
  { id: 'brand-promotion',        label: 'Brand Promotion' },
  { id: 'digital-marketing',      label: 'Digital Marketing' },
];

const SERVICES = [
  {
    num: '01', id: 'events',
    title: 'Event Management',
    body: 'From planning and promotion to on-ground execution, we help bring successful events to life.',
    items: ['Event Planning', 'Event Promotion', 'Vendor Coordination', 'Audience Management', 'On-Ground Execution', 'Brand Activations'],
  },
  {
    num: '02', id: 'startup-support',
    title: 'Startup Support',
    body: 'Helping early-stage businesses move from idea and setup toward visibility and growth.',
    items: ['Startup Launch Support', 'Business Setup Assistance', 'Digital Presence', 'Market Positioning', 'Growth Support', 'Business Connections'],
  },
  {
    num: '03', id: 'business-support',
    title: 'Business Support',
    body: 'Practical support for businesses that need the right people, services, connections or execution.',
    items: ['Business Development', 'Operational Assistance', 'Partnerships', 'Lead Generation', 'Business Connections', 'Growth Support'],
  },
  {
    num: '04', id: 'influencer-connections',
    title: 'Influencer Connections',
    body: 'Connecting brands with relevant creators for authentic campaigns and partnerships.',
    items: ['Creator Discovery', 'Creator Matching', 'Campaign Coordination', 'Brand–Creator Partnerships', 'Content Campaigns', 'Influencer Promotion'],
  },
  {
    num: '05', id: 'brand-promotion',
    title: 'Brand Promotion',
    body: 'Helping businesses increase visibility through strategic promotion, campaigns and real-world activations.',
    items: ['Brand Activations', 'Promotional Campaigns', 'Event Promotion', 'Creator Partnerships', 'Offline Visibility', 'Brand Awareness'],
  },
  {
    num: '06', id: 'digital-marketing',
    title: 'Digital Marketing',
    body: 'Building digital visibility and customer acquisition through content, campaigns and performance marketing.',
    items: ['Social Media Marketing', 'Performance Marketing', 'Content Strategy', 'Lead Generation', 'SEO', 'Conversion Optimisation'],
  },
];

const PROJECTS = [
  {
    id: 'urbane-wear', slug: 'urbane-wear', number: '01',
    title: 'Urbane Wear',
    client: 'Urbane Wear (D2C Fashion)',
    category: 'brand-promotion',
    subtitle: 'Brand Promotion / Influencer Marketing',
    year: '2025',
    summary: 'Scaling a Gen-Z fashion brand from ₹5L to ₹50L/month through creator-led acquisition.',
    challenge: 'High Facebook Ad CPA was unsustainable. The brand needed an alternative channel to reach its Gen-Z audience without burning through budget.',
    outcome: '10× revenue growth. CPA reduced by 65%. ₹50L+ monthly recurring revenue achieved.',
    services: ['Influencer Connections', 'Brand Promotion', 'Performance Marketing'],
    image: projectMockup1,
    imageAlt: 'Urbane Wear fashion brand campaign',
    featured: true, layout: 'normal', highlight: '10× Revenue Growth',
  },
  {
    id: 'paynova', slug: 'paynova', number: '02',
    title: 'PayNova',
    client: 'PayNova (Fintech)',
    category: 'digital-marketing',
    subtitle: 'Digital Marketing / User Acquisition',
    year: '2024',
    summary: 'Acquiring 100,000 app users in 30 days for a new fintech product launch.',
    challenge: 'PayNova needed to hit a seed-round milestone of 100k active users quickly in a competitive fintech market.',
    outcome: '112,450 installs. Cost-per-install at ₹42 against a target of ₹80.',
    services: ['Digital Marketing', 'Influencer Connections', 'PR Strategy'],
    image: projectMockup2,
    imageAlt: 'PayNova fintech app user acquisition campaign',
    featured: true, layout: 'reverse', highlight: '+100k Users · 30 Days',
  },
  {
    id: 'cloudflow', slug: 'cloudflow', number: '03',
    title: 'CloudFlow',
    client: 'CloudFlow (B2B SaaS)',
    category: 'startup-support',
    subtitle: 'Startup Support / B2B Growth',
    year: '2024',
    summary: 'Helping an early-stage SaaS startup secure CGTMSE funding and build a B2B pipeline.',
    challenge: 'A working product with no capital to scale. Founders had deep technical expertise but no finance or marketing background.',
    outcome: '₹2 Crore CGTMSE-backed loan secured in 45 days. 45 qualified demos per month established.',
    services: ['Startup Support', 'Financial Compliance', 'Business Connections'],
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80',
    imageAlt: 'CloudFlow B2B SaaS startup support',
    featured: true, layout: 'normal', highlight: '₹2Cr Funding · 45 Days',
  },
  {
    id: 'vitalsip', slug: 'vitalsip', number: '04',
    title: 'VitalSip', client: 'VitalSip (FMCG Beverage)',
    category: 'brand-promotion', subtitle: 'Brand Promotion', year: '2025',
    summary: 'Taking a local beverage brand to nationwide visibility.',
    highlight: '12M+ Organic Views',
    image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'VitalSip brand promotion campaign', featured: false,
  },
  {
    id: 'codecamp', slug: 'codecamp', number: '05',
    title: 'CodeCamp India', client: 'CodeCamp India (EdTech)',
    category: 'startup-support', subtitle: 'Startup Support', year: '2024',
    summary: 'Selling out a ₹1.5L tech bootcamp in 72 hours.',
    highlight: '150 Seats · 72 Hours',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'CodeCamp India launch', featured: false,
  },
  {
    id: 'blocktrade', slug: 'blocktrade', number: '06',
    title: 'BlockTrade', client: 'BlockTrade (Crypto Exchange)',
    category: 'digital-marketing', subtitle: 'Digital Marketing', year: '2023',
    summary: 'Rebuilding user trust following market-wide confidence collapse.',
    highlight: '24 Media Features',
    image: 'https://images.unsplash.com/photo-1621504450181-5d156f8746c5?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'BlockTrade trust rebuilding', featured: false,
  },
];



const PROCESS_STEPS = [
  { num: '01', title: 'Understand', body: 'We understand your business, audience, goals and the specific requirement you need addressed.' },
  { num: '02', title: 'Plan', body: 'We identify the right services, people, partners and execution strategy for your situation.' },
  { num: '03', title: 'Execute', body: 'We coordinate the required event, creator, brand, business and marketing activities.' },
  { num: '04', title: 'Grow', body: 'We evaluate the outcome, refine what works and identify the next opportunity.' },
];

/* ═══════════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════════ */

// HERO
const WorkHero = () => (
  <section className="ow-hero">
    <div className="ow-container">
      <div className="ow-hero-inner">
        <div className="ow-hero-copy">
          <p className="ow-eyebrow-pill">EVENTS · BRANDS · BUSINESS · PEOPLE</p>
          <h1 className="ow-hero-h1">
            We connect<br />
            businesses, brands<br />
            <em>&amp; people.</em>
          </h1>
          <p className="ow-hero-body">
            From events and startup support to creator partnerships, brand promotion and digital marketing, we bring strategy, people and execution together.
          </p>
          <div className="ow-hero-ctas">
            <Link to="/contact" className="ow-btn-primary">
              Let's Talk <ArrowRight size={17} />
            </Link>
            <a href="#ow-services" className="ow-btn-ghost">
              Explore Services
            </a>
          </div>
        </div>
        <div className="ow-hero-visual">
          <div className="ow-hero-img-frame">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85"
              alt="Business event and brand activation"
              loading="eager"
            />
          </div>
          {/* Subtle decorative linework */}
          <svg className="ow-hero-deco" viewBox="0 0 200 200" fill="none" aria-hidden="true">
            <circle cx="160" cy="40" r="40" stroke="currentColor" strokeWidth="0.5" opacity="0.15"/>
            <circle cx="160" cy="40" r="25" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
            <circle cx="40" cy="160" r="20" stroke="currentColor" strokeWidth="0.5" opacity="0.12"/>
            <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="0.4" opacity="0.08"/>
            <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" strokeWidth="0.4" opacity="0.08"/>
            <circle cx="100" cy="100" r="3" fill="currentColor" opacity="0.2"/>
            <circle cx="160" cy="40" r="3" fill="currentColor" opacity="0.25"/>
            <circle cx="40" cy="160" r="3" fill="currentColor" opacity="0.2"/>
          </svg>
          <div className="ow-hero-badge">
            <span className="ow-badge-num">6</span>
            <span className="ow-badge-label">Core capability<br/>areas</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// SELECTED WORK
const SelectedWork = ({ activeTab, setActiveTab, featured, indexProjects }) => (
  <section className="ow-selected" id="ow-work">
    <div className="ow-container">
      <div className="ow-selected-head">
        <div>
          <p className="ow-eyebrow">SELECTED WORK</p>
          <h2 className="ow-section-h2">Projects That Made an Impact</h2>
          <p className="ow-section-body">
            A selection of events, campaigns, business initiatives and growth projects we've helped bring to life.
          </p>
        </div>
        <Link to="/case-studies" className="ow-view-all">
          View All Work <ArrowRight size={16} />
        </Link>
      </div>
    </div>

    {/* Sticky filter bar */}
    <div className="ow-filter-bar" role="navigation" aria-label="Filter projects by category">
      <div className="ow-container">
        <div className="ow-filter-row">
          {FILTER_CATS.map(cat => (
            <button
              key={cat.id}
              className={`ow-filter-btn${activeTab === cat.id ? ' active' : ''}`}
              onClick={() => setActiveTab(cat.id)}
              aria-pressed={activeTab === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="ow-container">
      {featured.length > 0 ? (
        <div className="ow-proj-list">
          {featured.map((p) => (
            <article key={p.id} className={`ow-proj${p.layout === 'reverse' ? ' ow-proj--rev' : ''}`}>
              <div className="ow-proj-visual">
                <Link to={`/case-studies/${p.slug}`} className="ow-proj-img-wrap">
                  <img src={p.image} alt={p.imageAlt} loading="lazy" />
                  <div className="ow-proj-img-hover">
                    <span>View Project <ArrowUpRight size={14} /></span>
                  </div>
                </Link>
              </div>
              <div className="ow-proj-info">
                <div className="ow-proj-meta">
                  <span className="ow-proj-num">{p.number}</span>
                  <span className="ow-proj-cat-pill">{p.subtitle}</span>
                </div>
                <h3 className="ow-proj-title">{p.title}</h3>
                <p className="ow-proj-client">{p.client} · {p.year}</p>
                <p className="ow-proj-summary">{p.summary}</p>
                <div className="ow-proj-breakdown">
                  <div>
                    <span className="ow-breakdown-lbl">THE CHALLENGE</span>
                    <p>{p.challenge}</p>
                  </div>
                  <div>
                    <span className="ow-breakdown-lbl">THE OUTCOME</span>
                    <p className="ow-outcome">{p.outcome}</p>
                  </div>
                </div>
                <div className="ow-proj-tags">
                  {p.services.map(s => <span key={s} className="ow-tag">{s}</span>)}
                </div>
                <Link to={`/case-studies/${p.slug}`} className="ow-proj-link">
                  VIEW PROJECT <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="ow-empty">
          <p>No projects in this category yet.</p>
          <button onClick={() => setActiveTab('all')} className="ow-btn-ghost-sm">View all work</button>
        </div>
      )}

      {/* Index table for non-featured */}
      {indexProjects.length > 0 && (
        <div className="ow-index">
          <h3 className="ow-index-title">More Projects</h3>
          <div className="ow-index-table" role="list">
            {indexProjects.map(p => (
              <Link to={`/case-studies/${p.slug}`} key={p.id} className="ow-index-row" role="listitem">
                <div className="ow-index-thumb">
                  <img src={p.image} alt={p.imageAlt || p.title} loading="lazy" />
                </div>
                <div className="ow-index-name">{p.title}</div>
                <div className="ow-index-sub">{p.subtitle}</div>
                <div className="ow-index-year">{p.year}</div>
                <div className="ow-index-high">{p.highlight}</div>
                <div className="ow-index-arr"><ArrowRight size={16} /></div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  </section>
);

// SERVICES
const Services = () => (
  <section className="ow-services" id="ow-services">
    <div className="ow-container">
      <div className="ow-services-head">
        <p className="ow-eyebrow">WHAT WE DO</p>
        <h2 className="ow-section-h2">Services</h2>
        <p className="ow-section-body">
          Six core capabilities, each designed to support a different business need. They can work individually or together.
        </p>
      </div>

      <div className="ow-services-grid">
        {SERVICES.map((svc) => (
          <div className="ow-svc-card" key={svc.id}>
            <div className="ow-svc-head">
              <span className="ow-svc-num">{svc.num}</span>
              <h3 className="ow-svc-title">{svc.title}</h3>
            </div>
            <p className="ow-svc-body">{svc.body}</p>
            <ul className="ow-svc-list">
              {svc.items.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ECOSYSTEM
const Ecosystem = () => (
  <section className="ow-ecosystem">
    <div className="ow-container">
      <div className="ow-ecosystem-inner">
        <div className="ow-ecosystem-copy">
          <p className="ow-eyebrow">HOW IT CONNECTS</p>
          <h2 className="ow-section-h2">More Than One Service.</h2>
          <p className="ow-section-body">
            Businesses often need more than one capability at the same time. Our services are designed to work together — so you don't need to coordinate six different companies.
          </p>
        </div>
        <div className="ow-eco-flow">
          {[
            { step: 'Startup Support', sub: 'Register · Position · Launch' },
            { step: 'Business Support', sub: 'Connections · Operations · Partners' },
            { step: 'Brand Promotion', sub: 'Identity · Campaigns · Visibility' },
            { step: 'Creator Connections', sub: 'Discovery · Matching · Execution' },
            { step: 'Event Management', sub: 'Planning · Promotion · Execution' },
            { step: 'Digital Marketing', sub: 'Acquisition · Content · Performance' },
          ].map((item, i, arr) => (
            <React.Fragment key={item.step}>
              <div className="ow-eco-node">
                <span className="ow-eco-n">{String(i + 1).padStart(2, '0')}</span>
                <strong className="ow-eco-name">{item.step}</strong>
                <span className="ow-eco-sub">{item.sub}</span>
              </div>
              {i < arr.length - 1 && <div className="ow-eco-conn" aria-hidden="true" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// STATS
const Stats = () => (
  <section className="ow-stats">
    <div className="ow-container">
      <div className="ow-stats-head">
        <p className="ow-eyebrow">OUR EXPERIENCE</p>
        <h2 className="ow-section-h2">Built Through Real Work.</h2>
      </div>
      <div className="ow-stats-grid">
        {[
          { label: 'Events Managed',      desc: 'End-to-end planning and on-ground execution' },
          { label: 'Brands Promoted',     desc: 'Across digital and physical channels' },
          { label: 'Creators Connected',  desc: 'Matched to the right brand at the right time' },
          { label: 'Startups Supported',  desc: 'From registration to revenue-generating stage' },
          { label: 'Campaigns Delivered', desc: 'Across social, performance and content' },
          { label: 'Businesses Supported',desc: 'Operations, growth and business development' },
        ].map(item => (
          <div className="ow-stat-item" key={item.label}>
            <h3 className="ow-stat-label">{item.label}</h3>
            <p className="ow-stat-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// EVENT SPOTLIGHT
const EventSpotlight = () => (
  <section className="ow-spotlight ow-spotlight--event">
    <div className="ow-container">
      <div className="ow-spotlight-inner">
        <div className="ow-spotlight-img">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85"
            alt="Professional event management and audience"
            loading="lazy"
          />
        </div>
        <div className="ow-spotlight-copy">
          <p className="ow-eyebrow">EVENT MANAGEMENT</p>
          <h2 className="ow-section-h2">From Planning to the Moment It Goes Live.</h2>
          <p className="ow-spotlight-body">
            We manage the moving parts behind successful events — from initial planning and promotion to vendor coordination and on-ground execution.
          </p>
          <ul className="ow-spotlight-list">
            {['Planning', 'Promotion', 'Vendor Coordination', 'Audience Management', 'On-Ground Execution'].map(i => (
              <li key={i}>
                <span className="ow-check" aria-hidden="true">✓</span> {i}
              </li>
            ))}
          </ul>
          <Link to="/services/startup-support" className="ow-btn-outline">
            Explore Event Services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// CREATOR SPOTLIGHT
const CreatorSpotlight = () => (
  <section className="ow-spotlight ow-spotlight--creator">
    <div className="ow-container">
      <div className="ow-spotlight-inner ow-spotlight-inner--rev">
        <div className="ow-spotlight-img">
          <img
            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=85"
            alt="Creator and brand collaboration"
            loading="lazy"
          />
          <div className="ow-spot-badge">
            <span className="ow-spot-badge-icon">✦</span>
            <span>Creator–Brand<br/>Connections</span>
          </div>
        </div>
        <div className="ow-spotlight-copy">
          <p className="ow-eyebrow">CREATOR CONNECTIONS</p>
          <h2 className="ow-section-h2">Connecting Brands With the Right Creators.</h2>
          <p className="ow-spotlight-body">
            We help businesses discover relevant creators, coordinate campaigns and build partnerships that reach the right audience — not just any audience.
          </p>
          <div className="ow-creator-flow">
            {['Brand Objective', 'Creator Selection', 'Campaign Execution', 'Content Distribution', 'Outcome'].map((step, i, arr) => (
              <React.Fragment key={step}>
                <span className="ow-flow-step">{step}</span>
                {i < arr.length - 1 && <span className="ow-flow-arrow" aria-hidden="true">→</span>}
              </React.Fragment>
            ))}
          </div>
          <Link to="/creators" className="ow-btn-outline">
            For Creators <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// TESTIMONIALS — horizontal infinite scroll
const Testimonials = () => <TestimonialsScroll />;

// PROCESS
const Process = () => (
  <section className="ow-process">
    <div className="ow-container">
      <div className="ow-process-head">
        <p className="ow-eyebrow">OUR APPROACH</p>
        <h2 className="ow-section-h2">How We Work</h2>
      </div>
      <div className="ow-process-steps">
        {PROCESS_STEPS.map((step, i) => (
          <div className="ow-process-step" key={step.num}>
            <div className="ow-ps-num">{step.num}</div>
            <div className="ow-ps-line" aria-hidden="true" />
            <h3 className="ow-ps-title">{step.title}</h3>
            <p className="ow-ps-body">{step.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// FINAL CTA
const FinalCTA = () => (
  <section className="ow-final-cta">
    <div className="ow-container">
      <div className="ow-cta-inner">
        <div className="ow-cta-copy">
          <p className="ow-eyebrow" style={{ color: 'rgba(255,255,255,0.5)' }}>LET'S WORK TOGETHER</p>
          <h2 className="ow-cta-h2">Have a business, campaign<br />or event in mind?</h2>
          <p className="ow-cta-body">
            Whether you're launching a startup, building your brand, planning an event or looking to grow digitally — tell us what you need.
          </p>
          <div className="ow-cta-btns">
            <Link to="/contact" className="ow-btn-primary">
              Let's Talk <ArrowRight size={17} />
            </Link>
            <Link to="/services/startup-support" className="ow-cta-ghost">
              Explore Services
            </Link>
          </div>
        </div>
        <div className="ow-cta-visual">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
            alt="Business collaboration and planning"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function CaseStudies() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeTab);

  const featured = filtered.filter(p => p.featured);
  const indexProjects = filtered.filter(p => !p.featured);

  return (
    <div className="ow-page">
      <SEO
        title="Our Work | C-PEB — Events, Brands, Business & Growth"
        description="From events and startup support to creator partnerships, brand promotion and digital marketing — see how C-PEB helps businesses execute, promote and grow."
      />
      <WorkHero />
      <SelectedWork
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        featured={featured}
        indexProjects={indexProjects}
      />
      <Services />
      <Ecosystem />
      <Stats />
      <EventSpotlight />
      <CreatorSpotlight />
      <Testimonials />
      <Process />
      <FinalCTA />
    </div>
  );
}
