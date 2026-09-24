import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import CreatorProfile from '../models/CreatorProfile.js';
import SocialAccount from '../models/SocialAccount.js';
import CreatorPortfolio from '../models/CreatorPortfolio.js';
import AdminReview from '../models/AdminReview.js';

const router = express.Router();

// Apply middleware to all routes in this file
router.use(protect);
router.use(admin);

// @route   GET /api/admin/creators/profiles
// @desc    Get all creator profiles for admin dashboard
router.get('/profiles', async (req, res) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    const profiles = await CreatorProfile.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    // Attach counts or basic social accounts if needed for the table
    // For now returning base profiles is enough for the table view
    res.json({ success: true, data: profiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   GET /api/admin/creators/profiles/:id
// @desc    Get detailed creator profile for review
router.get('/profiles/:id', async (req, res) => {
  try {
    const profile = await CreatorProfile.findById(req.params.id)
      .populate('userId', 'name email');

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const socialAccounts = await SocialAccount.find({ creatorProfileId: profile._id });
    const portfolios = await CreatorPortfolio.find({ creatorProfileId: profile._id }).sort({ sortOrder: 1 });
    const reviews = await AdminReview.find({ creatorProfileId: profile._id })
      .populate('adminId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...profile.toObject(),
        socialAccounts,
        portfolios,
        reviews,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/admin/creators/profiles/:id/review
// @desc    Approve, Reject, or Request Changes
router.post('/profiles/:id/review', async (req, res) => {
  try {
    const { action, note } = req.body;
    // action must be one of: APPROVED, CHANGES_REQUESTED, REJECTED
    
    if (!['APPROVED', 'CHANGES_REQUESTED', 'REJECTED'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Invalid action' });
    }

    const profile = await CreatorProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    profile.status = action;
    
    if (action === 'APPROVED') {
      profile.approvedAt = new Date();
      profile.visibility = 'VISIBLE';
    } else if (action === 'REJECTED') {
      profile.rejectedAt = new Date();
      profile.visibility = 'HIDDEN';
    } else if (action === 'CHANGES_REQUESTED') {
      profile.visibility = 'HIDDEN';
    }

    await profile.save();

    // Log the review
    const review = await AdminReview.create({
      creatorProfileId: profile._id,
      adminId: req.user._id,
      action,
      note: note || '',
    });

    res.json({ success: true, data: { profile, review } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   PUT /api/admin/creators/profiles/:id
// @desc    Update creator profile fields
router.put('/profiles/:id', async (req, res) => {
  try {
    const profile = await CreatorProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' });

    const updatableFields = ['displayName', 'slug', 'bio', 'profileImage', 'city', 'state', 'country', 'primaryCategory', 'secondaryCategories', 'languages', 'priority', 'featured', 'visibility', 'imagePosition', 'followersExact', 'followersDisplay'];
    
    for (const field of updatableFields) {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    }
    
    if (req.body.followersExact !== undefined || req.body.followersDisplay !== undefined) {
       profile.followersUpdatedAt = new Date();
    }

    await profile.save();
    res.json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   PUT /api/admin/creators/order
// @desc    Bulk update creator priority
router.put('/order', async (req, res) => {
  try {
    const { order } = req.body; // Array of { id, priority }
    if (!Array.isArray(order)) return res.status(400).json({ success: false, error: 'Invalid order data' });
    
    for (const item of order) {
      await CreatorProfile.findByIdAndUpdate(item.id, { priority: item.priority });
    }
    
    res.json({ success: true, message: 'Order updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
