import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Search,
  BarChart3,
  Megaphone,
  Share2,
  FileText,
  TrendingUp,
  Globe,
  Layers,
  Target,
  Zap,
  LineChart,
  MousePointerClick,
  Activity,
  SendHorizonal,
  CheckCircle,
} from 'lucide-react';
import SEO from '../components/SEO';
import './DigitalMarketing.css';

/* ═══════════════════════════════════
   DATA
═══════════════════════════════════ */

const SERVICES = [
  {
    id: 'seo',
    num: '01',
    icon: <Search size={24} />,
    title: 'Search Engine Optimisation (SEO)',
    desc:
      'Improve how your business appears in search results — technically, structurally, and in terms of content. Good SEO brings relevant visitors to your website without ongoing advertising spend.',
    points: [
      'Technical SEO audits and issue resolution',
      'Keyword research and search intent analysis',
      'On-page optimisation and heading structure',
      'Content structure and readability improvements',
      'Website performance and crawlability',
      'Local SEO for location-based businesses',
      'Ongoing search performance monitoring',
    ],
    cta: 'Get an SEO Quote',
    ctaTo: '#get-a-quote',
    visual: [
      { icon: <Search size={15} />, label: 'Technical audit review' },
      { icon: <Target size={15} />, label: 'Keyword & intent mapping' },
      { icon: <FileText size={15} />, label: 'On-page content structure' },
      { icon: <Activity size={15} />, label: 'Search performance tracking' },
    ],
  },
  {
    id: 'paid',
    num: '02',
    icon: <Target size={24} />,
    title: 'Search & Social Media Advertising',
    desc:
      'Reach people who are actively looking for what you offer, or build awareness with precisely targeted audiences. We set up, manage, and optimise campaigns across Google and Meta.',
    points: [
      'Google Ads search and display campaign management',
      'Meta advertising across Facebook and Instagram',
      'Audience targeting and segmentation',
      'Campaign and landing page alignment',
      'Conversion tracking and event setup',
      'Budget monitoring and performance optimisation',
    ],
    cta: 'Get a Paid Campaign Quote',
    ctaTo: '#get-a-quote',
    visual: [
      { icon: <Globe size={15} />, label: 'Google Search campaigns' },
      { icon: <Share2 size={15} />, label: 'Meta advertising' },
      { icon: <MousePointerClick size={15} />, label: 'Conversion tracking' },
      { icon: <BarChart3 size={15} />, label: 'Budget & ROAS monitoring' },
    ],
  },
  {
    id: 'social',
    num: '03',
    icon: <Share2 size={24} />,
    title: 'Social Media Marketing',
    desc:
      'Build a consistent, professional presence on the platforms where your audience spends time. We help with strategy, content planning, and performance reporting.',
    points: [
      'Social media strategy aligned to business goals',
      'Content planning and publishing calendars',
      'Brand voice and visual consistency',
      'Audience engagement and community management',
      'Campaign performance reporting',
    ],
    cta: 'Get a Social Media Quote',
    ctaTo: '#get-a-quote',
    visual: [
      { icon: <Share2 size={15} />, label: 'Platform strategy' },
      { icon: <FileText size={15} />, label: 'Content calendar' },
      { icon: <Zap size={15} />, label: 'Audience engagement' },
      { icon: <BarChart3 size={15} />, label: 'Performance reporting' },
    ],
  },
  {
    id: 'content',
    num: '04',
    icon: <FileText size={24} />,
    title: 'Content & Brand Communication',
    desc:
      'Clear, purposeful writing that supports your business goals — whether that is improving search visibility, explaining your services, or communicating consistently across touchpoints.',
    points: [
      'Website copy and landing page content',
      'Campaign messaging and communication frameworks',
      'SEO-oriented content planning and writing',
      'Social media content for key channels',
      'Consistent messaging across customer touchpoints',
    ],
    cta: 'Get a Content Strategy Quote',
    ctaTo: '#get-a-quote',
    visual: [
      { icon: <FileText size={15} />, label: 'Website & landing page copy' },
      { icon: <Target size={15} />, label: 'SEO-oriented content' },
      { icon: <Megaphone size={15} />, label: 'Campaign messaging' },
      { icon: <Layers size={15} />, label: 'Multi-channel consistency' },
    ],
  },
  {
    id: 'analytics',
    num: '05',
    icon: <BarChart3 size={24} />,
    title: 'Performance Analytics & Conversion Optimisation',
    desc:
      'Understand what is and is not working across your digital channels. We configure measurement, interpret available data, and make informed adjustments to improve results over time.',
    points: [
      'Campaign tracking and analytics configuration',
      'Conversion measurement and goal setup',
      'Landing page improvement and testing',
      'User journey analysis',
      'Data-informed campaign adjustments',
    ],
    cta: 'Get an Analytics Quote',
    ctaTo: '#get-a-quote',
    visual: [
      { icon: <LineChart size={15} />, label: 'Analytics configuration' },
      { icon: <MousePointerClick size={15} />, label: 'Conversion measurement' },
      { icon: <TrendingUp size={15} />, label: 'User journey analysis' },
      { icon: <Activity size={15} />, label: 'Ongoing optimisation' },
    ],
  },
];

