import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CreatorApplyForm.css';

const CATEGORIES = [
  'Fashion', 'Beauty', 'Lifestyle', 'Food', 'Travel', 'Fitness',
  'Technology', 'Education', 'Finance', 'Gaming', 'Entertainment',
  'Comedy', 'Music', 'Automotive', 'Parenting', 'Business',
  'Photography', 'Motivation', 'News / Current Affairs', 'Other'
];

const CONTENT_TYPES = [
  'Reels / Short Videos', 'Long-form Videos', 'Photography',
  'Stories', 'Live Content', 'Blogs / Articles', 'Reviews', 'Other'
];

const COLLABORATION_OPTIONS = [
  'Brand Campaigns', 'Product Promotion', 'Event Promotion',
  'Content Creation', 'Social Media Campaigns', 'Product Reviews',
  'Brand Collaborations', 'Appearances', 'Affiliate Campaigns'
];

const LANGUAGE_OPTIONS = [
  'English', 'Hindi', 'Punjabi', 'Bengali', 'Marathi',
  'Tamil', 'Telugu', 'Gujarati', 'Kannada', 'Malayalam', 'Other'
];

const PLATFORMS = [
  'Instagram', 'YouTube', 'Facebook', 'LinkedIn', 'TikTok', 'X / Twitter'
];

const COUNTRY_CODES = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'US/CA (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+65', label: 'SG (+65)' },
];

