import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import './WhyChooseUs.css';

const REASONS = [
  {
    num: '01',
    title: 'ONE CONNECTED ECOSYSTEM',
    desc: 'Events, business support, creators, brand promotion and digital marketing under one organization.',
    support: 'Coordinate fewer moving parts and keep your execution connected.',
    tags: 'EVENTS · STARTUPS · BUSINESS · CREATORS · BRANDS · DIGITAL',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'C-PEB connected ecosystem and strategic collaboration',
    imageLabel: 'Strategic Planning & Delivery',
  },
  {
    num: '02',
    title: 'BUILT AROUND EXECUTION',
    desc: 'We focus on getting the work done — planning, coordination, promotion, partnerships and on-ground activity.',
    support: 'Strategy matters, but execution is where outcomes are created.',
    tags: 'PLANNING · COORDINATION · ON-GROUND ACTIVITY',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'On-ground event execution and production',
    imageLabel: 'On-Ground Event & Activation',
  },
  {
    num: '03',
    title: 'THE RIGHT PEOPLE & CONNECTIONS',
    desc: 'Access to the people, creators, businesses and partners relevant to the work.',
    support: 'We help bring the right relationships into the project.',
    tags: 'CREATOR MATCHING · PARTNERSHIPS · NETWORKS',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Creator and brand collaboration meeting',
    imageLabel: 'Creator Partnerships & Networks',
  },
  {
    num: '04',
    title: 'FLEXIBLE FOR DIFFERENT BUSINESS NEEDS',
    desc: "Whether you're launching a startup, promoting a brand, organizing an event or building digital visibility, our support can adapt around the requirement.",
    support: 'Different business stages need different kinds of support.',
    tags: 'EARLY STAGE · BRAND SCALE · EVENT ACTIVATION',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Startup growth and business development workspace',
    imageLabel: 'Startup Support & Brand Scale',
  },
  {
    num: '05',
    title: 'ONE TEAM TO COORDINATE',
    desc: 'Instead of managing disconnected service providers, work with one organization across related requirements.',
    support: 'Better coordination. Clearer communication. Fewer handoffs.',
    tags: 'SINGLE POINT OF CONTACT · UNIFIED WORKFLOW',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Professional business team coordinating execution',
    imageLabel: 'Unified Team Coordination',
  },
];

const WhyChooseUs = () => {
  const [activeReason, setActiveReason] = useState(0);

  return (
    <section className="wcu-section" id="why-choose-us" aria-label="Why Choose C-PEB">
      <div className="wcu-container">
        
        {/* ── Section Grid: Left Editorial Context + Right Flat Reasons List ── */}
        <div className="wcu-grid">
          
          {/* ── Left Column: Editorial Header, Trust Statement & Visual ── */}
          <div className="wcu-left">
            <div className="wcu-header">
              <span className="wcu-eyebrow">THE C-PEB ADVANTAGE</span>
              <h2 className="wcu-heading">
                More Than a Service.<br />
                <em>A Partner for the Work Ahead.</em>
              </h2>
              <p className="wcu-lead">
                From planning an event to promoting a brand, connecting with creators or supporting a growing business, we bring the right capabilities together to help you move from requirement to execution.
              </p>

              {/* Trust Statement */}
              <div className="wcu-trust-block">
                <span className="wcu-trust-dash" aria-hidden="true">—</span>
                <div className="wcu-trust-content">
                  <span className="wcu-trust-item">ONE ORGANIZATION</span>
                  <span className="wcu-trust-dot" aria-hidden="true">·</span>
                  <span className="wcu-trust-item">MULTIPLE CAPABILITIES</span>
                  <span className="wcu-trust-dot" aria-hidden="true">·</span>
                  <span className="wcu-trust-item">CONNECTED EXECUTION</span>
                </div>
              </div>
            </div>

            {/* Visual Frame (desktop crossfades based on hovered reason; mobile stacks) */}
            <div className="wcu-visual-wrap">
              <div className="wcu-visual-frame">
                {REASONS.map((r, idx) => (
                  <img
                    key={r.num}
                    src={r.image}
                    alt={r.imageAlt}
                    className={`wcu-visual-img ${activeReason === idx ? 'is-active' : ''}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                ))}

                {/* Subtle corner crosshairs */}
                <div className="wcu-frame-crosshair wcu-frame-tl" aria-hidden="true">+</div>
                <div className="wcu-frame-crosshair wcu-frame-tr" aria-hidden="true">+</div>
                <div className="wcu-frame-crosshair wcu-frame-bl" aria-hidden="true">+</div>
                <div className="wcu-frame-crosshair wcu-frame-br" aria-hidden="true">+</div>

                {/* Floating micro-badge */}
                <div className="wcu-visual-badge">
                  <span className="wcu-badge-dot" aria-hidden="true"></span>
                  <span className="wcu-badge-text">{REASONS[activeReason].imageLabel}</span>
                </div>
              </div>

              <div className="wcu-visual-footer">
                <span className="wcu-vf-stat">06 Service Capabilities</span>
                <span className="wcu-vf-divider" aria-hidden="true">/</span>
                <span className="wcu-vf-note">One Coordinated Delivery</span>
              </div>
            </div>
          </div>

          {/* ── Right Column: Flat Editorial List of 5 Reasons ── */}
          <div className="wcu-right">
            <div className="wcu-list" role="list">
              {REASONS.map((item, index) => {
                const isActive = activeReason === index;
                return (
                  <article
                    key={item.num}
                    className={`wcu-item ${isActive ? 'is-active' : ''}`}
                    onMouseEnter={() => setActiveReason(index)}
                    onFocus={() => setActiveReason(index)}
                    tabIndex={0}
                    role="listitem"
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {/* Continuous vertical timeline connector */}
                    <div className="wcu-item-gutter" aria-hidden="true">
                      <span className="wcu-node-marker">
                        <span className="wcu-node-dot"></span>
                      </span>
                      {index < REASONS.length - 1 && <span className="wcu-line-segment"></span>}
                    </div>

                    {/* Content Body */}
                    <div className="wcu-item-content">
                      <header className="wcu-item-header">
                        <span className="wcu-item-num">{item.num}</span>
                        <h3 className="wcu-item-title">
                          {item.title}
                          <ArrowUpRight className="wcu-item-arrow" size={17} aria-hidden="true" />
                        </h3>
                      </header>

                      <p className="wcu-item-desc">{item.desc}</p>
                      <p className="wcu-item-support">{item.support}</p>

                      <div className="wcu-item-tags" aria-label="Capability tags">
                        {item.tags}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
