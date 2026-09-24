import {
  INFLUENCER_DATABASE,
  SERVICES_CATALOG,
  PRICING_PACKAGES,
  COMPANY_INFO,
  COMMON_FAQS
} from './chatbotData';

// Normalized category matcher
const CATEGORY_KEYWORDS = {
  Fashion: ['fashion', 'clothing', 'apparel', 'wear', 'streetwear', 'ethnic', 'designer', 'dress', 'outfit', 'garment', 'textile'],
  Beauty: ['beauty', 'makeup', 'skincare', 'cosmetics', 'cosmetic', 'haircare', 'wellness', 'glow', 'skin'],
  Gaming: ['gaming', 'game', 'gamer', 'esports', 'bgmi', 'free fire', 'pubg', 'streamer'],
  Entertainment: ['entertainment', 'comedy', 'humor', 'skits', 'roast', 'fun'],
  Music: ['music', 'singer', 'folk', 'song', 'artist', 'cultural'],
  Lifestyle: ['lifestyle', 'vlog', 'daily', 'creator', 'family'],
  Fitness: ['fitness', 'gym', 'workout', 'health', 'bodybuilding', 'nutrition', 'training'],
  Travel: ['travel', 'tourism', 'trips', 'vacation', 'destination']
};

const LOCATION_KEYWORDS = [
  { key: 'bihar', label: 'Bihar' },
  { key: 'patna', label: 'Bihar (Patna)' },
  { key: 'delhi', label: 'Delhi NCR' },
  { key: 'mumbai', label: 'Mumbai' },
  { key: 'bangalore', label: 'Bangalore' },
  { key: 'bengaluru', label: 'Bangalore' },
  { key: 'pune', label: 'Pune' },
  { key: 'kolkata', label: 'Kolkata' },
  { key: 'hyderabad', label: 'Hyderabad' },
  { key: 'north india', label: 'North India' },
  { key: 'pan-india', label: 'Pan-India' }
];

const PLATFORM_KEYWORDS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'ig', label: 'Instagram' },
  { key: 'reels', label: 'Instagram' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'yt', label: 'YouTube' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'fb', label: 'Facebook' }
];

/**
 * Intelligent NLP parameter extractor
 */
export function extractEntities(text) {
  const lower = text.toLowerCase();
  const entities = {};

  // Extract Category
  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    if (words.some(w => lower.includes(w))) {
      entities.category = cat;
      break;
    }
  }

  // Extract Location
  for (const loc of LOCATION_KEYWORDS) {
    if (lower.includes(loc.key)) {
      entities.location = loc.label;
      break;
    }
  }

  // Extract Platform
  for (const plat of PLATFORM_KEYWORDS) {
    if (lower.includes(plat.key)) {
      entities.platform = plat.label;
      break;
    }
  }

  // Extract Count / Numbers (e.g. "5 influencers", "10 creators", "top 3")
  const countMatch = lower.match(/(\d+)\s*(influencers?|creators?|profiles?|options?|recommendations?)/i) ||
                     lower.match(/(top|find|need|want|show)\s*(\d+)/i);
  if (countMatch) {
    const num = parseInt(countMatch[1] || countMatch[2], 10);
    if (num > 0 && num <= 20) {
      entities.count = num;
    }
  }

  // Extract Budget hints (e.g. "50k", "1 lakh", "25000", "under 1L")
  const budgetMatch = lower.match(/(₹?\s*\d+[\d,]*\s*(?:k|lakhs?|cr)?|budget\s*(?:is|of|under|around)?\s*₹?\s*[\d,]+)/i);
  if (budgetMatch) {
    entities.budget = budgetMatch[0].trim();
  }

  // Extract Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    entities.email = emailMatch[0];
  }

  // Extract Phone Number (Indian mobile format)
  const phoneMatch = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
  if (phoneMatch) {
    entities.phone = phoneMatch[0];
  }

  return entities;
}

/**
 * Filter influencer database by criteria
 */
