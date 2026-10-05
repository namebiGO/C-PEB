import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Clock,
  HelpCircle,
  X,
  Send,
  MessageSquare,
  AlertCircle,
  Briefcase,
  TrendingUp,
  Target,
  Megaphone,
  Calendar,
  Check,
  Search,
  Lock,
  ExternalLink
} from 'lucide-react';
import SEO from '../components/SEO';
import './StartupAdvisory.css';

const API_BASE = '';

// Razorpay Payment Page URLs (configurable via .env or fallback links)
const RAZORPAY_LINKS = {
  ONE_MONTH: import.meta.env.VITE_RAZORPAY_1M_URL || 'https://pages.razorpay.com/cpeb-advisory-1m',
  THREE_MONTHS: import.meta.env.VITE_RAZORPAY_3M_URL || 'https://pages.razorpay.com/cpeb-advisory-3m'
};

const getLocalAdvisorySubs = () => {
  try {
    return JSON.parse(localStorage.getItem('cpeb_advisory_subs') || '[]');
  } catch {
    return [];
  }
};

const saveLocalAdvisorySub = (sub) => {
  try {
    const subs = getLocalAdvisorySubs();
    const updated = [sub, ...subs.filter((s) => s.orderId !== sub.orderId)];
    localStorage.setItem('cpeb_advisory_subs', JSON.stringify(updated));
  } catch (err) {
    console.error('Local save error', err);
  }
};

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const HELP_CATEGORIES = [
  {
    title: 'BUSINESS DIRECTION',
    icon: Target,
    items: [
      'Business idea discussion & validation',
      'Strategic planning & focus',
      'Priorities & resource allocation',
      'Next-step practical guidance',
      'Critical problem solving'
    ]
  },
  {
    title: 'STARTUP SUPPORT',
    icon: TrendingUp,
    items: [
      'Pre-launch & launch planning',
      'Digital presence setup guidance',
      'Business setup & operations overview',
      'Early-stage customer acquisition support',
      'Market positioning & messaging'
    ]
  },
  {
    title: 'BUSINESS SUPPORT',
    icon: Briefcase,
    items: [
      'Business development thinking',
      'Day-to-day operational guidance',
      'Partner & vendor connection guidance',
      'Lead generation discussion',
      'Sustainable growth planning'
    ]
  },
  {
    title: 'BRAND & MARKETING',
    icon: Megaphone,
    items: [
      'Brand promotion strategy',
      'Digital marketing channel evaluation',
      'Campaign concept planning',
      'Creator partnership alignment',
      'Event & product promotion'
    ]
  },
  {
    title: 'EVENTS & ACTIVATIONS',
    icon: Calendar,
    items: [
      'Event concept & planning discussions',
      'Event promotion tactics',
      'Brand activations strategy',
      'Target audience outreach',
      'Execution roadmap support'
    ]
  }
];

const COMPARISON_ROWS = [
  { feature: 'Priority Support Handling', m1: true, m3: true },
  { feature: 'Ongoing Advisory Access', m1: true, m3: true },
  { feature: 'Business Direction & Idea Guidance', m1: true, m3: true },
  { feature: 'Startup Setup & Launch Guidance', m1: true, m3: true },
  { feature: 'Brand & Marketing Strategy', m1: true, m3: true },
  { feature: 'Relevant C-PEB Service Coordination', m1: true, m3: true },
  { feature: 'Support Plan Duration', m1: '1 Month', m3: '3 Months' },
  { feature: 'Pricing Commitment', m1: '₹2,499 Total', m3: '₹5,999 Total (≈ ₹2,000/mo)' }
];

const EXAMPLE_QUESTIONS = [
  'How should we launch this business without overspending?',
  'Which digital channel should we focus on first for early traction?',
  'How can we promote our brand locally and build trust?',
  'Should we use creators for this campaign or run performance ads?',
  'How should we plan and structure our upcoming launch event?',
  'What should our next marketing step be given our current budget?',
  'How can we improve our business positioning against incumbents?',
  'What kind of support and partners do we need right now?'
];

const EXCLUSIONS = [
  'Full event production and venue management',
  'Third-party paid media ad spend budgets',
  'Direct influencer and creator talent fees',
  'Full-scope software and custom website development',
  'Graphic design and commercial video production crews',
  'External vendor charges and registration fees',
  'Guaranteed commercial outcomes, revenue, or investor funding'
];

const FAQS = [
  {
    q: 'What does the ₹2,499 plan include?',
    a: 'The ₹2,499 plan includes 1 month of dedicated advisory support from C-PEB with priority handling. You can bring your startup and business questions, explore next steps, evaluate marketing options, and get practical guidance throughout your active month.'
  },
  {
    q: 'What does the ₹5,999 plan include?',
    a: 'The ₹5,999 plan includes 3 full months of continuous advisory support from C-PEB with priority handling. It offers the same practical guidance as the 1-month plan over an extended period at an effective cost of approximately ₹2,000 per month.'
  },
  {
    q: 'What does priority support mean?',
    a: 'Priority support means your questions and support requests are placed in an expedited priority queue ahead of general public inquiries. Our advisory team reviews your context and provides focused, structured guidance during your active subscription.'
  },
  {
    q: 'Can startups subscribe to the advisory plan?',
    a: 'Yes. The advisory plans are specifically designed for early-stage founders and startups validating ideas, preparing launches, or structuring their digital presence.'
  },
  {
    q: 'Can established businesses subscribe?',
    a: 'Yes. Established businesses and MSMEs utilize our advisory support to evaluate marketing campaigns, plan activations, review operations, and coordinate growth strategies.'
  },
  {
    q: 'Can I purchase additional C-PEB services while my advisory plan is active?',
    a: 'Yes. If your business requires separate execution services—such as full digital marketing campaigns, influencer collaborations, or event management—you can engage C-PEB separately with coordinated alignment.'
  },
  {
    q: 'Can I upgrade from 1 month to 3 months?',
    a: 'Yes. You can transition to a 3-month continuous advisory plan at any time to extend your support window.'
  },
  {
    q: 'What happens after my plan ends?',
    a: 'When your plan period concludes, priority support access expires. You can renew your advisory subscription for 1 month or 3 months whenever you need ongoing support again.'
  },
  {
    q: 'Does the plan include execution services?',
    a: 'No. The advisory plan is dedicated to strategic guidance, problem solving, options evaluation, and priority support. Third-party execution costs (such as paid ad budgets, creator fees, or full event production) are separate.'
  },
  {
    q: 'How do I get started?',
    a: 'Select your preferred duration (1 Month or 3 Months), fill in your basic business details and your initial requirement, and activate your plan. Your priority support becomes active immediately upon activation.'
  }
];

