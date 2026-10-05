import express from 'express';
import Contact from '../models/Contact.js';
import { sendNewContactEmail } from '../config/mailer.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ──────────────────────────────────────────────
// POST /api/contact
// Save a new contact/strategy wizard submission
// PUBLIC — but rate-limited in index.js (formLimiter)
// ──────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const { identity, goal, budget, name, email, phone, company } = req.body;

    // Basic presence checks (Mongoose schema validates types)
    if (!identity || !goal || !budget || !name || !email) {
      res.status(400);
      throw new Error('Fields identity, goal, budget, name and email are required.');
    }

    // Input length guards — prevent oversized payloads
    const contact = await Contact.create({
      identity: String(identity).trim().slice(0, 200),
      goal: String(goal).trim().slice(0, 200),
      budget: String(budget).trim().slice(0, 100),
      name: String(name).trim().slice(0, 100),
      email: String(email).toLowerCase().trim().slice(0, 200),
      phone: phone ? String(phone).trim().slice(0, 20) : '',
      company: company ? String(company).trim().slice(0, 200) : '',
    });

    // Fire-and-forget email notification to office
    sendNewContactEmail({ ...contact.toObject() }).catch(() => {});

    if (req.io) {
      req.io.emit('new_contact', contact);
    }

    return res.status(201).json({
      success: true,
      message: 'Your request has been received. We will be in touch shortly!',
      id: contact._id,
    });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// GET /api/contact
// List all submissions — ADMIN ONLY
// Query params: ?status=new&limit=50&page=1
// ──────────────────────────────────────────────
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    // Clamp pagination to prevent massive data dumps
    const safeLimit = Math.min(Number(limit), 100);
    const safePage = Math.max(Number(page), 1);

    const filter = {};
    if (status) filter.status = status;

    const skip = (safePage - 1) * safeLimit;

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      Contact.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      total,
      page: safePage,
      limit: safeLimit,
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// GET /api/contact/:id
// Fetch a single submission by ID — ADMIN ONLY
// ──────────────────────────────────────────────
router.get('/:id', protect, admin, async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404);
      throw new Error('Submission not found.');
    }
    return res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// PATCH /api/contact/:id
// Update the lead status and/or notes — ADMIN ONLY
// ──────────────────────────────────────────────
router.patch('/:id', protect, admin, async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const updateData = {};
    if (status) {
      if (!['new', 'in-progress', 'closed'].includes(status)) {
        res.status(400);
        throw new Error('status must be one of: new, in-progress, closed');
      }
      updateData.status = status;
    }

    if (notes !== undefined) {
      updateData.notes = String(notes).trim().slice(0, 1000);
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!contact) {
      res.status(404);
      throw new Error('Submission not found.');
    }

    if (req.io) {
      req.io.emit('update_contact', contact);
    }

    return res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
});

export default router;