export function searchInfluencers({ category, platform, location, count = 3, minFollowers = 0 }) {
  let list = [...INFLUENCER_DATABASE];

  if (category) {
    list = list.filter(inf => 
      inf.category.toLowerCase() === category.toLowerCase() ||
      inf.niche.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (platform) {
    list = list.filter(inf => 
      inf.platform.toLowerCase() === platform.toLowerCase() ||
      (platform === 'Instagram' && inf.platCode === 'IG') ||
      (platform === 'YouTube' && inf.platCode === 'YT')
    );
  }

  if (location) {
    const locLower = location.toLowerCase();
    const locMatched = list.filter(inf => 
      inf.location.toLowerCase().includes(locLower) ||
      (locLower.includes('bihar') && (inf.location.includes('Bihar') || inf.location.includes('North India') || inf.location.includes('Pan-India')))
    );
    if (locMatched.length > 0) {
      list = locMatched;
    }
  }

  if (minFollowers > 0) {
    list = list.filter(inf => inf.followerNum >= minFollowers);
  }

  // If specific filters yielded zero items, fallback gracefully to general category or top creators
  if (list.length === 0) {
    list = INFLUENCER_DATABASE.slice(0, 4);
  }

  return list.slice(0, count);
}

/**
 * Core Dialogue Engine
 * Receives:
 * - userInput: string or action payload
 * - memory: current session state
 * Returns:
 * - { text, cards, cardType, quickActions, updatedMemory, cta }
 */
export function processMessage(userInput, memory = {}) {
  const text = (typeof userInput === 'string' ? userInput : userInput.text || '').trim();
  const lower = text.toLowerCase();
  const extracted = extractEntities(text);

  // Sync memory with extracted entities
  const updatedMemory = {
    ...memory,
    category: extracted.category || memory.category || '',
    location: extracted.location || memory.location || '',
    platform: extracted.platform || memory.platform || '',
    budget: extracted.budget || memory.budget || '',
    count: extracted.count || memory.count || 3,
    email: extracted.email || memory.email || '',
    phone: extracted.phone || memory.phone || '',
    name: memory.name || '',
    company: memory.company || ''
  };

  // 1. In-progress Lead Capture Flow
  if (memory.flow === 'lead_capture') {
    return handleLeadCaptureStep(text, updatedMemory);
  }

  // 2. In-progress Influencer Campaign Planning Flow
  if (memory.flow === 'influencer_campaign_wizard') {
    return handleCampaignWizardStep(text, updatedMemory);
  }

  // 3. In-progress Influencer Search Clarification Flow
  if (memory.flow === 'influencer_search_wizard') {
    return handleInfluencerSearchStep(text, updatedMemory);
  }

  // 4. Quick Actions / Trigger Intents
  if (lower === 'find an influencer' || lower === 'find influencer' || lower.includes('find an influencer')) {
    if (updatedMemory.category) {
      // Memory already has category!
      return executeInfluencerSearch(updatedMemory, `Searching creators in ${updatedMemory.category} for your brand.`);
    }
    updatedMemory.flow = 'influencer_search_wizard';
    updatedMemory.step = 'ask_category';
    return {
      text: "I can help you identify vetted influencers tailored to your goals. What category or niche does your brand represent?",
      quickActions: ['Fashion & Apparel', 'Beauty & Skincare', 'Gaming & Tech', 'Fitness & Wellness', 'Lifestyle', 'Music & Regional'],
      updatedMemory
    };
  }

  if (lower === 'influencer marketing' || lower.includes('influencer marketing campaign') || lower === 'campaign planning') {
    updatedMemory.flow = 'influencer_campaign_wizard';
    updatedMemory.step = 'ask_objective';
    return {
      text: "What is the primary objective for your influencer campaign?",
      quickActions: ['Brand Awareness', 'Product Promotion', 'Lead Generation', 'Sales / Conversions', 'App Promotion', 'Event Promotion'],
      updatedMemory
    };
  }

  if (lower === 'startup services' || lower === 'startup support' || lower.includes('startup service')) {
    const startupServices = SERVICES_CATALOG.filter(s => s.category === 'Startup Services' || s.category === 'Advisory');
    return {
      text: "Here are our core technical and strategic services built for Indian startups. We manage everything from MVP engineering to official advisory.",
      cardType: 'service',
      cards: startupServices,
      quickActions: ['Website Development', 'Mobile App Development', 'Startup & Business Advisory', 'Get a Quote', 'Main Menu'],
      updatedMemory
    };
  }

  if (lower === 'business services' || lower.includes('business service') || lower.includes('msme') || lower.includes('loans')) {
    const bizServices = SERVICES_CATALOG.filter(s => s.category === 'Business Services');
    return {
      text: "C-PEB provides comprehensive compliance, government schemes, and financial services for MSMEs and enterprises:",
      cardType: 'service',
      cards: bizServices,
      quickActions: ['MSME Business Loan', 'Mudra Loan (PMMY)', 'GST Compliance', 'Udyam Registration', 'Get a Quote'],
      updatedMemory
    };
  }

  if (lower === 'pricing' || lower.includes('pricing') || lower.includes('package') || lower.includes('cost')) {
    return {
      text: "Sure. What would you like pricing for?",
      quickActions: ['Influencer Marketing', 'Startup Services', 'Website Development', 'Advisory Support', 'Get a Custom Quote'],
      updatedMemory
    };
  }

  if (lower === 'talk to a team member' || lower.includes('talk to a human') || lower.includes('speak to human') || lower.includes('customer support')) {
    updatedMemory.flow = 'lead_capture';
    updatedMemory.step = 'ask_requirement';
    updatedMemory.leadType = 'human_support';
    return {
      text: `Our advisory team is ready to assist you. You can connect immediately or leave your requirement below:\n\n• Phone: ${COMPANY_INFO.phoneDisplay}\n• Email: ${COMPANY_INFO.email}\n\nWhat requirement would you like to discuss with our team?`,
      quickActions: ['Chat on WhatsApp', 'Influencer Collaboration', 'Business Advisory', 'Custom Tech Project'],
      cta: {
        label: 'Chat on WhatsApp',
        url: COMPANY_INFO.whatsappUrl,
        type: 'external'
      },
      updatedMemory
    };
  }

  // 5. Smart NLP Intent Detection

  // Specific query like: "I need 5 influencers from Bihar for my clothing brand"
  if (
    (extracted.category || lower.includes('influencer') || lower.includes('creator')) &&
    (extracted.location || extracted.count || extracted.platform || extracted.category)
  ) {
    return executeInfluencerSearch(updatedMemory);
  }

  // Direct Pricing Queries
  if (lower.includes('influencer pricing') || lower.includes('influencer package') || lower === 'influencer marketing pricing') {
    return {
      text: "Here are C-PEB's structured influencer marketing packages. Pricing is completely transparent with zero hidden margins on media spend:",
      cardType: 'pricing',
      cards: PRICING_PACKAGES.influencer,
      quickActions: ['Get Custom Quote', 'Talk to a Team Member', 'Startup Services'],
      updatedMemory
    };
  }

  if (lower.includes('website development') || lower.includes('website price') || lower.includes('need a website')) {
    const webDev = SERVICES_CATALOG.find(s => s.id === 'web-dev');
    return {
      text: "We build modern, fast web applications, landing pages, and responsive portals engineered for high conversion. Starting from ₹24,999 with a standard 1–2 week turnaround.",
      cardType: 'service',
      cards: [webDev],
      quickActions: ['Get a Quote', 'Explore Other Services', 'Talk to a Team Member'],
      cta: {
        label: 'Start Requirement',
        action: 'start_web_quote'
      },
      updatedMemory
    };
  }

  if (lower.includes('advisory') || lower.includes('startup advisory') || lower.includes('₹2,499') || lower.includes('5,999')) {
    return {
      text: "C-PEB offers dedicated strategic advisory with priority queue response. Founders use this to validate ideas, plan launches, and structure growth:",
      cardType: 'pricing',
      cards: PRICING_PACKAGES.advisory,
      quickActions: ['Learn More', 'Get a Quote', 'Talk to a Team Member'],
      updatedMemory
    };
  }

  // Direct Loan / Funding Inquiries
  if (lower.includes('loan') || lower.includes('mudra') || lower.includes('cgtmse') || lower.includes('funding')) {
    const loanServices = SERVICES_CATALOG.filter(s => s.tags.includes('Finance'));
    return {
      text: "C-PEB facilitates access to verified institutional and government credit facilities for Indian businesses:",
      cardType: 'service',
      cards: loanServices,
      quickActions: ['Mudra Loan (PMMY)', 'MSME Business Loan', 'Check Eligibility', 'Talk to a Team Member'],
      updatedMemory
    };
  }

  // Navigation Help
  if (lower.includes('where can i find influencers') || lower.includes('explore influencers') || lower.includes('find creators')) {
    return {
      text: "You can explore all creator categories directly on our Influencers page, or tell me your niche and I will filter recommendations right here.",
      quickActions: ['Explore Influencers', 'Fashion Creators', 'Gaming Creators', 'Beauty Creators'],
      cta: {
        label: 'Explore Influencers',
        url: '/influencers/Fashion',
        type: 'internal'
      },
      updatedMemory
    };
  }

  if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('office') || lower.includes('address')) {
    return {
      text: `You can reach C-PEB directly through our official channels:\n\n• Phone: ${COMPANY_INFO.phoneDisplay}\n• Email: ${COMPANY_INFO.email}\n• Headquarters: ${COMPANY_INFO.address}\n• Hours: ${COMPANY_INFO.hours}`,
      quickActions: ['Chat on WhatsApp', 'Talk to a Team Member', 'Main Menu'],
      cta: {
        label: 'Chat on WhatsApp',
        url: COMPANY_INFO.whatsappUrl,
        type: 'external'
      },
      updatedMemory
    };
  }

  // Check Common FAQs
  const matchedFaq = COMMON_FAQS.find(faq => 
    lower.includes(faq.q.toLowerCase().slice(0, 15)) ||
    (lower.includes('hidden') && faq.q.includes('hidden')) ||
    (lower.includes('verify') && faq.q.includes('verify')) ||
    (lower.includes('collateral') && faq.q.includes('collateral'))
  );
  if (matchedFaq) {
    return {
      text: `${matchedFaq.a}\n\nWould you like further details on this?`,
      quickActions: ['Explore Services', 'Pricing', 'Talk to a Team Member'],
      updatedMemory
    };
  }

  // Greeting
  if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower === 'start') {
    return {
      text: "Hello! How can I assist your business today? I can help you source influencers, explore our technical and business services, check pricing, or schedule a strategy call.",
      quickActions: ['Find an Influencer', 'Influencer Marketing', 'Startup Services', 'Business Services', 'Pricing', 'Talk to a Team Member'],
      updatedMemory
    };
  }

  // Fallback Handling (Prompt requirement 16)
  return {
    text: "I want to make sure I understand correctly. Are you looking for an influencer, a business service, pricing information, or help from our team?",
    quickActions: ['Find Influencer', 'Explore Services', 'Pricing', 'Contact Team'],
    updatedMemory
  };
}

