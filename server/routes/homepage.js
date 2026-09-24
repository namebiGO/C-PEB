import express from 'express';
import HomepageContent from '../models/HomepageContent.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/homepage/:type
// @desc    Get homepage section content
router.get('/:type', async (req, res) => {
  try {
    const content = await HomepageContent.findOne({ type: req.params.type.toUpperCase() });
    res.json({ success: true, data: content ? content.data : null });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   PUT /api/admin/homepage/:type
// @desc    Update homepage section content
router.put('/:type', protect, async (req, res) => {
  try {
    const type = req.params.type.toUpperCase();
    const content = await HomepageContent.findOneAndUpdate(
      { type },
      { type, data: req.body },
      { upsert: true, new: true }
    );
    
    if (req.io) req.io.emit('content_updated', { type: 'homepage_updated', section: type });
    res.json({ success: true, data: content.data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
