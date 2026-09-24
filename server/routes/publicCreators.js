import express from 'express';
import CreatorProfile from '../models/CreatorProfile.js';
import SocialAccount from '../models/SocialAccount.js';
import CreatorPortfolio from '../models/CreatorPortfolio.js';

const router = express.Router();

// @route   GET /api/public/creators
// @desc    Get all APPROVED creators (public directory)
router.get('/', async (req, res) => {
  try {
    // Only fetch APPROVED and VISIBLE profiles
    const query = { status: 'APPROVED', visibility: 'VISIBLE' };
    
    // Simple filtering logic
    if (req.query.category) {
      query.$or = [
        { primaryCategory: req.query.category },
        { secondaryCategories: req.query.category }
      ];
    }
    if (req.query.location) {
      query.city = { $regex: req.query.location, $options: 'i' };
    }
    
    // NOTE: In production, pagination should be added here
    const profiles = await CreatorProfile.find(query)
      .select('-phone -email -accuracyConsent -userId')
      .sort({ priority: 1, updatedAt: -1 })
      .lean();

    // Attach social accounts for the cards
    const populatedProfiles = await Promise.all(profiles.map(async (profile) => {
      const socialAccounts = await SocialAccount.find({ creatorProfileId: profile._id }).lean();
      return {
        ...profile,
        socialAccounts,
      };
    }));

    res.json({ success: true, data: populatedProfiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   GET /api/public/creators/:slug
// @desc    Get individual APPROVED creator by slug
router.get('/:slug', async (req, res) => {
  try {
    const profile = await CreatorProfile.findOne({ 
      slug: req.params.slug, 
      status: 'APPROVED',
      visibility: 'VISIBLE'
    })
      .select('-phone -email -accuracyConsent -userId')
      .lean();

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Creator not found' });
    }

    const socialAccounts = await SocialAccount.find({ creatorProfileId: profile._id }).lean();
    const portfolios = await CreatorPortfolio.find({ creatorProfileId: profile._id }).sort({ sortOrder: 1 }).lean();

    res.json({
      success: true,
      data: {
        ...profile,
        socialAccounts,
        portfolios
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
