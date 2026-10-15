// -----------------------------------------------------------------
// C-PEB WhatsApp Handoff Utility
// All WhatsApp link generation must go through buildWhatsAppUrl().
// Number format: digits-only, country code first (no +, spaces, dashes)
// -----------------------------------------------------------------

const WHATSAPP_NUMBER = '917079701229'; // +91 70797 01229

/**
 * Builds a wa.me URL with a URL-encoded prefilled message.
 * @param {string} message - Human-readable message to prefill
 * @returns {string} Full wa.me URL
 */
export function buildWhatsAppUrl(message) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

/**
 * Builds the prefilled WhatsApp message from chatbot conversation state.
 * Only includes fields the visitor actually answered -- never invents data.
 *
 * @param {Object} waState - Conversation state object:
 *   { service, requirement, qualifier, name }
 * @returns {string} Formatted message ready for URL encoding
 */
export function buildWhatsAppMessage(waState) {
  const { service, requirement, qualifier, name } = waState;

  const lines = [];

  lines.push('Hi C-PEB Team,');
  lines.push('');
  lines.push('I contacted you through the C-PEB website.');
  lines.push('');
  lines.push('My requirements:');

  if (service)      lines.push(`- Service: ${service}`);
  if (requirement)  lines.push(`- Requirement: ${requirement}`);
  if (qualifier)    lines.push(`- Details: ${qualifier}`);

  lines.push('');
  lines.push("I'd like to discuss this further.");
  lines.push('Please let me know the next steps.');
  lines.push('');
  if (name) {
    lines.push(`Thank you,`);
    lines.push(name);
  } else {
    lines.push('Thank you.');
  }

  return lines.join('\n');
}

/**
 * Convenience: build a ready-to-use WhatsApp URL from chatbot wa state.
 */
export function buildHandoffUrl(waState) {
  const message = buildWhatsAppMessage(waState);
  return buildWhatsAppUrl(message);
}
