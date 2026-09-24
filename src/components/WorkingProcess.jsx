import React, { useState } from 'react';
import './WorkingProcess.css';
import { Search, BarChart2, Link2, LayoutDashboard, CheckCircle2, ArrowRight, Users, Star, TrendingUp } from 'lucide-react';

const steps = [
  {
    num: '01',
    id: 'find',
    icon: <Search size={16} />,
    label: 'Find',
    title: 'Discover the Perfect Creators',
    desc: 'Filter through thousands of verified creators by niche, audience size, engagement rate, and past performance — in seconds.',
    bullets: [
      'Advanced audience demographic filters',
      'Fake follower & authenticity scoring',
    ],
    btnLabel: 'Start Searching',
    visual: 'find',
  },
  {
    num: '02',
    id: 'analyze',
    icon: <BarChart2 size={16} />,
    label: 'Analyze',
    title: 'Analyze the Perfect Fit',
    desc: 'Dive deep into creator analytics before you commit. Understand their audience, engagement, and reach to make sure your brand reaches the right people.',
    bullets: [
      'Audience quality & engagement analysis',
      'Authenticity and reach indicators',
    ],
    btnLabel: 'Analyze Influencer',
    visual: 'analyze',
  },
  {
    num: '03',
    id: 'connect',
    icon: <Link2 size={16} />,
    label: 'Connect',
    title: 'Seamless Outreach & Negotiation',
    desc: 'Reach out directly through the platform. Manage contracts, negotiate rates, and align on deliverables without leaving the dashboard.',
    bullets: [
      'Automated contract generation',
      'In-app messaging and file sharing',
    ],
    btnLabel: 'Connect Now',
    visual: 'connect',
  },
  {
    num: '04',
    id: 'manage',
    icon: <LayoutDashboard size={16} />,
    label: 'Manage',
    title: 'Track Campaigns in Real-Time',
    desc: 'Monitor content approvals, track live campaign metrics, and measure ROI — all from one centralized command center.',
    bullets: [
      'Live performance tracking links',
      'Automated campaign reporting',
    ],
    btnLabel: 'Manage Campaigns',
    visual: 'manage',
  },
];

