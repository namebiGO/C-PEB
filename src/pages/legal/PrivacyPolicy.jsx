import React from 'react';
import SEO from '../../components/SEO';
import './Legal.css';

export default function PrivacyPolicy() {
  return (
    <div className="legal-page fade-in">
      <SEO 
        title="Privacy Policy | C-PEB" 
        description="Privacy Policy for C-PEB platform and services." 
      />
      
      <header className="legal-header">
        <div className="legal-header-inner">
          <h1>Privacy Policy</h1>
          <p className="legal-updated">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </header>

      <div className="legal-layout">
        <aside className="legal-sidebar">
          <h3>Table of Contents</h3>
          <ul>
            <li><a href="#intro">1. Introduction</a></li>
            <li><a href="#data">2. The Data We Collect</a></li>
            <li><a href="#usage">3. How We Use Your Data</a></li>
            <li><a href="#security">4. Data Security</a></li>
            <li><a href="#contact">5. Contact Us</a></li>
          </ul>
        </aside>

        <main className="legal-content-card legal-body">
          <section id="intro">
            <h2>1. Introduction</h2>
            <p>At C-PEB, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
          </section>
          
          <section id="data">
            <h2>2. The Data We Collect</h2>
            <p>Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul>
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
              <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
            </ul>
          </section>

          <section id="usage">
            <h2>3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul>
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal or regulatory obligation.</li>
            </ul>
          </section>

          <section id="security">
            <h2>4. Data Security</h2>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.</p>
          </section>

          <section id="contact">
            <h2>5. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact our data privacy manager at <a href="mailto:privacy@c-peb.in">privacy@c-peb.in</a>.</p>
            <div className="legal-contact-box">
              <p><strong>C-PEB Legal Team</strong><br />Email: <a href="mailto:privacy@c-peb.in">privacy@c-peb.in</a><br />Response time: Within 24-48 business hours</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
