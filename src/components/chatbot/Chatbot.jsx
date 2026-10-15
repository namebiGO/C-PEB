import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  RotateCcw,
  Volume2,
  VolumeX,
  Minus,
  ExternalLink
} from 'lucide-react';
import {
  InfluencerCard,
  ServiceCard,
  PricingCard,
  LeadConfirmationCard,
  WhatsAppHandoffCard
} from './ChatbotCard';
import { processMessage } from './chatbotEngine';
import { buildHandoffUrl } from './whatsappHandoff';
import './Chatbot.css';

const INITIAL_WELCOME = {
  id: 'msg-welcome-0',
  sender: 'bot',
  text: "Hi! Welcome to C-PEB. 👋\n\nHow can our team help you today? Select any service below to connect directly with us on WhatsApp:",
  time: formatTime(new Date()),
  quickActions: [
    'Influencer Management',
    'Event Management',
    'Tech Solutions',
    'Brand Growth',
    'Something Else',
  ]
};

// Initial memory state for a fresh session — starts the wa_qualify flow
const INITIAL_MEMORY = {
  flow: 'wa_qualify',
  wa_service: '',
  wa_requirement: '',
};

function formatTime(date) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
}

// Gentle Web Audio tone for assistant responses (pure synthesized audio, no external assets needed)
function playTone(muted) {
  if (muted) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch {
    // Audio contexts might be blocked before first interaction
  }
}

