import React, { useRef } from 'react';
import './TestimonialsScroll.css';

/* ─── REPLACE with real client quotes when available ─── */
export const TESTIMONIALS_DATA = [
  {
    id: 1,
    quote: "Working with C-PEB to launch our new product was a game-changer. They didn't just find random influencers—they matched us with 40+ creators whose audiences genuinely cared about our niche. Our ROI hit 3.5x in the first month.",
    name: 'Siddharth Joshi',
    role: 'Founder',
    company: 'NovaTech Audio',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 2,
    quote: "We were struggling to get investor meetings until C-PEB revamped our pitch deck and financial model. Their advisory team helped us clarify our value proposition, and we closed our seed round just three weeks later.",
    name: 'Anjali Sharma',
    role: 'Co-Founder',
    company: 'FinEase Solutions',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 3,
    quote: "We hired C-PEB for our annual brand launch event in Bangalore. From venue sourcing and stage design to influencer invites and on-ground logistics, their execution was flawless. Easiest event we've ever hosted.",
    name: 'Kunal Desai',
    role: 'Marketing Director',
    company: 'Zenith Apparels',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 4,
    quote: "The C-PEB team completely transformed our brand identity. They delivered a cohesive design language across our packaging, website, and social media that immediately elevated our brand perception. Truly exceptional work.",
    name: 'Meera Nambiar',
    role: 'Head of Brand',
    company: 'PureAura Skincare',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 5,
    quote: "Their approach to performance marketing is completely data-driven. Within two months of taking over our ad accounts, C-PEB dropped our customer acquisition cost by 40% while scaling our monthly revenue consistently.",
    name: 'Rajeev Gupta',
    role: 'CEO',
    company: 'NextGen Retail',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
  },
];

/**
 * Shared horizontal infinite-scroll testimonials section.
 *
 * Props:
 *   eyebrow  {string}  — small label above heading (default: "CLIENTS SAY")
 *   heading  {string}  — section heading
 *   subhead  {string}  — supporting sentence
 *   bg       {string}  — CSS background value (default: "var(--bg)")
 *   showNote {boolean} — show placeholder note (default: false)
 */
const TestimonialsScroll = ({
  eyebrow  = 'CLIENTS SAY',
  heading  = 'What Our Clients Say',
  subhead  = "Real experiences from businesses, brands and people we've worked with.",
  bg       = 'var(--bg)',
  showNote = false,
}) => {
  const trackRef = useRef(null);

  // Double the list for the seamless infinite loop
  const doubled = [...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA];

  return (
    <section
      id="testimonials-scroll"
      className="ts-section"
      style={{ background: bg }}
      aria-label="Client testimonials"
    >
      {/* Fixed header — stays inside the container */}
      <div className="ts-container">
        <div className="ts-head">
          <p className="ts-eyebrow">{eyebrow}</p>
          <h2 className="ts-heading">{heading}</h2>
          <p className="ts-subhead">{subhead}</p>
          {showNote && (
            <p className="ts-note" aria-live="polite">
              — Placeholder content. Replace with verified client testimonials.
            </p>
          )}
        </div>
      </div>

      {/* Full-bleed scrolling viewport */}
      <div className="ts-outer">
        {/* Edge fades */}
        <div className="ts-fade ts-fade--l" aria-hidden="true" />
        <div className="ts-fade ts-fade--r" aria-hidden="true" />

        {/*
          Track: [Set A][Set B], identical.
          Starts at translateX(-setWidth) → showing Set B.
          Animates to translateX(0)       → showing Set A.
          Since A = B, the loop is seamless.
          setWidth = 5 × (440px card + 24px gap) = 2320px
        */}
        <div className="ts-track" ref={trackRef}>
          {doubled.map((t, i) => (
            <article
              className="ts-card"
              key={`${t.id}-${i}`}
              aria-hidden={i >= TESTIMONIALS_DATA.length ? 'true' : undefined}
            >
              <div className="ts-q" aria-hidden="true">&ldquo;</div>
              <p className="ts-text">{t.quote}</p>
              <footer className="ts-footer">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="ts-avatar"
                  loading="lazy"
                  width="44"
                  height="44"
                />
                <div className="ts-who">
                  <strong className="ts-name">{t.name}</strong>
                  <span className="ts-role">{t.role}</span>
                  <span className="ts-company">{t.company}</span>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsScroll;
