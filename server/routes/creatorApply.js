import express from 'express';
import CreatorApplication from '../models/CreatorApplication.js';

const router = express.Router();

// ── Normalise Instagram input ─────────────────────────────
// Accept: @handle, handle, instagram.com/handle, full URL
const normaliseInstagram = (raw) => {
  if (!raw) return '';
  let s = raw.trim();

  // Strip protocol + www
  s = s.replace(/^https?:\/\//i, '').replace(/^www\./i, '');

  // If it starts with instagram.com/
  if (/^instagram\.com\//i.test(s)) {
    s = s.replace(/^instagram\.com\//i, '');
    // Remove trailing slashes / query params
    s = s.split('/')[0].split('?')[0];
    return `@${s.replace(/^@/, '')}`;
  }

  // Plain @handle or handle
  return `@${s.replace(/^@/, '')}`;
};

// @route   POST /api/creators/apply
// @desc    Submit a creator application (public — no auth required)
router.post('/apply', async (req, res) => {
  try {
    const {
      creatorName,
      instagram,
      category,
      city,
      whatsapp,
      // optional
      email,
      youtube,
      otherSocial,
    } = req.body;

    // ── Validate required fields ────────────────────
    const missing = [];
    if (!creatorName?.trim()) missing.push('Creator Name');
    if (!instagram?.trim())   missing.push('Instagram Profile');
    if (!category?.trim())    missing.push('Category');
    if (!city?.trim())        missing.push('City');
    if (!whatsapp?.trim())    missing.push('WhatsApp Number');

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Please fill in: ${missing.join(', ')}`,
      });
    }

    // ── Normalise Instagram handle ──────────────────
    const normalInstagram = normaliseInstagram(instagram);

    // ── Create application ─────────────────────────
    const application = await CreatorApplication.create({
      creatorName: creatorName.trim(),
      instagram: normalInstagram,
      category: category.trim(),
      city: city.trim(),
      whatsapp: whatsapp.trim(),
      email: email?.trim() || '',
      youtube: youtube?.trim() || '',
      otherSocial: otherSocial?.trim() || '',
      status: 'PENDING_REVIEW',
    });

    // Notify admin via socket if available
    if (req.io) {
      req.io.emit('new_creator_application', {
        id: application._id,
        creatorName: application.creatorName,
        instagram: application.instagram,
        category: application.category,
        city: application.city,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Application received. We will review your profile and get back to you.',
      data: {
        id: application._id,
        status: application.status,
      },
    });
  } catch (error) {
    console.error('Creator application error:', error);
    return res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
});

export default router;
