import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import './CreatorApplySection.css';
import '../pages/creators/CreatorApply.css';

const CATEGORIES = [
  'Fashion', 'Beauty', 'Lifestyle', 'Food', 'Travel', 'Fitness',
  'Technology', 'Education', 'Finance', 'Gaming', 'Entertainment',
  'Comedy', 'Music', 'Automotive', 'Parenting', 'Business',
  'Photography', 'Motivation', 'Other',
];

const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 +91' },
  { code: '+1',  label: '🇺🇸 +1' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+971',label: '🇦🇪 +971' },
  { code: '+65', label: '🇸🇬 +65' },
  { code: '+61', label: '🇦🇺 +61' },
  { code: '+49', label: '🇩🇪 +49' },
];

const PERKS = [
  {
    icon: '💼',
    title: 'Connect with funded startups & brands',
    desc: 'Access 500+ brand partners actively looking for creators like you.',
  },
  {
    icon: '💸',
    title: 'Guaranteed payouts within 15 days',
    desc: '₹5 Crore+ already paid out. Your earnings, always on time.',
  },
  {
    icon: '🎯',
    title: 'Dedicated talent manager',
    desc: 'A personal manager handles campaigns, negotiations & support.',
  },
];

export default function CreatorApplySection() {
  const [form, setForm] = useState({
    creatorName: '',
    instagram: '',
    category: '',
    city: '',
    countryCode: '+91',
    whatsappNumber: '',
    email: '',
    youtube: '',
    otherSocial: '',
  });

  const [showOptional, setShowOptional] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.creatorName.trim())     e.creatorName     = 'Please enter your creator name.';
    if (!form.instagram.trim())       e.instagram       = 'Please enter your Instagram username or profile link.';
    if (!form.category)               e.category        = 'Please select a content category.';
    if (!form.city.trim())            e.city            = 'Please enter your city.';
    if (!form.whatsappNumber.trim())  e.whatsappNumber  = 'Please enter your WhatsApp number.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    try {
      const payload = {
        creatorName: form.creatorName,
        instagram:   form.instagram,
        category:    form.category,
        city:        form.city,
        whatsapp:    `${form.countryCode} ${form.whatsappNumber}`.trim(),
        email:       form.email,
        youtube:     form.youtube,
        otherSocial: form.otherSocial,
      };

      const res  = await fetch('/api/creators/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setServerError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setServerError('Could not connect to server. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="cas-section" id="join-as-creator" aria-label="Apply as a Creator">

      {/* Section header */}
      <p className="cas-section-label">Join C-PEB Creators</p>
      <h2 className="cas-section-heading">Get discovered by the right brands</h2>
      <p className="cas-section-sub">
        Create your creator profile in under a minute. We review every application before it goes live.
      </p>

      <div className="cas-inner">

        {/* ── LEFT – selling points ── */}
        <div className="cas-left">
          <div className="cas-perks-list">
            {PERKS.map((p) => (
              <div className="cas-perk" key={p.title}>
                <div className="cas-perk-icon">{p.icon}</div>
                <div className="cas-perk-copy">
                  <strong>{p.title}</strong>
                  <span>{p.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="cas-stats">
            <div className="cas-stat">
              <strong>25K+</strong>
              <span>Active Creators</span>
            </div>
            <div className="cas-stat">
              <strong>₹5Cr+</strong>
              <span>Paid Out</span>
            </div>
            <div className="cas-stat">
              <strong>500+</strong>
              <span>Brand Partners</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT – form ── */}
        <div className="cas-right">

          {submitted ? (
            <div className="cas-success-inner">
              <div className="cas-success-badge">PENDING REVIEW</div>
              <h3>Application Received 🎉</h3>
              <p>
                Thanks for applying to C-PEB Creators. We'll review your profile
                and reach out on WhatsApp within 48 hours.
              </p>
            </div>
          ) : (
            <form className="ca-form" onSubmit={handleSubmit} noValidate>

              {serverError && (
                <div className="ca-server-error">{serverError}</div>
              )}

              {/* Creator Name */}
              <div className="ca-field">
                <label htmlFor="cas-name">Creator Name <span className="ca-req">*</span></label>
                <input
                  id="cas-name"
                  type="text"
                  placeholder="Your name or creator name"
                  value={form.creatorName}
                  onChange={set('creatorName')}
                  className={errors.creatorName ? 'ca-input-err' : ''}
                  autoComplete="name"
                />
                {errors.creatorName && <p className="ca-err">{errors.creatorName}</p>}
              </div>

              {/* Instagram */}
              <div className="ca-field">
                <label htmlFor="cas-ig">Instagram Profile <span className="ca-req">*</span></label>
                <input
                  id="cas-ig"
                  type="text"
                  placeholder="@username or profile link"
                  value={form.instagram}
                  onChange={set('instagram')}
                  className={errors.instagram ? 'ca-input-err' : ''}
                  autoCapitalize="none"
                  autoCorrect="off"
                />
                {errors.instagram && <p className="ca-err">{errors.instagram}</p>}
              </div>

              {/* Category */}
              <div className="ca-field">
                <label htmlFor="cas-cat">What do you create? <span className="ca-req">*</span></label>
                <div className="ca-select-wrap">
                  <select
                    id="cas-cat"
                    value={form.category}
                    onChange={set('category')}
                    className={errors.category ? 'ca-input-err' : ''}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                {errors.category && <p className="ca-err">{errors.category}</p>}
              </div>

              {/* City */}
              <div className="ca-field">
                <label htmlFor="cas-city">City <span className="ca-req">*</span></label>
                <input
                  id="cas-city"
                  type="text"
                  placeholder="Your city"
                  value={form.city}
                  onChange={set('city')}
                  className={errors.city ? 'ca-input-err' : ''}
                  autoComplete="address-level2"
                />
                {errors.city && <p className="ca-err">{errors.city}</p>}
              </div>

              {/* WhatsApp */}
              <div className="ca-field">
                <label htmlFor="cas-wa">WhatsApp Number <span className="ca-req">*</span></label>
                <div className="ca-phone-row">
                  <select
                    className="ca-phone-code"
                    value={form.countryCode}
                    onChange={set('countryCode')}
                    aria-label="Country code"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                  <input
                    id="cas-wa"
                    type="tel"
                    placeholder="98765 43210"
                    value={form.whatsappNumber}
                    onChange={set('whatsappNumber')}
                    className={errors.whatsappNumber ? 'ca-input-err' : ''}
                    autoComplete="tel-national"
                  />
                </div>
                {errors.whatsappNumber && <p className="ca-err">{errors.whatsappNumber}</p>}
              </div>

              {/* Optional toggle */}
              <button
                type="button"
                className="ca-optional-toggle"
                onClick={() => setShowOptional((p) => !p)}
              >
                {showOptional ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                {showOptional ? 'Hide optional details' : '+ Add more details (optional)'}
              </button>

              {showOptional && (
                <div className="ca-optional-fields">
                  <div className="ca-field">
                    <label htmlFor="cas-email">Email</label>
                    <input
                      id="cas-email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={set('email')}
                      autoComplete="email"
                    />
                  </div>
                  <div className="ca-field">
                    <label htmlFor="cas-yt">YouTube Profile</label>
                    <input
                      id="cas-yt"
                      type="text"
                      placeholder="@yourchannel or YouTube URL"
                      value={form.youtube}
                      onChange={set('youtube')}
                    />
                  </div>
                  <div className="ca-field">
                    <label htmlFor="cas-other">Other Social Profile</label>
                    <input
                      id="cas-other"
                      type="text"
                      placeholder="Twitter, LinkedIn, TikTok, etc."
                      value={form.otherSocial}
                      onChange={set('otherSocial')}
                    />
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="ca-submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Submitting…' : <><span>Apply as Creator</span> <ArrowRight size={16} /></>}
              </button>

              <p className="ca-microcopy">
                Your profile will be reviewed before it appears publicly on C-PEB.
              </p>
              <p className="ca-privacy">
                We'll only use your information for creator onboarding and relevant opportunities.
              </p>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}