/**
 * Execute Influencer Search with matched cards
 */
function executeInfluencerSearch(memory, customPrefix = null) {
  const count = memory.count || 3;
  const results = searchInfluencers({
    category: memory.category,
    platform: memory.platform,
    location: memory.location,
    count
  });

  const locationMsg = memory.location ? ` in or reaching ${memory.location}` : '';
  const categoryMsg = memory.category ? ` in ${memory.category}` : '';
  const platformMsg = memory.platform ? ` on ${memory.platform}` : '';

  const prefix = customPrefix || `Here are our verified creator recommendations${categoryMsg}${platformMsg}${locationMsg}:`;

  return {
    text: `${prefix} Each creator has authenticated reach and verified engagement stats.`,
    cardType: 'influencer',
    cards: results,
    quickActions: ['Get Campaign Consultation', 'Change Category', 'Talk to a Team Member', 'Main Menu'],
    updatedMemory: memory
  };
}

/**
 * Influencer Campaign Wizard Flow
 */
function handleCampaignWizardStep(text, memory) {
  const lower = text.toLowerCase();

  if (memory.step === 'ask_objective') {
    memory.objective = text;
    memory.step = 'ask_brand_name';
    return {
      text: `Understood, targeting **${text}**. What is your brand or company name?`,
      quickActions: ['Skip Brand Name'],
      updatedMemory: memory
    };
  }

  if (memory.step === 'ask_brand_name') {
    if (lower !== 'skip brand name') {
      memory.brandName = text;
    }
    memory.step = 'ask_platform';
    return {
      text: "Which preferred platforms should this campaign emphasize?",
      quickActions: ['Instagram Reels & Posts', 'YouTube Dedicated / Integration', 'Multi-Platform (IG + YT)', 'Open to Recommendations'],
      updatedMemory: memory
    };
  }

  if (memory.step === 'ask_platform') {
    memory.platform = text;
    memory.step = 'ask_budget';
    return {
      text: "What is your approximate campaign budget?",
      quickActions: ['Under ₹50,000', '₹50,000 – ₹2,00,000', '₹2,00,000 – ₹10,00,000', 'Enterprise / ₹10L+'],
      updatedMemory: memory
    };
  }

  if (memory.step === 'ask_budget') {
    memory.budget = text;
    // Transition to progressive lead collection
    memory.flow = 'lead_capture';
    memory.step = 'ask_name';
    memory.requirement = `Influencer Campaign for ${memory.brandName || 'Brand'} - Objective: ${memory.objective || 'Growth'}, Platform: ${memory.platform}, Budget: ${memory.budget}`;

    return {
      text: "Thanks! I have the basic campaign requirements. You can submit your details and our team can help you with the next steps.\n\nMay I have your name?",
      updatedMemory: memory
    };
  }

  memory.flow = null;
  return processMessage(text, memory);
}

