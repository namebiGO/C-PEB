import express from 'express';
import AdminActivity from '../models/AdminActivity.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(admin);

// GET /api/activity?page=1&limit=30&entityType=CREATOR_PROFILE
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 30, entityType } = req.query;

    const filter = {};
    if (entityType && entityType !== 'ALL') filter.entityType = entityType;

    const skip = (Number(page) - 1) * Number(limit);
    const [activities, total] = await Promise.all([
      AdminActivity.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      AdminActivity.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: activities,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
