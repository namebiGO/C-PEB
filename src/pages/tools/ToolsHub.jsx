import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, CheckSquare, ArrowRight, TrendingUp } from 'lucide-react';
import './Tools.css';
import SEO from '../../components/SEO';

const TOOLS = [
  {
    id: 'roi-calculator',
    title: 'Influencer ROI Calculator',
    desc: 'Estimate the reach, engagement, and projected sales from your influencer marketing budget.',
    icon: <TrendingUp size={28} />,
    color: '#10b981',
    link: '/tools/roi-calculator',
    badge: 'Popular'
  },
  {
    id: 'funding-checker',
    title: 'Startup Funding Checker',
    desc: 'Find out exactly which government schemes, grants, and loans your startup is eligible for in 3 minutes.',
    icon: <CheckSquare size={28} />,
    color: '#3b82f6',
    link: '/tools/funding-checker',
    badge: 'New'
  },
  {
    id: 'coming-soon',
    title: 'Marketing Budget Planner',
    desc: 'Coming Soon: Allocate your ad spend optimally across Facebook, Google, and Influencers to maximize ROAS.',
    icon: <Calculator size={28} />,
    color: '#6b7280',
    link: '#',
    badge: 'Soon',
    disabled: true
  }
];

export default function ToolsHub() {
  return (
    <div className="tools-page">
      <SEO 
        title="Free Tools & Calculators | C-PEB" 
        description="Free tools for startups and brands: Influencer ROI Calculator, Government Funding Checker, and more." 
      />
      
      <section className="tools-hero">
        <div className="container text-center">
          <p className="section-eyebrow">Free Resources</p>
          <h1>Interactive Tools to <br/><span className="text-gradient">Grow Your Business</span></h1>
          <p className="max-w-600 mx-auto mt-3">Data-driven calculators and eligibility checkers built by our experts to help you make smarter marketing and funding decisions.</p>
        </div>
      </section>

      <section className="tools-grid-section">
        <div className="container">
          <div className="tools-grid">
            {TOOLS.map(tool => (
              <div className={`tool-card ${tool.disabled ? 'disabled' : ''}`} key={tool.id}>
                <div className="tool-card-icon" style={{ backgroundColor: `${tool.color}15`, color: tool.color }}>
                  {tool.icon}
                </div>
                {tool.badge && <span className="tool-badge" style={{ backgroundColor: tool.color }}>{tool.badge}</span>}
                
                <h3>{tool.title}</h3>
                <p>{tool.desc}</p>
                
                {!tool.disabled ? (
                  <Link to={tool.link} className="btn btn-outline w-full justify-center mt-auto">
                    Try it Now <ArrowRight size={16} />
                  </Link>
                ) : (
                  <button className="btn btn-secondary w-full justify-center mt-auto" disabled>
                    Coming Soon
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
