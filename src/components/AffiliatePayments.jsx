import React from 'react';
import './AffiliatePayments.css';
import { CreditCard, List, Megaphone, TrendingUp } from 'lucide-react';

const AffiliatePayments = () => {
  return (
    <section className="payments-section">
      <div className="container">
        
        <div className="payments-layout">
          
          {/* Left: Visual Mockups */}
          <div className="payments-visual">
            <div className="mock-payment-card">
              <div className="mock-card-header">
                <CreditCard size={20} className="accent" />
                <span className="mock-card-title">Payout Method</span>
              </div>
              
              <div className="mock-card-body">
                <div className="mock-option active">
                  <div className="mock-radio"></div>
                  <span>Direct Bank Transfer</span>
                </div>
                <div className="mock-option">
                  <div className="mock-radio empty"></div>
                  <span>PayPal</span>
                </div>
                
                <div className="mock-input-group mt-3">
                  <label>Account Number</label>
                  <div className="mock-input">•••• •••• •••• 9030</div>
                </div>
              </div>
            </div>

            <div className="mock-statement-card">
              <div className="mock-card-header">
                <List size={18} />
                <span className="mock-card-title">Recent Statements</span>
              </div>
              
              <div className="mock-statement-list">
                <div className="mock-statement-row">
                  <div className="mock-st-left">
                    <span className="mock-st-date">Today</span>
                    <span className="mock-st-desc">Brand Collab - TechReview</span>
                  </div>
                  <span className="mock-st-amount positive">+₹45,000</span>
                </div>
                <div className="mock-statement-row">
                  <div className="mock-st-left">
                    <span className="mock-st-date">May 05</span>
                    <span className="mock-st-desc">Affiliate Payout - Amazon</span>
                  </div>
                  <span className="mock-st-amount positive">+₹12,400</span>
                </div>
                <div className="mock-statement-row">
                  <div className="mock-st-left">
                    <span className="mock-st-date">Apr 28</span>
                    <span className="mock-st-desc">Platform Fee</span>
                  </div>
                  <span className="mock-st-amount negative">-₹1,200</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="payments-copy">
            <p className="section-eyebrow">Influencer Affiliate Payments</p>
            <h2>Pay influencers, Send creators free products</h2>
            <p className="payments-desc">
              Manage all your creator payouts in one place. Whether it's flat fees, affiliate commissions, or sending out product samples, our automated system ensures everyone gets paid on time, every time.
            </p>

            <div className="payments-features">
              
              <div className="pay-feat-item">
                <div className="pay-feat-icon">
                  <Megaphone size={24} />
                </div>
                <div className="pay-feat-text">
                  <h4>Promote Your Product & Brand</h4>
                  <p>Send free product samples seamlessly to creators. Track deliveries and content deliverables directly in your dashboard.</p>
                </div>
              </div>

              <div className="pay-feat-item">
                <div className="pay-feat-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="pay-feat-text">
                  <h4>Scale Up Businesses</h4>
                  <p>Set up multi-tiered affiliate structures. Reward your top-performing creators with automated performance bonuses.</p>
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