const CONNECTED = [
  {
    icon: <Globe size={20} />,
    title: 'Web Development',
    desc: 'Business websites, landing pages, and web applications built for performance and results.',
    link: '/services/business-services',
    linkLabel: 'View Web Services',
    active: false,
  },
  {
    icon: <Layers size={20} />,
    title: 'UI/UX Design',
    desc: 'User-centred interface design, navigation, and digital experiences that convert.',
    link: '/services/startup-support',
    linkLabel: 'View Design Services',
    active: false,
  },
  {
    icon: <Search size={20} />,
    title: 'SEO',
    desc: 'Technical foundations, search-friendly structure, and content that improves visibility over time.',
    link: '/contact',
    linkLabel: 'Discuss SEO',
    active: false,
  },
  {
    icon: <Megaphone size={20} />,
    title: 'Tech Solutions',
    desc: 'Campaign strategy, social media, paid advertising, content, and performance measurement.',
    link: '/services/digital-marketing',
    linkLabel: 'Current page',
    active: true,
  },
];

const PROCESS = [
  {
    num: '01',
    title: 'Understand',
    desc: 'We learn about your business, audience, current digital presence, and what outcomes matter most to you.',
  },
  {
    num: '02',
    title: 'Plan',
    desc: 'We define the right channels, priorities, campaign structure, content requirements, and measurement approach.',
  },
  {
    num: '03',
    title: 'Execute',
    desc: 'We implement the agreed strategy across relevant channels, coordinating with design or development work where needed.',
  },
  {
    num: '04',
    title: 'Measure & Improve',
    desc: 'We review performance data, identify what can be improved, and refine the approach based on real results.',
  },
];

const WHY = [
  {
    icon: <Target size={18} />,
    title: 'Business-focused from the start',
    desc: 'We plan around your specific business objectives, not generic digital marketing activities.',
  },
  {
    icon: <Layers size={18} />,
    title: 'Connected across design, development & marketing',
    desc: 'Our team can coordinate SEO, content, advertising, and website work together rather than as separate efforts.',
  },
  {
    icon: <FileText size={18} />,
    title: 'Clear communication about scope and priorities',
    desc: 'You understand what is being done, why it is being done, and what to expect at each stage.',
  },
  {
    icon: <BarChart3 size={18} />,
    title: 'Decisions informed by available data',
    desc: 'We use performance data to guide adjustments rather than making changes based on assumptions.',
  },
  {
    icon: <TrendingUp size={18} />,
    title: 'An approach that evolves with your business',
    desc: 'Your digital marketing strategy can grow and shift as your business priorities develop over time.',
  },
];

