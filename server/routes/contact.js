import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// ──────────────────────────────────────────────
// POST /api/contact
// Save a new contact/strategy wizard submission
// ──────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const { identity, goal, budget, name, email, phone, company } = req.body;

    // Basic presence checks (Mongoose schema validates types)
    if (!identity || !goal || !budget || !name || !email) {
      res.status(400);
      throw new Error('Fields identity, goal, budget, name and email are required.');
    }

    const contact = await Contact.create({
      identity,
      goal,
      budget,
      name,
      email,
      phone: phone || '',
      company: company || '',
    });

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
// List all submissions (admin / dev use)
// Query params: ?status=new&limit=50&page=1
// ──────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Contact.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// GET /api/contact/:id
// Fetch a single submission by ID
// ──────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
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
// PATCH /api/contact/:id/status
// Update the lead status (new → in-progress → closed)
// ──────────────────────────────────────────────
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['new', 'in-progress', 'closed'].includes(status)) {
      res.status(400);
      throw new Error('status must be one of: new, in-progress, closed');
    }
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!contact) {
      res.status(404);
      throw new Error('Submission not found.');
    }
    return res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
});

export default router;