/**
 * Influencer Search Clarification Flow
 */
function handleInfluencerSearchStep(text, memory) {
  const lower = text.toLowerCase();

  if (memory.step === 'ask_category') {
    // Map answer to category
    for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
      if (words.some(w => lower.includes(w)) || lower.includes(cat.toLowerCase())) {
        memory.category = cat;
        break;
      }
    }
    if (!memory.category) {
      memory.category = text;
    }

    memory.step = 'ask_platform';
    return {
      text: `Selected **${memory.category}**. Which platform would you like to target?`,
      quickActions: ['Instagram', 'YouTube', 'All Platforms'],
      updatedMemory: memory
    };
  }

  if (memory.step === 'ask_platform') {
    if (lower.includes('instagram') || lower.includes('ig')) memory.platform = 'Instagram';
    else if (lower.includes('youtube') || lower.includes('yt')) memory.platform = 'YouTube';
    else memory.platform = '';

    memory.step = 'ask_location';
    return {
      text: "Do you have a target location or audience geography in mind (e.g. Bihar, Mumbai, Delhi, or Pan-India)?",
      quickActions: ['Pan-India', 'Bihar & Hindi Belt', 'Delhi NCR', 'Mumbai', 'Bangalore'],
      updatedMemory: memory
    };
  }

  if (memory.step === 'ask_location') {
    if (lower !== 'pan-india') {
      memory.location = text;
    }
    memory.flow = null; // search ready!
    return executeInfluencerSearch(memory);
  }

  memory.flow = null;
  return processMessage(text, memory);
}

