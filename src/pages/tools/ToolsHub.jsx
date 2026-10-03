import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, CheckSquare, Calculator, ArrowRight,
  Zap, Target, Users, Gift, ChevronRight, Clock, Sparkles
} from 'lucide-react';
import SEO from '../../components/SEO';
import './Tools.css';

// ─── Tool catalogue — single source of truth ───────────────────────────────
// Extend this array when new tools are added.
const TOOLS = [
  {
    id:          'roi-calculator',
    title:       'Influencer ROI Calculator',
    description: 'Estimate campaign reach, clicks and projected sales from your influencer marketing budget.',
    Icon:        TrendingUp,
    iconBg:      'var(--green-light)',
    iconColor:   'var(--green-dark)',
    category:    'Marketing',
    status:      'popular',       // 'popular' | 'new' | 'soon' | null
    duration:    '3 min',
    isFree:      true,
    route:       '/tools/roi-calculator',
    cta:         'Calculate ROI',
  },
  {
    id:          'funding-checker',
    title:       'Startup Funding Checker',
    description: 'Find out which government schemes, grants and loans your startup is eligible for — in under 5 minutes.',
    Icon:        CheckSquare,
    iconBg:      '#eff6ff',
    iconColor:   '#2563eb',
    category:    'Funding',
    status:      'new',
    duration:    '5 min',
    isFree:      true,
    route:       '/tools/funding-checker',
    cta:         'Check eligibility',
  },
  {
    id:          'budget-planner',
    title:       'Marketing Budget Planner',
    description: 'Allocate ad spend optimally across Instagram, YouTube and Google to maximise ROAS.',
    Icon:        Calculator,
    iconBg:      '#faf5ff',
    iconColor:   '#7c3aed',
    category:    'Planning',
    status:      'soon',
    duration:    '4 min',
    isFree:      true,
    route:       null,
    cta:         'Coming soon',
  },
];

// ─── Why-section items ─────────────────────────────────────────────────────
const WHY_ITEMS = [
  {
    Icon:  Target,
    title: 'Data-driven',
    desc:  'Use real inputs — budget, niche, engagement — instead of generic industry averages.',
  },
  {
    Icon:  Zap,
    title: 'Simple',
    desc:  'Get useful results in minutes, without spreadsheets or an analytics background.',
  },
  {
    Icon:  Users,
    title: 'Creator-focused',
    desc:  'Built around the real decisions brands and creators face on every campaign.',
  },
  {
    Icon:  Gift,
    title: 'Free to start',
    desc:  'No signup required to use our tools. No paywalls on the core features.',
  },
];

// ─── Badge config ──────────────────────────────────────────────────────────
const BADGE_CONFIG = {
  popular: { label: 'Popular',     className: 'th-badge th-badge--popular' },
  new:     { label: 'New',         className: 'th-badge th-badge--new'     },
  soon:    { label: 'Coming Soon', className: 'th-badge th-badge--soon'    },
};

