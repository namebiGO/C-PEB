import React from 'react';
import './AffiliatePayments.css';
import { CreditCard, List, ShieldCheck, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

const AffiliatePayments = () => {
  return (
    <section className="payments-section">
      <div className="container">
        
        <div className="payments-layout">
          
          {/* Left: Visual Mockups */}
          <div className="payments-visual">
            
            {/* Background Activity Card */}
            <div className="rzp-activity-card">
              <div className="rzp-card-header">
                <Activity size={18} className="rzp-muted-icon" />
                <span className="rzp-card-title">Payment Activity</span>
              </div>
              <div className="rzp-statement-list">
                <div className="rzp-statement-row">
                  <div className="rzp-st-left">
                    <span className="rzp-st-desc">Creator Campaign</span>
                    <span className="rzp-st-amount">₹45,000</span>
                  </div>
                  <span className="rzp-st-status paid">Paid</span>
                </div>
                <div className="rzp-statement-row">
                  <div className="rzp-st-left">
                    <span className="rzp-st-desc">Affiliate Payment</span>
                    <span className="rzp-st-amount">₹12,400</span>
                  </div>
                  <span className="rzp-st-status paid">Paid</span>
                </div>
              </div>
            </div>

            {/* Foreground Checkout Card */}
            <div className="rzp-checkout-card">
              <div className="rzp-header">
                <span className="rzp-eyebrow">PAYMENT</span>
              </div>
              
              <div className="rzp-amount-section">
                <h3 className="rzp-title">Creator Payment</h3>
                <div className="rzp-amount">₹12,400</div>
              </div>

              <div className="rzp-method-section">
                <span className="rzp-method-label">Payment Method</span>
                <div className="rzp-method-box">
                  <div className="rzp-logo">
                    <div className="rzp-logo-mark"></div>
                    <span>Razorpay</span>
                  </div>
                  <div className="rzp-radio active"></div>
                </div>
              </div>

              <div className="rzp-security">
                <CheckCircle2 size={14} className="rzp-accent" />
                <span>Secure payment powered by Razorpay</span>
              </div>
            </div>

          </div>

          {/* Right: Text Content */}
          <div className="payments-copy">
            <p className="section-eyebrow">CREATOR PAYMENTS</p>
            <h2>Simple, Secure Payments for Creators</h2>
            <p className="payments-desc">
              Make creator payments simple with a secure online payment experience powered by Razorpay. C-PEB helps you manage payments while keeping the experience straightforward for your team and creators.
            </p>

            <div className="payments-features">
              
              <div className="pay-feat-item">
                <div className="pay-feat-icon">
                  <ShieldCheck size={24} />
                </div>
                <div className="pay-feat-text">
                  <h4>Secure Payments</h4>
                  <p>Give creators a simple and secure online payment experience through Razorpay.</p>
                </div>
              </div>

              <div className="pay-feat-item">
                <div className="pay-feat-icon">
                  <CreditCard size={24} />
                </div>
                <div className="pay-feat-text">
                  <h4>Simple Payment Flow</h4>
                  <p>Keep the payment experience straightforward, from payment initiation to confirmation.</p>
                </div>
              </div>

              <div className="pay-feat-item">
                <div className="pay-feat-icon">
                  <List size={24} />
                </div>
                <div className="pay-feat-text">
                  <h4>Easy to Track</h4>
                  <p>Keep payment activity organized so your team can easily follow creator payments.</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AffiliatePayments;