const FAQS = [
  {
    q: "What does C-PEB's digital marketing service include?",
    a: "Our digital marketing service covers search engine optimisation (SEO), search and social media advertising (Google Ads, Meta), social media marketing, content and brand communication, and performance analytics. We work across whichever combination of these areas is most relevant for your business.",
  },
  {
    q: 'Can digital marketing be combined with website development?',
    a: "Yes, and in most cases it works better that way. Marketing campaigns perform more effectively when the underlying website is well-structured, fast, and designed to convert. C-PEB offers both digital marketing and web development, so these can be coordinated as part of the same engagement.",
  },
  {
    q: 'Do you provide SEO and paid advertising?',
    a: "We provide both. SEO improves your organic visibility in search results over time. Paid advertising — through Google Ads and Meta — can generate traffic more immediately. Many businesses benefit from running both together: paid campaigns while SEO builds longer-term momentum.",
  },
  {
    q: 'How do you measure campaign performance?',
    a: "We configure tracking and analytics to measure the outcomes that matter to your business — website enquiries, contact form submissions, calls, or purchases. We use this data to understand what is working, report on progress, and make informed adjustments to improve results.",
  },
  {
    q: 'Can you work with an existing website?',
    a: "Yes. Most of our digital marketing work starts with an existing website. We review the technical setup, content structure, and performance of the current site and recommend improvements where they would meaningfully support your marketing goals.",
  },
  {
    q: 'How can a business get started with C-PEB?',
    a: "The simplest way is to get in touch via our contact page. Tell us about your business, what you are currently doing online, and what you are trying to achieve. We will discuss the right approach for your situation and outline how we can help.",
  },
];

/* ═══════════════════════════════════
   GET A QUOTE FORM
═══════════════════════════════════ */
const SERVICES_OPTIONS = [
  'Search Engine Optimisation (SEO)',
  'Google Ads / Paid Search',
  'Meta Advertising (Facebook & Instagram)',
  'Social Media Marketing',
  'Content & Brand Communication',
  'Performance Analytics',
  'Full Digital Marketing Package',
  'Not sure — need guidance',
];

const QuoteForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrorMsg('Please enter your full name.');
      setStatus('error');
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        requirement: `[Digital Marketing Quote] Service: ${form.service || 'General Inquiry'} | Message: ${form.message.trim() || 'No additional notes provided.'}`,
        source: 'Digital Marketing Quote Form',
      };
      const res = await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Submission failed. Please try again.');
      }
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again or reach out directly at office@cpebindiait.com.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="dm-quote-success">
        <div className="dm-quote-success-icon">
          <CheckCircle size={40} />
        </div>
        <h3>Quote Request Received</h3>
        <p>
          Thank you, <strong>{form.name}</strong>. We've received your enquiry and our team
          will follow up with you at <strong>{form.email}</strong> within one business day.
        </p>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setStatus('idle');
            setForm({ name: '', email: '', phone: '', company: '', service: '', message: '' });
          }}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form className="dm-quote-form" onSubmit={handleSubmit} noValidate>
      <div className="dm-qf-row">
        <div className="dm-qf-group">
          <label htmlFor="qf-name">Full Name <span aria-hidden="true">*</span></label>
          <input
            id="qf-name"
            type="text"
            required
            autoComplete="name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>
        <div className="dm-qf-group">
          <label htmlFor="qf-company">Business / Company</label>
          <input
            id="qf-company"
            type="text"
            autoComplete="organization"
            placeholder="Acme Ltd"
            value={form.company}
            onChange={(e) => update('company', e.target.value)}
          />
        </div>
      </div>

      <div className="dm-qf-row">
        <div className="dm-qf-group">
          <label htmlFor="qf-email">Email Address <span aria-hidden="true">*</span></label>
          <input
            id="qf-email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@example.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        <div className="dm-qf-group">
          <label htmlFor="qf-phone">Phone Number</label>
          <input
            id="qf-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>
      </div>

      <div className="dm-qf-group">
        <label htmlFor="qf-service">Service You're Interested In</label>
        <select
          id="qf-service"
          value={form.service}
          onChange={(e) => update('service', e.target.value)}
        >
          <option value="">Select a service…</option>
          {SERVICES_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="dm-qf-group">
        <label htmlFor="qf-message">Tell us about your project</label>
        <textarea
          id="qf-message"
          rows={4}
          placeholder="Describe your business, current challenges, and what you want to achieve…"
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
        />
      </div>

      {status === 'error' && (
        <div className="dm-qf-error" role="alert">
          ⚠️ {errorMsg}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary btn-lg dm-qf-submit"
        disabled={status === 'loading'}
        id="dm-quote-submit-btn"
      >
        {status === 'loading' ? 'Sending Request…' : <><span>Get Your Free Quote</span> <SendHorizonal size={18} /></>}
      </button>

      <p className="dm-qf-note">
        We'll respond within one business day. No commitments or long-term contracts.
      </p>
    </form>
  );
};

/* ═══════════════════════════════════
   FAQ ITEM COMPONENT
═══════════════════════════════════ */
const FAQItem = ({ faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`dm-faq-item${open ? ' open' : ''}`}>
      <button
        className="dm-faq-btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{faq.q}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <p className="dm-faq-answer">{faq.a}</p>}
    </div>
  );
};