// ─── ToolCard ─────────────────────────────────────────────────────────────
function ToolCard({ tool, index }) {
  const isAvailable = tool.status !== 'soon';
  const badge       = tool.status ? BADGE_CONFIG[tool.status] : null;

  const cardInner = (
    <div className={`th-card ${!isAvailable ? 'th-card--soon' : ''}`} style={{ '--card-i': index }}>

      {/* Top row: icon + badge */}
      <div className="th-card__top">
        <div className="th-card__icon-wrap" style={{ background: tool.iconBg }}>
          <tool.Icon size={22} color={tool.iconColor} aria-hidden="true" />
        </div>
        {badge && (
          <span className={badge.className} aria-label={`Status: ${badge.label}`}>
            {badge.label}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="th-card__body">
        <h3 className="th-card__title">{tool.title}</h3>
        <p className="th-card__desc">{tool.description}</p>
      </div>

      {/* Divider + meta */}
      <div className="th-card__meta-row">
        <span className="th-card__meta">
          <Clock size={13} aria-hidden="true" />
          {tool.duration}
        </span>
        <span className="th-card__meta th-card__meta--free">
          Free
        </span>
      </div>

      {/* CTA */}
      <div className="th-card__footer">
        {isAvailable ? (
          <span className="th-card__cta">
            {tool.cta}
            <ArrowRight size={14} className="th-cta-arrow" aria-hidden="true" />
          </span>
        ) : (
          <span className="th-card__cta th-card__cta--muted">
            Notify me
            <ArrowRight size={14} className="th-cta-arrow" aria-hidden="true" />
          </span>
        )}
      </div>
    </div>
  );

  if (isAvailable && tool.route) {
    return (
      <Link to={tool.route} className="th-card-link" aria-label={`Open ${tool.title}`}>
        {cardInner}
      </Link>
    );
  }

  // Coming soon — link to contact for notifications
  return (
    <Link to="/contact" className="th-card-link" aria-label={`Get notified about ${tool.title}`}>
      {cardInner}
    </Link>
  );
}

// ─── How it works steps ────────────────────────────────────────────────────
const STEPS = [
  { n: '01', title: 'Choose a tool',     desc: 'Select the calculator or checker that matches your goal.' },
  { n: '02', title: 'Enter your details', desc: 'Provide campaign, business or funding information.' },
  { n: '03', title: 'Get your result',   desc: 'Review the estimate, eligibility result or recommendation.' },
];

// ─── Page ─────────────────────────────────────────────────────────────────
export default function ToolsHub() {
  const toolsRef   = useRef(null);
  const howRef     = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="th-page">
      <SEO
        title="Free Tools for Creator Marketing | C-PEB"
        description="Practical calculators and checkers built to help brands, creators and marketers make smarter campaign and funding decisions."
      />

      {/* ══ 1. HERO ═══════════════════════════════════════════════════════ */}
      <section className="th-hero" aria-labelledby="th-hero-heading">
        <div className="th-hero__inner container">
          <p className="section-eyebrow">Free Tools</p>
          <h1 id="th-hero-heading" className="th-hero__heading">
            Free Tools for Smarter<br />
            Creator Marketing
          </h1>
          <p className="th-hero__sub">
            Practical calculators and checkers built to help brands, creators and
            marketers make smarter campaign and funding decisions.
          </p>
          <div className="th-hero__actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => scrollTo(toolsRef)}
              aria-label="Scroll to tools"
            >
              Explore tools <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => scrollTo(howRef)}
              aria-label="Scroll to how it works"
            >
              How it works
            </button>
          </div>
        </div>
      </section>

      {/* ══ 2. TOOL GRID ══════════════════════════════════════════════════ */}
      <section
        className="th-tools-section"
        ref={toolsRef}
        id="tools"
        aria-labelledby="th-tools-heading"
      >
        <div className="container">
          <div className="th-section-header">
            <div>
              <p className="section-eyebrow">Featured Tools</p>
              <h2 id="th-tools-heading" className="th-section-title">
                Start with a tool built for your next decision.
              </h2>
            </div>
            <Link to="/contact" className="th-suggest-link">
              Suggest a tool
              <ChevronRight size={15} aria-hidden="true" />
            </Link>
          </div>

          {/* Grid */}
          <div className="th-grid" role="list" aria-label="Available tools">
            {TOOLS.map((tool, i) => (
              <div key={tool.id} role="listitem">
                <ToolCard tool={tool} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. WHY C-PEB TOOLS ════════════════════════════════════════════ */}
      <section className="th-why-section" aria-labelledby="th-why-heading">
        <div className="container">
          <div className="th-why-inner">
            <div className="th-why-left">
              <p className="section-eyebrow">Why use C-PEB tools</p>
              <h2 id="th-why-heading" className="th-section-title">
                Tools built for<br />practical decisions.
              </h2>
              <p className="th-why-sub">
                We build every tool around a real question that creators, brands and
                marketers actually face — not hypothetical use cases.
              </p>
              <Link to="/tools/roi-calculator" className="btn btn-primary">
                Try ROI Calculator <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <ul className="th-why-grid" aria-label="Benefits">
              {WHY_ITEMS.map(({ Icon, title, desc }) => (
                <li key={title} className="th-why-item">
                  <div className="th-why-icon" aria-hidden="true">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="th-why-title">{title}</h3>
                    <p className="th-why-desc">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ 4. HOW IT WORKS ═══════════════════════════════════════════════ */}
      <section
        className="th-how-section"
        ref={howRef}
        id="how-it-works"
        aria-labelledby="th-how-heading"
      >
        <div className="container">
          <div className="th-how-header">
            <p className="section-eyebrow">How it works</p>
            <h2 id="th-how-heading" className="th-section-title">Three steps to your answer.</h2>
          </div>

          <ol className="th-steps" aria-label="Steps to use a tool">
            {STEPS.map((step, i) => (
              <li key={step.n} className="th-step">
                <span className="th-step__num" aria-hidden="true">{step.n}</span>
                {i < STEPS.length - 1 && (
                  <span className="th-step__connector" aria-hidden="true" />
                )}
                <div className="th-step__content">
                  <h3 className="th-step__title">{step.title}</h3>
                  <p className="th-step__desc">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══ 5. COMING SOON STRIP ══════════════════════════════════════════ */}
      <section className="th-upcoming-section" aria-labelledby="th-upcoming-heading">
        <div className="container">
          <div className="th-upcoming-inner">
            <div className="th-upcoming-left">
              <span className="th-upcoming-label">
                <Sparkles size={14} aria-hidden="true" /> In development
              </span>
              <h2 id="th-upcoming-heading" className="th-upcoming-title">
                More tools on the way.
              </h2>
              <p className="th-upcoming-sub">
                We're building a Marketing Budget Planner, Creator Outreach Tracker and
                more. Tell us which tool would help you most.
              </p>
              <Link to="/contact" className="btn btn-primary">
                Request a tool <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <ul className="th-upcoming-list" aria-label="Upcoming tools">
              {['Marketing Budget Planner', 'Creator Outreach Tracker', 'Brand Collab Estimator', 'Campaign Timeline Builder'].map(name => (
                <li key={name} className="th-upcoming-item">
                  <span className="th-upcoming-dot" aria-hidden="true" />
                  {name}
                  <span className="th-upcoming-soon">Soon</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ 6. FINAL CTA ══════════════════════════════════════════════════ */}
      <section className="th-cta-section" aria-labelledby="th-cta-heading">
        <div className="container">
          <div className="th-cta-inner">
            <h2 id="th-cta-heading" className="th-cta-title">
              Ready to make a smarter decision?
            </h2>
            <p className="th-cta-sub">
              Explore C-PEB tools built for the creator economy.
            </p>
            <div className="th-cta-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => scrollTo(toolsRef)}
                aria-label="Scroll to tools"
              >
                Explore all tools <ArrowRight size={16} aria-hidden="true" />
              </button>
              <Link to="/contact" className="btn btn-secondary btn-lg">
                Talk to our team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
