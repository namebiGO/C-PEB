import nodemailer from 'nodemailer';

// ── Transporter ───────────────────────────────────────────────
// Configure SMTP via .env variables. Works with Gmail, Zoho,
// any SMTP service, or standard SMTP relay.
const createTransporter = () => {
  if (!process.env.SMTP_HOST && !process.env.SMTP_SERVICE) return null;

  return nodemailer.createTransport(
    process.env.SMTP_SERVICE
      ? {
          service: process.env.SMTP_SERVICE,           // e.g. 'gmail'
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        }
      : {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        }
  );
};

const OFFICE_EMAIL = 'office@cpebindiait.com';

// ── Generic send helper ───────────────────────────────────────
const sendMail = async (options) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[Mailer] SMTP not configured. Skipping email notification.');
    return;
  }
  try {
    await transporter.sendMail({
      from: `"C-PEB Notifications" <${process.env.SMTP_USER || OFFICE_EMAIL}>`,
      ...options,
    });
  } catch (err) {
    console.error('[Mailer] Failed to send email:', err.message);
  }
};

// ── New Lead Notification ─────────────────────────────────────
export const sendNewLeadEmail = async (lead) => {
  const { name, email, phone, company, identity, goal, budget, requirement } = lead;

  const rows = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone || '—'],
    ['Company / Handle', company || '—'],
    ['Identity', identity || '—'],
    ['Goal', goal || '—'],
    ['Budget', budget || '—'],
    ['Requirement', requirement || '—'],
  ]
    .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:600;color:#374151;white-space:nowrap;">${k}</td><td style="padding:6px 12px;color:#111;">${v}</td></tr>`)
    .join('');

  await sendMail({
    to: OFFICE_EMAIL,
    subject: `🔔 New Lead: ${name} (${identity || 'General'})`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#f9fafb;padding:24px;border-radius:12px;">
        <div style="background:#1a1a2e;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h2 style="color:#fff;margin:0;font-size:1.25rem;">New Lead Received — C-PEB</h2>
        </div>
        <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:20px 24px;">
          <table style="width:100%;border-collapse:collapse;">
            ${rows}
          </table>
          <p style="margin-top:20px;font-size:0.8rem;color:#9ca3af;">
            Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
          </p>
        </div>
      </div>
    `,
  });
};

// ── New Contact Form Notification ─────────────────────────────
export const sendNewContactEmail = async (contact) => {
  await sendNewLeadEmail(contact); // same template, reuse
};