/* ═══════════════════════════════════
   HERO VISUAL — marketing metrics card
═══════════════════════════════════ */
const HeroVisual = () => (
  <div className="dm-hero-visual" aria-hidden="true">
    {/* Floating chips */}
    <div className="dm-float-chip dm-fc-1">
      <Search size={14} /> Organic Search
    </div>
    <div className="dm-float-chip dm-fc-2">
      <TrendingUp size={14} /> Campaign Live
    </div>
    <div className="dm-float-chip dm-fc-3">
      <Target size={14} /> Audience Matched
    </div>
    <div className="dm-float-chip dm-fc-4">
      <BarChart3 size={14} /> Conversions Tracked
    </div>

    {/* Main card */}
    <div className="dm-visual-card">
      <div className="dm-visual-header">
        <span className="dm-visual-title">Channel Performance</span>
        <span className="dm-visual-badge">
          <span className="dm-visual-badge-dot" /> Active
        </span>
      </div>

      <div className="dm-visual-metrics">
        {[
          { label: 'Organic Search', pct: 72 },
          { label: 'Paid Search', pct: 58 },
          { label: 'Social Media', pct: 45 },
          { label: 'Direct', pct: 31 },
        ].map(({ label, pct }) => (
          <div className="dm-metric-row" key={label}>
            <span className="dm-metric-label">{label}</span>
            <div className="dm-metric-bar-wrap">
              <div className="dm-metric-bar" style={{ width: `${pct}%` }} />
            </div>
            <span className="dm-metric-val">{pct}%</span>
          </div>
        ))}
      </div>

      <div className="dm-visual-channels">
        {['Google', 'Meta', 'SEO', 'Content', 'Analytics'].map((ch) => (
          <span className="dm-channel-pill" key={ch}>{ch}</span>
        ))}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════
   PAGE
═══════════════════════════════════ */
export default function DigitalMarketing() {
  return (
    <div className="dm-page">
      <SEO
        title="Tech Solutions Services | C-PEB"
        description="Build your digital presence with search visibility, targeted campaigns, content strategy, and performance analytics. C-PEB connects SEO, advertising, social media and web development into a coordinated approach for your business."
      />

      {/* ── HERO ── */}
      <section className="dm-hero">
        <div className="dm-hero-container">

          {/* Left copy */}
          <div className="dm-hero-copy">
            {/* Breadcrumb */}
            <nav className="dm-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="dm-breadcrumb-sep">›</span>
              <span>Services</span>
              <span className="dm-breadcrumb-sep">›</span>
              <span className="dm-breadcrumb-current">Tech Solutions</span>
            </nav>

            <p className="dm-hero-eyebrow">Tech Solutions</p>

            <h1 className="dm-hero-h1">
              Tech Solutions Built Around{' '}
              <span className="dm-h1-accent">Your Business Goals</span>
            </h1>

            <p className="dm-hero-lead">
              Bring your brand in front of the right audience with a connected
              digital strategy built around search visibility, engaging content,
              targeted campaigns, and measurable performance.
            </p>

            <div className="dm-hero-actions">
              <a href="#get-a-quote" className="btn btn-primary btn-lg" id="dm-hero-cta-primary">
                Get a Free Quote <ArrowRight size={18} />
              </a>
              <Link to="/contact" className="btn btn-secondary btn-lg" id="dm-hero-cta-secondary">
                Explore Services
              </Link>
            </div>

            <div className="dm-hero-trust">
              {[
                { icon: <Search size={18} />, title: 'SEO', sub: 'Organic visibility' },
                { icon: <Target size={18} />, title: 'Paid Campaigns', sub: 'Google & Meta' },
                { icon: <BarChart3 size={18} />, title: 'Analytics', sub: 'Measurable results' },
              ].map(({ icon, title, sub }) => (
                <div className="dm-trust-item" key={title}>
                  <div className="dm-trust-icon">{icon}</div>
                  <div className="dm-trust-text">
                    <strong>{title}</strong>
                    <span>{sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <HeroVisual />
        </div>
      </section>

      {/* ── INTRODUCTION ── */}
      <section className="dm-section">
        <div className="container">
          <div className="dm-section-head">
            <p className="section-eyebrow">Our Approach</p>
            <h2>Marketing That Connects Every Part of Your Digital Presence</h2>
            <p>
              Search visibility, content, website experience, paid campaigns, and
              measurement each support a different stage of the customer journey.
              We connect these elements into a coordinated approach rather than
              treating them as separate activities.
            </p>
          </div>

          <div className="dm-intro-grid">
            {[
              {
                icon: <Target size={22} />,
                num: '01',
                title: 'Reach the right audience',
                desc: 'Appear in front of people who are actively searching for what you offer, or build awareness with precisely targeted campaigns.',
              },
              {
                icon: <MousePointerClick size={22} />,
                num: '02',
                title: 'Turn traffic into enquiries',
                desc: 'Relevant traffic only creates value when your website and messaging are set up to convert visitors into genuine leads.',
              },
              {
                icon: <LineChart size={22} />,
                num: '03',
                title: 'Measure and improve over time',
                desc: 'Understand what is working, make informed adjustments, and build on results rather than repeating activity that does not perform.',
              },
            ].map(({ icon, num, title, desc }) => (
              <div className="dm-intro-card" key={num}>
                <div className="dm-intro-icon">{icon}</div>
                <span className="dm-intro-num">{num}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="dm-section dm-section--alt" id="services">
        <div className="container">
          <div className="dm-section-head">
            <p className="section-eyebrow">Services</p>
            <h2>Tech Solutions Services</h2>
            <p>
              From improving organic visibility to managing targeted campaigns, we
              help businesses build a more consistent and measurable digital
              presence.
            </p>
          </div>

          <div className="dm-services-list">
            {SERVICES.map((svc, i) => (
              <div
                className={`dm-service-block${i % 2 !== 0 ? ' dm-service-block--reversed' : ''}`}
                key={svc.id}
                id={`service-${svc.id}`}
              >
                {/* Content */}
                <div className="dm-service-content">
                  <span className="dm-service-number">{svc.num}</span>
                  <div className="dm-service-icon-wrap">{svc.icon}</div>
                  <h3>{svc.title}</h3>
                  <p>{svc.desc}</p>
                  <ul className="dm-service-points" aria-label={`${svc.title} details`}>
                    {svc.points.map((pt) => (
                      <li key={pt}>
                        <CheckCircle2 size={14} aria-hidden="true" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  {svc.ctaTo.startsWith('#') ? (
                    <a href={svc.ctaTo} className="btn btn-primary" id={`dm-svc-cta-${svc.id}`}>
                      {svc.cta} <ArrowRight size={16} />
                    </a>
                  ) : (
                    <Link to={svc.ctaTo} className="btn btn-primary" id={`dm-svc-cta-${svc.id}`}>
                      {svc.cta} <ArrowRight size={16} />
                    </Link>
                  )}
                </div>

                {/* Visual panel */}
                <div className="dm-service-visual" aria-hidden="true">
                  <div className="dm-svc-vis-header">{svc.title}</div>
                  <div className="dm-svc-vis-items">
                    {svc.visual.map(({ icon: vIcon, label }) => (
                      <div className="dm-svc-vis-item" key={label}>
                        {vIcon}
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONNECTED SERVICES ── */}
      <section className="dm-section">
        <div className="container">
          <div className="dm-section-head">
            <p className="section-eyebrow">Connected Services</p>
            <h2>Everything Your Digital Presence Needs to Work Together</h2>
            <p>
              Effective marketing depends on the quality of the digital experience
              behind each campaign. C-PEB offers the services that need to work
              together.
            </p>
          </div>

          <div className="dm-connected-grid">
            {CONNECTED.map(({ icon, title, desc, link, linkLabel, active }) => (
              <Link
                to={link}
                className={`dm-connected-card${active ? ' dm-connected-card--active' : ''}`}
                key={title}
                aria-current={active ? 'page' : undefined}
              >
                <div className="dm-connected-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <span className="dm-connected-link">
                  {linkLabel} <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE WORK ── */}
      <section className="dm-section dm-section--alt">
        <div className="container">
          <div className="dm-section-head">
            <p className="section-eyebrow">How We Work</p>
            <h2>A Clear Process From Planning to Performance</h2>
            <p>
              We follow a structured approach that begins with understanding your
              business and ends with measurable, improving results.
            </p>
          </div>

          <div className="dm-process-grid">
            {PROCESS.map(({ num, title, desc }) => (
              <div className="dm-process-step" key={num}>
                <div className="dm-process-num-wrap">
                  <span className="dm-process-num">{num}</span>
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY C-PEB ── */}
      <section className="dm-section">
        <div className="container">
          <div className="dm-why-layout">
            <div className="dm-why-left">
              <p className="section-eyebrow">Why C-PEB</p>
              <h2>A Practical, Connected Approach to Digital Growth</h2>
              <p>
                We work with businesses that want digital marketing to connect
                meaningfully to their business outcomes — not just generate
                activity reports.
              </p>
            </div>

            <div className="dm-why-benefits">
              {WHY.map(({ icon, title, desc }) => (
                <div className="dm-why-item" key={title}>
                  <div className="dm-why-icon">{icon}</div>
                  <div className="dm-why-text">
                    <h4>{title}</h4>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GET A QUOTE ── */}
      <section className="dm-section" id="get-a-quote">
        <div className="container">
          <div className="dm-quote-layout">
            {/* Left copy */}
            <div className="dm-quote-copy">
              <p className="section-eyebrow">Get a Quote</p>
              <h2>Tell Us About Your Project</h2>
              <p>
                Fill in the form with your business details and what you're looking
                to achieve. We'll review your requirements and follow up with a
                tailored response — no automated responses, no commitments.
              </p>
              <ul className="dm-quote-promises">
                {[
                  'Response within one business day',
                  'No long-term contracts required',
                  'Honest guidance on what will work for you',
                  'Combined design, SEO & marketing options available',
                ].map((pt) => (
                  <li key={pt}>
                    <CheckCircle2 size={15} aria-hidden="true" />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="dm-quote-contact-alt">
                <span>Prefer to email directly?</span>
                <a href="mailto:office@cpebindiait.com" className="dm-quote-email-link">
                  office@cpebindiait.com
                </a>
              </div>
            </div>

            {/* Right form */}
            <div className="dm-quote-form-wrap">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="dm-section dm-section--alt" id="faq">
        <div className="container">
          <div className="dm-faq-layout">
            <div className="dm-faq-left">
              <p className="section-eyebrow">FAQ</p>
              <h2>Frequently Asked Questions</h2>
              <p>
                Answers to questions we commonly hear from businesses considering
                digital marketing.
              </p>
              <Link to="/contact" className="btn btn-primary" id="dm-faq-contact-btn">
                Ask a Question <ArrowRight size={16} />
              </Link>
            </div>

            <div className="dm-faq-list" role="list">
              {FAQS.map((faq) => (
                <FAQItem key={faq.q} faq={faq} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="dm-cta-section">
        <div className="container">
          <div className="dm-cta-inner">
            <div className="dm-cta-copy">
              <h2>Let's Discuss Your Next Digital Project</h2>
              <p>
                Tell us about your business, your current challenges, and what you
                want to achieve. We can discuss the right combination of design,
                development, SEO, and digital marketing for your requirements.
              </p>
            </div>
            <div className="dm-cta-actions">
              <a href="#get-a-quote" className="btn btn-primary btn-lg" id="dm-cta-primary">
                Get Your Free Quote <ArrowRight size={18} />
              </a>
              <Link to="/contact" className="btn btn-secondary btn-lg" id="dm-cta-secondary">
                Contact Us Directly
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
