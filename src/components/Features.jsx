import React from 'react';
import './Features.css';
import { Target, Zap, Shield, HeartHandshake } from 'lucide-react';

const features = [
  {
    icon: <Target size={22} />,
    title: 'Precision Matching',
    desc: 'Our algorithm connects brands with creators whose audience, tone, and content style genuinely align — no guesswork.',
  },
  {
    icon: <Zap size={22} />,
    title: 'Real-Time Analytics',
    desc: 'Track every campaign live. Reach, engagement, ROI — all in one dashboard your team can actually understand.',
  },
  {
    icon: <Shield size={22} />,
    title: 'Secure Payments',
    desc: 'Escrow-protected payouts mean creators always get paid on time, and brands only pay for delivered results.',
  },
  {
    icon: <HeartHandshake size={22} />,
    title: 'Creator Mentorship',
    desc: 'Access a community of seasoned creators. Learn, collaborate, and grow alongside India\'s top digital talent.',
  },
];

const Features = () => (
  <section className="features-section" id="features">
    <div className="container">
      <div className="features-layout">

        {/* Left: sticky copy */}
        <div className="features-copy">
          <p className="section-eyebrow">Platform</p>
          <h2>Built for creators<br />who mean business.</h2>
          <p className="features-sub">
            Everything you need to build a sustainable creator career —
            from your first brand deal to scaling a team.
          </p>
          <button className="btn btn-primary">See how it works</button>
        </div>

        {/* Right: feature list */}
        <div className="features-list">
          {features.map((f, i) => (
            <div className="feature-item" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  </section>
);

export default Features;
