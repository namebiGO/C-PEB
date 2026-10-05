import React from 'react';

/**
 * LeadershipCard
 *
 * Two modes:
 *   1. Real profile  — name + designation shown; image or initials avatar
 *   2. Placeholder   — placeholder={true}; neutral silhouette, coming soon copy
 *
 * To add a member later: supply name/designation/image in leadershipTeam array,
 * remove `placeholder: true`. Zero JSX or CSS changes needed.
 */

/* ── Silhouette SVG (for placeholder cards) ── */
const SilhouetteIcon = () => (
  <svg
    width="72"
    height="72"
    viewBox="0 0 72 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="36" cy="26" r="16" fill="#94a3b8" />
    <path
      d="M4 68c0-17.673 14.327-32 32-32s32 14.327 32 32"
      fill="#94a3b8"
    />
  </svg>
);

/* ── LinkedIn icon SVG ── */
const LinkedInIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/* ── Arrow icon ── */
const ArrowIcon = () => (
  <svg
    className="lc-linkedin-arrow"
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
);

const LeadershipCard = ({ name, designation, image, imagePosition, bio, linkedin, placeholder }) => {
  /* ── PLACEHOLDER card ── */
  if (placeholder) {
    return (
      <article
        className="lc-card lc-card--placeholder"
        aria-label="Leadership profile coming soon"
      >
        <div className="lc-photo">
          <div className="lc-silhouette">
            <SilhouetteIcon />
          </div>
        </div>
        <div className="lc-body">
          <div>
            <p className="lc-ph-name">Leadership Team</p>
            <p className="lc-ph-role">Profile coming soon</p>
          </div>
        </div>
      </article>
    );
  }

  /* ── Derive initials from name ── */
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  /* ── REAL profile card ── */
  return (
    <article
      className="lc-card"
      aria-label={`${name}, ${designation} at C-PEB`}
    >
      {/* Photo or avatar */}
      <div className="lc-photo">
        {image ? (
          <img
            src={image}
            alt={`${name}, ${designation} at C-PEB`}
            width={400}
            height={267}
            loading="lazy"
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
          />
        ) : (
          <div className="lc-avatar" aria-hidden="true">
            <div className="lc-avatar-ring">
              <span className="lc-avatar-initials">{initials}</span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="lc-body">
        <div>
          <h3 className="lc-name">{name}</h3>
          <p className="lc-designation">{designation}</p>
        </div>

        {bio && (
          <p className="lc-bio">{bio}</p>
        )}

        {linkedin && (
          <>
            <div className="lc-divider" aria-hidden="true" />
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="lc-linkedin"
              aria-label={`View ${name}'s LinkedIn profile`}
            >
              <LinkedInIcon />
              <span>LinkedIn</span>
              <ArrowIcon />
            </a>
          </>
        )}
      </div>
    </article>
  );
};

export default LeadershipCard;
