import express from 'express';
import CreatorProfile from '../models/CreatorProfile.js';
import SocialAccount from '../models/SocialAccount.js';
import CreatorPortfolio from '../models/CreatorPortfolio.js';

const router = express.Router();

// @route   GET /api/public/creators
// @desc    Get all APPROVED creators (public directory)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    // Only fetch APPROVED and PUBLISHED profiles
    const query = { status: 'APPROVED', isPublished: true };
    
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
    
    // Fetch profiles with pagination
    const total = await CreatorProfile.countDocuments(query);
    const profiles = await CreatorProfile.find(query)
      .select('-phone -email -accuracyConsent -userId')
      .sort({ priority: 1, updatedAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .lean();

    // Fix N+1 query problem: fetch all social accounts for these profiles in one go
    const profileIds = profiles.map(p => p._id);
    const allSocialAccounts = await SocialAccount.find({ creatorProfileId: { $in: profileIds } }).lean();
    
    // Group social accounts by profile ID
    const socialAccountsByProfile = {};
    allSocialAccounts.forEach(account => {
      const pid = account.creatorProfileId.toString();
      if (!socialAccountsByProfile[pid]) {
        socialAccountsByProfile[pid] = [];
      }
      socialAccountsByProfile[pid].push(account);
    });

    // Attach social accounts for the cards
    const populatedProfiles = profiles.map(profile => ({
      ...profile,
      socialAccounts: socialAccountsByProfile[profile._id.toString()] || [],
    }));

    res.json({ 
      success: true, 
      count: populatedProfiles.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: populatedProfiles 
    });
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
      isPublished: true
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
