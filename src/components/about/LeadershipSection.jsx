import React from 'react';
import LeadershipCard from './LeadershipCard';
import './LeadershipSection.css';

/**
 * leadershipTeam — single source of truth for team data.
 *
 * TO ADD A NEW MEMBER:
 *   1. Find an entry with `placeholder: true`
 *   2. Replace it with actual data (name, designation, image, optional linkedin)
 *   3. Remove `placeholder: true`
 *
 * No JSX, CSS, or component changes needed.
 */
const leadershipTeam = [
  {
    name: 'Adarsh Kumar',
    designation: 'CEO & Founder',
    image: null,
    bio: 'Adarsh founded C-PEB with one clear goal — make growth accessible to every Indian startup, not just the well-funded ones. He leads the company\'s vision, partnerships, and direction.',
    linkedin: null,
    placeholder: false,
  },
  {
    name: 'Jeet Balraj',
    designation: 'Manager',
    image: null,
    bio: 'Jeet keeps the operations moving. From client relationships to internal coordination, he ensures the team delivers on every commitment — on time and without excuses.',
    linkedin: null,
    placeholder: false,
  },
  {
    name: 'Amit Kumar',
    designation: 'Software Engineer',
    image: null,
    bio: 'Amit builds the technology behind C-PEB — the platform, tools, and systems that power everything clients and creators interact with every day.',
    linkedin: null,
    placeholder: false,
  },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
];

const LeadershipSection = () => (
  <section className="leadership-section" aria-labelledby="leadership-heading">
    <div className="container">

      {/* ── Section intro ── */}
      <div className="leadership-header">
        <p className="section-eyebrow">Our Leadership</p>
        <h2 id="leadership-heading">Meet the People Behind C-PEB</h2>
        <p className="leadership-desc">
          Meet the people helping shape C-PEB, build our products and move the company forward.
        </p>
      </div>

      {/* ── Grid ── */}
      <div className="leadership-grid">
        {leadershipTeam.map((member, index) => (
          <LeadershipCard
            key={member.placeholder ? `placeholder-${index}` : member.name}
            name={member.name}
            designation={member.designation}
            image={member.image}
            bio={member.bio}
            linkedin={member.linkedin}
            placeholder={member.placeholder}
          />
        ))}
      </div>

    </div>
  </section>
);


export default LeadershipSection;
