import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/SEO';
import './CreatorOnboarding.css';

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

const PLATFORM_OPTIONS = [
  'Instagram', 'YouTube', 'Facebook', 'LinkedIn', 'TikTok', 'X / Twitter'
];

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', label: 'India (+91)' },
  { code: '+1', country: 'US', label: 'USA / Canada (+1)' },
  { code: '+44', country: 'GB', label: 'UK (+44)' },
  { code: '+971', country: 'AE', label: 'UAE (+971)' },
  { code: '+65', country: 'SG', label: 'Singapore (+65)' },
  { code: '+61', country: 'AU', label: 'Australia (+61)' },
  { code: '+49', country: 'DE', label: 'Germany (+49)' },
];

const CreatorOnboarding = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [latestReview, setLatestReview] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('DRAFT');

  // Form State
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
    primaryPlatform: '',
    audienceLocation: '',
    audienceAgeRange: '',
    accuracyConsent: false,
  });

  const [socialAccounts, setSocialAccounts] = useState([
    { platform: 'Instagram', username: '', profileUrl: '', followers: '', averageViews: '', engagementRate: '' }
  ]);

  const [portfolios, setPortfolios] = useState([
    { title: '', url: '', campaignType: '' }
  ]);

  // Load existing profile on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const stepParam = parseInt(searchParams.get('step'));
    if (stepParam && stepParam >= 1 && stepParam <= 4) {
      setCurrentStep(stepParam);
    }
    fetchExistingProfile();
  }, [location, user]);

  const fetchExistingProfile = async () => {
    if (!user?.token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/creators/profile/me', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();

      if (data.success && data.data) {
        const p = data.data;
        setCurrentStatus(p.status || 'DRAFT');

        // Parse phone if formatted as code + number
        let phoneCode = '+91';
        let phoneNumber = p.phone || '';
        if (phoneNumber.startsWith('+')) {
          const match = COUNTRY_CODES.find(c => phoneNumber.startsWith(c.code));
          if (match) {
            phoneCode = match.code;
            phoneNumber = phoneNumber.slice(match.code.length).trim();
          }
        }

        setFormData({
          fullName: p.fullName || user?.name || '',
          displayName: p.displayName || '',
          profileImage: p.profileImage || '',
          email: p.email || user?.email || '',
          phoneCode,
          phoneNumber,
          city: p.city || '',
          state: p.state || '',
          country: p.country || 'India',
          languages: p.languages || [],
          primaryCategory: p.primaryCategory || '',
          secondaryCategories: p.secondaryCategories || [],
          contentTypes: p.contentTypes || [],
          bio: p.bio || '',
          collaborationInterests: p.collaborationInterests || [],
          primaryPlatform: p.primaryPlatform || '',
          audienceLocation: p.audienceLocation || '',
          audienceAgeRange: p.audienceAgeRange || '',
          accuracyConsent: p.accuracyConsent || false,
        });

        if (p.socialAccounts && p.socialAccounts.length > 0) {
          setSocialAccounts(p.socialAccounts.map(sa => ({
            platform: sa.platform || 'Instagram',
            username: sa.username || '',
            profileUrl: sa.profileUrl || '',
            followers: sa.followers || '',
            averageViews: sa.averageViews || '',
            engagementRate: sa.engagementRate || '',
          })));
        }

        if (p.portfolios && p.portfolios.length > 0) {
          setPortfolios(p.portfolios.map(pt => ({
            title: pt.title || '',
            url: pt.url || '',
            campaignType: pt.campaignType || ''
          })));
        }

        if (p.latestReview) {
          setLatestReview(p.latestReview);
        }

        // If already submitted and under review (and not arriving to edit), show submitted state
        if (p.status === 'PENDING_REVIEW' && !searchParamsHasEdit()) {
          setSubmittedSuccess(true);
        }
      } else {
        // Prefill default user info
        setFormData(prev => ({
          ...prev,
          fullName: user?.name || '',
          displayName: user?.name || '',
          email: user?.email || '',
        }));
      }
    } catch (err) {
      console.error('Error fetching creator profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchParamsHasEdit = () => {
    const params = new URLSearchParams(location.search);
    return params.get('edit') === 'true' || params.get('step');
  };

  // Profile completion percentage
  const completionPercentage = useMemo(() => {
    const requiredItems = [
      Boolean(formData.fullName?.trim()),
      Boolean(formData.displayName?.trim()),
      Boolean(formData.profileImage?.trim()),
      Boolean(formData.email?.trim()),
      Boolean(formData.phoneNumber?.trim()),
      Boolean(formData.city?.trim()),
      Boolean(formData.state?.trim()),
      Boolean(formData.primaryCategory?.trim()),
      Boolean(formData.contentTypes?.length > 0),
      Boolean(formData.bio?.trim()),
      Boolean(socialAccounts.length > 0 && socialAccounts[0]?.username && socialAccounts[0]?.profileUrl),
      Boolean(formData.primaryPlatform?.trim()),
    ];
    const completed = requiredItems.filter(Boolean).length;
    return Math.round((completed / requiredItems.length) * 100);
  }, [formData, socialAccounts]);

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors(prev => ({ ...prev, profileImage: 'Please upload a JPG, PNG, or WEBP image.' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profileImage: 'Image size must be under 5MB.' }));
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

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, profileImage: '' }));
  };

  // Helper formatting for follower display
  const formatFollowersHelper = (val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num <= 0) return '';
    if (num >= 1000000) return `${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)}M followers`;
    if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K followers`;
    return `${num} followers`;
  };

  // Multi-select toggles
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

  // Social account handlers
  const handleSocialChange = (index, field, value) => {
    const updated = [...socialAccounts];
    if (field === 'followers') {
      const cleanVal = value.replace(/[^0-9]/g, '');
      updated[index][field] = cleanVal;
    } else {
      updated[index][field] = value;
    }
    setSocialAccounts(updated);

    // If changing platform of an account that was primary, update primary platform
    if (field === 'platform' && updated.length === 1) {
      setFormData(prev => ({ ...prev, primaryPlatform: value }));
    }
  };

  const addSocialAccount = () => {
    if (socialAccounts.length >= 6) return;
    const availablePlatforms = PLATFORM_OPTIONS.filter(
      p => !socialAccounts.some(acc => acc.platform === p)
    );
    const nextPlatform = availablePlatforms[0] || 'Instagram';
    setSocialAccounts(prev => [
      ...prev,
      { platform: nextPlatform, username: '', profileUrl: '', followers: '', averageViews: '', engagementRate: '' }
    ]);
  };

  const removeSocialAccount = (index) => {
    if (socialAccounts.length <= 1) return;
    const targetPlatform = socialAccounts[index].platform;
    const updated = socialAccounts.filter((_, i) => i !== index);
    setSocialAccounts(updated);

    if (formData.primaryPlatform === targetPlatform) {
      setFormData(prev => ({ ...prev, primaryPlatform: updated[0]?.platform || '' }));
    }
  };

  // Portfolio handlers
  const handlePortfolioChange = (index, field, value) => {
    const updated = [...portfolios];
    updated[index][field] = value;
    setPortfolios(updated);
  };

  const addPortfolioItem = () => {
    if (portfolios.length >= 3) return;
    setPortfolios(prev => [...prev, { title: '', url: '', campaignType: '' }]);
  };

  const removePortfolioItem = (index) => {
    setPortfolios(prev => prev.filter((_, i) => i !== index));
  };

  // Validation per step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName?.trim()) newErrors.fullName = 'Full Name is required.';
      if (!formData.displayName?.trim()) newErrors.displayName = 'Display / Creator Name is required.';
      if (!formData.profileImage?.trim()) newErrors.profileImage = 'Profile Photo is required.';
      if (!formData.email?.trim()) {
        newErrors.email = 'Email Address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
      if (!formData.phoneNumber?.trim()) {
        newErrors.phoneNumber = 'Phone Number is required.';
      } else if (formData.phoneNumber.replace(/[^0-9]/g, '').length < 7) {
        newErrors.phoneNumber = 'Please enter a valid phone number.';
      }
      if (!formData.city?.trim()) newErrors.city = 'City is required.';
      if (!formData.state?.trim()) newErrors.state = 'State is required.';
      if (!formData.country?.trim()) newErrors.country = 'Country is required.';
    }

    if (step === 2) {
      if (!formData.primaryCategory?.trim()) newErrors.primaryCategory = 'Please select a primary category.';
      if (!formData.contentTypes || formData.contentTypes.length === 0) {
        newErrors.contentTypes = 'Select at least one content type.';
      }
      if (!formData.bio?.trim()) {
        newErrors.bio = 'Short Bio is required.';
      } else if (formData.bio.length > 300) {
        newErrors.bio = 'Bio cannot exceed 300 characters.';
      }
    }

    if (step === 3) {
      if (!socialAccounts || socialAccounts.length === 0) {
        newErrors.socialAccounts = 'At least one social platform is required.';
      } else {
        const first = socialAccounts[0];
        if (!first.username?.trim()) newErrors.socialUsername_0 = 'Username / handle is required.';
        if (!first.profileUrl?.trim()) {
          newErrors.socialUrl_0 = 'Profile URL is required.';
        } else if (!/^https?:\/\//i.test(first.profileUrl.trim())) {
          newErrors.socialUrl_0 = 'URL must start with http:// or https://';
        }
        if (!first.followers || parseInt(first.followers, 10) <= 0) {
          newErrors.socialFollowers_0 = 'Please enter your current follower count.';
        }
      }

      if (!formData.primaryPlatform?.trim()) {
        newErrors.primaryPlatform = 'Please designate your primary creator platform.';
      }
    }

    if (step === 4) {
      if (!formData.accuracyConsent) {
        newErrors.accuracyConsent = 'Please confirm that the information provided is accurate.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Build Payload
  const getPayload = () => {
    const fullPhone = formData.phoneNumber ? `${formData.phoneCode} ${formData.phoneNumber.trim()}` : '';
    const cleanSocials = socialAccounts
      .filter(sa => sa.username?.trim() || sa.profileUrl?.trim())
      .map(sa => ({
        platform: sa.platform,
        username: sa.username.trim(),
        profileUrl: sa.profileUrl.trim(),
        followers: sa.followers || '0',
        averageViews: sa.averageViews?.trim() || '',
        engagementRate: sa.engagementRate?.trim() || '',
      }));

    const cleanPortfolios = portfolios
      .filter(p => p.url?.trim() || p.title?.trim())
      .map((p, idx) => ({
        title: p.title?.trim() || `Portfolio Item ${idx + 1}`,
        url: p.url.trim(),
        campaignType: p.campaignType || '',
        sortOrder: idx
      }));

    return {
      fullName: formData.fullName.trim(),
      displayName: formData.displayName.trim(),
      profileImage: formData.profileImage,
      email: formData.email.trim(),
      phone: fullPhone,
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
      languages: formData.languages,
      primaryCategory: formData.primaryCategory,
      secondaryCategories: formData.secondaryCategories,
      contentTypes: formData.contentTypes,
      bio: formData.bio.trim(),
      collaborationInterests: formData.collaborationInterests,
      primaryPlatform: formData.primaryPlatform || socialAccounts[0]?.platform || '',
      audienceLocation: formData.audienceLocation.trim(),
      audienceAgeRange: formData.audienceAgeRange.trim(),
      accuracyConsent: formData.accuracyConsent,
      socialAccounts: cleanSocials,
      portfolios: cleanPortfolios,
    };
  };

  const handleFillDemoData = () => {
    login({
      _id: '654321098765432109876543',
      name: 'Demo Influencer',
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
        averageViews: '25K - 35K',
        engagementRate: '5.2%'
      },
      {
        platform: 'YouTube',
        username: '@aaravvlogs',
        profileUrl: 'https://youtube.com/@aaravvlogs',
        followers: '32000',
        averageViews: '15K - 20K',
        engagementRate: '4.8%'
      }
    ]);
    setPortfolios([
      {
        title: 'Monsoon Wanderlust Campaign',
        url: 'https://instagram.com/p/reel123',
        campaignType: 'Reel'
      }
    ]);
    setSaveSuccessMsg('Loaded demo profile! You can explore and test all 4 steps.');
    setTimeout(() => setSaveSuccessMsg(''), 5000);
  };

  // Save Draft
  const handleSaveDraft = async (showNotification = true) => {
    setSaving(true);
    setSaveSuccessMsg('');
    try {
      let token = user?.token;
      if (!token) {
        const demoUser = {
          _id: '654321098765432109876543',
          name: formData.fullName || 'Demo Influencer',
          email: formData.email || 'creator@cpeb.com',
          role: 'CREATOR',
          token: 'demo-token-123'
        };
        login(demoUser);
        token = demoUser.token;
      }

      const payload = getPayload();
      const res = await fetch('/api/creators/profile/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        if (showNotification) {
          setSaveSuccessMsg('Draft saved. You can leave and return anytime.');
          setTimeout(() => setSaveSuccessMsg(''), 4500);
        }
        return true;
      } else {
        console.error('Save failed:', data.error);
        return false;
      }
    } catch (err) {
      console.error('Draft save failed:', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Step Navigation
  const handleNext = async () => {
    if (!validateStep(currentStep)) return;
    await handleSaveDraft(false);
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const jumpToStep = (stepNumber) => {
    if (stepNumber <= currentStep || validateStep(currentStep)) {
      handleSaveDraft(false);
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final Submit Application
  const handleSubmitApplication = async () => {
    // Validate all steps first
    const isStep1Valid = validateStep(1);
    const isStep2Valid = validateStep(2);
    const isStep3Valid = validateStep(3);
    const isStep4Valid = validateStep(4);

    if (!isStep1Valid) {
      setCurrentStep(1);
      return;
    }
    if (!isStep2Valid) {
      setCurrentStep(2);
      return;
    }
    if (!isStep3Valid) {
      setCurrentStep(3);
      return;
    }
    if (!isStep4Valid) {
      return;
    }

    setSaving(true);
    try {
      // 1. Save all latest data
      const saved = await handleSaveDraft(false);
      if (!saved) {
        alert('Could not save profile details before submission. Please try again.');
        return;
      }

      // 2. Submit for review
      const res = await fetch('/api/creators/profile/me/submit', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      const data = await res.json();

      if (data.success) {
        setSubmittedSuccess(true);
        setCurrentStatus('PENDING_REVIEW');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(data.error || 'Failed to submit application. Please verify all required fields.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('An error occurred during submission. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="onboarding-loading-screen">
        <div className="onboarding-spinner"></div>
        <p>Loading your application...</p>
      </div>
    );
  }

  // Submitted Confirmation Screen
  if (submittedSuccess) {
    return (
      <div className="onboarding-page-wrap">
        <div className="onboarding-success-card">
          <div className="success-icon-wrapper">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <span className="success-status-pill">STATUS: PENDING REVIEW</span>
          <h1 className="success-title">Application submitted.</h1>
          <p className="success-desc">
            Thank you for applying to join C-PEB. Our team will review your profile before it appears publicly.
          </p>
          <div className="success-details-box">
            <div className="success-detail-row">
              <span className="success-detail-label">Creator Name</span>
              <span className="success-detail-value">{formData.displayName}</span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">Primary Category</span>
              <span className="success-detail-value">{formData.primaryCategory}</span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">Primary Platform</span>
              <span className="success-detail-value">{formData.primaryPlatform || socialAccounts[0]?.platform}</span>
            </div>
          </div>
          <div className="success-actions">
            <Link to="/creator/dashboard" className="btn-success-primary">
              GO TO CREATOR DASHBOARD &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-page-wrap">
      <div className="onboarding-container">
        
        {/* LEFT COLUMN: Editorial Sidebar */}
        <aside className="onboarding-sidebar">
          <div className="sidebar-sticky-inner">
            <div className="sidebar-brand-header">
              <span className="sidebar-eyebrow">JOIN C-PEB</span>
              <h1 className="sidebar-title">Build your creator profile.</h1>
              <p className="sidebar-subtitle">
                Share your work, connect your social channels, and unlock collaborations with leading brands across India.
              </p>
            </div>

            {/* Profile Completion Indicator */}
            <div className="profile-completion-box">
              <div className="completion-header">
                <span className="completion-label">PROFILE COMPLETION</span>
                <span className="completion-percent">{completionPercentage}%</span>
              </div>
              <div className="completion-bar-track">
                <div 
                  className="completion-bar-fill" 
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Editorial 4-Step Progress Indicator */}
            <nav className="editorial-step-nav" aria-label="Onboarding Steps">
              {[
                { id: 1, label: 'ABOUT YOU', tag: '01' },
                { id: 2, label: 'CONTENT', tag: '02' },
                { id: 3, label: 'SOCIALS', tag: '03' },
                { id: 4, label: 'SUBMIT', tag: '04' }
              ].map((step) => {
                const isActive = currentStep === step.id;
                const isPassed = currentStep > step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => jumpToStep(step.id)}
                    className={`nav-step-item ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
                  >
                    <div className="nav-step-header">
                      <span className="nav-step-num">{step.tag}</span>
                      <span className="nav-step-label">{step.label}</span>
                    </div>
                    <div className="nav-step-rule" />
                  </button>
                );
              })}
            </nav>

            {/* Quick Actions in Sidebar */}
            <div className="sidebar-footer-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-sidebar-draft"
                style={{
                  background: '#EEF9F2',
                  borderColor: '#A7F3D0',
                  color: '#0a7c3e',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
                onClick={handleFillDemoData}
              >
                <span>⚡</span> Fill Demo Influencer Data
              </button>

              <button
                type="button"
                className="btn-sidebar-draft"
                onClick={() => handleSaveDraft(true)}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save & Continue Later'}
              </button>

              <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                <Link to="/for-creators" style={{ fontSize: '0.85rem', color: '#0a7c3e', textDecoration: 'none', fontWeight: 600 }}>
                  Browse Approved Creators Directory &rarr;
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Form Body */}
        <main className="onboarding-main">
          <SEO 
            title="Apply as a Creator | C-PEB" 
            description="Join C-PEB's curated creator network. Get discovered by premium Indian brands and funded startups." 
          />
          
          {/* Admin Feedback Notice if CHANGES_REQUESTED */}
          {currentStatus === 'CHANGES_REQUESTED' && latestReview?.note && (
            <div className="admin-review-callout">
              <div className="callout-header">
                <span className="callout-pill">CHANGES REQUESTED</span>
                <span className="callout-date">
                  {new Date(latestReview.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="callout-note">
                <strong>Feedback from C-PEB Review Team:</strong> "{latestReview.note}"
              </p>
              <p className="callout-sub">Please review the sections below, make the necessary updates, and resubmit your profile.</p>
            </div>
          )}

          {/* Floating Draft Saved Toast */}
          {saveSuccessMsg && (
            <div className="draft-saved-toast">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Form Step Wrapper */}
          <div className="onboarding-form-card">
            
            {/* ══════════════════════════════════════════════════
                STEP 01: ABOUT YOU
            ══════════════════════════════════════════════════ */}
            {currentStep === 1 && (
              <section className="form-step-section">
                <header className="step-header">
                  <span className="step-tagline">STEP 01</span>
                  <h2 className="step-title">Tell us about yourself.</h2>
                  <p className="step-desc">Start with a few details that help us understand who you are.</p>
                </header>

                <div className="form-fields-grid">
                  
                  {/* Profile Photo Uploader */}
                  <div className="form-field-full">
                    <label className="field-label required">Profile Photo</label>
                    <div className="photo-uploader-container">
                      <div className="photo-preview-box">
                        {formData.profileImage ? (
                          <img src={formData.profileImage} alt="Profile Preview" className="photo-preview-img" />
                        ) : (
                          <div className="photo-placeholder">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                              <circle cx="12" cy="13" r="4" />
                            </svg>
                            <span>No Photo</span>
                          </div>
                        )}
                      </div>

                      <div className="photo-controls">
                        <div className="photo-buttons-row">
                          <label className="btn-photo-upload">
                            {formData.profileImage ? 'Replace Photo' : 'Upload Photo'}
                            <input 
                              type="file" 
                              accept="image/jpeg,image/png,image/webp" 
                              onChange={handlePhotoUpload} 
                              className="hidden-file-input" 
                            />
                          </label>
                          {formData.profileImage && (
                            <button 
                              type="button" 
                              className="btn-photo-remove" 
                              onClick={handleRemovePhoto}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <p className="field-hint">JPG, PNG or WEBP · Recommended square 1:1 portrait (Max 5MB)</p>
                        {errors.profileImage && <span className="field-error-msg">{errors.profileImage}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="form-field">
                    <label className="field-label required">Full Name</label>
                    <input
                      type="text"
                      className={`form-input ${errors.fullName ? 'has-error' : ''}`}
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={e => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: null });
                      }}
                    />
                    {errors.fullName && <span className="field-error-msg">{errors.fullName}</span>}
                  </div>

                  {/* Display / Creator Name */}
                  <div className="form-field">
                    <label className="field-label required">Display / Creator Name</label>
                    <input
                      type="text"
                      className={`form-input ${errors.displayName ? 'has-error' : ''}`}
                      placeholder="How you'd like to appear publicly (e.g. Amit Creates)"
                      value={formData.displayName}
                      onChange={e => {
                        setFormData({ ...formData, displayName: e.target.value });
                        if (errors.displayName) setErrors({ ...errors, displayName: null });
                      }}
                    />
                    {errors.displayName && <span className="field-error-msg">{errors.displayName}</span>}
                  </div>

                  {/* Email */}
                  <div className="form-field">
                    <label className="field-label required">Email Address</label>
                    <input
                      type="email"
                      className={`form-input ${errors.email ? 'has-error' : ''}`}
                      placeholder="you@domain.com"
                      value={formData.email}
                      onChange={e => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                    />
                    <p className="field-hint">Kept strictly private for collaboration notifications.</p>
                    {errors.email && <span className="field-error-msg">{errors.email}</span>}
                  </div>

                  {/* Phone with Country Code */}
                  <div className="form-field">
                    <label className="field-label required">Phone Number</label>
                    <div className="phone-input-group">
                      <select
                        className="country-code-select"
                        value={formData.phoneCode}
                        onChange={e => setFormData({ ...formData, phoneCode: e.target.value })}
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code}>{c.label}</option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        className={`form-input phone-text-input ${errors.phoneNumber ? 'has-error' : ''}`}
                        placeholder="98765 43210"
                        value={formData.phoneNumber}
                        onChange={e => {
                          const val = e.target.value.replace(/[^0-9\s-]/g, '');
                          setFormData({ ...formData, phoneNumber: val });
                          if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: null });
                        }}
                      />
                    </div>
                    <p className="field-hint">Used strictly for campaign support and verification.</p>
                    {errors.phoneNumber && <span className="field-error-msg">{errors.phoneNumber}</span>}
                  </div>

                  {/* City */}
                  <div className="form-field">
                    <label className="field-label required">City</label>
                    <input
                      type="text"
                      className={`form-input ${errors.city ? 'has-error' : ''}`}
                      placeholder="e.g. Mumbai, Bengaluru"
                      value={formData.city}
                      onChange={e => {
                        setFormData({ ...formData, city: e.target.value });
                        if (errors.city) setErrors({ ...errors, city: null });
                      }}
                    />
                    {errors.city && <span className="field-error-msg">{errors.city}</span>}
                  </div>

                  {/* State */}
                  <div className="form-field">
                    <label className="field-label required">State</label>
                    <input
                      type="text"
                      className={`form-input ${errors.state ? 'has-error' : ''}`}
                      placeholder="e.g. Maharashtra, Karnataka"
                      value={formData.state}
                      onChange={e => {
                        setFormData({ ...formData, state: e.target.value });
                        if (errors.state) setErrors({ ...errors, state: null });
                      }}
                    />
                    {errors.state && <span className="field-error-msg">{errors.state}</span>}
                  </div>

                  {/* Country */}
                  <div className="form-field">
                    <label className="field-label required">Country</label>
                    <input
                      type="text"
                      className={`form-input ${errors.country ? 'has-error' : ''}`}
                      placeholder="Country"
                      value={formData.country}
                      onChange={e => {
                        setFormData({ ...formData, country: e.target.value });
                        if (errors.country) setErrors({ ...errors, country: null });
                      }}
                    />
                    {errors.country && <span className="field-error-msg">{errors.country}</span>}
                  </div>

                  {/* Languages (Optional Multi-Select) */}
                  <div className="form-field-full">
                    <label className="field-label optional">Languages You Create In</label>
                    <p className="field-hint" style={{ marginTop: '-0.25rem', marginBottom: '0.75rem' }}>
                      Select the languages you actively use in your content.
                    </p>
                    <div className="pill-options-grid">
                      {LANGUAGE_OPTIONS.map(lang => {
                        const isSelected = formData.languages.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            className={`choice-pill ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleArrayItem('languages', lang)}
                          >
                            {isSelected && <span className="pill-check">✓</span>}
                            {lang}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </section>
            )}

            {/* ══════════════════════════════════════════════════
                STEP 02: YOUR CONTENT
            ══════════════════════════════════════════════════ */}
            {currentStep === 2 && (
              <section className="form-step-section">
                <header className="step-header">
                  <span className="step-tagline">STEP 02</span>
                  <h2 className="step-title">What do you create?</h2>
                  <p className="step-desc">Help brands understand your content and the audiences you reach.</p>
                </header>

                <div className="form-fields-grid">

                  {/* Primary Category */}
                  <div className="form-field-full">
                    <label className="field-label required">Primary Category</label>
                    <select
                      className={`form-select ${errors.primaryCategory ? 'has-error' : ''}`}
                      value={formData.primaryCategory}
                      onChange={e => {
                        setFormData({ ...formData, primaryCategory: e.target.value });
                        if (errors.primaryCategory) setErrors({ ...errors, primaryCategory: null });
                      }}
                    >
                      <option value="">Select your main content niche</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.primaryCategory && <span className="field-error-msg">{errors.primaryCategory}</span>}
                  </div>

                  {/* Content Types (Required Multi-select) */}
                  <div className="form-field-full">
                    <label className="field-label required">Content Types</label>
                    <p className="field-hint" style={{ marginTop: '-0.25rem', marginBottom: '0.75rem' }}>
                      Select all formats you specialize in producing.
                    </p>
                    <div className="pill-options-grid">
                      {CONTENT_TYPES.map(type => {
                        const isSelected = formData.contentTypes.includes(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            className={`choice-pill ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              toggleArrayItem('contentTypes', type);
                              if (errors.contentTypes) setErrors({ ...errors, contentTypes: null });
                            }}
                          >
                            {isSelected && <span className="pill-check">✓</span>}
                            {type}
                          </button>
                        );
                      })}
                    </div>
                    {errors.contentTypes && <span className="field-error-msg">{errors.contentTypes}</span>}
                  </div>

                  {/* Short Bio (Max 300 Chars) */}
                  <div className="form-field-full">
                    <div className="label-with-counter">
                      <label className="field-label required">Short Bio</label>
                      <span className={`char-counter ${formData.bio.length > 300 ? 'exceeded' : ''}`}>
                        {formData.bio.length} / 300
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      className={`form-textarea ${errors.bio ? 'has-error' : ''}`}
                      placeholder="Tell us what you create, who you create for, and what makes your content different."
                      value={formData.bio}
                      maxLength={300}
                      onChange={e => {
                        setFormData({ ...formData, bio: e.target.value });
                        if (errors.bio) setErrors({ ...errors, bio: null });
                      }}
                    />
                    {errors.bio && <span className="field-error-msg">{errors.bio}</span>}
                  </div>

                  {/* Secondary Categories (Optional up to 3) */}
                  <div className="form-field-full">
                    <div className="label-with-counter">
                      <label className="field-label optional">Secondary Categories</label>
                      <span className="field-hint">Select up to 3</span>
                    </div>
                    <div className="pill-options-grid">
                      {CATEGORIES.filter(c => c !== formData.primaryCategory).map(cat => {
                        const isSelected = formData.secondaryCategories.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            className={`choice-pill small ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleArrayItem('secondaryCategories', cat, 3)}
                          >
                            {isSelected && <span className="pill-check">✓</span>}
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Collaboration Interests (Optional Multi-Select) */}
                  <div className="form-field-full">
                    <label className="field-label optional">Collaboration Interests</label>
                    <p className="field-hint" style={{ marginTop: '-0.25rem', marginBottom: '0.75rem' }}>
                      What types of brand collaborations are you open to?
                    </p>
                    <div className="pill-options-grid">
                      {COLLABORATION_OPTIONS.map(opt => {
                        const isSelected = formData.collaborationInterests.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`choice-pill ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleArrayItem('collaborationInterests', opt)}
                          >
                            {isSelected && <span className="pill-check">✓</span>}
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </section>
            )}

            {/* ══════════════════════════════════════════════════
                STEP 03: YOUR SOCIALS & WORK
            ══════════════════════════════════════════════════ */}
            {currentStep === 3 && (
              <section className="form-step-section">
                <header className="step-header">
                  <span className="step-tagline">STEP 03</span>
                  <h2 className="step-title">Where can brands find you?</h2>
                  <p className="step-desc">Add the platforms where you actively create content. At least one platform is required.</p>
                </header>

                <div className="form-fields-grid">

                  {/* Social Accounts List */}
                  <div className="form-field-full">
                    <label className="field-label required">Connected Platforms</label>
                    
                    <div className="social-cards-list">
                      {socialAccounts.map((account, idx) => (
                        <div key={idx} className="social-account-card">
                          <div className="social-card-header">
                            <span className="social-card-num">Platform 0{idx + 1}</span>
                            {socialAccounts.length > 1 && (
                              <button
                                type="button"
                                className="btn-remove-social"
                                onClick={() => removeSocialAccount(idx)}
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="social-card-grid">
                            <div className="social-card-field">
                              <label className="field-sublabel">Platform</label>
                              <select
                                className="form-select"
                                value={account.platform}
                                onChange={e => handleSocialChange(idx, 'platform', e.target.value)}
                              >
                                {PLATFORM_OPTIONS.map(p => (
                                  <option key={p} value={p}>{p}</option>
                                ))}
                              </select>
                            </div>

                            <div className="social-card-field">
                              <label className="field-sublabel">Username / Handle</label>
                              <input
                                type="text"
                                className={`form-input ${errors[`socialUsername_${idx}`] ? 'has-error' : ''}`}
                                placeholder="@yourhandle"
                                value={account.username}
                                onChange={e => handleSocialChange(idx, 'username', e.target.value)}
                              />
                              {errors[`socialUsername_${idx}`] && (
                                <span className="field-error-msg">{errors[`socialUsername_${idx}`]}</span>
                              )}
                            </div>

                            <div className="social-card-field full">
                              <label className="field-sublabel">Profile URL</label>
                              <input
                                type="url"
                                className={`form-input ${errors[`socialUrl_${idx}`] ? 'has-error' : ''}`}
                                placeholder={`https://${account.platform.toLowerCase().replace(/[^a-z]/g, '')}.com/yourhandle`}
                                value={account.profileUrl}
                                onChange={e => handleSocialChange(idx, 'profileUrl', e.target.value)}
                              />
                              {errors[`socialUrl_${idx}`] && (
                                <span className="field-error-msg">{errors[`socialUrl_${idx}`]}</span>
                              )}
                            </div>

                            <div className="social-card-field">
                              <label className="field-sublabel">Current Followers / Subscribers</label>
                              <div className="follower-input-wrap">
                                <input
                                  type="text"
                                  className={`form-input ${errors[`socialFollowers_${idx}`] ? 'has-error' : ''}`}
                                  placeholder="e.g. 25000"
                                  value={account.followers}
                                  onChange={e => handleSocialChange(idx, 'followers', e.target.value)}
                                />
                                {formatFollowersHelper(account.followers) && (
                                  <span className="follower-badge">
                                    {formatFollowersHelper(account.followers)}
                                  </span>
                                )}
                              </div>
                              {errors[`socialFollowers_${idx}`] && (
                                <span className="field-error-msg">{errors[`socialFollowers_${idx}`]}</span>
                              )}
                            </div>

                            <div className="social-card-field">
                              <label className="field-sublabel">Avg Views (Optional)</label>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. 15K - 20K"
                                value={account.averageViews}
                                onChange={e => handleSocialChange(idx, 'averageViews', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {socialAccounts.length < 6 && (
                      <button
                        type="button"
                        className="btn-add-social-outline"
                        onClick={addSocialAccount}
                      >
                        + Add Another Social Platform
                      </button>
                    )}
                  </div>

                  {/* Primary Platform (Dynamically sourced from accounts above) */}
                  <div className="form-field-full">
                    <label className="field-label required">Which platform is your primary creator platform?</label>
                    <p className="field-hint" style={{ marginTop: '-0.25rem', marginBottom: '0.75rem' }}>
                      This will be featured prominently on your public profile card.
                    </p>
                    <div className="pill-options-grid">
                      {socialAccounts.map((acc, i) => (
                        <button
                          key={i}
                          type="button"
                          className={`choice-pill ${formData.primaryPlatform === acc.platform ? 'selected' : ''}`}
                          onClick={() => {
                            setFormData({ ...formData, primaryPlatform: acc.platform });
                            if (errors.primaryPlatform) setErrors({ ...errors, primaryPlatform: null });
                          }}
                        >
                          {formData.primaryPlatform === acc.platform && <span className="pill-check">✓</span>}
                          {acc.platform} {acc.username ? `(${acc.username})` : ''}
                        </button>
                      ))}
                    </div>
                    {errors.primaryPlatform && <span className="field-error-msg">{errors.primaryPlatform}</span>}
                  </div>

                  {/* Portfolio / Work Samples (Optional) */}
                  <div className="form-field-full portfolio-section-divider">
                    <label className="field-label optional">Show Us Your Work</label>
                    <p className="field-hint" style={{ marginTop: '-0.25rem', marginBottom: '1rem' }}>
                      Add a link to your portfolio website, or 1 to 3 URLs of your best campaigns, viral reels, or YouTube videos.
                    </p>

                    <div className="portfolio-links-list">
                      {portfolios.map((item, pIdx) => (
                        <div key={pIdx} className="portfolio-entry-row">
                          <input
                            type="text"
                            className="form-input portfolio-title-input"
                            placeholder="Title (e.g. Fashion Week Reel / Brand Campaign)"
                            value={item.title}
                            onChange={e => handlePortfolioChange(pIdx, 'title', e.target.value)}
                          />
                          <input
                            type="url"
                            className="form-input portfolio-url-input"
                            placeholder="https://..."
                            value={item.url}
                            onChange={e => handlePortfolioChange(pIdx, 'url', e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn-remove-portfolio"
                            onClick={() => removePortfolioItem(pIdx)}
                            title="Remove link"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {portfolios.length < 3 && (
                      <button
                        type="button"
                        className="btn-add-portfolio-link"
                        onClick={addPortfolioItem}
                      >
                        + Add Work / Campaign Link
                      </button>
                    )}
                  </div>

                  {/* Optional Audience Snapshot */}
                  <div className="form-field-full audience-snapshot-block">
                    <div className="audience-block-header">
                      <span className="field-label optional">Audience Snapshot (Optional)</span>
                      <p className="field-hint">You can also update or enrich this anytime from your dashboard.</p>
                    </div>
                    <div className="form-fields-grid" style={{ marginTop: '1rem' }}>
                      <div className="form-field">
                        <label className="field-sublabel">Primary Audience Location</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. India (75%), USA (10%)"
                          value={formData.audienceLocation}
                          onChange={e => setFormData({ ...formData, audienceLocation: e.target.value })}
                        />
                      </div>
                      <div className="form-field">
                        <label className="field-sublabel">Audience Age Range</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 18-24 (45%), 25-34 (35%)"
                          value={formData.audienceAgeRange}
                          onChange={e => setFormData({ ...formData, audienceAgeRange: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            )}

            {/* ══════════════════════════════════════════════════
                STEP 04: REVIEW & SUBMIT
            ══════════════════════════════════════════════════ */}
            {currentStep === 4 && (
              <section className="form-step-section">
                <header className="step-header">
                  <span className="step-tagline">STEP 04</span>
                  <h2 className="step-title">Review your profile</h2>
                  <p className="step-desc">
                    Review your information before submitting for C-PEB curation. Each section can be edited directly.
                  </p>
                </header>

                <div className="review-preview-container">
                  
                  {/* ABOUT YOU CARD */}
                  <div className="review-summary-card">
                    <div className="review-card-top">
                      <h3 className="review-card-title">ABOUT YOU</h3>
                      <button type="button" className="btn-edit-section" onClick={() => jumpToStep(1)}>
                        EDIT &rarr;
                      </button>
                    </div>

                    <div className="review-about-layout">
                      <div className="review-avatar-frame">
                        {formData.profileImage ? (
                          <img src={formData.profileImage} alt={formData.displayName} className="review-avatar-img" />
                        ) : (
                          <div className="review-avatar-fallback">
                            {formData.displayName?.charAt(0) || 'C'}
                          </div>
                        )}
                      </div>

                      <div className="review-about-meta">
                        <div className="review-meta-item">
                          <span className="review-label">Display Name</span>
                          <span className="review-val strong">{formData.displayName || '—'}</span>
                        </div>
                        <div className="review-meta-item">
                          <span className="review-label">Full Name</span>
                          <span className="review-val">{formData.fullName || '—'}</span>
                        </div>
                        <div className="review-meta-item">
                          <span className="review-label">Location</span>
                          <span className="review-val">
                            {[formData.city, formData.state, formData.country].filter(Boolean).join(', ') || '—'}
                          </span>
                        </div>
                        <div className="review-meta-item">
                          <span className="review-label">Languages</span>
                          <span className="review-val">
                            {formData.languages?.length > 0 ? formData.languages.join(', ') : 'None specified'}
                          </span>
                        </div>
                        <div className="review-meta-item private-tag">
                          <span className="review-label">Contact (Private)</span>
                          <span className="review-val muted">{formData.email} · {formData.phoneCode} {formData.phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CONTENT CARD */}
                  <div className="review-summary-card">
                    <div className="review-card-top">
                      <h3 className="review-card-title">CONTENT</h3>
                      <button type="button" className="btn-edit-section" onClick={() => jumpToStep(2)}>
                        EDIT &rarr;
                      </button>
                    </div>

                    <div className="review-details-grid">
                      <div className="review-data-col">
                        <span className="review-label">Primary Category</span>
                        <span className="review-val strong">{formData.primaryCategory || '—'}</span>
                      </div>

                      {formData.secondaryCategories?.length > 0 && (
                        <div className="review-data-col">
                          <span className="review-label">Secondary Categories</span>
                          <span className="review-val">{formData.secondaryCategories.join(', ')}</span>
                        </div>
                      )}

                      <div className="review-data-col full">
                        <span className="review-label">Content Types</span>
                        <div className="review-tags-row">
                          {formData.contentTypes?.map(t => (
                            <span key={t} className="review-tag">{t}</span>
                          ))}
                        </div>
                      </div>

                      <div className="review-data-col full">
                        <span className="review-label">Short Bio</span>
                        <p className="review-bio-text">{formData.bio || '—'}</p>
                      </div>

                      {formData.collaborationInterests?.length > 0 && (
                        <div className="review-data-col full">
                          <span className="review-label">Collaboration Interests</span>
                          <div className="review-tags-row">
                            {formData.collaborationInterests.map(c => (
                              <span key={c} className="review-tag">{c}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SOCIALS & WORK CARD */}
                  <div className="review-summary-card">
                    <div className="review-card-top">
                      <h3 className="review-card-title">SOCIALS &amp; PORTFOLIO</h3>
                      <button type="button" className="btn-edit-section" onClick={() => jumpToStep(3)}>
                        EDIT &rarr;
                      </button>
                    </div>

                    <div className="review-details-grid">
                      <div className="review-data-col full">
                        <div className="review-primary-platform-banner">
                          <span className="banner-label">PRIMARY PLATFORM</span>
                          <span className="banner-val">{formData.primaryPlatform || socialAccounts[0]?.platform}</span>
                        </div>
                      </div>

                      <div className="review-data-col full">
                        <span className="review-label">Connected Platforms</span>
                        <div className="review-socials-list">
                          {socialAccounts.map((sa, i) => (
                            <div key={i} className="review-social-row">
                              <span className="review-social-name">{sa.platform}</span>
                              <span className="review-social-handle">{sa.username}</span>
                              <span className="review-social-followers">
                                {formatFollowersHelper(sa.followers) || `${sa.followers} followers`}
                              </span>
                              {sa.profileUrl && (
                                <a 
                                  href={sa.profileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="review-social-link"
                                >
                                  Visit Profile ↗
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {portfolios.some(p => p.url?.trim()) && (
                        <div className="review-data-col full">
                          <span className="review-label">Work / Campaign Links</span>
                          <div className="review-portfolio-list">
                            {portfolios.filter(p => p.url?.trim()).map((p, pI) => (
                              <div key={pI} className="review-portfolio-item">
                                <span className="p-title">{p.title || 'Work Sample'}</span>
                                <a href={p.url} target="_blank" rel="noopener noreferrer" className="p-url">
                                  {p.url} ↗
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(formData.audienceLocation || formData.audienceAgeRange) && (
                        <div className="review-data-col full">
                          <span className="review-label">Audience Snapshot</span>
                          <p className="review-val muted">
                            {[formData.audienceLocation, formData.audienceAgeRange].filter(Boolean).join(' · ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Confirmation & Consent Box */}
                  <div className="submission-consent-card">
                    <label className="consent-checkbox-label">
                      <input
                        type="checkbox"
                        className="consent-checkbox"
                        checked={formData.accuracyConsent}
                        onChange={e => {
                          setFormData({ ...formData, accuracyConsent: e.target.checked });
                          if (errors.accuracyConsent) setErrors({ ...errors, accuracyConsent: null });
                        }}
                      />
                      <span className="consent-text">
                        I confirm that the information provided is accurate and that C-PEB may review this profile before publishing it.
                      </span>
                    </label>
                    {errors.accuracyConsent && (
                      <span className="field-error-msg" style={{ display: 'block', marginTop: '0.5rem' }}>
                        {errors.accuracyConsent}
                      </span>
                    )}
                  </div>

                </div>
              </section>
            )}

            {/* Bottom Actions Bar */}
            <div className="onboarding-action-bar">
              <div className="action-bar-left">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn-action-back"
                    onClick={handleBack}
                    disabled={saving}
                  >
                    &larr; BACK
                  </button>
                )}
              </div>

              <div className="action-bar-right">
                <button
                  type="button"
                  className="btn-action-draft"
                  onClick={() => handleSaveDraft(true)}
                  disabled={saving}
                >
                  {saving ? 'SAVING...' : 'SAVE AS DRAFT'}
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    className="btn-action-next"
                    onClick={handleNext}
                    disabled={saving}
                  >
                    CONTINUE &rarr;
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-action-submit"
                    onClick={handleSubmitApplication}
                    disabled={saving}
                  >
                    {saving ? 'SUBMITTING...' : (
                      currentStatus === 'CHANGES_REQUESTED' ? 'RESUBMIT FOR REVIEW →' : 'SUBMIT APPLICATION →'
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
};

export default CreatorOnboarding;
