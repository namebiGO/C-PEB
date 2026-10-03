import React from 'react';
import { ArrowRight } from 'lucide-react';
import './TrustedLeadersSection.css';

/**
 * Image columns — exactly 4 columns total:
 *   colA (far left)   → 2 images, offset lower
 *   colB (inner left) → 3 images, starts higher
 *   colC (inner right)→ 3 images, starts higher
 *   colD (far right)  → 2 images, offset lower
 *
 * All images are real C-PEB creator assets.
 * alt="" because these are purely decorative — they frame the
 * central trust message, not identify specific individuals.
 */
const COLUMNS = [
  // Column A — far left, 2 images, drops down
  {
    id: 'colA',
    offset: 72,        // px — pushes column down to stagger it
    images: [
      { src: '/images/creators/elvish-yadav.webp',   alt: '' },
      { src: '/images/creators/neelam-giri.webp',    alt: '' },
    ],
  },
  // Column B — inner left, 3 images, starts high
  {
    id: 'colB',
    offset: 0,
    images: [
      { src: '/images/creators/rajat-dalal.webp',    alt: '' },
      { src: '/images/creators/amrapali-dubey.webp', alt: '' },
      { src: '/images/creators/sanjay-pandey.webp',  alt: '' },
    ],
  },
  // Column C — inner right, 3 images, starts high
  {
    id: 'colC',
    offset: 0,
    images: [
      { src: '/images/creators/avdhesh-mishra.webp', alt: '' },
      { src: '/images/creators/kajal-raghwani.webp', alt: '' },
      { src: '/images/creators/wamiqa-gabbi.webp',   alt: '' },
    ],
  },
  // Column D — far right, 2 images, drops down
  {
    id: 'colD',
    offset: 72,
    images: [
      { src: '/images/creators/pawan-singh.webp',      alt: '' },
      { src: '/images/creators/dinesh-lal-yadav.webp', alt: '' },
    ],
  },
];

export default function TrustedLeadersSection() {
  const leftCols  = COLUMNS.slice(0, 2);
  const rightCols = COLUMNS.slice(2, 4);

  return (
    <section className="tl-section" aria-labelledby="tl-heading">
      <div className="container">
        <div className="tl-panel">

          {/* ── Left image group ── */}
          <div className="tl-col-group tl-col-group--left" aria-hidden="true">
            {leftCols.map((col) => (
              <div
                key={col.id}
                className="tl-col"
                style={{ '--col-offset': `${col.offset}px` }}
              >
                {col.images.map((img, i) => (
                  <div key={i} className="tl-img-wrap">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="tl-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* ── Centre content ── */}
          <div className="tl-center">
            <span className="tl-pill">Testimonials</span>

            <h2 id="tl-heading" className="tl-heading">
              <span className="tl-h-dark">Trusted by leaders</span>
              <span className="tl-h-muted">from various industries</span>
            </h2>

            <p className="tl-desc">
              Learn why brands, founders and marketers trust C-PEB to connect
              them with the right creators and grow their business.
            </p>

            <button
              onClick={() => {
                document.getElementById('testimonials-scroll')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="tl-cta"
              aria-label="Read C-PEB success stories"
            >
              Read Success Stories
              <ArrowRight size={14} className="tl-arrow" aria-hidden="true" />
            </button>
          </div>

          {/* ── Right image group ── */}
          <div className="tl-col-group tl-col-group--right" aria-hidden="true">
            {rightCols.map((col) => (
              <div
                key={col.id}
                className="tl-col"
                style={{ '--col-offset': `${col.offset}px` }}
              >
                {col.images.map((img, i) => (
                  <div key={i} className="tl-img-wrap">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="tl-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
