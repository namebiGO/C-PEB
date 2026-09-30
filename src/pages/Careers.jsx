import React from 'react';
import { ArrowRight, MapPin, Clock, Heart, Zap, Coffee, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './Careers.css';

const CULTURE_POINTS = [
  {
    icon: <Zap size={24} />,
    title: 'Fast-Paced Growth',
    desc: 'Work at the intersection of startups and the creator economy. We move fast and break boundaries.'
  },
  {
    icon: <Users size={24} />,
    title: 'Collaborative Team',
    desc: 'No egos. Just a group of passionate individuals building the future of digital ecosystems.'
  },
  {
    icon: <Coffee size={24} />,
    title: 'Remote-Friendly',
    desc: 'Work from anywhere. We care about the impact you make, not where you sit.'
  },
  {
    icon: <Heart size={24} />,
    title: 'Health & Wellness',
    desc: 'Comprehensive health coverage and flexible time off to keep you at your best.'
  }
];

const OPEN_POSITIONS = [
  {
    id: 'talent-manager',
    title: 'Creator Talent Manager',
    dept: 'Creator Operations',
    location: 'Remote / Bangalore',
    type: 'Full-time'
  },
  {
    id: 'growth-marketer',
    title: 'Performance Marketer (B2B)',
    dept: 'Marketing',
    location: 'Remote',
    type: 'Full-time'
  },
  {
    id: 'business-dev',
    title: 'Business Development Executive',
    dept: 'Sales & Partnerships',
    location: 'Mumbai / Bangalore',
    type: 'Full-time'
  }
];

export default function Careers() {
  return (
    <div className="careers-page">
      <SEO 
        title="Careers | Join C-PEB" 
        description="Join C-PEB and help us build the ultimate ecosystem for startups, businesses, and creators." 
      />

      {/* ── Hero ── */}
      <section className="careers-hero shared-hero-bg">
        <div className="container">
          <div className="careers-hero-inner">
            <span className="section-eyebrow">JOIN OUR TEAM</span>
            <h1 className="careers-hero-title">
              Let's Build the Future of <span className="text-gradient">Business & Creators</span>
            </h1>
            <p className="careers-hero-desc">
              We're a fast-growing team empowering startups to scale and creators to monetize. If you love solving hard problems and driving real impact, you belong here.
            </p>
            <a href="#open-roles" className="btn btn-primary btn-lg">
              View Open Roles <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Culture ── */}
      <section className="careers-culture">
        <div className="container">
          <div className="text-center max-w-600 mx-auto">
            <h2>Why Work With Us?</h2>
            <p className="mt-2 text-2">We believe in giving our team the autonomy to experiment, the resources to succeed, and the flexibility to live their lives.</p>
          </div>
          <div className="culture-grid">
            {CULTURE_POINTS.map((pt, i) => (
              <div className="culture-card" key={i}>
                <div className="culture-icon">{pt.icon}</div>
                <h3>{pt.title}</h3>
                <p className="text-2">{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Jobs ── */}
      <section id="open-roles" className="careers-jobs">
        <div className="container">
          <div className="jobs-header">
            <h2>Open Positions</h2>
            <p className="mt-2 text-2">Find your next opportunity at C-PEB.</p>
          </div>

          <div className="jobs-list">
            {OPEN_POSITIONS.map(job => (
              <Link to="/contact" className="job-card" key={job.id}>
                <div className="job-info">
                  <h3>{job.title}</h3>
                  <div className="job-meta">
                    <span className="job-tag">{job.dept}</span>
                    <span><MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> {job.location}</span>
                    <span><Clock size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> {job.type}</span>
                  </div>
                </div>
                <div className="job-action">
                  Apply Now <ArrowRight size={18} />
                </div>
              </Link>
            ))}
            
            <div className="text-center mt-8 p-6 bg-alt border-radius" style={{ borderRadius: '12px', border: '1px dashed var(--border)' }}>
              <h3>Don't see a fit?</h3>
              <p className="text-2 mt-2 mb-4">We're always looking for talented people. Send us your resume anyway.</p>
              <Link to="/contact" className="btn btn-outline">Submit General Application</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
