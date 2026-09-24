import React, { useRef } from 'react';
import './TestimonialsScroll.css';

/* ─── REPLACE with real client quotes when available ─── */
export const TESTIMONIALS_DATA = [
  {
    id: 1,
    quote: 'The team understood our business inside-out before recommending anything. Execution was professional and results were better than we expected.',
    name: 'Rohan Mehta',
    role: 'Founder',
    company: 'Urbane Wear',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 2,
    quote: 'From event coordination to digital promotion, they handled everything seamlessly. It felt like having an in-house team with agency-level execution.',
    name: 'Priya Sharma',
    role: 'Marketing Head',
    company: 'PayNova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 3,
    quote: 'The creator partnerships they arranged were genuinely suited to our brand. Not just numbers — the right people, with the right audience.',
    name: 'Ananya Verma',
    role: 'Brand Lead',
    company: 'Aura Living',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 4,
    quote: 'They took our startup from zero online presence to a consistent content machine in weeks. The speed and professionalism was genuinely impressive.',
    name: 'Vikram Malhotra',
    role: 'Co-Founder',
    company: 'CloudFlow',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 5,
    quote: 'The event was planned and executed end-to-end. We had zero stress on the day — they managed everything from vendor coordination to on-ground support.',
    name: 'Neha Kapoor',
    role: 'Head of Events',
    company: 'Apex Summit',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
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
