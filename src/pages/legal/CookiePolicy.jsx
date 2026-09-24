import React from 'react';
import SEO from '../../components/SEO';
import './Legal.css';

export default function CookiePolicy() {
  return (
    <div className="legal-page fade-in">
      <SEO
        title="Cookie Policy | C-PEB"
        description="Cookie Policy for C-PEB platform."
      />

      <header className="legal-header">
        <div className="legal-header-inner">
          <h1>Cookie Policy</h1>
          <p className="legal-updated">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </header>

      <div className="legal-layout">
        <aside className="legal-sidebar">
          <h3>Table of Contents</h3>
          <ul>
            <li><a href="#what-are-cookies">1. What Are Cookies</a></li>
            <li><a href="#how-we-use">2. How We Use Cookies</a></li>
            <li><a href="#disabling">3. Disabling Cookies</a></li>
            <li><a href="#the-cookies">4. The Cookies We Set</a></li>
            <li><a href="#third-party">5. Third Party Cookies</a></li>
            <li><a href="#contact">6. Contact Information</a></li>
          </ul>
        </aside>

        <main className="legal-content-card legal-body">
          <section id="what-are-cookies">
            <h2>1. What Are Cookies</h2>
            <p>As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies.</p>
          </section>

          <section id="how-we-use">
            <h2>2. How We Use Cookies</h2>
            <p>We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.</p>
          </section>

          <section id="disabling">
            <h2>3. Disabling Cookies</h2>
            <p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site.</p>
          </section>

          <section id="the-cookies">
            <h2>4. The Cookies We Set</h2>
            <ul>
              <li><strong>Account related cookies:</strong> If you create an account with us then we will use cookies for the management of the signup process and general administration.</li>
              <li><strong>Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page.</li>
              <li><strong>Forms related cookies:</strong> When you submit data through a form such as those found on contact pages or comment forms, cookies may be set to remember your user details for future correspondence.</li>
            </ul>
          </section>

          <section id="third-party">
            <h2>5. Third Party Cookies</h2>
            <p>In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.</p>
            <ul>
              <li>This site uses Google Analytics which is one of the most widespread and trusted analytics solutions on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.</li>
            </ul>
          </section>

          <section id="contact">
            <h2>6. Contact Information</h2>
            <p>Hopefully that has clarified things for you. If you are still looking for more information, you can contact us at <a href="mailto:privacy@c-peb.in">privacy@c-peb.in</a>.</p>
            <div className="legal-contact-box">
              <p><strong>C-PEB Data Protection Officer</strong><br />Email: <a href="mailto:privacy@c-peb.in">privacy@c-peb.in</a><br />Subject: Cookie Preferences & Policy</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
