import express from 'express';
import Influencer from '../models/Influencer.js';
import Service from '../models/Service.js';
import Lead from '../models/Lead.js';

const router = express.Router();

// @route   GET /api/public/featured-influencers
// @desc    Get featured influencers for homepage
router.get('/featured-influencers', async (req, res) => {
  try {
    const influencers = await Influencer.find({ isActive: true, isFeatured: true })
      .sort({ featuredOrder: 1 })
      .limit(10); // Limit just in case
    res.json({ success: true, data: influencers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   GET /api/public/featured-services
// @desc    Get featured services for homepage
router.get('/featured-services', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true, isFeatured: true })
      .populate('influencerId', 'name profileImage')
      .sort({ displayOrder: 1 })
      .limit(12);
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/public/leads
// @desc    Submit a new lead from contact forms
router.post('/leads', async (req, res) => {
  try {
    // Map identity/goal/budget to requirement if present
    const data = { ...req.body };
    if (data.identity && data.goal && data.budget) {
      data.requirement = `Identity: ${data.identity} | Goal: ${data.goal} | Budget: ${data.budget}`;
    }
    
    // Ensure we have a requirement string even if none provided directly
    if (!data.requirement && req.body.message) {
        data.requirement = req.body.message;
    }
    if (!data.requirement) {
        data.requirement = 'General Inquiry';
    }

    const lead = await Lead.create(data);
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   GET /api/public/influencer/:slug
// @desc    Get single influencer by slug
router.get('/influencer/:slug', async (req, res) => {
  try {
    const influencer = await Influencer.findOne({ slug: req.params.slug, isActive: true });
    if (!influencer) {
      return res.status(404).json({ success: false, error: 'Influencer not found' });
    }
    // Also fetch their services
    const services = await Service.find({ influencerId: influencer._id, isActive: true });
    res.json({ success: true, data: { influencer, services } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard stats (Protected but putting it here for simplicity, will move or protect)
// Actually, this should be in an admin route, let's keep it here but protected if we want, or I'll create a new route.
// For now, I'll move stats to a separate admin route file.

export default router;