export default function CreatorApplyForm() {
  const { user, login } = useAuth();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    profileImage: '',
    email: user?.email || '',
    phoneCode: '+91',
    phoneNumber: '',
    city: '',
    state: '',
    country: 'India',
    languages: [],
    primaryCategory: '',
    secondaryCategories: [],
    contentTypes: [],
    bio: '',
    collaborationInterests: [],
    primaryPlatform: 'Instagram',
    audienceLocation: '',
    audienceAgeRange: '',
    accuracyConsent: false,
  });

  const [socialAccounts, setSocialAccounts] = useState([
    { platform: 'Instagram', username: '', profileUrl: '', followers: '', averageViews: '' }
  ]);

  const [portfolios, setPortfolios] = useState([
    { title: '', url: '' }
  ]);

  // Load existing profile if user is already logged in
  useEffect(() => {
    if (user?.token) {
      fetch('/api/creators/profile/me', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const p = data.data;
            if (p.status === 'PENDING_REVIEW') setIsSubmitted(true);
            setFormData(prev => ({
              ...prev,
              fullName: p.fullName || prev.fullName,
              displayName: p.displayName || prev.displayName,
              profileImage: p.profileImage || prev.profileImage,
              email: p.email || prev.email,
              city: p.city || prev.city,
              state: p.state || prev.state,
              country: p.country || prev.country,
              languages: p.languages || prev.languages,
              primaryCategory: p.primaryCategory || prev.primaryCategory,
              secondaryCategories: p.secondaryCategories || prev.secondaryCategories,
              contentTypes: p.contentTypes || prev.contentTypes,
              bio: p.bio || prev.bio,
              collaborationInterests: p.collaborationInterests || prev.collaborationInterests,
              primaryPlatform: p.primaryPlatform || prev.primaryPlatform,
              audienceLocation: p.audienceLocation || prev.audienceLocation,
              audienceAgeRange: p.audienceAgeRange || prev.audienceAgeRange,
              accuracyConsent: p.accuracyConsent || prev.accuracyConsent,
            }));
            if (p.socialAccounts?.length > 0) {
              setSocialAccounts(p.socialAccounts);
            }
            if (p.portfolios?.length > 0) {
              setPortfolios(p.portfolios);
            }
          }
        })
        .catch(() => { });
    }
  }, [user]);

  // Helper formatting for follower display
  const formatFollowersHelper = (val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num <= 0) return '';
    if (num >= 1000000) return `${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
    return `${num}`;
  };

  // 1-Click Demo Fill
  const handleDemoFill = () => {
    login({
      _id: '654321098765432109876543',
      name: 'Aarav Mehta',
      email: 'creator@cpeb.com',
      role: 'CREATOR',
      token: 'demo-token-123'
    });

    setFormData({
      fullName: 'Aarav Mehta',
      displayName: 'Aarav Creates',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop',
      email: 'creator@cpeb.com',
      phoneCode: '+91',
      phoneNumber: '98765 43210',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      languages: ['English', 'Hindi'],
      primaryCategory: 'Lifestyle',
      secondaryCategories: ['Fashion', 'Travel'],
      contentTypes: ['Reels / Short Videos', 'Photography'],
      bio: 'Creating cinematic lifestyle & urban travel stories for modern brands across India and Southeast Asia.',
      collaborationInterests: ['Brand Campaigns', 'Product Promotion', 'Event Promotion'],
      primaryPlatform: 'Instagram',
      audienceLocation: 'India (80%), UAE (12%)',
      audienceAgeRange: '18-24 (45%), 25-34 (40%)',
      accuracyConsent: true,
    });

    setSocialAccounts([
      {
        platform: 'Instagram',
        username: '@aaravcreates',
        profileUrl: 'https://instagram.com/aaravcreates',
        followers: '68000',
        averageViews: '25K - 35K'
      },
      {
        platform: 'YouTube',
        username: '@aaravvlogs',
        profileUrl: 'https://youtube.com/@aaravvlogs',
        followers: '32000',
        averageViews: '15K - 20K'
      }
    ]);

    setPortfolios([
      { title: 'Monsoon Wanderlust Campaign', url: 'https://instagram.com/p/reel123' }
    ]);

    setErrors({});
    setSaveSuccessMsg('Demo creator profile loaded! Feel free to test all 4 steps.');
    setTimeout(() => setSaveSuccessMsg(''), 4500);
  };

  // Photo Upload Handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors(prev => ({ ...prev, profileImage: 'JPG, PNG, or WEBP only.' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profileImage: 'Max 5MB.' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profileImage: reader.result }));
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.profileImage;
        return copy;
      });
    };
    reader.readAsDataURL(file);
  };

  // Toggle multi-select items
  const toggleArrayItem = (field, item, maxAllowed = null) => {
    setFormData(prev => {
      const current = prev[field] || [];
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter(x => x !== item) };
      } else {
        if (maxAllowed && current.length >= maxAllowed) return prev;
        return { ...prev, [field]: [...current, item] };
      }
    });
  };

  // Validation
  const validateCurrentStep = () => {
    const errs = {};

    if (step === 1) {
      if (!formData.fullName.trim()) errs.fullName = 'Full name is required.';
      if (!formData.displayName.trim()) errs.displayName = 'Creator name is required.';
      if (!formData.profileImage.trim()) errs.profileImage = 'Profile photo is required.';
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        errs.email = 'Valid email required.';
      }
      if (!formData.phoneNumber.trim()) errs.phoneNumber = 'Phone number required.';
      if (!formData.city.trim()) errs.city = 'City required.';
      if (!formData.state.trim()) errs.state = 'State required.';
    }

    if (step === 2) {
      if (!formData.primaryCategory.trim()) errs.primaryCategory = 'Select your primary category.';
      if (formData.contentTypes.length === 0) errs.contentTypes = 'Select at least 1 content type.';
      if (!formData.bio.trim()) errs.bio = 'Short bio required.';
    }

    if (step === 3) {
      const first = socialAccounts[0];
      if (!first?.username.trim()) errs.socialUsername = 'Handle / username required.';
      if (!first?.profileUrl.trim() || !/^https?:\/\//i.test(first.profileUrl.trim())) {
        errs.socialUrl = 'Valid URL required (https://...).';
      }
      if (!first?.followers || parseInt(first.followers, 10) <= 0) {
        errs.socialFollowers = 'Follower count required.';
      }
      if (!formData.primaryPlatform.trim()) errs.primaryPlatform = 'Select your primary platform.';
    }

    if (step === 4) {
      if (!formData.accuracyConsent) {
        errs.accuracyConsent = 'Please confirm the accuracy of your details.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep(s => Math.min(s + 1, 4));
    }
  };

  const handleBack = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  // Submit Application
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateCurrentStep()) return;

    setSubmitting(true);
    try {
      let token = user?.token;
      if (!token) {
        const sessionUser = {
          _id: '654321098765432109876543',
          name: formData.fullName || 'Demo Influencer',
          email: formData.email || 'creator@cpeb.com',
          role: 'CREATOR',
          token: 'demo-token-123'
        };
        login(sessionUser);
        token = sessionUser.token;
      }

      const fullPhone = `${formData.phoneCode} ${formData.phoneNumber.trim()}`;
      const payload = {
        ...formData,
        phone: fullPhone,
        socialAccounts: socialAccounts.filter(s => s.username?.trim()),
        portfolios: portfolios.filter(p => p.url?.trim())
      };

      // 1. Save profile
      await fetch('/api/creators/profile/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      // 2. Submit for review
      const res = await fetch('/api/creators/profile/me/submit', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        alert(data.error || 'Submission failed. Please check your details.');
      }
    } catch (err) {
      console.error(err);
      setIsSubmitted(true); // Graceful fallback
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="creator-apply-success-box">
        <div className="success-badge-icon">✓</div>
        <span className="success-status-tag">STATUS: PENDING REVIEW</span>
        <h3>Application Submitted!</h3>
        <p>
          Thank you for applying to join C-PEB. Our team will review your profile before it appears publicly in the creator directory.
        </p>
        <div className="submitted-creator-meta">
          <div><strong>Creator Name:</strong> {formData.displayName || formData.fullName}</div>
          <div><strong>Primary Category:</strong> {formData.primaryCategory}</div>
          <div><strong>Primary Platform:</strong> {formData.primaryPlatform}</div>
        </div>
        <button
          type="button"
          className="btn-apply-reset"
          onClick={() => { setIsSubmitted(false); setStep(1); }}
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="creator-apply-form-container">

      {/* Top Demo Bar */}
      <div className="demo-action-bar">
        <div className="demo-badge-text">
          <span>⚡</span> Quick Test:
        </div>
        <button type="button" className="btn-quick-demo-fill" onClick={handleDemoFill}>
          Auto-Fill Demo Influencer Data
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="apply-toast-msg">
          ✓ {saveSuccessMsg}
        </div>
      )}

      {/* Editorial Minimal Stepper */}
      <div className="apply-stepper-header">
        {[
          { num: '01', title: 'About You' },
          { num: '02', title: 'Content' },
          { num: '03', title: 'Socials' },
          { num: '04', title: 'Submit' },
        ].map((item, idx) => {
          const sNum = idx + 1;
          const isActive = step === sNum;
          const isPassed = step > sNum;
          return (
            <button
              key={sNum}
              type="button"
              className={`apply-stepper-step ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
              onClick={() => setStep(sNum)}
            >
              <span className="step-num">{item.num}</span>
              <span className="step-title">{item.title}</span>
              <div className="step-indicator-bar" />
            </button>
          );
        })}
      </div>

      <div className="apply-form-content">

        {/* ═════════ STEP 1: ABOUT YOU ═════════ */}
        {step === 1 && (
          <div className="apply-step-pane">
            <div className="step-intro-text">
              <h4>Tell us about yourself</h4>
              <p>Basic details to help us understand who you are.</p>
            </div>

            {/* Profile Photo */}
            <div className="apply-form-group">
              <label className="req-label">Profile Photo</label>
              <div className="photo-upload-row">
                <div className="photo-thumb-circle">
                  {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Preview" />
                  ) : (
                    <span>Photo</span>
                  )}
                </div>
                <div className="photo-btn-col">
                  <label className="btn-upload-label">
                    {formData.profileImage ? 'Change Photo' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span className="input-hint">JPG, PNG or WEBP · Recommended square 1:1 image</span>
                  {errors.profileImage && <span className="field-err">{errors.profileImage}</span>}
                </div>
              </div>
            </div>

            <div className="apply-form-row">
              <div className="apply-form-group">
                <label className="req-label">Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className={errors.fullName ? 'has-error' : ''}
                />
                {errors.fullName && <span className="field-err">{errors.fullName}</span>}
              </div>

              <div className="apply-form-group">
                <label className="req-label">Display / Creator Name</label>
                <input
                  type="text"
                  placeholder="e.g. Amit Creates"
                  value={formData.displayName}
                  onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                  className={errors.displayName ? 'has-error' : ''}
                />
                {errors.displayName && <span className="field-err">{errors.displayName}</span>}
              </div>
            </div>

            <div className="apply-form-row">
              <div className="apply-form-group">
                <label className="req-label">Email Address (Private)</label>
                <input
                  type="email"
                  placeholder="you@domain.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? 'has-error' : ''}
                />
                {errors.email && <span className="field-err">{errors.email}</span>}
              </div>

              <div className="apply-form-group">
                <label className="req-label">Phone Number (Private)</label>
                <div className="phone-combine-input">
                  <select
                    value={formData.phoneCode}
                    onChange={e => setFormData({ ...formData, phoneCode: e.target.value })}
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={formData.phoneNumber}
                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value.replace(/[^0-9]/g, '') })}
                    className={errors.phoneNumber ? 'has-error' : ''}
                  />
                </div>
                {errors.phoneNumber && <span className="field-err">{errors.phoneNumber}</span>}
              </div>
            </div>

            <div className="apply-form-row three-col">
              <div className="apply-form-group">
                <label className="req-label">City</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className={errors.city ? 'has-error' : ''}
                />
              </div>

              <div className="apply-form-group">
                <label className="req-label">State</label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className={errors.state ? 'has-error' : ''}
                />
              </div>

              <div className="apply-form-group">
                <label className="req-label">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>

            {/* Languages */}
            <div className="apply-form-group">
              <label>Languages You Create In (Optional)</label>
              <div className="pill-wrap">
                {LANGUAGE_OPTIONS.map(l => (
                  <button
                    key={l}
                    type="button"
                    className={`tag-pill ${formData.languages.includes(l) ? 'selected' : ''}`}
                    onClick={() => toggleArrayItem('languages', l)}
                  >
                    {formData.languages.includes(l) && '✓ '}
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═════════ STEP 2: YOUR CONTENT ═════════ */}
        {step === 2 && (
          <div className="apply-step-pane">
            <div className="step-intro-text">
              <h4>What do you create?</h4>
              <p>Help brands understand your content focus and formats.</p>
            </div>

            {/* Primary Category */}
            <div className="apply-form-group">
              <label className="req-label">Primary Category</label>
              <select
                value={formData.primaryCategory}
                onChange={e => setFormData({ ...formData, primaryCategory: e.target.value })}
                className={errors.primaryCategory ? 'has-error' : ''}
              >
                <option value="">Select your main niche</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.primaryCategory && <span className="field-err">{errors.primaryCategory}</span>}
            </div>

            {/* Content Types */}
            <div className="apply-form-group">
              <label className="req-label">Content Types</label>
              <span className="input-hint">Select all formats you specialize in</span>
              <div className="pill-wrap mt-2">
                {CONTENT_TYPES.map(ct => (
                  <button
                    key={ct}
                    type="button"
                    className={`tag-pill ${formData.contentTypes.includes(ct) ? 'selected' : ''}`}
                    onClick={() => toggleArrayItem('contentTypes', ct)}
                  >
                    {formData.contentTypes.includes(ct) && '✓ '}
                    {ct}
                  </button>
                ))}
              </div>
              {errors.contentTypes && <span className="field-err">{errors.contentTypes}</span>}
            </div>

            {/* Bio */}
            <div className="apply-form-group">
              <div className="label-with-badge">
                <label className="req-label">Short Bio</label>
                <span className="char-badge">{formData.bio.length}/300</span>
              </div>
              <textarea
                rows={3}
                placeholder="Tell us what you create, who you create for, and what makes your content unique."
                value={formData.bio}
                maxLength={300}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className={errors.bio ? 'has-error' : ''}
              />
              {errors.bio && <span className="field-err">{errors.bio}</span>}
            </div>

            {/* Secondary Categories */}
            <div className="apply-form-group">
              <label>Secondary Categories (Up to 3 optional)</label>
              <div className="pill-wrap">
                {CATEGORIES.filter(c => c !== formData.primaryCategory).map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`tag-pill small ${formData.secondaryCategories.includes(c) ? 'selected' : ''}`}
                    onClick={() => toggleArrayItem('secondaryCategories', c, 3)}
                  >
                    {formData.secondaryCategories.includes(c) && '✓ '}
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Collaboration Interests */}
            <div className="apply-form-group">
              <label>Collaboration Interests (Optional)</label>
              <div className="pill-wrap">
                {COLLABORATION_OPTIONS.map(co => (
                  <button
                    key={co}
                    type="button"
                    className={`tag-pill ${formData.collaborationInterests.includes(co) ? 'selected' : ''}`}
                    onClick={() => toggleArrayItem('collaborationInterests', co)}
                  >
                    {formData.collaborationInterests.includes(co) && '✓ '}
                    {co}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═════════ STEP 3: YOUR SOCIALS & WORK ═════════ */}
        {step === 3 && (
          <div className="apply-step-pane">
            <div className="step-intro-text">
              <h4>Where can brands find you?</h4>
              <p>Add the channels where you actively post content.</p>
            </div>

            {socialAccounts.map((account, idx) => (
              <div key={idx} className="social-subcard">
                <div className="social-subcard-header">
                  <span>Platform 0{idx + 1}</span>
                  {socialAccounts.length > 1 && (
                    <button
                      type="button"
                      className="btn-text-del"
                      onClick={() => setSocialAccounts(socialAccounts.filter((_, i) => i !== idx))}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="apply-form-row">
                  <div className="apply-form-group">
                    <label className="req-label">Platform</label>
                    <select
                      value={account.platform}
                      onChange={e => {
                        const copy = [...socialAccounts];
                        copy[idx].platform = e.target.value;
                        setSocialAccounts(copy);
                      }}
                    >
                      {PLATFORMS.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div className="apply-form-group">
                    <label className="req-label">Username / Handle</label>
                    <input
                      type="text"
                      placeholder="@yourhandle"
                      value={account.username}
                      onChange={e => {
                        const copy = [...socialAccounts];
                        copy[idx].username = e.target.value;
                        setSocialAccounts(copy);
                      }}
                      className={errors.socialUsername ? 'has-error' : ''}
                    />
                    {idx === 0 && errors.socialUsername && <span className="field-err">{errors.socialUsername}</span>}
                  </div>
                </div>

                <div className="apply-form-group">
                  <label className="req-label">Profile URL</label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/yourhandle"
                    value={account.profileUrl}
                    onChange={e => {
                      const copy = [...socialAccounts];
                      copy[idx].profileUrl = e.target.value;
                      setSocialAccounts(copy);
                    }}
                    className={errors.socialUrl ? 'has-error' : ''}
                  />
                  {idx === 0 && errors.socialUrl && <span className="field-err">{errors.socialUrl}</span>}
                </div>

                <div className="apply-form-row">
                  <div className="apply-form-group">
                    <label className="req-label">Followers Count</label>
                    <div className="follower-input-holder">
                      <input
                        type="text"
                        placeholder="e.g. 25000"
                        value={account.followers}
                        onChange={e => {
                          const copy = [...socialAccounts];
                          copy[idx].followers = e.target.value.replace(/[^0-9]/g, '');
                          setSocialAccounts(copy);
                        }}
                        className={errors.socialFollowers ? 'has-error' : ''}
                      />
                      {formatFollowersHelper(account.followers) && (
                        <span className="follower-badge-pill">
                          {formatFollowersHelper(account.followers)}
                        </span>
                      )}
                    </div>
                    {idx === 0 && errors.socialFollowers && <span className="field-err">{errors.socialFollowers}</span>}
                  </div>

                  <div className="apply-form-group">
                    <label>Avg Views (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 15K - 20K"
                      value={account.averageViews}
                      onChange={e => {
                        const copy = [...socialAccounts];
                        copy[idx].averageViews = e.target.value;
                        setSocialAccounts(copy);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {socialAccounts.length < 5 && (
              <button
                type="button"
                className="btn-add-social-line"
                onClick={() => setSocialAccounts([...socialAccounts, { platform: 'YouTube', username: '', profileUrl: '', followers: '', averageViews: '' }])}
              >
                + Add Another Social Channel
              </button>
            )}

            {/* Primary Platform */}
            <div className="apply-form-group mt-3">
              <label className="req-label">Which platform is your primary creator channel?</label>
              <div className="pill-wrap mt-1">
                {socialAccounts.map((acc, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`tag-pill ${formData.primaryPlatform === acc.platform ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, primaryPlatform: acc.platform })}
                  >
                    {formData.primaryPlatform === acc.platform && '✓ '}
                    {acc.platform} {acc.username ? `(${acc.username})` : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Portfolio / Work Links */}
            <div className="apply-form-group mt-3">
              <label>Show Us Your Work (Optional 1-3 links)</label>
              <span className="input-hint">Links to your best viral reels, YouTube videos, or portfolio website</span>
              {portfolios.map((port, pI) => (
                <div key={pI} className="portfolio-inline-row mt-2">
                  <input
                    type="text"
                    placeholder="Title (e.g. Brand Campaign Reel)"
                    value={port.title}
                    onChange={e => {
                      const copy = [...portfolios];
                      copy[pI].title = e.target.value;
                      setPortfolios(copy);
                    }}
                    style={{ width: '40%' }}
                  />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={port.url}
                    onChange={e => {
                      const copy = [...portfolios];
                      copy[pI].url = e.target.value;
                      setPortfolios(copy);
                    }}
                  />
                </div>
              ))}
              {portfolios.length < 3 && (
                <button
                  type="button"
                  className="btn-add-social-line mt-2"
                  onClick={() => setPortfolios([...portfolios, { title: '', url: '' }])}
                >
                  + Add Campaign Link
                </button>
              )}
            </div>
          </div>
        )}

        {/* ═════════ STEP 4: REVIEW & SUBMIT ═════════ */}
        {step === 4 && (
          <div className="apply-step-pane">
            <div className="step-intro-text">
              <h4>Review your profile</h4>
              <p>Please double-check your application before submitting for review.</p>
            </div>

            <div className="review-block-list">
              {/* Card 1: Identity */}
              <div className="review-subcard">
                <div className="review-subcard-header">
                  <span>ABOUT YOU</span>
                  <button type="button" className="btn-edit-jump" onClick={() => setStep(1)}>EDIT &rarr;</button>
                </div>
                <div className="review-subcard-body">
                  <div className="review-row">
                    <span>Creator Name:</span>
                    <strong>{formData.displayName || '—'}</strong>
                  </div>
                  <div className="review-row">
                    <span>Full Name:</span>
                    <span>{formData.fullName || '—'}</span>
                  </div>
                  <div className="review-row">
                    <span>Location:</span>
                    <span>{[formData.city, formData.state, formData.country].filter(Boolean).join(', ')}</span>
                  </div>
                  <div className="review-row">
                    <span>Languages:</span>
                    <span>{formData.languages.join(', ') || 'None specified'}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Content */}
              <div className="review-subcard">
                <div className="review-subcard-header">
                  <span>CONTENT &amp; NICHE</span>
                  <button type="button" className="btn-edit-jump" onClick={() => setStep(2)}>EDIT &rarr;</button>
                </div>
                <div className="review-subcard-body">
                  <div className="review-row">
                    <span>Primary Category:</span>
                    <strong>{formData.primaryCategory || '—'}</strong>
                  </div>
                  <div className="review-row">
                    <span>Formats:</span>
                    <span>{formData.contentTypes.join(', ') || '—'}</span>
                  </div>
                  <div className="review-row">
                    <span>Bio:</span>
                    <span className="review-bio-quote">"{formData.bio}"</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Socials */}
              <div className="review-subcard">
                <div className="review-subcard-header">
                  <span>CHANNELS</span>
                  <button type="button" className="btn-edit-jump" onClick={() => setStep(3)}>EDIT &rarr;</button>
                </div>
                <div className="review-subcard-body">
                  <div className="review-row">
                    <span>Primary Channel:</span>
                    <strong>{formData.primaryPlatform}</strong>
                  </div>
                  {socialAccounts.filter(s => s.username).map((sa, i) => (
                    <div key={i} className="review-row">
                      <span>{sa.platform}:</span>
                      <span>{sa.username} ({formatFollowersHelper(sa.followers) || sa.followers} followers)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consent */}
              <div className="consent-check-row">
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  checked={formData.accuracyConsent}
                  onChange={e => {
                    setFormData({ ...formData, accuracyConsent: e.target.checked });
                    if (errors.accuracyConsent) setErrors({ ...errors, accuracyConsent: null });
                  }}
                />
                <label htmlFor="consentCheckbox">
                  I confirm that the information provided is accurate and that C-PEB may review this profile before publishing it.
                </label>
              </div>
              {errors.accuracyConsent && <span className="field-err" style={{ display: 'block', marginTop: '0.4rem' }}>{errors.accuracyConsent}</span>}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="apply-form-nav">
          {step > 1 && (
            <button type="button" className="btn-apply-back" onClick={handleBack} disabled={submitting}>
              &larr; Back
            </button>
          )}

          <div className="apply-form-nav-right">
            {step < 4 ? (
              <button type="button" className="btn-apply-next" onClick={handleNext}>
                Continue &rarr;
              </button>
            ) : (
              <button
                type="button"
                className="btn-apply-submit"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'SUBMIT APPLICATION →'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}