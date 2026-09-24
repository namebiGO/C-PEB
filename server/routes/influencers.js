import express from 'express';
import Influencer from '../models/Influencer.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected
router.use(protect);

// @route   GET /api/admin/influencers
// @desc    Get all influencers
router.get('/', async (req, res) => {
  try {
    const influencers = await Influencer.find().sort({ createdAt: -1 });
    res.json({ success: true, data: influencers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/admin/influencers
// @desc    Create an influencer
router.post('/', async (req, res) => {
  try {
    // Generate a simple slug if not provided
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    const influencer = await Influencer.create(req.body);
    req.io.emit('content_updated', { type: 'influencer_created' });
    res.status(201).json({ success: true, data: influencer });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Slug already exists' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/admin/influencers/:id
// @desc    Update an influencer
router.put('/:id', async (req, res) => {
  try {
    const influencer = await Influencer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!influencer) {
      return res.status(404).json({ success: false, error: 'Influencer not found' });
    }

    req.io.emit('content_updated', { type: 'influencer_updated' });
    res.json({ success: true, data: influencer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/admin/influencers/:id
// @desc    Delete an influencer
router.delete('/:id', async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id);

    if (!influencer) {
      return res.status(404).json({ success: false, error: 'Influencer not found' });
    }

    await influencer.deleteOne();
    req.io.emit('content_updated', { type: 'influencer_deleted' });
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
