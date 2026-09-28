import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, ArrowLeft, Camera, AlertCircle } from 'lucide-react';
import './CreatorOnboarding.css';

const CATEGORIES = [
  'Fashion', 'Beauty', 'Lifestyle', 'Food', 'Travel', 'Fitness',
  'Technology', 'Education', 'Finance', 'Gaming', 'Entertainment',
  'Comedy', 'Music', 'Parenting', 'Photography', 'Other'
];

const CONTENT_TYPES = [
  'Instagram Reels', 'Instagram Posts', 'Instagram Stories', 
  'YouTube Videos', 'YouTube Shorts', 'UGC', 
  'Product Reviews', 'Live Content', 'Event Content', 'Other'
];

const COLLABORATION_OPTIONS = [
  'Paid Collaborations', 'Product Collaborations', 'Affiliate Campaigns', 
  'Event Campaigns', 'Long-Term Partnerships', 'UGC Projects', 
  'Brand Ambassador Opportunities'
];

const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Punjabi', 'Bengali', 'Marathi', 'Tamil', 'Telugu', 'Gujarati', 'Kannada', 'Malayalam', 'Other'];
const PLATFORMS = ['Instagram', 'YouTube', 'Facebook', 'LinkedIn', 'X / Twitter'];
const AUDIENCE_AGES = ['18–24', '25–34', '35–44', '45+'];

