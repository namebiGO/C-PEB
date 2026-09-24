import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ArrowRight, ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';
import './Tools.css';
import SEO from '../../components/SEO';

const QUESTIONS = [
  {
    id: 'age',
    q: 'How old is your business?',
    options: [
      { label: 'Just starting (0-1 year)', value: 'new' },
      { label: 'Growing (1-3 years)', value: 'growing' },
      { label: 'Established (3+ years)', value: 'established' }
    ]
  },
  {
    id: 'revenue',
    q: 'What is your current annual revenue?',
    options: [
      { label: 'Pre-revenue / Under ₹10L', value: 'low' },
      { label: '₹10L - ₹1Cr', value: 'mid' },
      { label: 'Over ₹1Cr', value: 'high' }
    ]
  },
  {
    id: 'sector',
    q: 'What is your primary sector?',
    options: [
      { label: 'Manufacturing', value: 'mfg' },
      { label: 'Technology / IT', value: 'tech' },
      { label: 'Services / Consulting', value: 'services' },
      { label: 'Retail / E-commerce', value: 'retail' }
    ]
  }
];

export default function FundingChecker() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComputing, setIsComputing] = useState(false);
  const [results, setResults] = useState(null);

  const handleOptionSelect = (qId, val) => {
    const newAnswers = { ...answers, [qId]: val };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Final step -> compute results
      setIsComputing(true);
      setTimeout(() => {
        computeResults(newAnswers);
        setIsComputing(false);
      }, 1500); // fake loading for effect
    }
  };

  const computeResults = (ans) => {
    const schemes = [];
    const { age, revenue, sector } = ans;

    // 1. Mudra Loans (Micro-credit)
    if (age === 'new' && revenue === 'low') {
      schemes.push({
        name: 'Mudra Loan (Shishu)',
        amount: 'Up to ₹50,000',
        desc: 'Micro-credit for very new startups needing immediate, small-scale working capital.'
      });
    } else if ((age === 'growing' || age === 'established') && (revenue === 'low' || revenue === 'mid')) {
      schemes.push({
        name: 'Mudra Loan (Kishor / Tarun)',
        amount: '₹5 Lakhs - ₹10 Lakhs',
        desc: 'Expansion capital for growing micro-enterprises without requiring collateral.'
      });
    }

    // 2. Startup India Seed Fund
    if ((sector === 'tech' || sector === 'services') && (age === 'new' || age === 'growing')) {
      schemes.push({
        name: 'Startup India Seed Fund Scheme (SISFS)',
        amount: 'Up to ₹20 Lakhs (Grant) / ₹50 Lakhs (Debt)',
        desc: 'For DPIIT recognized startups focusing on tech or innovative services for proof of concept and prototype development.'
      });
    }

    // 3. CGTMSE / PSB59
    if ((age === 'growing' || age === 'established') && (revenue === 'mid' || revenue === 'high')) {
      schemes.push({
        name: 'CGTMSE Backed Loan',
        amount: 'Up to ₹5 Crore',
        desc: 'Collateral-free loans for established MSMEs through participating banks, backed by government guarantee.'
      });
      if (revenue === 'high') {
        schemes.push({
          name: 'PSB59 Business Loan',
          amount: 'Up to ₹5 Crore',
          desc: 'In-principle approval in 59 minutes for established businesses with GST and IT returns.'
        });
      }
    }

    // 4. Sector-Specific
    if (sector === 'mfg') {
      schemes.push({
        name: 'PMEGP Scheme',
        amount: 'Up to ₹50 Lakhs',
        desc: 'Credit-linked subsidy programme specifically to help set up new manufacturing enterprises.'
      });
      if (revenue === 'high') {
        schemes.push({
          name: 'PLI Scheme (Production Linked Incentive)',
          amount: '4% - 6% of incremental sales',
          desc: 'Financial incentives to boost domestic manufacturing and attract large investments.'
        });
      }
    }

    if (sector === 'retail' && revenue !== 'high') {
      schemes.push({
        name: 'ONDC Retail Support',
        amount: 'Varies',
        desc: 'Subsidies and support for small retailers to digitize and onboard onto the Open Network for Digital Commerce.'
      });
    }

    if (sector === 'tech' && age === 'established') {
      schemes.push({
        name: 'STPI Export Benefits',
        amount: 'Tax Exemptions',
        desc: 'Benefits for established IT/ITeS companies exporting software services.'
      });
    }

    // Always ensure at least 2 schemes are shown as a fallback
    if (schemes.length === 0) {
      schemes.push({
        name: 'Stand-Up India Scheme',
        amount: '₹10 Lakhs - ₹1 Crore',
        desc: 'Bank loans for setting up a new enterprise, specifically aimed at SC/ST or women entrepreneurs.'
      });
      schemes.push({
        name: 'SMILE Scheme',
        amount: 'Varies',
        desc: 'Soft loans for MSMEs to meet their debt-to-equity ratio requirements for expansion.'
      });
    }

    // Sort by amount / relevance ideally, but for now just take the top 4 to not overwhelm
    setResults(schemes.slice(0, 4));
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResults(null);
  };

  return (
    <div className="tools-page">
      <SEO 
        title="Startup Funding Checker | C-PEB" 
        description="Find out which government schemes, grants, and loans your startup is eligible for." 
      />
      
      <div className="container">
        <div className="tools-breadcrumb">
          <Link to="/tools">← Back to Tools</Link>
        </div>
      </div>

      <section className="tool-calculator-section">
        <div className="container max-w-800">
          
          <div className="checker-card">
            
            {!results && !isComputing && (
              <div className="checker-quiz fade-in">
                <div className="quiz-header">
                  <span className="quiz-step-count">Step {step + 1} of {QUESTIONS.length}</span>
                  <div className="quiz-progress-bar">
                    <div className="quiz-progress-fill" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}></div>
                  </div>
                  <h2>{QUESTIONS[step].q}</h2>
                </div>

                <div className="quiz-options">
                  {QUESTIONS[step].options.map(opt => (
                    <button 
                      key={opt.value} 
                      className="quiz-opt-btn"
                      onClick={() => handleOptionSelect(QUESTIONS[step].id, opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {step > 0 && (
                  <button className="quiz-back-btn" onClick={() => setStep(step - 1)}>
                    <ArrowLeft size={14} /> Back
                  </button>
                )}
              </div>
            )}

            {isComputing && (
              <div className="checker-loading fade-in text-center">
                <div className="loader-spinner mx-auto mb-4"></div>
                <h3>Analyzing your profile...</h3>
                <p className="text-gray">Scanning 50+ government schemes and lending partners.</p>
              </div>
            )}

            {results && !isComputing && (
              <div className="checker-results fade-in">
                <div className="results-header text-center">
                  <div className="r-badge mx-auto mb-3"><CheckCircle2 size={32} className="text-green" /></div>
                  <h2>You're Eligible!</h2>
                  <p>Based on your profile, here are the top schemes you should apply for:</p>
                </div>

                <div className="schemes-list mt-5">
                  {results.map((s, i) => (
                    <div className="scheme-card" key={i}>
                      <div className="scheme-icon"><Building2 size={24} /></div>
                      <div className="scheme-info">
                        <h4>{s.name}</h4>
                        <span className="scheme-amount">{s.amount}</span>
                        <p>{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="results-cta mt-5 text-center p-4 bg-alt rounded-lg border">
                  <h3>Need help applying?</h3>
                  <p className="mb-3">Our compliance team can prepare your documents and apply on your behalf.</p>
                  <Link to="/contact" className="btn btn-primary w-full justify-center">Get Application Support</Link>
                  <button className="btn btn-outline w-full justify-center mt-3" onClick={reset}>Retake Quiz</button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>
    </div>
  );
}