export default function Chatbot() {
  const navigate = useNavigate();

  // Widget visibility state
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Message list & user memory
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('cpeb_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [INITIAL_WELCOME];
  });

  const [memory, setMemory] = useState(() => {
    try {
      const saved = sessionStorage.getItem('cpeb_chat_memory');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { ...INITIAL_MEMORY };
  });

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Sync session storage
  useEffect(() => {
    try {
      sessionStorage.setItem('cpeb_chat_history', JSON.stringify(messages));
      sessionStorage.setItem('cpeb_chat_memory', JSON.stringify(memory));
    } catch {}
  }, [messages, memory]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
      setShowTooltip(false);
    }
  }, [isOpen]);

  // Auto-dismiss tooltip after 14 seconds if unopened
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 14000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setShowTooltip(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClearChat = () => {
    const freshMemory = { ...INITIAL_MEMORY };
    const freshMessages = [
      {
        ...INITIAL_WELCOME,
        id: `msg-welcome-${Date.now()}`,
        time: formatTime(new Date())
      }
    ];
    setMessages(freshMessages);
    setMemory(freshMemory);
    sessionStorage.removeItem('cpeb_chat_history');
    sessionStorage.removeItem('cpeb_chat_memory');
  };

  const sendMessage = (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    setInputVal('');

    // Append User message
    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      time: formatTime(new Date())
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Natural assistant thinking delay
    setTimeout(() => {
      const response = processMessage(text, memory);

      setMemory(response.updatedMemory || memory);

      const botMsg = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        cardType: response.cardType,
        cards: response.cards,
        cta: response.cta,
        quickActions: response.quickActions || [],
        time: formatTime(new Date())
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      playTone(isMuted);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle quick actions — redirects to WhatsApp for services & WhatsApp CTAs
  const handleQuickAction = (actionText) => {
    const lower = actionText.toLowerCase();

    // 1. Direct WhatsApp quick reply
    if (
      lower === 'chat on whatsapp' ||
      lower === 'continue on whatsapp' ||
      lower.includes('whatsapp')
    ) {
      const handoffMsg = [...messages].reverse().find(
        (m) => m.cardType === 'wa_handoff' && m.cards && m.cards[0]?.whatsappUrl
      );
      const url = handoffMsg ? handoffMsg.cards[0].whatsappUrl : 'https://wa.me/917079701229?text=Hi%20C-PEB%20Team%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20services.';
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (e) {}
      return;
    }

    // 2. Navigation or reset
    if (lower === 'choose another service' || lower === 'main menu' || lower === 'keep chatting') {
      sendMessage(actionText);
      return;
    }

    // 3. For EVERY service option, immediately open WhatsApp with prefilled message
    let serviceName = '';
    if (lower.includes('influencer') || lower.includes('creator')) {
      serviceName = 'Influencer Management';
    } else if (lower.includes('event')) {
      serviceName = 'Event Management';
    } else if (lower.includes('tech') || lower.includes('web') || lower.includes('app') || lower.includes('software') || lower.includes('it')) {
      serviceName = 'Tech Solutions';
    } else if (lower.includes('brand') || lower.includes('marketing') || lower.includes('campaign')) {
      serviceName = 'Brand Growth';
    } else if (lower.includes('startup') || lower.includes('fund') || lower.includes('advisory')) {
      serviceName = 'Startup Support & Advisory';
    } else if (lower.includes('something else') || lower.includes('other')) {
      serviceName = 'General Business Advisory';
    }

    if (serviceName) {
      const requirement = actionText !== serviceName ? actionText : `Inquiry for ${serviceName}`;
      const url = buildHandoffUrl({ service: serviceName, requirement });
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (e) {}

      // Send message to display WhatsApp handoff card in chat
      sendMessage(actionText);
      return;
    }

    sendMessage(actionText);
  };

  // Card specific handlers — redirect to WhatsApp for every service & creator
  const handleEnquireCreator = (influencer) => {
    const serviceName = 'Influencer Collaboration';
    const requirement = `Collaboration inquiry with ${influencer.name} (${influencer.category} on ${influencer.platform})`;
    const url = buildHandoffUrl({ service: serviceName, requirement });

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {}

    const botMsg = {
      id: `msg-bot-${Date.now()}`,
      sender: 'bot',
      text: `Connecting you with our team regarding **${influencer.name}**! 🚀\n\nClick **Continue on WhatsApp** below to discuss creator availability & rates at **+91 70797 01229**:`,
      cardType: 'wa_handoff',
      cards: [{ service: serviceName, requirement, whatsappUrl: url }],
      quickActions: ['Continue on WhatsApp', 'Choose Another Service'],
      time: formatTime(new Date())
    };
    setMessages((prev) => [...prev, botMsg]);
  };

  const handleQuoteService = (service) => {
    const serviceName = service.title || 'Technical & Business Service';
    const requirement = `Quote request for ${serviceName} (${service.category || 'Services'})`;
    const url = buildHandoffUrl({ service: serviceName, requirement });

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {}

    const botMsg = {
      id: `msg-bot-${Date.now()}`,
      sender: 'bot',
      text: `Connecting you with our team for **${serviceName}**! 🚀\n\nClick **Continue on WhatsApp** below to discuss your project scope & pricing at **+91 70797 01229**:`,
      cardType: 'wa_handoff',
      cards: [{ service: serviceName, requirement, whatsappUrl: url }],
      quickActions: ['Continue on WhatsApp', 'Choose Another Service'],
      time: formatTime(new Date())
    };
    setMessages((prev) => [...prev, botMsg]);
  };

  const handleSelectPricing = (pkg) => {
    const serviceName = `Package Subscription: ${pkg.name}`;
    const requirement = `Subscription inquiry for ${pkg.name} (${pkg.price})`;
    const url = buildHandoffUrl({ service: serviceName, requirement });

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {}

    const botMsg = {
      id: `msg-bot-${Date.now()}`,
      sender: 'bot',
      text: `Connecting you with our team for the **${pkg.name}** plan! 🚀\n\nClick **Continue on WhatsApp** below to get started at **+91 70797 01229**:`,
      cardType: 'wa_handoff',
      cards: [{ service: serviceName, requirement, whatsappUrl: url }],
      quickActions: ['Continue on WhatsApp', 'Choose Another Service'],
      time: formatTime(new Date())
    };
    setMessages((prev) => [...prev, botMsg]);
  };

  // Active quick actions from latest bot message
  const lastBotMsg = [...messages].reverse().find((m) => m.sender === 'bot');
  const activeQuickActions = lastBotMsg?.quickActions || [];

  return (
    <div className="cb-widget-root" aria-live="polite">
      {/* ── Closed Launcher State ── */}
      {!isOpen && (
        <div className="cb-launcher-wrap">
          {showTooltip && (
            <div className="cb-teaser-tooltip" onClick={handleOpen} role="alert">
              <span className="cb-teaser-text">
                <Sparkles size={14} className="cb-teaser-sparkle" />
                How can we help you today?
              </span>
              <button
                type="button"
                className="cb-teaser-close"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                aria-label="Close tooltip"
              >
                <X size={13} />
              </button>
              <div className="cb-teaser-arrow"></div>
            </div>
          )}

          <button
            type="button"
            className="cb-launcher-btn"
            onClick={handleOpen}
            aria-label="Open Business Assistant Chat"
          >
            <div className="cb-pulse-ring"></div>
            <MessageSquare size={26} />
            <span className="cb-launcher-badge"></span>
          </button>
        </div>
      )}

      {/* ── Opened Chat Window ── */}
      {isOpen && (
        <div className="cb-window" role="dialog" aria-label="C-PEB Business Assistant">
          {/* Header */}
          <div className="cb-header">
            <div className="cb-header-left">
              <div className="cb-bot-avatar">
                <div className="cb-bot-avatar-inner">
                  <Bot size={20} />
                </div>
              </div>
              <div className="cb-bot-info">
                <div className="cb-bot-title-row">
                  <h3 className="cb-bot-title">Business Assistant</h3>
                </div>
                <div className="cb-bot-status">
                  <span className="cb-status-dot"></span>
                  <span>Online • C-PEB Concierge</span>
                </div>
              </div>
            </div>

            <div className="cb-header-actions">
              <button
                type="button"
                className="cb-header-btn"
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
                aria-label="Toggle mute"
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <button
                type="button"
                className="cb-header-btn"
                onClick={handleClearChat}
                title="Restart conversation"
                aria-label="Restart chat"
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                className="cb-header-btn"
                onClick={handleClose}
                title="Minimize chat"
                aria-label="Minimize chat"
              >
                <Minus size={16} />
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="cb-messages-area">
            <div className="cb-session-pill">Session Active</div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`cb-msg-row ${msg.sender === 'bot' ? 'cb-bot-msg' : 'cb-user-msg'}`}
              >
                <div className="cb-bubble">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} style={{ margin: pIdx > 0 ? '8px 0 0 0' : 0 }}>
                      {paragraph.split('\n').map((line, lIdx) => (
                        <React.Fragment key={lIdx}>
                          {lIdx > 0 && <br />}
                          {line}
                        </React.Fragment>
                      ))}
                    </p>
                  ))}

                  {/* Render CTA if provided */}
                  {msg.cta && (
                    <div className="cb-inline-cta">
                      {msg.cta.type === 'external' ? (
                        <a
                          href={msg.cta.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cb-cta-link-btn"
                        >
                          <span>{msg.cta.label}</span>
                          <ExternalLink size={13} />
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="cb-cta-link-btn"
                          onClick={() => {
                            if (msg.cta.action === 'start_web_quote') {
                              handleQuoteService({ title: 'Website Development', category: 'Startup Services' });
                            } else if (msg.cta.url) {
                              navigate(msg.cta.url);
                            }
                          }}
                        >
                          <span>{msg.cta.label}</span>
                          <Sparkles size={13} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Render Cards Slider if attached to bot response */}
                {msg.cards && msg.cards.length > 0 && (
                  <div className="cb-cards-slider">
                    {msg.cardType === 'influencer' &&
                      msg.cards.map((inf) => (
                        <InfluencerCard
                          key={inf.id || inf.slug}
                          influencer={inf}
                          onEnquire={handleEnquireCreator}
                        />
                      ))}

                    {msg.cardType === 'service' &&
                      msg.cards.map((svc) => (
                        <ServiceCard
                          key={svc.id}
                          service={svc}
                          onQuote={handleQuoteService}
                        />
                      ))}

                    {msg.cardType === 'pricing' &&
                      msg.cards.map((pkg, idx) => (
                        <PricingCard
                          key={idx}
                          pkg={pkg}
                          onSelect={handleSelectPricing}
                        />
                      ))}

                    {msg.cardType === 'lead_confirmation' &&
                      msg.cards.map((lead, idx) => (
                        <LeadConfirmationCard key={idx} lead={lead} />
                      ))}

                    {msg.cardType === 'wa_handoff' &&
                      msg.cards.map((handoff, idx) => (
                        <WhatsAppHandoffCard
                          key={idx}
                          handoff={handoff}
                          onKeepChatting={() => {
                            sendMessage('Keep Chatting');
                          }}
                        />
                      ))}
                  </div>
                )}

                <span className="cb-msg-time">{msg.time}</span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="cb-msg-row cb-bot-msg">
                <div className="cb-typing-indicator">
                  <span className="cb-dot"></span>
                  <span className="cb-dot"></span>
                  <span className="cb-dot"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Bar */}
          {!isTyping && activeQuickActions.length > 0 && (
            <div className="cb-quick-actions-bar">
              {activeQuickActions.map((action, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="cb-quick-btn"
                  onClick={() => handleQuickAction(action)}
                >
                  <span>{action}</span>
                </button>
              ))}
            </div>
          )}

          {/* Message Input Bar */}
          <div className="cb-input-bar">
            <input
              ref={inputRef}
              type="text"
              className="cb-input-field"
              placeholder="Ask anything or describe your requirement…"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              aria-label="Type your message"
            />
            <button
              type="button"
              className="cb-send-btn"
              onClick={() => sendMessage()}
              disabled={!inputVal.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
