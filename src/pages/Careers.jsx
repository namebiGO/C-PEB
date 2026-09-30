import React from 'react';
import { ArrowRight, ArrowUpRight, MapPin, Clock, BookOpen, UserCheck, Users, Zap, Briefcase, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './Careers.css';

const CULTURE_PRINCIPLES = [
  {
    icon: <BookOpen size={20} strokeWidth={1.5} />,
    title: 'Learn & Grow',
    desc: 'Work on challenging problems, learn from your teammates and keep improving your craft.'
  },
  {
    icon: <UserCheck size={20} strokeWidth={1.5} />,
    title: 'Take Ownership',
    desc: 'We value people who take responsibility, think independently and follow their work through.'
  },
  {
    icon: <Users size={20} strokeWidth={1.5} />,
    title: 'Work Together',
    desc: 'Good work comes from open communication, collaboration and respect for different perspectives.'
  },
  {
    icon: <Zap size={20} strokeWidth={1.5} />,
    title: 'Make an Impact',
    desc: 'Focus on work that creates something useful for our clients, customers and team.'
  }
];

const EXPECTATIONS = [
  {
    icon: <BookOpen size={18} strokeWidth={1.5} />,
    title: 'Learning & Development',
    desc: 'Opportunities to improve your skills through real projects and continuous learning.'
  },
  {
    icon: <Zap size={18} strokeWidth={1.5} />,
    title: 'Meaningful Work',
    desc: 'Work on projects where your contribution has a visible impact.'
  },
  {
    icon: <Users size={18} strokeWidth={1.5} />,
    title: 'Collaborative Environment',
    desc: 'Work with people who value communication, respect and teamwork.'
  },
  {
    icon: <ArrowUpRight size={18} strokeWidth={1.5} />,
    title: 'Career Growth',
    desc: 'Take on increasing responsibility as you grow with the team.'
  },
  {
    icon: <Briefcase size={18} strokeWidth={1.5} />,
    title: 'Flexible Working',
    desc: 'A practical approach to getting work done effectively.'
  },
  {
    icon: <HeartHandshake size={18} strokeWidth={1.5} />,
    title: 'Supportive Team',
    desc: 'A workplace where questions, ideas and different perspectives are welcome.'
  }
];

const OPEN_POSITIONS = [
  {
    id: 'talent-manager',
    title: 'Creator Talent Manager',
    dept: 'Creator Operations',
    location: 'Bangalore, India',
    type: 'Full-time',
    desc: 'Manage relationships with top creators, negotiate brand deals, and help our talent roster grow their digital presence.'
  },
  {
    id: 'performance-marketer',
    title: 'Performance Marketer',
    dept: 'Digital Marketing',
    location: 'Remote',
    type: 'Full-time',
    desc: 'Plan, execute and optimize paid acquisition campaigns across Meta and Google for our startup clients.'
  },
  {
    id: 'business-dev',
    title: 'Business Development Executive',
    dept: 'Sales & Partnerships',
    location: 'Mumbai, India',
    type: 'Full-time',
    desc: 'Identify and connect with funded startups who need operational and marketing support from C-PEB.'
  }
];

export default function Careers() {
  return (
    <div className="careers-page">
      <SEO 
        title="Careers at C-PEB | Join Our Team" 
        description="Explore career opportunities at C-PEB and join a team building meaningful digital solutions." 
      />

      {/* ────────────────────────────────────────────────────────
          HERO SECTION
          ──────────────────────────────────────────────────────── */}
      <section className="careers-hero shared-hero-bg">
        <div className="container">
          <div className="careers-hero-inner">
            <div className="careers-hero-copy">
              <span className="careers-eyebrow">CAREERS AT C-PEB</span>
              <h1 className="careers-hero-title">Build Your Career With Us</h1>
              <p className="careers-hero-desc">
                We're building a team of curious, capable people who want to do meaningful work, take ownership and grow along the way.
              </p>
              <div className="careers-hero-actions">
                <a href="#open-roles" className="btn btn-primary">
                  View Open Positions
                </a>
                <a href="#general-app" className="btn btn-secondary">
                  Send Your Resume
                </a>
              </div>
            </div>
            <div className="careers-hero-visual">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                alt="C-PEB Team Collaboration" 
                className="careers-hero-img"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          WHY C-PEB (Editorial Two-Column)
          ──────────────────────────────────────────────────────── */}
      <section className="careers-why">
        <div className="container">
          <div className="careers-why-inner">
            <div className="careers-why-left">
              <span className="careers-eyebrow">WHY C-PEB</span>
              <h2>Work That Gives You Room to Grow</h2>
            </div>
            <div className="careers-why-right">
              <p>
                At C-PEB, we believe good work comes from people who are given the opportunity to learn, contribute and take ownership. You'll work on real projects, solve real problems and collaborate with people who care about doing things well.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          CULTURE
          ──────────────────────────────────────────────────────── */}
      <section className="careers-culture">
        <div className="container">
          <div className="careers-culture-header">
            <h2>How We Work</h2>
            <p className="careers-subtitle">We value thoughtful work, ownership, collaboration and continuous learning.</p>
          </div>
          
          <div className="culture-grid">
            {CULTURE_PRINCIPLES.map((pt, i) => (
              <div className="culture-card" key={i}>
                <div className="culture-icon">{pt.icon}</div>
                <h3>{pt.title}</h3>
                <p>{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          LIFE AT C-PEB (Editorial Image Layout)
          ──────────────────────────────────────────────────────── */}
      <section className="careers-life">
        <div className="container">
          <div className="careers-life-header">
            <h2>Life at C-PEB</h2>
            <p className="careers-subtitle">A glimpse into the people, collaboration and everyday moments behind our work.</p>
          </div>
          
          <div className="life-image-grid">
            <div className="life-img-large">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80" alt="Team meeting" loading="lazy" />
            </div>
            <div className="life-img-small-1">
              <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=80" alt="Focused work" loading="lazy" />
            </div>
            <div className="life-img-small-2">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80" alt="Team discussion" loading="lazy" />
            </div>
            <div className="life-img-wide">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" alt="Casual team moment" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          PEOPLE / TEAM MESSAGE
          ──────────────────────────────────────────────────────── */}
      <section className="careers-team-msg">
        <div className="container">
          <div className="team-msg-inner">
            <div className="team-msg-visual">
              <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80" alt="C-PEB Employee" loading="lazy" />
            </div>
            <div className="team-msg-copy">
              <h2>Good People Do Good Work</h2>
              <p>
                We care about the people behind the work. We want everyone at C-PEB to have the space to contribute, learn from others and build work they can be proud of.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          WHAT YOU CAN EXPECT
          ──────────────────────────────────────────────────────── */}
      <section className="careers-expectations">
        <div className="container">
          <div className="expectations-header">
            <h2>What You Can Expect</h2>
          </div>
          
          <div className="expectations-grid">
            {EXPECTATIONS.map((exp, i) => (
              <div className="expectation-item" key={i}>
                <div className="expectation-icon">{exp.icon}</div>
                <div className="expectation-content">
                  <h4>{exp.title}</h4>
                  <p>{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          OPEN POSITIONS
          ──────────────────────────────────────────────────────── */}
      <section id="open-roles" className="careers-jobs">
        <div className="container">
          <div className="jobs-header">
            <h2>Open Positions</h2>
            <p className="careers-subtitle">Explore current opportunities and find a role where you can contribute and grow.</p>
          </div>

          {OPEN_POSITIONS.length > 0 ? (
            <div className="jobs-list">
              {OPEN_POSITIONS.map(job => (
                <div className="job-card" key={job.id}>
                  <div className="job-card-main">
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-meta">
                      <span>{job.dept}</span>
                      <span className="job-meta-dot">·</span>
                      <span>{job.type}</span>
                      <span className="job-meta-dot">·</span>
                      <span>{job.location}</span>
                    </div>
                    <p className="job-desc">{job.desc}</p>
                  </div>
                  <div className="job-card-action">
                    <Link to={`/contact?role=${job.id}`} className="job-link-btn">
                      View Position <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="jobs-empty">
              <h3>No Open Positions Right Now</h3>
              <p>We don't have any open roles at the moment, but we're always interested in meeting talented people.</p>
              <a href="#general-app" className="btn btn-primary mt-4">Send Your Resume</a>
            </div>
          )}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          GENERAL APPLICATION CTA
          ──────────────────────────────────────────────────────── */}
      <section id="general-app" className="careers-general-app">
        <div className="container">
          <div className="general-app-inner">
            <h2>Don't See the Right Role?</h2>
            <p>
              We’re always interested in hearing from talented people. Send us your resume and tell us how you could contribute to C-PEB.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Send Your Resume
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
