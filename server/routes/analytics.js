import express from 'express';
import SearchEvent from '../models/SearchEvent.js';
import CreatorProfile from '../models/CreatorProfile.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─────────────────────────────────────────────────────
// PUBLIC — Track a search / profile view event
// POST /api/analytics/event
// Body: { eventType, query, category, location, creatorProfileId, resultCount, sessionId }
// ─────────────────────────────────────────────────────
router.post('/event', async (req, res) => {
  try {
    const { eventType, query, category, location, creatorProfileId, resultCount, sessionId } = req.body;

    const validTypes = ['SEARCH', 'PROFILE_VIEW', 'PROFILE_CLICK', 'CATEGORY_BROWSE', 'LOCATION_BROWSE'];
    if (eventType && !validTypes.includes(eventType)) {
      return res.status(400).json({ success: false, error: 'Invalid eventType' });
    }

    await SearchEvent.create({
      eventType: eventType || 'SEARCH',
      query: (query || '').trim().slice(0, 200),
      category: category || '',
      location: location || '',
      creatorProfileId: creatorProfileId || null,
      resultCount: resultCount || 0,
      sessionId: (sessionId || '').slice(0, 64),
    });

    res.status(201).json({ success: true });
  } catch (error) {
    // Never let analytics errors break the user experience
    console.error('Analytics event error:', error);
    res.status(201).json({ success: true }); // silent fail
  }
});

// ─────────────────────────────────────────────────────
// ADMIN — All analytics routes below require auth
// ─────────────────────────────────────────────────────
router.use(protect);
router.use(admin);

// GET /api/analytics/admin/summary
// Returns top-level analytics numbers
router.get('/admin/summary', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const [
      totalSearches,
      totalProfileViews,
      todaySearches,
      uniqueQueries,
    ] = await Promise.all([
      SearchEvent.countDocuments({ eventType: 'SEARCH', createdAt: { $gte: since } }),
      SearchEvent.countDocuments({ eventType: 'PROFILE_VIEW', createdAt: { $gte: since } }),
      SearchEvent.countDocuments({ 
        eventType: 'SEARCH', 
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } 
      }),
      SearchEvent.distinct('query', { eventType: 'SEARCH', query: { $ne: '' }, createdAt: { $gte: since } })
        .then(q => q.length),
    ]);

    res.json({
      success: true,
      data: { totalSearches, totalProfileViews, todaySearches, uniqueQueries, days: Number(days) },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// GET /api/analytics/admin/top-creators?days=30&limit=10
// Most searched / viewed creators
router.get('/admin/top-creators', async (req, res) => {
  try {
    const { days = 30, limit = 10, eventType = 'PROFILE_VIEW' } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const pipeline = [
      {
        $match: {
          eventType,
          creatorProfileId: { $ne: null },
          createdAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: '$creatorProfileId',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: 'creatorprofiles',
          localField: '_id',
          foreignField: '_id',
          as: 'profile',
        },
      },
      { $unwind: { path: '$profile', preserveNullAndEmpty: false } },
      {
        $project: {
          _id: '$profile._id',
          displayName: '$profile.displayName',
          slug: '$profile.slug',
          profileImage: '$profile.profileImage',
          primaryCategory: '$profile.primaryCategory',
          city: '$profile.city',
          status: '$profile.status',
          count: 1,
        },
      },
    ];

    const results = await SearchEvent.aggregate(pipeline);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// GET /api/analytics/admin/searches-over-time?days=14
// Daily search volume for charts
router.get('/admin/searches-over-time', async (req, res) => {
  try {
    const { days = 14 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const pipeline = [
      { $match: { eventType: 'SEARCH', createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } },
    ];

    const results = await SearchEvent.aggregate(pipeline);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// GET /api/analytics/admin/top-categories?days=30
router.get('/admin/top-categories', async (req, res) => {
  try {
    const { days = 30, limit = 10 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const results = await SearchEvent.aggregate([
      { $match: { category: { $ne: '' }, createdAt: { $gte: since } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: Number(limit) },
      { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);

    res.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// GET /api/analytics/admin/top-locations?days=30
router.get('/admin/top-locations', async (req, res) => {
  try {
    const { days = 30, limit = 10 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const results = await SearchEvent.aggregate([
      { $match: { location: { $ne: '' }, createdAt: { $gte: since } } },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: Number(limit) },
      { $project: { location: '$_id', count: 1, _id: 0 } },
    ]);

    res.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// GET /api/analytics/admin/top-queries?days=30
router.get('/admin/top-queries', async (req, res) => {
  try {
    const { days = 30, limit = 10 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const results = await SearchEvent.aggregate([
      { $match: { eventType: 'SEARCH', query: { $ne: '' }, createdAt: { $gte: since } } },
      { $group: { _id: { $toLower: '$query' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: Number(limit) },
      { $project: { query: '$_id', count: 1, _id: 0 } },
    ]);

    res.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