/**
 * Progressive Lead Capture Flow
 */
function handleLeadCaptureStep(text, memory) {
  const lower = text.toLowerCase();

  if (memory.step === 'ask_requirement') {
    memory.requirement = text;
    memory.step = 'ask_name';
    return {
      text: "Thank you. To ensure our team reaches the right person, may I have your full name?",
      updatedMemory: memory
    };
  }

  if (memory.step === 'ask_name') {
    memory.name = text;
    memory.step = 'ask_email';
    return {
      text: `Pleasure to meet you, ${memory.name}. What is the best email address to send your proposal or consultation details?`,
      updatedMemory: memory
    };
  }

  if (memory.step === 'ask_email') {
    const extracted = extractEntities(text);
    memory.email = extracted.email || text;
    memory.step = 'ask_phone';
    return {
      text: "And what is your phone number or WhatsApp contact?",
      updatedMemory: memory
    };
  }

  if (memory.step === 'ask_phone') {
    const extracted = extractEntities(text);
    memory.phone = extracted.phone || text;
    memory.step = 'ask_company';

    if (memory.company || memory.brandName) {
      // If company was already collected earlier, finish directly!
      return finalizeLead(memory);
    }

    return {
      text: "Lastly, what is your company or brand name?",
      quickActions: ['Independent Founder', 'Skip for now'],
      updatedMemory: memory
    };
  }

  if (memory.step === 'ask_company') {
    if (lower !== 'skip for now') {
      memory.company = text;
    }
    return finalizeLead(memory);
  }

  return finalizeLead(memory);
}

/**
 * Record lead locally and prepare API sync payload
 */
function finalizeLead(memory) {
  memory.flow = null;
  memory.step = 'completed';

  const leadPayload = {
    name: memory.name || 'Visitor',
    email: memory.email || '',
    phone: memory.phone || '',
    company: memory.company || memory.brandName || '',
    budget: memory.budget || '',
    goal: memory.objective || 'Chatbot Inquiry',
    identity: 'Brand',
    requirement: memory.requirement || 'General Business / Influencer Inquiry',
    createdAt: new Date().toISOString()
  };

  // Persist locally as fallback so leads are never lost
  try {
    const existing = JSON.parse(localStorage.getItem('cpeb_chat_leads') || '[]');
    existing.unshift(leadPayload);
    localStorage.setItem('cpeb_chat_leads', JSON.stringify(existing));
  } catch (err) {
    console.error('Local lead storage error:', err);
  }

  // Attempt async sync to backend API endpoint
  fetch('http://localhost:5001/api/public/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadPayload)
  }).catch(() => {
    // Graceful offline fallback
  });

  return {
    text: `Thanks, ${memory.name || 'there'}. Your requirement has been recorded. Our team can review it and get back to you within 24 hours.`,
    cardType: 'lead_confirmation',
    cards: [leadPayload],
    quickActions: ['Explore Influencers', 'View Services Catalog', 'Chat on WhatsApp', 'Start New Conversation'],
    updatedMemory: memory
  };
}
