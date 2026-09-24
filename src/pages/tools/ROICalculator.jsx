import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRight, Eye, MousePointer2, ShoppingCart, Lock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Pricing.css'; // Reuse some layout styles if needed
import './Tools.css';
import SEO from '../../components/SEO';

const NICHES = [
  { id: 'fashion', label: 'Fashion & Beauty', cpm: 250, cpc: 12, cvr: 0.015 },
  { id: 'tech', label: 'Tech & Gadgets', cpm: 350, cpc: 25, cvr: 0.025 },
  { id: 'finance', label: 'Finance & Crypto', cpm: 500, cpc: 40, cvr: 0.035 },
  { id: 'food', label: 'Food & Beverage', cpm: 200, cpc: 10, cvr: 0.012 },
  { id: 'health', label: 'Health & Fitness', cpm: 300, cpc: 18, cvr: 0.020 },
  { id: 'general', label: 'General / Lifestyle', cpm: 180, cpc: 8, cvr: 0.010 },
];

export default function ROICalculator() {
  const [budget, setBudget] = useState(50000);
  const [niche, setNiche] = useState('general');
  const [aov, setAov] = useState(1500); // Average Order Value
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [email, setEmail] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  // Results state
  const [results, setResults] = useState({ reach: 0, clicks: 0, sales: 0, revenue: 0, roi: 0 });

  useEffect(() => {
    const selectedNiche = NICHES.find(n => n.id === niche) || NICHES[5];

    // Rough estimation math
    const estReach = Math.floor((budget / selectedNiche.cpm) * 1000);
    const estClicks = Math.floor(budget / selectedNiche.cpc);
    const estSales = Math.floor(estClicks * selectedNiche.cvr);
    const estRevenue = estSales * aov;
    const estRoi = budget > 0 ? ((estRevenue - budget) / budget) * 100 : 0;

    setResults({
      reach: estReach,
      clicks: estClicks,
      sales: estSales,
      revenue: estRevenue,
      roi: estRoi.toFixed(0)
    });
  }, [budget, niche, aov]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (email) {
      // Normally send to backend here
      console.log("Email captured:", email);
      setUnlocked(true);
      setShowEmailGate(false);
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  const formatNumber = (val) => new Intl.NumberFormat('en-IN').format(val);

  return (
    <div className="tools-page">
      <SEO
        title="Influencer ROI Calculator | C-PEB"
        description="Estimate your reach, clicks, and sales from influencer marketing based on your budget and industry."
      />

      <div className="container">
        <div className="tools-breadcrumb">
          <Link to="/tools">← Back to Tools</Link>
        </div>
      </div>

      <section className="tool-calculator-section">
        <div className="container">
          <div className="tool-calc-layout">

            {/* Input Left Side */}
            <div className="tool-calc-inputs">
              <div className="tool-calc-header">
                <Calculator size={24} className="text-green" />
                <h2>ROI Calculator</h2>
                <p>Plug in your campaign details to estimate returns.</p>
              </div>

              <div className="calc-group">
                <label className="calc-label">
                  Campaign Budget: <strong>{formatCurrency(budget)}</strong>
                </label>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="calc-slider"
                />
                <div className="calc-slider-marks">
                  <span>₹10K</span>
                  <span>₹10L+</span>
                </div>
              </div>

              <div className="calc-group">
                <label className="calc-label">Industry / Niche</label>
                <select className="calc-select" value={niche} onChange={(e) => setNiche(e.target.value)}>
                  {NICHES.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                </select>
              </div>

              <div className="calc-group">
                <label className="calc-label">Average Order Value (AOV)</label>
                <div className="calc-input-prefix">
                  <span>₹</span>
                  <input
                    type="number"
                    min="100"
                    value={aov === 0 ? '' : aov}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAov(val === '' ? '' : Number(val));
                    }}
                    className="calc-input-text"
                  />
                </div>
              </div>
            </div>

            {/* Results Right Side */}
            <div className="tool-calc-results">
              <div className="results-card">
                <h3>Estimated Results</h3>

                <div className="results-grid">
                  <div className="result-item">
                    <Eye size={20} className="r-icon text-blue" />
                    <div>
                      <p className="r-label">Est. Reach</p>
                      <p className="r-val">{formatNumber(results.reach)}</p>
                    </div>
                  </div>

                  <div className="result-item">
                    <MousePointer2 size={20} className="r-icon text-purple" />
                    <div>
                      <p className="r-label">Est. Clicks</p>
                      <p className="r-val">{formatNumber(results.clicks)}</p>
                    </div>
                  </div>
                </div>

                {/* Email Gate for Revenue/Sales */}
                {!unlocked ? (
                  <div className="results-gate">
                    {!showEmailGate ? (
                      <div className="gate-prompt">
                        <Lock size={24} className="mb-2 text-gray" />
                        <h4>Unlock Sales & ROI Estimates</h4>
                        <p>See exactly how much revenue this budget could generate.</p>
                        <button className="btn btn-primary mt-3" onClick={() => setShowEmailGate(true)}>
                          Reveal Full ROI <ArrowRight size={16} />
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleUnlock} className="gate-form fade-in">
                        <h4>Where should we send your detailed report?</h4>
                        <input
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="gate-input"
                        />
                        <button type="submit" className="btn btn-primary w-full justify-center">
                          Unlock Results
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="results-unlocked fade-in">
                    <div className="results-grid mt-4 pt-4 border-t">
                      <div className="result-item">
                        <ShoppingCart size={20} className="r-icon text-green" />
                        <div>
                          <p className="r-label">Est. Sales</p>
                          <p className="r-val">{formatNumber(results.sales)}</p>
                        </div>
                      </div>
                      <div className="result-item">
                        <TrendingUp size={20} className="r-icon text-green" />
                        <div>
                          <p className="r-label">Proj. Revenue</p>
                          <p className="r-val text-green">{formatCurrency(results.revenue)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="roi-highlight mt-4">
                      <span>Estimated ROI</span>
                      <strong>{results.roi}%</strong>
                    </div>

                    <div className="cta-box mt-5">
                      <p>Want to hit these numbers?</p>
                      <Link to="/contact" className="btn btn-primary w-full justify-center">Speak to an Expert</Link>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}