/* ── Per-step analytics visualizations ── */
const VisualFind = () => (
  <div className="wp-visual-card">
    <div className="wp-visual-label">Creator Discovery</div>
    <div className="wp-find-list">
      {[
        { name: 'Shreya Jain',    cat: 'Beauty',   eng: '4.8%', score: 92, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
        { name: 'Ujjwal Gamer',   cat: 'Gaming',   eng: '7.1%', score: 88, img: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80' },
        { name: 'Kritika Khurana',cat: 'Fashion',  eng: '3.5%', score: 85, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80' },
      ].map((c, i) => (
        <div className="wp-find-row" key={i}>
          <img src={c.img} alt={c.name} className="wp-find-avatar" />
          <div className="wp-find-info">
            <span className="wp-find-name">{c.name}</span>
            <span className="wp-find-cat">{c.cat}</span>
          </div>
          <div className="wp-find-meta">
            <span className="wp-find-eng">{c.eng} eng.</span>
            <div className="wp-find-score-bar">
              <div style={{ width: `${c.score}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="wp-visual-footer">
      <span className="wp-visual-tag"><Search size={11} /> 14,205 creators indexed</span>
    </div>
  </div>
);

const VisualAnalyze = () => (
  <div className="wp-visual-card">
    <div className="wp-visual-label">Creator Analysis</div>
    <div className="wp-analyze-profile">
      <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80" alt="creator" className="wp-analyze-avatar" />
      <div>
        <div className="wp-analyze-name">Malvika Sitlani</div>
        <div className="wp-analyze-niche">Luxury Beauty · Instagram</div>
      </div>
      <div className="wp-analyze-badge">Verified ✓</div>
    </div>
    <div className="wp-analyze-metrics">
      {[
        { label: 'Engagement', value: '5.2%', good: true },
        { label: 'Audience Auth.', value: '94%', good: true },
        { label: 'Reach', value: '890K', good: true },
      ].map((m, i) => (
        <div className="wp-metric-row" key={i}>
          <span className="wp-metric-label">{m.label}</span>
          <div className="wp-metric-bar-wrap">
            <div className="wp-metric-bar" style={{ width: m.label === 'Reach' ? '68%' : m.value }} />
          </div>
          <span className={`wp-metric-val ${m.good ? 'good' : ''}`}>{m.value}</span>
        </div>
      ))}
    </div>
    <div className="wp-analyze-demo">
      <span className="wp-demo-label">Audience</span>
      <div className="wp-demo-bars">
        {[{ seg: '18–24', w: 38 }, { seg: '25–34', w: 29 }, { seg: '35+', w: 33 }].map((d, i) => (
          <div className="wp-demo-item" key={i}>
            <span>{d.seg}</span>
            <div className="wp-demo-bar"><div style={{ width: `${d.w}%` }} /></div>
            <span>{d.w}%</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const VisualConnect = () => (
  <div className="wp-visual-card">
    <div className="wp-visual-label">Outreach Hub</div>
    <div className="wp-connect-thread">
      <div className="wp-msg wp-msg-brand">
        <div className="wp-msg-bubble">Hi! We'd love to partner on our Q4 launch. Your audience aligns perfectly.</div>
        <span className="wp-msg-time">10:12 AM</span>
      </div>
      <div className="wp-msg wp-msg-creator">
        <div className="wp-msg-bubble">Sounds great! What deliverables do you have in mind?</div>
        <span className="wp-msg-time">10:34 AM</span>
      </div>
      <div className="wp-msg wp-msg-brand">
        <div className="wp-msg-bubble">2 Reels + 1 Story set. Contract attached. ✅</div>
        <span className="wp-msg-time">10:41 AM</span>
      </div>
    </div>
    <div className="wp-visual-footer">
      <span className="wp-visual-tag"><Users size={11} /> 92% response rate · avg 4 hr reply</span>
    </div>
  </div>
);

const VisualManage = () => (
  <div className="wp-visual-card">
    <div className="wp-visual-label">Campaign Dashboard</div>
    <div className="wp-manage-stats">
      {[
        { label: 'Total Reach', value: '4.2M' },
        { label: 'Conversions', value: '3,840' },
        { label: 'ROI', value: '3.4×' },
      ].map((s, i) => (
        <div className="wp-manage-stat" key={i}>
          <span className="wp-manage-val">{s.value}</span>
          <span className="wp-manage-lbl">{s.label}</span>
        </div>
      ))}
    </div>
    <div className="wp-manage-chart">
      {[35, 52, 44, 68, 55, 78, 90].map((h, i) => (
        <div className="wp-bar-wrap" key={i}>
          <div className={`wp-bar ${i === 6 ? 'wp-bar-accent' : ''}`} style={{ height: `${h}%` }} />
        </div>
      ))}
    </div>
    <div className="wp-visual-footer">
      <span className="wp-visual-tag"><TrendingUp size={11} /> 12 active campaigns · updated live</span>
    </div>
  </div>
);

const visuals = { find: <VisualFind />, analyze: <VisualAnalyze />, connect: <VisualConnect />, manage: <VisualManage /> };

const WorkingProcess = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [animating, setAnimating] = useState(false);

  const handleStep = (idx) => {
    if (idx === activeStep) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveStep(idx);
      setAnimating(false);
    }, 180);
  };

  const current = steps[activeStep];

  return (
    <section className="process-section">
      <div className="container">

        {/* Heading */}
        <div className="process-head">
          <p className="section-eyebrow">Working Process</p>
          <h2>Influencer Working Process</h2>
        </div>

        {/* Step navigator */}
        <div className="process-nav">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <button
                className={`process-step-btn ${activeStep === idx ? 'active' : ''}`}
                onClick={() => handleStep(idx)}
              >
                <span className="process-step-num">{step.num}</span>
                <span className="process-step-icon">{step.icon}</span>
                <span className="process-step-label">{step.label}</span>
                <span className="process-step-line" />
              </button>
              {idx < steps.length - 1 && <div className="process-connector" />}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div className={`process-body ${animating ? 'wp-fade-out' : 'wp-fade-in'}`}>

          {/* Left */}
          <div className="process-info">
            <h3 className="process-step-title">{current.title}</h3>
            <p className="process-desc">{current.desc}</p>
            <ul className="process-bullets">
              {current.bullets.map((b, i) => (
                <li key={i}>
                  <CheckCircle2 size={15} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <button className="btn btn-primary">
              {current.btnLabel} <ArrowRight size={15} />
            </button>
          </div>

          {/* Right */}
          <div className="process-visual">
            <div className="wp-visual-grid-bg" aria-hidden="true" />
            {visuals[current.visual]}
          </div>

        </div>

      </div>
    </section>
  );
};

export default WorkingProcess;
