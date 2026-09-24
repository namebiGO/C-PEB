import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import './FAQSection.css';

const FAQ_ITEMS = [
  {
    id: '01',
    category: 'Event Management',
    question: 'Can you manage an event from planning through on-ground execution?',
    answer: 'Yes. We handle end-to-end event management — from initial concept and scheduling to vendor coordination, venue logistics, audience promotion, and dedicated on-ground management during the live event. We ensure all operational details run smoothly so you can focus on your attendees and brand objectives.'
  },
  {
    id: '02',
    category: 'Startup Support',
    question: 'Can startups work with you across multiple business requirements?',
    answer: 'Absolutely. Early-stage businesses often need coordinated support across different functions. We assist with digital presence, market positioning, business development, promotional campaigns, and creator connections without requiring you to manage five separate, disconnected agencies.'
  },
  {
    id: '03',
    category: 'Influencer Connections',
    question: 'How do you connect brands with relevant creators?',
    answer: "We don't rely on random directory lists or vanity follower metrics. We match brands with creators whose actual audience demographics, content style, and engagement align with your campaign goals. We coordinate briefing, deliverable tracking, content approvals, and distribution."
  },
  {
    id: '04',
    category: 'Brand Promotion & Digital Marketing',
    question: 'Can you handle both offline brand promotion and digital marketing?',
    answer: 'Yes. One of our core strengths is connecting physical activations with digital reach. Whether that involves an on-ground event, experiential product sampling, social media distribution, or performance marketing, we ensure both channels reinforce each other rather than operating in silos.'
  },
  {
    id: '05',
    category: 'Business Support',
    question: 'Can a business hire C-PEB for only one specific service?',
    answer: 'Yes. While our ecosystem is designed to coordinate multiple related requirements, you can engage us strictly for a standalone project — such as coordinating a single event, launching a creator partnership campaign, or handling specific business development needs.'
  },
  {
    id: '06',
    category: 'Process & Onboarding',
    question: 'What happens after I contact C-PEB?',
    answer: 'We review your requirements and schedule an initial consultation to understand your goals, timeline, and scope. We then outline a clear execution plan with transparent deliverables and timelines before any commitment is made. No generic proposals or high-pressure sales pitches.'
  }
];

const TRUST_ITEMS = [
  {
    category: 'EVENTS',
    title: 'Planning · Promotion · Execution',
    detail: 'On-ground coordination and live event management'
  },
  {
    category: 'BUSINESS',
    title: 'Support · Strategy · Connections',
    detail: 'Practical operational assistance and partnership development'
  },
  {
    category: 'CREATORS',
    title: 'Discovery · Matching · Partnerships',
    detail: 'Targeted brand campaigns with relevant creators'
  },
  {
    category: 'DIGITAL',
    title: 'Campaigns · Marketing · Growth',
    detail: 'Integrated multi-channel performance and digital visibility'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0); // First question open by default

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq" aria-label="Frequently Asked Questions">
      <div className="faq-container">
        
        {/* ── Main Two-Column Layout ── */}
        <div className="faq-grid">
          
          {/* ── Left Column: Editorial Header, Visual & Trust Statement ── */}
          <div className="faq-left">
            <div className="faq-header">
              <span className="faq-eyebrow">QUESTIONS</span>
              <h2 className="faq-heading">
                Questions,<br />
                <em>Answered.</em>
              </h2>
              <p className="faq-lead">
                From events and startup support to creator partnerships and digital marketing, here's what clients commonly ask before getting started.
              </p>

              <div className="faq-tags-bar" aria-label="Core capability areas">
                EVENTS · STARTUPS · BUSINESS · CREATORS · BRANDS · DIGITAL
              </div>
            </div>

            {/* Authentic Business Execution Visual */}
            <div className="faq-visual-wrap">
              <div className="faq-visual-frame">
                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1000&q=85"
                  alt="Professional team planning business and event strategy"
                  className="faq-visual-img"
                  loading="lazy"
                />
                
                {/* Subtle corner crosshairs */}
                <div className="faq-crosshair faq-crosshair-tl" aria-hidden="true">+</div>
                <div className="faq-crosshair faq-crosshair-tr" aria-hidden="true">+</div>
                <div className="faq-crosshair faq-crosshair-bl" aria-hidden="true">+</div>
                <div className="faq-crosshair faq-crosshair-br" aria-hidden="true">+</div>

                {/* Micro-badge */}
                <div className="faq-visual-badge">
                  <span className="faq-badge-dot" aria-hidden="true"></span>
                  <span className="faq-badge-text">PRACTICAL BUSINESS EXECUTION</span>
                </div>
              </div>

              {/* Trust statement */}
              <div className="faq-trust-statement">
                <span className="faq-trust-dash" aria-hidden="true">—</span>
                <span className="faq-trust-text">
                  ONE ORGANIZATION · MULTIPLE CAPABILITIES · CONNECTED EXECUTION
                </span>
              </div>
            </div>
          </div>

          {/* ── Right Column: Flat Editorial Accordion ── */}
          <div className="faq-right">
            <div className="faq-accordion" role="region" aria-label="Accordion Questions">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openIndex === index;
                const panelId = `faq-panel-${item.id}`;
                const buttonId = `faq-btn-${item.id}`;

                return (
                  <article
                    key={item.id}
                    className={`faq-row ${isOpen ? 'is-open' : ''}`}
                  >
                    <button
                      id={buttonId}
                      className="faq-trigger"
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                    >
                      <div className="faq-q-meta">
                        <span className="faq-q-num">{item.id}</span>
                        <div className="faq-q-active-bar" aria-hidden="true"></div>
                      </div>

                      <span className="faq-q-text">{item.question}</span>

                      <span className="faq-icon-wrap" aria-hidden="true">
                        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                      </span>
                    </button>

                    <div
                      id={panelId}
                      className="faq-panel"
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!isOpen}
                    >
                      <div className="faq-answer-inner">
                        <p className="faq-answer-text">{item.answer}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

        </div>

        {/* ── Credibility Trust Strip (Replacing Social Follower Counts) ── */}
        <div className="faq-trust-strip" aria-label="Why Businesses Work With Us">
          <div className="faq-ts-header">
            <span className="faq-ts-eyebrow">WHY BUSINESSES WORK WITH US</span>
          </div>

          <div className="faq-ts-grid">
            {TRUST_ITEMS.map((t, idx) => (
              <div key={t.category} className="faq-ts-col">
                <span className="faq-ts-category">{t.category}</span>
                <h4 className="faq-ts-title">{t.title}</h4>
                <p className="faq-ts-detail">{t.detail}</p>
                {idx < TRUST_ITEMS.length - 1 && <div className="faq-ts-sep" aria-hidden="true"></div>}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

