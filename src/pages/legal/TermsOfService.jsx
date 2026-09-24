import React from 'react';
import SEO from '../../components/SEO';
import './Legal.css';

export default function TermsOfService() {
  return (
    <div className="legal-page fade-in">
      <SEO 
        title="Terms of Service | C-PEB" 
        description="Terms of Service for C-PEB platform." 
      />
      
      <header className="legal-header">
        <div className="legal-header-inner">
          <h1>Terms of Service</h1>
          <p className="legal-updated">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </header>

      <div className="legal-layout">
        <aside className="legal-sidebar">
          <h3>Table of Contents</h3>
          <ul>
            <li><a href="#acceptance">1. Acceptance of Terms</a></li>
            <li><a href="#description">2. Description of Service</a></li>
            <li><a href="#conduct">3. User Conduct</a></li>
            <li><a href="#payments">4. Payments and Fees</a></li>
            <li><a href="#liability">5. Limitation of Liability</a></li>
            <li><a href="#contact">6. Contact Information</a></li>
          </ul>
        </aside>

        <main className="legal-content-card legal-body">
          <section id="acceptance">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using the C-PEB website and services, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement.</p>
          </section>
          
          <section id="description">
            <h2>2. Description of Service</h2>
            <p>C-PEB provides a platform connecting creators, startups, and brands for promotional and marketing services. We also offer business compliance and support services. We reserve the right to modify or discontinue, temporarily or permanently, the Service with or without notice to you. You agree that C-PEB shall not be liable to you or any third party for any modification, suspension or discontinuance of the Service.</p>
          </section>

          <section id="conduct">
            <h2>3. User Conduct</h2>
            <p>You agree to not use the Service to:</p>
            <ul>
              <li>Upload, post, email, transmit or otherwise make available any content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libellous, invasive of another's privacy, hateful, or racially, ethnically or otherwise objectionable.</li>
              <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
              <li>Interfere with or disrupt the Service or servers or networks connected to the Service, or disobey any requirements, procedures, policies or regulations of networks connected to the Service.</li>
            </ul>
          </section>

          <section id="payments">
            <h2>4. Payments and Fees</h2>
            <p>All payments for services must be made in accordance with the pricing and payment terms presented to you at the time of purchase. Fees are non-refundable unless explicitly stated otherwise in a separate agreement or as required by applicable law.</p>
          </section>

          <section id="liability">
            <h2>5. Limitation of Liability</h2>
            <p>You expressly understand and agree that C-PEB shall not be liable for any indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses (even if C-PEB has been advised of the possibility of such damages), resulting from the use or the inability to use the service.</p>
          </section>

          <section id="contact">
            <h2>6. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at <a href="mailto:legal@c-peb.in">legal@c-peb.in</a>.</p>
            <div className="legal-contact-box">
              <p><strong>C-PEB Legal Department</strong><br />Email: <a href="mailto:legal@c-peb.in">legal@c-peb.in</a><br />Location: New Delhi, India</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
