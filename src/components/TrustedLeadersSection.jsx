import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './TrustedLeadersSection.css';

/**
 * Mosaic image configuration.
 * Uses real C-PEB creator assets from /public/images/creators/.
 * Each tile has: src, alt, a size class, and absolute position classes.
 * 
 * Positions are defined via CSS — the data here drives which CSS
 * modifier class to apply, keeping positioning logic in CSS.
 */
const MOSAIC_TILES = [
  // TOP ROW — left to right
  { src: '/images/creators/elvish-yadav.webp',     alt: '',  pos: 'tl1',  size: 'lg'  },
  { src: '/images/creators/rajat-dalal.webp',      alt: '',  pos: 'tl2',  size: 'sm'  },
  { src: '/images/creators/avdhesh-mishra.webp',   alt: '',  pos: 'tc1',  size: 'md'  },
  { src: '/images/creators/wamiqa-gabbi.webp',     alt: '',  pos: 'tr1',  size: 'sm'  },
  { src: '/images/creators/amrapali-dubey.webp',   alt: '',  pos: 'tr2',  size: 'lg'  },

  // MID ROW — outer sides
  { src: '/images/creators/sanjay-pandey.webp',    alt: '',  pos: 'ml1',  size: 'md'  },
  { src: '/images/creators/kajal-raghwani.webp',   alt: '',  pos: 'mr1',  size: 'md'  },

  // BOTTOM ROW — left to right
  { src: '/images/creators/dinesh-lal-yadav.webp', alt: '',  pos: 'bl1',  size: 'lg'  },
  { src: '/images/creators/neelam-giri.webp',      alt: '',  pos: 'bc1',  size: 'sm'  },
  { src: '/images/creators/pawan-singh.webp',      alt: '',  pos: 'br1',  size: 'lg'  },
];

export default function TrustedLeadersSection() {
  return (
    <section
      className="tl-section"
      aria-labelledby="tl-heading"
    >
      <div className="container">
        <div className="tl-panel">

          {/* ── Gradient edge fades ── */}
          <div className="tl-fade tl-fade--top"    aria-hidden="true" />
          <div className="tl-fade tl-fade--bottom" aria-hidden="true" />
          <div className="tl-fade tl-fade--left"   aria-hidden="true" />
          <div className="tl-fade tl-fade--right"  aria-hidden="true" />

          {/* ── Image mosaic ── */}
          <div className="tl-mosaic" aria-hidden="true">
            {MOSAIC_TILES.map(({ src, alt, pos, size }, i) => (
              <div
                key={pos}
                className={`tl-tile tl-tile--${pos} tl-tile--${size}`}
                style={{ '--tile-i': i }}
              >
                <img
                  src={src}
                  alt={alt}
                  className="tl-tile__img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>

          {/* ── Central content ── */}
          <div className="tl-center">
            {/* Eyebrow pill */}
            <span className="tl-pill">Testimonials</span>

            {/* Heading */}
            <h2 id="tl-heading" className="tl-heading">
              <span className="tl-heading__line1">Trusted by leaders</span>
              <span className="tl-heading__line2">from various industries</span>
            </h2>

            {/* Description */}
            <p className="tl-desc">
              Learn why brands, founders and marketers trust C-PEB to connect them
              with the right creators and grow their business.
            </p>

            {/* CTA */}
            <Link to="/case-studies" className="tl-cta" aria-label="Read C-PEB success stories">
              Read Success Stories
              <ArrowRight size={15} className="tl-cta__arrow" aria-hidden="true" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