export default function StartupAdvisory() {
  const [openFaq, setOpenFaq] = useState(null);

  // Checkout modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('ONE_MONTH'); // 'ONE_MONTH' | 'THREE_MONTHS'
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    businessName: '',
    requirement: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [redirectOrderId, setRedirectOrderId] = useState('');
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [submitError, setSubmitError] = useState('');

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const VALID_COUPONS = { FIRST10: 10 };

  const handleApplyCoupon = () => {
    const code = couponInput.toUpperCase().trim();
    if (!code) { setCouponError('Please enter a coupon code.'); return; }
    if (VALID_COUPONS[code] !== undefined) {
      setCouponApplied(true);
      setCouponDiscount(VALID_COUPONS[code]);
      setCouponError('');
    } else {
      setCouponApplied(false);
      setCouponDiscount(0);
      setCouponError('Invalid coupon code.');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponInput('');
    setCouponError('');
  };

  // Support request form state (inside success view)
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [supportForm, setSupportForm] = useState({ subject: '', requirement: '' });
  const [supportSubmitting, setSupportSubmitting] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState(false);
  const [supportError, setSupportError] = useState('');

  // Status lookup state
  const [lookupOpen, setLookupOpen] = useState(false);
  const [lookupRef, setLookupRef] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  // Test mode — only active when URL contains ?test=1
  const [testMode] = useState(() => new URLSearchParams(window.location.search).get('test') === '1');
  const [testStatus, setTestStatus] = useState('');

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleOpenCheckout = (planKey = 'ONE_MONTH') => {
    setSelectedPlan(planKey);
    setSubmitError('');
    setRedirecting(false);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setRedirecting(false);
    setSubmitError('');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('activate') === 'true') {
      handleOpenCheckout('ONE_MONTH');
    }
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (modalOpen || lookupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen, lookupOpen]);

  // ─── ₹1 Test Payment Handler ──────────────────────────────
  const handleTestPayment = async () => {
    setTestStatus('Creating ₹1 test order...');
    try {
      const res = await fetch(`${API_BASE}/api/advisory/test-payment`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to create test order');

      const loaded = await loadRazorpay();
      if (!loaded) { setTestStatus('❌ Razorpay SDK failed to load'); return; }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_Ti8XXqrNUy345C',
        amount: 100,
        currency: 'INR',
        name: 'C-PEB',
        description: '₹1 Integration Test',
        order_id: data.razorpayOrderId,
        handler: function (response) {
          setTestStatus(`✅ Test payment successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: { name: 'Test User', email: 'test@cpeb.in', contact: '9999999999' },
        theme: { color: '#17a85a' }
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (r) => setTestStatus(`❌ Failed: ${r.error.description}`));
      rzp.open();
      setTestStatus('💳 Razorpay modal opened — complete the payment');
    } catch (err) {
      setTestStatus(`❌ Error: ${err.message}`);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    const isThree = selectedPlan === 'THREE_MONTHS';
    const amount = isThree ? 5999 : 2499;

    let orderId = '';
    let rzpOrderId = '';
    let createdSub = null;

    try {
      const res = await fetch(`${API_BASE}/api/advisory/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          plan: selectedPlan,
          paymentStatus: 'PENDING',
          paymentMethod: 'Razorpay',
          couponCode: couponApplied ? couponInput.toUpperCase().trim() : undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        createdSub = data.data;
        orderId = createdSub.orderId;
        rzpOrderId = data.razorpayOrderId;
      } else {
        throw new Error(data.error || 'Failed to create order');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setSubmitError(err.message || 'Failed to initiate checkout. Please try again.');
      setSubmitting(false);
      return;
    }

    const resLoad = await loadRazorpay();
    if (!resLoad) {
      setSubmitError('Razorpay SDK failed to load. Are you online?');
      setSubmitting(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_Ti8XXqrNUy345C',
      amount: amount * 100,
      currency: "INR",
      name: "C-PEB",
      description: isThree ? "Ongoing Advisory (3 Months)" : "Starter Advisory (1 Month)",
      order_id: rzpOrderId,
      handler: async function (response) {
        try {
          const verifyRes = await fetch(`${API_BASE}/api/advisory/order/${orderId}/confirm-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
             setActiveSubscription(verifyData.data);
             saveLocalAdvisorySub(verifyData.data);
             setModalOpen(false);
             setLookupRef(orderId);
             setLookupOpen(true);
             setTimeout(() => handleLookupSubscription({ preventDefault: () => {} }), 500);
          } else {
             alert('Payment verification failed');
          }
        } catch (err) {
           console.error(err);
           alert('Payment verification error');
        }
      },
      prefill: {
        name: formData.customerName,
        email: formData.email,
        contact: formData.phone
      },
      theme: {
        color: "#17a85a"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response){
        alert(`Payment failed: ${response.error.description}`);
    });
    rzp.open();
    
    setSubmitting(false);
  };

  const handleLookupSubscription = async (e) => {
    e.preventDefault();
    if (!lookupRef.trim()) return;

    setLookupLoading(true);
    setLookupError('');

    try {
      const res = await fetch(`${API_BASE}/api/advisory/order/${encodeURIComponent(lookupRef.trim())}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setActiveSubscription(data.data);
        saveLocalAdvisorySub(data.data);
        setLookupOpen(false);
        setModalOpen(true);
        return;
      }
      throw new Error(data.error || 'Not found on server');
    } catch {
      // Check local cache
      const localSubs = getLocalAdvisorySubs();
      const term = lookupRef.trim().toLowerCase();
      const match = localSubs.find(
        (s) => s.orderId?.toLowerCase() === term || s.email?.toLowerCase() === term
      );
      if (match) {
        setActiveSubscription(match);
        setLookupOpen(false);
        setModalOpen(true);
      } else {
        setLookupError('Subscription not found. Please verify your Order ID or registered email.');
      }
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSupportRequestSubmit = async (e) => {
    e.preventDefault();
    if (!activeSubscription) return;

    setSupportSubmitting(true);
    setSupportError('');

    try {
      const res = await fetch(`${API_BASE}/api/advisory/subscription/${activeSubscription._id}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supportForm)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setActiveSubscription(data.data);
        saveLocalAdvisorySub(data.data);
        setSupportSuccess(true);
        setSupportForm({ subject: '', requirement: '' });
        return;
      }
      throw new Error(data.error || 'Server error');
    } catch {
      // Local fallback
      const updatedSub = {
        ...activeSubscription,
        requests: [
          {
            _id: 'req_' + Date.now(),
            subject: supportForm.subject,
            requirement: supportForm.requirement,
            status: 'OPEN',
            prioritySupport: true,
            createdAt: new Date().toISOString(),
            replies: []
          },
          ...(activeSubscription.requests || [])
        ]
      };
      setActiveSubscription(updatedSub);
      saveLocalAdvisorySub(updatedSub);
      setSupportSuccess(true);
      setSupportForm({ subject: '', requirement: '' });
    } finally {
      setSupportSubmitting(false);
    }
  };

  const isThreeMonths = selectedPlan === 'THREE_MONTHS';
  const planBasePrice = isThreeMonths ? 5999 : 2499;
  const planDiscount = couponApplied ? Math.round(planBasePrice * couponDiscount / 100) : 0;
  const planPrice = planBasePrice - planDiscount;

  return (
    <div className="adv-page">
      <SEO
        title="Startup & Business Advisory | Practical Guidance | C-PEB"
        description="Get practical, ongoing business guidance for your startup or business with priority support from C-PEB. Flexible 1-month and 3-month plans."
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1 — HERO
          ───────────────────────────────────────────────────────────── */}
      <section className="adv-hero shared-hero-bg">
        <div className="adv-container">
          <div className="adv-hero-inner">
            <span className="adv-eyebrow">STARTUP & BUSINESS SUPPORT</span>
            <h1 className="adv-hero-title">
              Get the Guidance You Need to Move Your Business Forward.
            </h1>
            <p className="adv-hero-desc">
              Get ongoing advisory support from C-PEB for your startup or business, with priority access during your active plan.
            </p>

            <div className="adv-hero-actions">
              <button
                type="button"
                className="adv-btn adv-btn-primary"
                onClick={() => handleOpenCheckout('ONE_MONTH')}
              >
                GET STARTED <ArrowRight size={18} />
              </button>
              <a href="#plans" className="adv-btn adv-btn-secondary">
                VIEW PLANS ↓
              </a>
            </div>

            <div className="adv-hero-trust">
              <span className="adv-trust-dot" />
              <span>1 Month or 3 Months · Priority Support Included</span>
            </div>

            <div className="adv-lookup-hint">
              <span>Already subscribed?</span>
              <button
                type="button"
                className="adv-link-btn"
                onClick={() => setLookupOpen(true)}
              >
                Check active plan status &rarr;
              </button>
            </div>

            {/* ── TEST MODE BANNER (only visible at ?test=1) ── */}
            {testMode && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem 1.25rem',
                background: 'rgba(255,165,0,0.1)',
                border: '1.5px dashed orange',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                maxWidth: '400px'
              }}>
                <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'orange', letterSpacing: '0.08em' }}>
                  🧪 TEST MODE — NOT VISIBLE TO USERS
                </span>
                <button
                  type="button"
                  onClick={handleTestPayment}
                  style={{
                    background: 'orange',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.6rem 1.2rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  💳 Pay ₹1 — Test Razorpay Integration
                </button>
                {testStatus && (
                  <p style={{ fontSize: '0.82rem', margin: 0, color: testStatus.startsWith('✅') ? 'limegreen' : testStatus.startsWith('❌') ? 'red' : '#ccc' }}>
                    {testStatus}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2 — WHAT THIS SERVICE IS
          ───────────────────────────────────────────────────────────── */}
      <section className="adv-section adv-bg-warm">
        <div className="adv-container">
          <div className="adv-section-head text-center max-w-750">
            <span className="adv-subheading-tag">PRACTICAL ADVISORY</span>
            <h2 className="adv-heading">More Than a One-Time Consultation.</h2>
            <p className="adv-lead">
              Business questions rarely fit into a single conversation. Our advisory plans give you continued access to practical guidance throughout your selected support period.
            </p>
          </div>

          <div className="adv-comparison-grid">
            <div className="adv-comp-card adv-comp-muted">
              <div className="adv-comp-header">
                <span className="adv-comp-tag">TRADITIONAL APPROACH</span>
                <h3>One-Time Advice</h3>
              </div>
              <ul className="adv-comp-list">
                <li>Isolated, single conversation with time pressure</li>
                <li>High friction and extra fees to ask follow-up questions</li>
                <li>Context is lost the moment the meeting ends</li>
                <li>Little accountability or structured continuation</li>
              </ul>
            </div>

            <div className="adv-comp-card adv-comp-highlight">
              <div className="adv-comp-header">
                <span className="adv-comp-tag adv-tag-green">C-PEB MODEL</span>
                <h3>Ongoing Support</h3>
              </div>
              <ul className="adv-comp-list">
                <li><CheckCircle2 size={16} className="text-green" /> Continued advisory access throughout your active plan</li>
                <li><CheckCircle2 size={16} className="text-green" /> Priority handling whenever new questions or decisions arise</li>
                <li><CheckCircle2 size={16} className="text-green" /> Retained context of your business, market, and constraints</li>
                <li><CheckCircle2 size={16} className="text-green" /> Coordination with specialized C-PEB execution services if needed</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3 — WHO IT'S FOR
          ───────────────────────────────────────────────────────────── */}
      <section className="adv-section">
        <div className="adv-container">
          <div className="adv-section-head text-center max-w-750">
            <span className="adv-subheading-tag">AUDIENCE</span>
            <h2 className="adv-heading">Built For Founders & Business Owners.</h2>
            <p className="adv-lead">
              Whether you are taking your first entrepreneurial step or steering an established enterprise, our support adapts to where you are.
            </p>
          </div>

          <div className="adv-who-grid">
            <div className="adv-who-box">
              <div className="adv-who-header">
                <div className="adv-who-icon"><TrendingUp size={24} /></div>
                <div>
                  <span className="adv-who-badge">EARLY STAGE</span>
                  <h3>STARTUPS</h3>
                </div>
              </div>
              <p className="adv-who-subtitle">For people who are:</p>
              <ul className="adv-checklist">
                <li>Starting a new business or venture</li>
                <li>Validating a business idea with real market feedback</li>
                <li>Preparing to launch their initial product or service</li>
                <li>Building an early customer base effectively</li>
                <li>Setting up their foundational digital presence</li>
                <li>Figuring out their next growth step without wasting capital</li>
                <li>Looking for direct, practical business guidance</li>
              </ul>
            </div>

            <div className="adv-who-box">
              <div className="adv-who-header">
                <div className="adv-who-icon"><Briefcase size={24} /></div>
                <div>
                  <span className="adv-who-badge">GROWTH & OPERATIONS</span>
                  <h3>BUSINESSES</h3>
                </div>
              </div>
              <p className="adv-who-subtitle">For businesses that:</p>
              <ul className="adv-checklist">
                <li>Need experienced input on an active business challenge</li>
                <li>Want objective support evaluating strategic options</li>
                <li>Need help planning a focused marketing campaign</li>
                <li>Require business and marketing coordination</li>
                <li>Need help identifying relevant service providers or partners</li>
                <li>Need support with high-stakes growth decisions</li>
                <li>Want priority access to C-PEB support channels</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4 — WHAT WE CAN HELP WITH
          ───────────────────────────────────────────────────────────── */}
      <section className="adv-section adv-bg-warm">
        <div className="adv-container">
          <div className="adv-section-head text-center max-w-750">
            <span className="adv-subheading-tag">CAPABILITIES MATRIX</span>
            <h2 className="adv-heading">What Can We Help You With?</h2>
            <p className="adv-lead">
              Our guidance focuses exclusively on practical problem-solving across core areas where C-PEB has proven operational capability.
            </p>
          </div>

          <div className="adv-matrix-grid">
            {HELP_CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div className="adv-matrix-card" key={idx}>
                  <div className="adv-matrix-top">
                    <div className="adv-matrix-icon"><Icon size={20} /></div>
                    <span className="adv-matrix-num">0{idx + 1}</span>
                  </div>
                  <h3 className="adv-matrix-title">{cat.title}</h3>
                  <ul className="adv-matrix-items">
                    {cat.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <span className="adv-bullet" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5 — PRIORITY SUPPORT
          ───────────────────────────────────────────────────────────── */}
      <section className="adv-section adv-priority-banner">
        <div className="adv-container">
          <div className="adv-priority-inner">
            <div className="adv-priority-left">
              <span className="adv-priority-badge">
                <ShieldCheck size={16} /> CORE BENEFIT
              </span>
              <h2 className="adv-priority-heading">Priority Support, Throughout Your Plan.</h2>
              <p className="adv-priority-desc">
                Once your plan is active, you receive priority access to C-PEB for the duration of your subscription. We prioritize your requests ahead of the general queue so you get thoughtful, actionable assistance when decisions cannot wait.
              </p>
              <div className="adv-priority-note">
                <Clock size={16} className="text-green" />
                <span>Priority handling during your active plan period. Factual, committed attention without empty SLA promises.</span>
              </div>
            </div>

            <div className="adv-priority-right">
              <div className="adv-priority-pill-grid">
                <div className="adv-priority-pill">
                  <CheckCircle2 size={18} className="text-green" />
                  <div>
                    <strong>Priority Queue Handling</strong>
                    <p>Subscribed requests are reviewed before general inquiries.</p>
                  </div>
                </div>
                <div className="adv-priority-pill">
                  <CheckCircle2 size={18} className="text-green" />
                  <div>
                    <strong>Ongoing Advisory Conversations</strong>
                    <p>Discuss problems iteratively as your project progresses.</p>
                  </div>
                </div>
                <div className="adv-priority-pill">
                  <CheckCircle2 size={18} className="text-green" />
                  <div>
                    <strong>Practical Options Evaluation</strong>
                    <p>Objective second opinion on vendors, tools, and marketing spend.</p>
                  </div>
                </div>
                <div className="adv-priority-pill">
                  <CheckCircle2 size={18} className="text-green" />
                  <div>
                    <strong>Internal Service Coordination</strong>
                    <p>Seamless alignment with C-PEB creator and business units.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6 — PRICING
          ───────────────────────────────────────────────────────────── */}
      <section className="adv-section" id="plans">
        <div className="adv-container">
          <div className="adv-section-head text-center max-w-750">
            <span className="adv-subheading-tag">COMMERCIAL PLANS</span>
            <h2 className="adv-heading">Choose Your Support Period.</h2>
            <p className="adv-lead">
              Two straightforward plans. Both include full priority support for the duration of your selected period.
            </p>
          </div>

          <div className="adv-pricing-grid">
            {/* Plan 1 */}
            <div className="adv-plan-card">
              <div className="adv-plan-head">
                <span className="adv-plan-code">PLAN 01</span>
                <h3 className="adv-plan-title">STARTER ADVISORY</h3>
                <span className="adv-plan-duration">1 MONTH</span>
                <div className="adv-plan-price-wrap">
                  <span className="adv-currency">₹</span>
                  <span className="adv-amount">2,499</span>
                </div>
                <div className="adv-plan-support-tag">
                  <CheckCircle2 size={14} className="text-green" />
                  <span>Priority Support Included</span>
                </div>
              </div>

              <p className="adv-plan-desc">
                Flexible support for founders and businesses that want guidance over the next month.
              </p>

              <div className="adv-plan-action">
                <button
                  type="button"
                  className="adv-btn adv-btn-secondary w-full"
                  onClick={() => handleOpenCheckout('ONE_MONTH')}
                >
                  BOOK NOW — ₹2,499 →
                </button>
                <div className="adv-plan-rzp-meta">
                  <Lock size={12} />
                  <span>Secure Razorpay Checkout</span>
                </div>
              </div>
            </div>

            {/* Plan 2 */}
            <div className="adv-plan-card adv-plan-featured">
              <div className="adv-featured-badge">BEST FOR CONTINUOUS SUPPORT</div>
              <div className="adv-plan-head">
                <span className="adv-plan-code">PLAN 02</span>
                <h3 className="adv-plan-title">ONGOING ADVISORY</h3>
                <span className="adv-plan-duration">3 MONTHS</span>
                <div className="adv-plan-price-wrap">
                  <span className="adv-currency">₹</span>
                  <span className="adv-amount">5,999</span>
                </div>
                <div className="adv-plan-total-notice">
                  <strong>₹5,999 TOTAL FOR 3 MONTHS</strong>
                  <span>≈ ₹2,000/month when billed for 3 months</span>
                </div>
                <div className="adv-plan-support-tag">
                  <CheckCircle2 size={14} className="text-green" />
                  <span>Priority Support Included</span>
                </div>
              </div>

              <p className="adv-plan-desc">
                Extended support for businesses that want consistent guidance and ongoing assistance.
              </p>

              <div className="adv-plan-action">
                <button
                  type="button"
                  className="adv-btn adv-btn-primary w-full"
                  onClick={() => handleOpenCheckout('THREE_MONTHS')}
                >
                  BOOK NOW — ₹5,999 →
                </button>
                <div className="adv-plan-rzp-meta">
                  <Lock size={12} />
                  <span>Secure Razorpay Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7 — PLAN COMPARISON TABLE
          ───────────────────────────────────────────────────────────── */}
      <section className="adv-section adv-bg-warm">
        <div className="adv-container">
          <div className="adv-section-head text-center max-w-750">
            <span className="adv-subheading-tag">FEATURE MATRIX</span>
            <h2 className="adv-heading">Plan Comparison</h2>
            <p className="adv-lead">
              Clear, transparent comparison. Both tiers provide the exact same quality of advisory support; the 3-month plan offers an extended commitment with monthly savings.
            </p>
          </div>

          <div className="adv-table-container">
            <table className="adv-table">
              <thead>
                <tr>
                  <th className="adv-th-feature">FEATURE</th>
                  <th className="adv-th-plan">1 MONTH (₹2,499)</th>
                  <th className="adv-th-plan adv-th-highlight">3 MONTHS (₹5,999)</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={i}>
                    <td className="adv-td-feature">{row.feature}</td>
                    <td className="adv-td-val">
                      {row.m1 === true ? <Check size={18} className="text-green" /> : row.m1}
                    </td>
                    <td className="adv-td-val adv-td-highlight">
                      {row.m3 === true ? <Check size={18} className="text-green" /> : row.m3}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 8 — HOW IT WORKS
          ───────────────────────────────────────────────────────────── */}
      <section className="adv-section">
        <div className="adv-container">
          <div className="adv-section-head text-center max-w-750">
            <span className="adv-subheading-tag">THE PROCESS</span>
            <h2 className="adv-heading">Simple From the Start.</h2>
            <p className="adv-lead">
              No protracted paperwork or multi-week intake. Get direct access to C-PEB advisory support in four clear steps.
            </p>
          </div>

          <div className="adv-steps-grid">
            <div className="adv-step-card">
              <span className="adv-step-num">01</span>
              <h4>CHOOSE YOUR PLAN</h4>
              <p>Select 1 month or 3 months depending on your project timeline and commitment.</p>
            </div>

            <div className="adv-step-card">
              <span className="adv-step-num">02</span>
              <h4>TELL US WHAT YOU NEED</h4>
              <p>Share your current business situation or startup requirement in simple terms.</p>
            </div>

            <div className="adv-step-card">
              <span className="adv-step-num">03</span>
              <h4>GET PRIORITY SUPPORT</h4>
              <p>Receive ongoing advisory support and priority queue access during your active plan.</p>
            </div>

            <div className="adv-step-card">
              <span className="adv-step-num">04</span>
              <h4>TAKE THE NEXT STEP</h4>
              <p>Use clear, practical guidance to make informed decisions and move your work forward.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 9 — EXAMPLES OF SUPPORT
          ───────────────────────────────────────────────────────────── */}
      <section className="adv-section adv-bg-warm">
        <div className="adv-container">
          <div className="adv-section-head text-center max-w-750">
            <span className="adv-subheading-tag">REAL DISCUSSIONS</span>
            <h2 className="adv-heading">Questions We Can Help You Think Through.</h2>
            <p className="adv-lead">
              Practical examples of questions founders and business owners bring to our advisory sessions.
            </p>
          </div>

          <div className="adv-questions-grid">
            {EXAMPLE_QUESTIONS.map((q, idx) => (
              <div className="adv-q-card" key={idx}>
                <HelpCircle size={20} className="adv-q-icon" />
                <p>"{q}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 10 — WHAT THIS DOES NOT INCLUDE
          ───────────────────────────────────────────────────────────── */}
      <section className="adv-section">
        <div className="adv-container">
          <div className="adv-exclusion-box">
            <div className="adv-exclusion-head">
              <AlertCircle size={24} className="text-amber" />
              <div>
                <span className="adv-subheading-tag">EXPECTATION MANAGEMENT</span>
                <h2 className="adv-heading mb-1">Know What You're Getting.</h2>
              </div>
            </div>
            <p className="adv-lead">
              The advisory plan provides <strong>strategic guidance, practical thinking, and priority support</strong>. It does <strong>not</strong> automatically include unlimited execution of third-party work unless separately agreed.
            </p>

            <div className="adv-exclusion-list-wrap">
              <h4 className="adv-exclusion-title">Separate execution services not included in the advisory fee:</h4>
              <div className="adv-exclusion-grid">
                {EXCLUSIONS.map((item, idx) => (
                  <div className="adv-exclusion-item" key={idx}>
                    <span className="adv-ex-cross">✕</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 11 — SERVICE ADD-ONS
          ───────────────────────────────────────────────────────────── */}
      <section className="adv-section adv-bg-warm">
        <div className="adv-container">
          <div className="adv-addons-card">
            <div className="adv-addons-content">
              <span className="adv-subheading-tag">SEPARATE ENGAGEMENTS</span>
              <h2>Need More Than Advisory?</h2>
              <p>
                When your project demands full execution, you can separately engage C-PEB for specialized services:
              </p>
              <div className="adv-addons-chips">
                <span>Event Management</span>
                <span>Digital Marketing</span>
                <span>Brand Promotion</span>
                <span>Influencer Connections</span>
                <span>Business Compliance</span>
              </div>
            </div>
            <div className="adv-addons-action">
              <Link to="/services/business-services" className="adv-btn adv-btn-primary">
                EXPLORE SERVICES <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 12 — FAQ
          ───────────────────────────────────────────────────────────── */}
      <section className="adv-section">
        <div className="adv-container">
          <div className="adv-section-head text-center max-w-750">
            <span className="adv-subheading-tag">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="adv-heading">Common Inquiries</h2>
            <p className="adv-lead">
              Concise, factual answers regarding plan scope, duration, and support handling.
            </p>
          </div>

          <div className="adv-faq-list">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div className={`adv-faq-item ${isOpen ? 'open' : ''}`} key={idx}>
                  <button
                    type="button"
                    className="adv-faq-question"
                    onClick={() => toggleFaq(idx)}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && <p className="adv-faq-answer">{faq.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 13 — FINAL CTA
          ───────────────────────────────────────────────────────────── */}
      <section className="adv-section adv-final-cta-section">
        <div className="adv-container">
          <div className="adv-final-cta-box">
            <span className="adv-final-eyebrow">NEED A SECOND OPINION?</span>
            <h2 className="adv-final-heading">Let's Talk About Your Business.</h2>
            <p className="adv-final-desc">
              Share what you're working on and we'll help you understand whether advisory support is the right fit.
            </p>
            <div className="adv-final-actions">
              <button
                type="button"
                className="adv-btn adv-btn-primary adv-btn-lg"
                onClick={() => handleOpenCheckout('ONE_MONTH')}
              >
                GET STARTED →
              </button>
              <Link to="/contact" className="adv-btn adv-btn-secondary adv-btn-lg">
                CONTACT US →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CHECKOUT & ACTIVE PLAN MODAL
          ───────────────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="adv-modal-backdrop" onClick={handleCloseModal}>
          <div className="adv-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="adv-modal-close"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {redirecting ? (
              /* RAZORPAY REDIRECT VIEW */
              <div className="adv-redirect-wrap">
                <div className="adv-redirect-spinner" />
                <div className="adv-redirect-badge">
                  <Lock size={14} />
                  <span>SECURE RAZORPAY CHECKOUT</span>
                </div>
                <h3 className="adv-redirect-title">Redirecting to Payment Page...</h3>
                <p className="adv-redirect-desc">
                  Connecting to Razorpay's secure checkout for <strong>{selectedPlan === 'THREE_MONTHS' ? 'Ongoing Advisory (3 Months)' : 'Starter Advisory (1 Month)'}</strong> — <strong>₹{planPrice.toLocaleString('en-IN')}</strong>.
                </p>
                <div className="adv-redirect-order-box">
                  <span className="adv-label">ORDER REFERENCE</span>
                  <div className="adv-order-code">{redirectOrderId}</div>
                </div>
                <div className="adv-redirect-action">
                  <a
                    href={redirectUrl}
                    className="adv-btn adv-btn-primary adv-redirect-btn"
                    rel="noopener noreferrer"
                  >
                    <span>Click here if not redirected in 3 seconds</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
                <p className="adv-redirect-footer-note">
                  🔒 256-bit SSL encrypted · Supported: UPI (GPay, PhonePe, Paytm), Cards & Net Banking.
                </p>
              </div>
            ) : !activeSubscription ? (
              /* CHECKOUT FORM VIEW */
              <div>
                <div className="adv-modal-head">
                  <span className="adv-subheading-tag">SUBSCRIPTION CHECKOUT</span>
                  <h3>Activate Your Advisory Plan</h3>
                  <p>Provide your business information and requirement to proceed to Razorpay payment.</p>
                </div>

                {/* Plan Toggle */}
                <div className="adv-modal-plan-toggle">
                  <button
                    type="button"
                    className={`adv-toggle-tab ${selectedPlan === 'ONE_MONTH' ? 'active' : ''}`}
                    onClick={() => setSelectedPlan('ONE_MONTH')}
                  >
                    <div className="adv-tab-title">1 Month</div>
                    <div className="adv-tab-price">₹2,499</div>
                  </button>

                  <button
                    type="button"
                    className={`adv-toggle-tab ${selectedPlan === 'THREE_MONTHS' ? 'active' : ''}`}
                    onClick={() => setSelectedPlan('THREE_MONTHS')}
                  >
                    <div className="adv-tab-badge">SAVE ON COMMITMENT</div>
                    <div className="adv-tab-title">3 Months</div>
                    <div className="adv-tab-price">₹5,999 Total</div>
                  </button>
                </div>

                {submitError && (
                  <div className="adv-alert-error">
                    <AlertCircle size={16} />
                    <span>{submitError}</span>
                  </div>
                )}

                <form onSubmit={handleCheckoutSubmit} className="adv-checkout-form">
                  <div className="adv-form-row">
                    <div className="adv-form-group">
                      <label htmlFor="customerName">Your Name *</label>
                      <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.customerName}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="adv-form-group">
                      <label htmlFor="businessName">Startup / Business Name *</label>
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        required
                        placeholder="e.g. Zenith Organics"
                        value={formData.businessName}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  <div className="adv-form-row">
                    <div className="adv-form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="rahul@zenith.in"
                        value={formData.email}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="adv-form-group">
                      <label htmlFor="phone">Phone / WhatsApp Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  <div className="adv-form-group">
                    <label htmlFor="requirement">What do you need help with? *</label>
                    <textarea
                      id="requirement"
                      name="requirement"
                      required
                      rows={3}
                      placeholder="Briefly describe what challenges, decisions, or guidance you need support on..."
                      value={formData.requirement}
                      onChange={handleFormChange}
                    />
                  </div>

                  {/* Coupon Code */}
                  <div className="adv-form-group">
                    <label>Coupon Code (Optional)</label>
                    {!couponApplied ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="e.g. FIRST10"
                          value={couponInput}
                          onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                          style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          style={{
                            padding: '0 1rem',
                            background: '#17a85a',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontSize: '0.82rem'
                          }}
                        >
                          APPLY
                        </button>
                      </div>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(23,168,90,0.1)',
                        border: '1.5px solid #17a85a',
                        borderRadius: '8px',
                        padding: '0.5rem 0.85rem'
                      }}>
                        <span style={{ color: '#17a85a', fontWeight: 700, fontSize: '0.85rem' }}>
                          ✅ {couponInput} — {couponDiscount}% OFF applied
                        </span>
                        <button type="button" onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '0.8rem' }}>
                          ✕ Remove
                        </button>
                      </div>
                    )}
                    {couponError && (
                      <p style={{ color: '#e53e3e', fontSize: '0.78rem', margin: '0.25rem 0 0' }}>{couponError}</p>
                    )}
                  </div>

                  {/* Summary Box */}
                  <div className="adv-order-summary">
                    <div className="adv-summary-row">
                      <span>Selected Plan:</span>
                      <strong>{selectedPlan === 'THREE_MONTHS' ? 'Ongoing Advisory (3 Months)' : 'Starter Advisory (1 Month)'}</strong>
                    </div>
                    <div className="adv-summary-row">
                      <span>Priority Support:</span>
                      <strong className="text-green">INCLUDED</strong>
                    </div>
                    {couponApplied && (
                      <>
                        <div className="adv-summary-row" style={{ color: '#888' }}>
                          <span>Original Price:</span>
                          <span style={{ textDecoration: 'line-through' }}>₹{planBasePrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="adv-summary-row" style={{ color: '#17a85a' }}>
                          <span>Discount ({couponDiscount}% — {couponInput}):</span>
                          <span>− ₹{planDiscount.toLocaleString('en-IN')}</span>
                        </div>
                      </>
                    )}
                    <div className="adv-summary-row adv-summary-total">
                      <span>Total Amount:</span>
                      <span className="adv-total-amount">₹{planPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="adv-btn adv-btn-primary w-full adv-rzp-submit-btn"
                    disabled={submitting}
                  >
                    <Lock size={16} />
                    <span>{submitting ? 'PREPARING RAZORPAY CHECKOUT...' : `PROCEED TO RAZORPAY — ₹${planPrice.toLocaleString('en-IN')} →`}</span>
                  </button>

                  <div className="adv-rzp-trust-row">
                    <span>🔒 256-bit Encrypted</span>
                    <span>•</span>
                    <span>UPI / Cards / Net Banking</span>
                    <span>•</span>
                    <span>Razorpay Verified</span>
                  </div>

                  <p className="adv-form-note">
                    You will be redirected to the official Razorpay payment page to complete your payment securely.
                  </p>
                </form>
              </div>
            ) : (
              /* ACTIVE PLAN CONFIRMATION VIEW */
              <div className="adv-success-view">
                <div className="adv-success-badge">
                  <CheckCircle2 size={32} className="text-green" />
                </div>
                <h3>Your advisory plan is active.</h3>
                <p className="adv-success-sub">
                  Welcome to C-PEB Advisory. Your subscription is verified and your priority support channel is now open.
                </p>

                <div className="adv-plan-status-card">
                  <div className="adv-status-head">
                    <div>
                      <span className="adv-label">ORDER REFERENCE</span>
                      <div className="adv-order-code">{activeSubscription.orderId}</div>
                    </div>
                    <span className="adv-badge-active">ACTIVE</span>
                  </div>

                  <div className="adv-status-grid">
                    <div>
                      <span className="adv-label">PLAN</span>
                      <strong>{activeSubscription.planTitle || (activeSubscription.plan === 'THREE_MONTHS' ? 'Ongoing Advisory (3 Months)' : 'Starter Advisory (1 Month)')}</strong>
                    </div>
                    <div>
                      <span className="adv-label">PRIORITY SUPPORT</span>
                      <strong className="text-green">ACTIVE</strong>
                    </div>
                    <div>
                      <span className="adv-label">START DATE</span>
                      <span>{new Date(activeSubscription.startDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="adv-label">END DATE</span>
                      <span>{new Date(activeSubscription.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="adv-success-actions">
                  <button
                    type="button"
                    className="adv-btn adv-btn-primary w-full"
                    onClick={() => {
                      setSupportModalOpen(true);
                      setSupportSuccess(false);
                    }}
                  >
                    <MessageSquare size={16} /> OPEN ADVISORY REQUEST →
                  </button>

                  <Link to="/contact" className="adv-btn adv-btn-secondary w-full">
                    CONTACT SUPPORT →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUPPORT REQUEST MODAL
          ───────────────────────────────────────────────────────────── */}
      {supportModalOpen && activeSubscription && (
        <div className="adv-modal-backdrop" onClick={() => setSupportModalOpen(false)}>
          <div className="adv-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="adv-modal-close"
              onClick={() => setSupportModalOpen(false)}
            >
              <X size={20} />
            </button>

            <div className="adv-modal-head">
              <span className="adv-subheading-tag">PRIORITY ADVISORY REQUEST</span>
              <h3>Submit a Guidance Request</h3>
              <p>Reference: <strong>{activeSubscription.orderId}</strong> ({activeSubscription.businessName})</p>
            </div>

            {supportSuccess ? (
              <div className="adv-request-success">
                <CheckCircle2 size={36} className="text-green mx-auto mb-2" />
                <h4>Support Request Received</h4>
                <p>
                  Your request has been logged in the priority queue. Our advisory team will review your business context and reach out promptly.
                </p>
                <button
                  type="button"
                  className="adv-btn adv-btn-secondary mt-3"
                  onClick={() => setSupportModalOpen(false)}
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSupportRequestSubmit} className="adv-support-form">
                {supportError && (
                  <div className="adv-alert-error">
                    <AlertCircle size={16} />
                    <span>{supportError}</span>
                  </div>
                )}

                <div className="adv-form-group">
                  <label htmlFor="reqSubject">Subject / Topic *</label>
                  <input
                    type="text"
                    id="reqSubject"
                    required
                    placeholder="e.g. Evaluating influencer agency quotes vs direct outreach"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                  />
                </div>

                <div className="adv-form-group">
                  <label htmlFor="reqDetails">What do you need help with? *</label>
                  <textarea
                    id="reqDetails"
                    required
                    rows={4}
                    placeholder="Detail the problem, numbers, links, or specific questions you need our team to evaluate..."
                    value={supportForm.requirement}
                    onChange={(e) => setSupportForm({ ...supportForm, requirement: e.target.value })}
                  />
                </div>

                <div className="adv-priority-flag">
                  <ShieldCheck size={16} className="text-green" />
                  <span>Flagged with <strong>Priority Queue</strong> status based on your active plan.</span>
                </div>

                <button
                  type="submit"
                  className="adv-btn adv-btn-primary w-full"
                  disabled={supportSubmitting}
                >
                  <Send size={16} /> {supportSubmitting ? 'SUBMITTING...' : 'SUBMIT REQUEST →'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          LOOKUP ACTIVE PLAN MODAL
          ───────────────────────────────────────────────────────────── */}
      {lookupOpen && (
        <div className="adv-modal-backdrop" onClick={() => setLookupOpen(false)}>
          <div className="adv-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="adv-modal-close"
              onClick={() => setLookupOpen(false)}
            >
              <X size={20} />
            </button>

            <div className="adv-modal-head">
              <span className="adv-subheading-tag">SUBSCRIBER PORTAL</span>
              <h3>Check Your Advisory Status</h3>
              <p>Enter your Order ID (e.g. CPEB-ADV-...) or your registered email address.</p>
            </div>

            {lookupError && (
              <div className="adv-alert-error">
                <AlertCircle size={16} />
                <span>{lookupError}</span>
              </div>
            )}

            <form onSubmit={handleLookupSubscription} className="adv-checkout-form">
              <div className="adv-form-group">
                <label htmlFor="lookupRefInput">Order ID or Email Address</label>
                <input
                  type="text"
                  id="lookupRefInput"
                  required
                  placeholder="CPEB-ADV-... or rahul@zenith.in"
                  value={lookupRef}
                  onChange={(e) => setLookupRef(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="adv-btn adv-btn-primary w-full"
                disabled={lookupLoading}
              >
                <Search size={16} /> {lookupLoading ? 'SEARCHING...' : 'FIND MY PLAN →'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
