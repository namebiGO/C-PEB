import express from 'express';
import SupportQuery from '../models/SupportQuery.js';
import SupportMessage from '../models/SupportMessage.js';
import AdminActivity from '../models/AdminActivity.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─────────────────────────────────────────────────────
// PUBLIC — Submit a new support query
// POST /api/queries
// ─────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, category, initialMessage, relatedCreatorSlug } = req.body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !initialMessage?.trim()) {
      return res.status(400).json({ success: false, error: 'Name, email, subject and message are required.' });
    }

    const query = await SupportQuery.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      subject: subject.trim(),
      category: category || 'GENERAL',
      initialMessage: initialMessage.trim(),
      relatedCreatorSlug: relatedCreatorSlug || '',
    });

    // Also create the first message in the thread
    await SupportMessage.create({
      queryId: query._id,
      senderType: 'USER',
      message: initialMessage.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Your query has been submitted. We will get back to you shortly.',
      data: { id: query._id, status: query.status },
    });
  } catch (error) {
    console.error('Support query error:', error);
    res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────────────────
// ADMIN routes below
// ─────────────────────────────────────────────────────
router.use(protect);
router.use(admin);

// GET /api/queries/admin?status=OPEN&priority=HIGH&page=1&limit=20&search=
router.get('/admin', async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20, search } = req.query;

    const filter = {};
    if (status && status !== 'ALL') filter.status = status;
    if (priority && priority !== 'ALL') filter.priority = priority;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [queries, total] = await Promise.all([
      SupportQuery.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      SupportQuery.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: queries,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// GET /api/queries/admin/:id — Full query detail with messages
router.get('/admin/:id', async (req, res) => {
  try {
    const query = await SupportQuery.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .lean();

    if (!query) return res.status(404).json({ success: false, error: 'Query not found' });

    const messages = await SupportMessage.find({ queryId: query._id })
      .sort({ createdAt: 1 })
      .lean();

    res.json({ success: true, data: { ...query, messages } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// POST /api/queries/admin/:id/reply — Admin replies
router.post('/admin/:id/reply', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ success: false, error: 'Message is required.' });
    }

    const query = await SupportQuery.findById(req.params.id);
    if (!query) return res.status(404).json({ success: false, error: 'Query not found' });

    // Create message
    const msg = await SupportMessage.create({
      queryId: query._id,
      senderType: 'ADMIN',
      adminId: req.user._id,
      adminName: req.user.name,
      message: message.trim(),
    });

    // Auto-move to IN_PROGRESS if still OPEN
    if (query.status === 'OPEN') {
      query.status = 'IN_PROGRESS';
      await query.save();
    }

    // Log admin activity
    await AdminActivity.create({
      adminId: req.user._id,
      adminName: req.user.name,
      action: 'REPLIED_TO_QUERY',
      entityType: 'QUERY',
      entityId: query._id.toString(),
      entityName: query.subject,
    }).catch(() => {}); // non-blocking

    // Emit real-time update
    if (req.io) {
      req.io.emit('update_query', { queryId: query._id, status: query.status });
    }

    res.json({ success: true, data: msg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// PATCH /api/queries/admin/:id/status
router.patch('/admin/:id/status', async (req, res) => {
  try {
    const { status, resolutionNote } = req.body;
    const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const query = await SupportQuery.findById(req.params.id);
    if (!query) return res.status(404).json({ success: false, error: 'Query not found' });

    const oldStatus = query.status;
    query.status = status;
    if (resolutionNote) query.resolutionNote = resolutionNote;
    if (status === 'RESOLVED') query.resolvedAt = new Date();
    if (status === 'CLOSED') query.closedAt = new Date();
    await query.save();

    // Log admin activity
    await AdminActivity.create({
      adminId: req.user._id,
      adminName: req.user.name,
      action: `CHANGED_QUERY_STATUS_TO_${status}`,
      entityType: 'QUERY',
      entityId: query._id.toString(),
      entityName: query.subject,
      metadata: { oldStatus, newStatus: status, resolutionNote },
    }).catch(() => {});

    if (req.io) {
      req.io.emit('update_query', { queryId: query._id, status });
    }

    res.json({ success: true, data: query });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// PATCH /api/queries/admin/:id/priority
router.patch('/admin/:id/priority', async (req, res) => {
  try {
    const { priority } = req.body;
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ success: false, error: 'Invalid priority' });
    }

    const query = await SupportQuery.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true }
    );
    if (!query) return res.status(404).json({ success: false, error: 'Query not found' });

    res.json({ success: true, data: query });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// GET /api/queries/admin/stats/summary
router.get('/admin/stats/summary', async (req, res) => {
  try {
    const [open, inProgress, resolved, closed, urgent] = await Promise.all([
      SupportQuery.countDocuments({ status: 'OPEN' }),
      SupportQuery.countDocuments({ status: 'IN_PROGRESS' }),
      SupportQuery.countDocuments({ status: 'RESOLVED' }),
      SupportQuery.countDocuments({ status: 'CLOSED' }),
      SupportQuery.countDocuments({ priority: 'URGENT', status: { $in: ['OPEN', 'IN_PROGRESS'] } }),
    ]);
    res.json({ success: true, data: { open, inProgress, resolved, closed, urgent } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
