import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, ArrowRight, ArrowLeft, Building2, User, Megaphone, Target, Zap, Briefcase, TrendingUp, Users } from 'lucide-react';
import './Contact.css';
import SEO from '../components/SEO';

export default function Contact() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identity: '',
    goal: '',
    budget: '',
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  const updateData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fetch('http://localhost:5001/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed. Please try again.');
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error('Form submission error:', err);
      setIsError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render Goal options based on Identity
  const getGoalOptions = () => {
    if (formData.identity === 'Creator') {
      return [
        { id: 'monetize', label: 'Monetize Audience', icon: <Target size={24} /> },
        { id: 'brand_deals', label: 'Get Brand Deals', icon: <Briefcase size={24} /> },
        { id: 'growth', label: 'Follower Growth', icon: <TrendingUp size={24} /> }
      ];
    }
    if (formData.identity === 'Startup') {
      return [
        { id: 'funding', label: 'Secure Funding', icon: <Zap size={24} /> },
        { id: 'marketing', label: 'Scale Marketing', icon: <Megaphone size={24} /> },
        { id: 'compliance', label: 'Legal & Compliance', icon: <Building2 size={24} /> }
      ];
    }
    // Default (Brand)
    return [
      { id: 'roas', label: 'Improve ROAS', icon: <Target size={24} /> },
      { id: 'influencers', label: 'Influencer Campaigns', icon: <Users size={24} /> },
      { id: 'sales', label: 'Drive Sales', icon: <Zap size={24} /> }
    ];
  };

  return (
    <div className="contact-page">
      <SEO 
        title="Contact Us | C-PEB" 
        description="Get in touch with C-PEB. Start your journey with our interactive strategy wizard." 
      />
      {/* ── Hero Section ── */}
      <section className="contact-hero">
        <div className="container">
          <p className="section-eyebrow">Strategy Call</p>
          <h1>Let's Build Something Great</h1>
          <p>Tell us a bit about yourself so we can match you with the right growth expert.</p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="contact-content">
        <div className="container contact-grid">
          
          {/* Contact Info Sidebar */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p className="contact-info-desc">Reach out to us directly or complete the strategy wizard, and our team will get back to you within 24 hours.</p>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon"><Phone size={20} /></div>
                <div>
                  <h3>Call Us</h3>
                  <p>+91 98765 43210</p>
                  <span>Mon-Sat, 9am to 6pm</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon"><Mail size={20} /></div>
                <div>
                  <h3>Email Us</h3>
                  <p>hello@c-peb.in</p>
                  <span>Support & General Enquiries</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon"><MapPin size={20} /></div>
                <div>
                  <h3>Visit Us</h3>
                  <p>Mumbai, Maharashtra, India</p>
                  <span>Headquarters</span>
                </div>
              </div>
            </div>

            <div className="contact-social">
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn btn-primary whatsapp-btn">
                <MessageSquare size={18} /> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Wizard Form */}
          <div className="contact-form-wrapper">
            <div className="form-card wizard-card">
              {isSubmitted ? (
                <div className="form-success fade-up">
                  <div className="success-icon-wrap">
                    <CheckCircle2 size={64} className="success-icon-large" />
                  </div>
                  <h3>Request Received!</h3>
                  <p>Thank you for sharing your details. An expert will review your profile and reach out shortly to schedule your strategy call.</p>
                  <button className="btn btn-outline mt-4" onClick={() => { setIsSubmitted(false); setStep(1); setFormData({identity:'', goal:'', budget:'', name:'', email:'', phone:'', company:''}); }}>
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <div className="wizard-container">
                  {/* Progress Bar */}
                  <div className="wizard-progress">
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
                    </div>
                    <span className="progress-text">Step {step} of 4</span>
                  </div>

                  {/* Step 1: Identity */}
                  {step === 1 && (
                    <div className="wizard-step fade-in">
                      <h3>How can we help you today?</h3>
                      <p className="step-desc">Select the option that best describes you.</p>
                      
                      <div className="wizard-options-grid">
                        {[
                          { id: 'Brand', icon: <Briefcase size={28} /> },
                          { id: 'Creator', icon: <User size={28} /> },
                          { id: 'Startup', icon: <Building2 size={28} /> }
                        ].map(opt => (
                          <div 
                            key={opt.id}
                            className={`wizard-option-card ${formData.identity === opt.id ? 'selected' : ''}`}
                            onClick={() => { updateData('identity', opt.id); setTimeout(nextStep, 300); }}
                          >
                            <div className="wo-icon">{opt.icon}</div>
                            <h4>I'm a {opt.id}</h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Goal */}
                  {step === 2 && (
                    <div className="wizard-step fade-in">
                      <h3>What is your primary goal?</h3>
                      <p className="step-desc">This helps us prepare the right strategy for our call.</p>
                      
                      <div className="wizard-options-grid">
                        {getGoalOptions().map(opt => (
                          <div 
                            key={opt.id}
                            className={`wizard-option-card ${formData.goal === opt.id ? 'selected' : ''}`}
                            onClick={() => { updateData('goal', opt.id); setTimeout(nextStep, 300); }}
                          >
                            <div className="wo-icon">{opt.icon}</div>
                            <h4>{opt.label}</h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Budget */}
                  {step === 3 && (
                    <div className="wizard-step fade-in">
                      <h3>What is your monthly budget?</h3>
                      <p className="step-desc">Knowing this helps us recommend realistic solutions.</p>
                      
                      <div className="wizard-options-list">
                        {['Under ₹50k', '₹50k - ₹2L', '₹2L - ₹10L', '₹10L+'].map(budget => (
                          <div 
                            key={budget}
                            className={`wizard-option-row ${formData.budget === budget ? 'selected' : ''}`}
                            onClick={() => { updateData('budget', budget); setTimeout(nextStep, 300); }}
                          >
                            {budget}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Details */}
                  {step === 4 && (
                    <div className="wizard-step fade-in">
                      <h3>Almost done!</h3>
                      <p className="step-desc">Where should we send your strategy blueprint?</p>
                      
                      <form onSubmit={handleSubmit} className="wizard-final-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Full Name *</label>
                            <input type="text" required value={formData.name} onChange={(e) => updateData('name', e.target.value)} placeholder="Jane Doe" />
                          </div>
                          <div className="form-group">
                            <label>Company/Handle</label>
                            <input type="text" value={formData.company} onChange={(e) => updateData('company', e.target.value)} placeholder="@janedoe / Acme Corp" />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Email Address *</label>
                            <input type="email" required value={formData.email} onChange={(e) => updateData('email', e.target.value)} placeholder="jane@example.com" />
                          </div>
                          <div className="form-group">
                            <label>Phone Number *</label>
                            <input type="tel" required value={formData.phone} onChange={(e) => updateData('phone', e.target.value)} placeholder="+91 98765 43210" />
                          </div>
                        </div>

                        {isError && (
                          <div style={{ color: '#e74c3c', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', fontSize: '0.875rem' }}>
                            ⚠️ {isError}
                          </div>
                        )}
                        <button type="submit" className="btn btn-primary submit-btn w-full justify-center mt-3" disabled={isLoading}>
                          {isLoading ? 'Sending…' : <><span>Complete Request</span> <Send size={16} /></>}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Navigation Footer */}
                  {step < 4 && (
                    <div className="wizard-footer">
                      {step > 1 ? (
                        <button className="btn btn-ghost" onClick={prevStep}><ArrowLeft size={16} /> Back</button>
                      ) : <div></div>}
                      
                      <button 
                        className="btn btn-primary" 
                        onClick={nextStep}
                        disabled={
                          (step === 1 && !formData.identity) ||
                          (step === 2 && !formData.goal) ||
                          (step === 3 && !formData.budget)
                        }
                      >
                        Next <ArrowRight size={16} />
                      </button>
                    </div>
                  )}
                  {step === 4 && (
                    <div className="wizard-footer justify-start">
                      <button className="btn btn-ghost" onClick={prevStep}><ArrowLeft size={16} /> Back</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