export default function CreatorOnboarding() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [status, setStatus] = useState('DRAFT');

  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    profileImage: '',
    city: '',
    state: '',
    languages: [],
    bio: '',
    primaryPlatform: '',
    audienceLocation: '',
    audienceAgeRange: '',
    primaryCategory: '',
    secondaryCategories: [],
    contentTypes: [],
    collaborationInterests: [],
    accuracyConsent: false,
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/creators/profile/me', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setFormData(prev => ({ ...prev, ...data.data }));
        setStatus(data.data.status || 'DRAFT');
        
        // Auto-resume logic
        if (data.data.status === 'APPROVED') {
          navigate('/creator/dashboard');
        } else if (['UNDER_REVIEW', 'PENDING_REVIEW', 'CHANGES_REQUESTED', 'REJECTED'].includes(data.data.status)) {
          setCurrentStep(7); // Show post-submission screen or feedback screen
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async (showAlert = true) => {
    if (!user?.token) return false;
    setSaving(true);
    try {
      const res = await fetch('/api/creators/profile/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        if (showAlert) {
          setSaveSuccessMsg('Progress saved.');
          setTimeout(() => setSaveSuccessMsg(''), 3000);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const nextStep = async () => {
    await handleSaveDraft(false);
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!formData.accuracyConsent) {
      alert("Please confirm the information is accurate.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...formData, status: 'PENDING_REVIEW' };
      const res = await fetch('/api/creators/profile/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setStatus('PENDING_REVIEW');
        setCurrentStep(7);
        window.scrollTo(0, 0);
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch (err) {
      alert('Network error during submission.');
    } finally {
      setSaving(false);
    }
  };

  const handleArrayToggle = (field, value, max = null) => {
    setFormData(prev => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        if (max && current.length >= max) return prev;
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const completionPercentage = useMemo(() => {
    const requiredFields = [
      'fullName', 'displayName', 'city', 'state', 'primaryPlatform', 
      'primaryCategory', 'audienceLocation', 'audienceAgeRange'
    ];
    let filled = 0;
    requiredFields.forEach(f => {
      if (formData[f] && formData[f].length > 0) filled++;
    });
    return Math.round((filled / requiredFields.length) * 100);
  }, [formData]);

  if (loading) return <div className="onboarding-loading">Loading...</div>;

  if (status === 'CHANGES_REQUESTED' && currentStep === 7) {
    return (
      <div className="onboarding-layout">
        <div className="onboarding-container text-center py-12">
          <AlertCircle size={64} className="text-yellow-500 mx-auto mb-6" style={{ color: '#eab308' }} />
          <h2 className="text-2xl font-bold mb-4">Changes requested</h2>
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: '1.5rem', borderRadius: '8px', maxWidth: '500px', margin: '0 auto 2rem', textAlign: 'left' }}>
            <h4 style={{ fontWeight: 600, color: '#92400e', marginBottom: '0.5rem' }}>Admin Feedback:</h4>
            <p style={{ color: '#b45309', margin: 0 }}>
              "{formData.changesRequestedReason || 'Please review and update your profile information.'}"
            </p>
          </div>
          <button onClick={() => setCurrentStep(1)} className="btn btn-primary">
            Update Profile
          </button>
        </div>
      </div>
    );
  }

  if (status === 'PENDING_REVIEW' || status === 'UNDER_REVIEW' || (currentStep === 7 && status !== 'CHANGES_REQUESTED')) {
    return (
      <div className="onboarding-layout">
        <div className="onboarding-container text-center py-12">
          <CheckCircle2 size={64} className="text-green mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Profile submitted successfully</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Your creator profile is now under review. We'll notify you when the review is complete so you can start collaborating.
          </p>
          <div className="status-badge inline-block bg-gray-100 px-4 py-2 rounded-full font-semibold text-gray-700 mb-8">
            STATUS: UNDER REVIEW
          </div>
          <br/>
          <button onClick={() => navigate('/creator/dashboard')} className="btn btn-primary">
            Go to Creator Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-layout">
      {/* Sidebar Progress */}
      <aside className="onboarding-sidebar">
        <div className="sidebar-header">
          <h3>Profile Setup</h3>
          <div className="completion-bar-wrap">
            <div className="completion-text">
              <span>Profile Completion</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="completion-track">
              <div className="completion-fill" style={{ width: `${completionPercentage}%` }} />
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className={`nav-step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>
            <span className="step-num">01</span> Basic Info
          </div>
          <div className={`nav-step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>
            <span className="step-num">02</span> Socials
          </div>
          <div className={`nav-step ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}>
            <span className="step-num">03</span> Audience
          </div>
          <div className={`nav-step ${currentStep === 4 ? 'active' : currentStep > 4 ? 'completed' : ''}`}>
            <span className="step-num">04</span> Content
          </div>
          <div className={`nav-step ${currentStep === 5 ? 'active' : currentStep > 5 ? 'completed' : ''}`}>
            <span className="step-num">05</span> Collaborations
          </div>
          <div className={`nav-step ${currentStep === 6 ? 'active' : currentStep > 6 ? 'completed' : ''}`}>
            <span className="step-num">06</span> Review
          </div>
        </nav>
        {saveSuccessMsg && <div className="save-toast">{saveSuccessMsg}</div>}
      </aside>

      {/* Main Form Content */}
      <main className="onboarding-main">
        
        {/* STEP 1: BASIC INFO */}
        {currentStep === 1 && (
          <div className="step-content">
            <div className="step-header">
              <h2>Tell us about yourself</h2>
              <p>A complete profile helps brands find the right creator for their campaigns.</p>
            </div>
            <div className="form-grid">
              <div className="form-group full-width photo-upload">
                <div className="photo-circle">
                  {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Profile" />
                  ) : (
                    <Camera size={24} />
                  )}
                </div>
                <div>
                  <h4>Profile Photo</h4>
                  <p>Upload a clear photo of yourself. (Feature simulated)</p>
                </div>
              </div>
              
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" value={formData.fullName} 
                  onChange={e => setFormData({...formData, fullName: e.target.value})} 
                  placeholder="Amit Kumar"
                />
              </div>
              <div className="form-group">
                <label>Creator / Display Name *</label>
                <input 
                  type="text" value={formData.displayName} 
                  onChange={e => setFormData({...formData, displayName: e.target.value})} 
                  placeholder="@amitcreates"
                />
              </div>
              <div className="form-group">
                <label>City *</label>
                <input 
                  type="text" value={formData.city} 
                  onChange={e => setFormData({...formData, city: e.target.value})} 
                  placeholder="Mumbai"
                />
              </div>
              <div className="form-group">
                <label>State *</label>
                <input 
                  type="text" value={formData.state} 
                  onChange={e => setFormData({...formData, state: e.target.value})} 
                  placeholder="Maharashtra"
                />
              </div>
              <div className="form-group full-width">
                <label>Languages (Select multiple)</label>
                <div className="chips-container">
                  {LANGUAGE_OPTIONS.map(lang => (
                    <button 
                      key={lang}
                      className={`chip ${formData.languages.includes(lang) ? 'selected' : ''}`}
                      onClick={() => handleArrayToggle('languages', lang)}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group full-width">
                <label>Short Bio</label>
                <textarea 
                  value={formData.bio} 
                  onChange={e => setFormData({...formData, bio: e.target.value})} 
                  placeholder="Tell brands about who you are and what you create..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SOCIALS */}
        {currentStep === 2 && (
          <div className="step-content">
            <div className="step-header">
              <h2>Connect your social platforms</h2>
              <p>Connect the platforms where you create content so brands can better understand your reach.</p>
            </div>
            <div className="form-group full-width mb-8">
              <label>Primary Platform *</label>
              <select 
                value={formData.primaryPlatform} 
                onChange={e => setFormData({...formData, primaryPlatform: e.target.value})}
              >
                <option value="">Select your main platform</option>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            
            <div className="platform-connections">
              {PLATFORMS.map(platform => (
                <div key={platform} className="platform-card">
                  <div className="platform-info">
                    <strong>{platform}</strong>
                    <span>Not connected</span>
                  </div>
                  <button className="btn btn-outline btn-sm">Connect</button>
                </div>
              ))}
              <p className="help-text mt-4">
                <AlertCircle size={14} className="inline mr-1"/>
                Verified platform data will be automatically synced. For this demo, manual entry is bypassed.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: AUDIENCE */}
        {currentStep === 3 && (
          <div className="step-content">
            <div className="step-header">
              <h2>Tell us about your audience</h2>
              <p>Where is your audience from, and who are they?</p>
            </div>
            <div className="form-group full-width mb-6">
              <label>Primary Audience Location *</label>
              <input 
                type="text" value={formData.audienceLocation} 
                onChange={e => setFormData({...formData, audienceLocation: e.target.value})} 
                placeholder="e.g. India, USA, specific cities"
              />
            </div>
            <div className="form-group full-width">
              <label>Primary Audience Age Range *</label>
              <div className="chips-container">
                {AUDIENCE_AGES.map(age => (
                  <button 
                    key={age}
                    className={`chip ${formData.audienceAgeRange === age ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, audienceAgeRange: age})}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CONTENT */}
        {currentStep === 4 && (
          <div className="step-content">
            <div className="step-header">
              <h2>What kind of content do you create?</h2>
              <p>Select the categories and formats that define your work.</p>
            </div>
            <div className="form-group full-width mb-6">
              <label>Primary Category *</label>
              <select 
                value={formData.primaryCategory} 
                onChange={e => setFormData({...formData, primaryCategory: e.target.value})}
              >
                <option value="">Select primary category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="form-group full-width mb-6">
              <label>Secondary Categories (Select up to 3)</label>
              <div className="chips-container">
                {CATEGORIES.filter(c => c !== formData.primaryCategory).map(cat => (
                  <button 
                    key={cat}
                    className={`chip ${formData.secondaryCategories.includes(cat) ? 'selected' : ''}`}
                    onClick={() => handleArrayToggle('secondaryCategories', cat, 3)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Content Formats (Select multiple)</label>
              <div className="chips-container">
                {CONTENT_TYPES.map(type => (
                  <button 
                    key={type}
                    className={`chip ${formData.contentTypes.includes(type) ? 'selected' : ''}`}
                    onClick={() => handleArrayToggle('contentTypes', type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: COLLABORATIONS */}
        {currentStep === 5 && (
          <div className="step-content">
            <div className="step-header">
              <h2>What collaborations are you interested in?</h2>
              <p>This helps us match you with the right brand campaigns.</p>
            </div>
            <div className="form-group full-width">
              <div className="chips-vertical">
                {COLLABORATION_OPTIONS.map(opt => (
                  <button 
                    key={opt}
                    className={`chip-row ${formData.collaborationInterests.includes(opt) ? 'selected' : ''}`}
                    onClick={() => handleArrayToggle('collaborationInterests', opt)}
                  >
                    <div className="checkbox">
                      {formData.collaborationInterests.includes(opt) && <CheckCircle2 size={14} />}
                    </div>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW */}
        {currentStep === 6 && (
          <div className="step-content">
            <div className="step-header">
              <h2>Review your creator profile</h2>
              <p>Please ensure all information is correct before submitting for review.</p>
            </div>
            
            <div className="review-sections">
              <div className="review-card">
                <div className="review-card-header">
                  <h3>Basic Information</h3>
                  <button onClick={() => setCurrentStep(1)} className="text-btn">Edit</button>
                </div>
                <div className="review-card-body">
                  <p><strong>Name:</strong> {formData.fullName}</p>
                  <p><strong>Display:</strong> {formData.displayName}</p>
                  <p><strong>Location:</strong> {formData.city}, {formData.state}</p>
                  <p><strong>Languages:</strong> {formData.languages.join(', ') || 'None selected'}</p>
                  <p><strong>Bio:</strong> {formData.bio || 'None'}</p>
                </div>
              </div>
              
              <div className="review-card">
                <div className="review-card-header">
                  <h3>Social Platforms</h3>
                  <button onClick={() => setCurrentStep(2)} className="text-btn">Edit</button>
                </div>
                <div className="review-card-body">
                  <p><strong>Primary Platform:</strong> {formData.primaryPlatform || 'None selected'}</p>
                </div>
              </div>

              <div className="review-card">
                <div className="review-card-header">
                  <h3>Audience & Content</h3>
                  <button onClick={() => setCurrentStep(4)} className="text-btn">Edit</button>
                </div>
                <div className="review-card-body">
                  <p><strong>Primary Category:</strong> {formData.primaryCategory || 'None selected'}</p>
                  <p><strong>Secondary:</strong> {formData.secondaryCategories.join(', ') || 'None selected'}</p>
                  <p><strong>Formats:</strong> {formData.contentTypes.join(', ') || 'None selected'}</p>
                  <p><strong>Audience Location:</strong> {formData.audienceLocation || 'None'}</p>
                  <p><strong>Audience Age:</strong> {formData.audienceAgeRange || 'None'}</p>
                </div>
              </div>
            </div>

            <div className="consent-box mt-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.accuracyConsent}
                  onChange={e => setFormData({...formData, accuracyConsent: e.target.checked})}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">
                  I confirm that the information provided is accurate. My profile will be reviewed by the C-PEB team before it becomes visible to brands.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="step-actions">
          {currentStep > 1 ? (
            <button className="btn btn-outline" onClick={prevStep}>
              <ArrowLeft size={16} className="mr-2 inline" /> Back
            </button>
          ) : <div></div>}
          
          <div className="flex gap-4">
            <button className="btn btn-outline" onClick={() => handleSaveDraft(true)} disabled={saving}>
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            {currentStep < 6 ? (
              <button className="btn btn-primary" onClick={nextStep}>
                Save & Continue
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving || !formData.accuracyConsent}>
                {saving ? 'Submitting...' : (status === 'CHANGES_REQUESTED' ? 'Resubmit Profile' : 'Submit Profile')}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
