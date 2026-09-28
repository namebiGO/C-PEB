import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import CreatorProfile from '../models/CreatorProfile.js';
import SocialAccount from '../models/SocialAccount.js';
import CreatorPortfolio from '../models/CreatorPortfolio.js';
import AdminReview from '../models/AdminReview.js';

const router = express.Router();

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

    const reviews = await AdminReview.find({ creatorProfileId: profile._id })
      .populate('adminId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...profile.toObject(),
        reviews,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/admin/creators/profiles/:id/review
// @desc    Approve, Reject, Request Changes, or Suspend
router.post('/profiles/:id/review', async (req, res) => {
  try {
    const { action, note } = req.body;
    
    if (!['APPROVED', 'CHANGES_REQUESTED', 'REJECTED', 'SUSPENDED'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Invalid action' });
    }

    const profile = await CreatorProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    profile.status = action;
    
    if (action === 'APPROVED') {
      profile.approvedAt = new Date();
      profile.approvedBy = req.user._id;
      profile.isPublished = true;
    } else if (action === 'REJECTED') {
      profile.rejectedAt = new Date();
      profile.rejectedBy = req.user._id;
      profile.rejectionReason = note || '';
      profile.isPublished = false;
    } else if (action === 'CHANGES_REQUESTED') {
      profile.changesRequestedReason = note || '';
      profile.isPublished = false;
    } else if (action === 'SUSPENDED') {
      profile.isPublished = false;
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
// @desc    Update creator profile fields directly
router.put('/profiles/:id', async (req, res) => {
  try {
    const profile = await CreatorProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' });

    const updatableFields = ['displayName', 'slug', 'bio', 'profileImage', 'city', 'state', 'country', 'primaryCategory', 'secondaryCategories', 'languages', 'priority', 'featured', 'isPublished', 'imagePosition', 'followersExact', 'followersDisplay'];
    
    for (const field of updatableFields) {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    }
    
    await profile.save();
    res.json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
