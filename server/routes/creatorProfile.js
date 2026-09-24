import express from 'express';
import { protect, creator } from '../middleware/authMiddleware.js';
import CreatorProfile from '../models/CreatorProfile.js';
import SocialAccount from '../models/SocialAccount.js';
import CreatorPortfolio from '../models/CreatorPortfolio.js';
import AdminReview from '../models/AdminReview.js';

const router = express.Router();

let demoProfileStore = {
  _id: '654321098765432109876543',
  userId: '654321098765432109876543',
  fullName: 'Demo Influencer',
  displayName: 'Demo Influencer',
  slug: 'demo-influencer',
  profileImage: '',
  email: 'creator@cpeb.com',
  phone: '+91 9876543210',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  languages: ['English', 'Hindi'],
  primaryCategory: 'Fashion',
  secondaryCategories: ['Lifestyle'],
  contentTypes: ['Reels / Short Videos'],
  bio: 'Passionate lifestyle & fashion content creator collaborating with innovative startups.',
  collaborationInterests: ['Brand Campaigns', 'Product Reviews'],
  primaryPlatform: 'Instagram',
  audienceLocation: 'India (85%)',
  audienceAgeRange: '18-24 (55%)',
  accuracyConsent: false,
  status: 'DRAFT',
  socialAccounts: [
    {
      platform: 'Instagram',
      username: '@demoinfluencer',
      profileUrl: 'https://instagram.com/demoinfluencer',
      followers: '45000',
      averageViews: '15K - 20K',
      engagementRate: '4.8%'
    }
  ],
  portfolios: [
    {
      title: 'Spring Fashion Campaign',
      url: 'https://instagram.com/p/demo123',
      campaignType: 'Reel'
    }
  ],
  latestReview: null
};

// @route   GET /api/creators/profile/me
// @desc    Get current creator's profile, socials, portfolios, and latest review note
router.get('/me', protect, creator, async (req, res) => {
  try {
    let profile = await CreatorProfile.findOne({ userId: req.user._id }).catch(() => null);

    if (!profile && String(req.user._id) === '654321098765432109876543') {
      return res.json({
        success: true,
        data: demoProfileStore
      });
    }
    
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const socialAccounts = await SocialAccount.find({ creatorProfileId: profile._id });
    const portfolios = await CreatorPortfolio.find({ creatorProfileId: profile._id }).sort({ sortOrder: 1 });
    const latestReview = await AdminReview.findOne({ creatorProfileId: profile._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...profile.toObject(),
        socialAccounts,
        portfolios,
        latestReview: latestReview ? { action: latestReview.action, note: latestReview.note, createdAt: latestReview.createdAt } : null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/creators/profile/me
// @desc    Create or update creator profile (Draft saving & updates)
router.post('/me', protect, creator, async (req, res) => {
  try {
    const { 
      fullName, displayName, bio, profileImage, email, phone, city, state, country, languages, 
      primaryCategory, secondaryCategories, contentTypes, collaborationInterests,
      primaryPlatform, audienceLocation, audienceAgeRange, accuracyConsent,
      socialAccounts, portfolios 
    } = req.body;

    // Generate a unique slug if not present
    let slug = req.body.slug;
    const nameForSlug = displayName || fullName || req.user.name;
    if (!slug && nameForSlug) {
      slug = nameForSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const existingSlug = await CreatorProfile.findOne({ slug, userId: { $ne: req.user._id } });
      if (existingSlug) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    // Handle demo creator store
    if (String(req.user._id) === '654321098765432109876543') {
      demoProfileStore = {
        ...demoProfileStore,
        ...req.body,
        status: demoProfileStore.status || 'DRAFT'
      };
      return res.json({ success: true, data: demoProfileStore });
    }

    let profile = await CreatorProfile.findOne({ userId: req.user._id }).catch(() => null);

    if (profile) {
      // Updates fields while preserving administrative status
      if (fullName !== undefined) profile.fullName = fullName;
      if (displayName !== undefined) profile.displayName = displayName;
      if (slug) profile.slug = slug;
      if (bio !== undefined) profile.bio = bio;
      if (profileImage !== undefined) profile.profileImage = profileImage;
      if (email !== undefined) profile.email = email;
      if (phone !== undefined) profile.phone = phone;
      if (city !== undefined) profile.city = city;
      if (state !== undefined) profile.state = state;
      if (country !== undefined) profile.country = country;
      if (languages !== undefined) profile.languages = languages;
      if (primaryCategory !== undefined) profile.primaryCategory = primaryCategory;
      if (secondaryCategories !== undefined) profile.secondaryCategories = secondaryCategories;
      if (contentTypes !== undefined) profile.contentTypes = contentTypes;
      if (collaborationInterests !== undefined) profile.collaborationInterests = collaborationInterests;
      if (primaryPlatform !== undefined) profile.primaryPlatform = primaryPlatform;
      if (audienceLocation !== undefined) profile.audienceLocation = audienceLocation;
      if (audienceAgeRange !== undefined) profile.audienceAgeRange = audienceAgeRange;
      if (accuracyConsent !== undefined) profile.accuracyConsent = accuracyConsent;

      await profile.save();
    } else {
      // Create new profile with DRAFT status
      profile = await CreatorProfile.create({
        userId: req.user._id,
        fullName: fullName || req.user.name,
        displayName: displayName || req.user.name,
        slug: slug || `creator-${Date.now().toString().slice(-6)}`,
        bio: bio || '',
        profileImage: profileImage || '',
        email: email || req.user.email,
        phone: phone || '',
        city: city || '',
        state: state || '',
        country: country || 'India',
        languages: languages || [],
        primaryCategory: primaryCategory || '',
        secondaryCategories: secondaryCategories || [],
        contentTypes: contentTypes || [],
        collaborationInterests: collaborationInterests || [],
        primaryPlatform: primaryPlatform || '',
        audienceLocation: audienceLocation || '',
        audienceAgeRange: audienceAgeRange || '',
        accuracyConsent: accuracyConsent || false,
        status: 'DRAFT',
      });
    }

    // Update social accounts if provided
    if (socialAccounts && Array.isArray(socialAccounts)) {
      await SocialAccount.deleteMany({ creatorProfileId: profile._id });
      if (socialAccounts.length > 0) {
        const accountsToInsert = socialAccounts.map(sa => ({
          creatorProfileId: profile._id,
          platform: sa.platform || 'Other',
          username: sa.username || '',
          profileUrl: sa.profileUrl || '',
          followers: sa.followers !== undefined ? String(sa.followers) : '0',
          averageViews: sa.averageViews || '',
          engagementRate: sa.engagementRate || '',
        }));
        await SocialAccount.insertMany(accountsToInsert);
      }
    }

    // Update portfolios if provided
    if (portfolios && Array.isArray(portfolios)) {
      await CreatorPortfolio.deleteMany({ creatorProfileId: profile._id });
      if (portfolios.length > 0) {
        const portfoliosToInsert = portfolios.map((p, index) => ({
          creatorProfileId: profile._id,
          title: p.title || 'Portfolio Item',
          url: p.url || '',
          campaignType: p.campaignType || '',
          sortOrder: p.sortOrder ?? index
        }));
        await CreatorPortfolio.insertMany(portfoliosToInsert);
      }
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message || 'Server Error' });
  }
});

// @route   POST /api/creators/profile/me/submit
// @desc    Submit profile for review with strict validation
router.post('/me/submit', protect, creator, async (req, res) => {
  try {
    if (String(req.user._id) === '654321098765432109876543') {
      demoProfileStore.status = 'PENDING_REVIEW';
      demoProfileStore.submittedAt = new Date();
      return res.json({ success: true, data: demoProfileStore });
    }

    const profile = await CreatorProfile.findOne({ userId: req.user._id }).catch(() => null);
    
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found. Please complete the form first.' });
    }

    // Validate Required Fields
    const errors = [];
    if (!profile.fullName?.trim()) errors.push('Full Name is required');
    if (!profile.displayName?.trim()) errors.push('Creator / Display Name is required');
    if (!profile.profileImage?.trim()) errors.push('Profile Photo is required');
    if (!profile.email?.trim()) errors.push('Email is required');
    if (!profile.phone?.trim()) errors.push('Phone number is required');
    if (!profile.city?.trim()) errors.push('City is required');
    if (!profile.state?.trim()) errors.push('State is required');
    if (!profile.country?.trim()) errors.push('Country is required');
    if (!profile.primaryCategory?.trim()) errors.push('Primary Category is required');
    if (!profile.contentTypes || profile.contentTypes.length === 0) errors.push('At least one Content Type is required');
    if (!profile.bio?.trim()) {
      errors.push('Short Bio is required');
    } else if (profile.bio.length > 300) {
      errors.push('Short Bio cannot exceed 300 characters');
    }

    // Validate Social Accounts
    const socials = await SocialAccount.find({ creatorProfileId: profile._id });
    if (!socials || socials.length === 0) {
      errors.push('At least one Social Platform is required');
    } else {
      const hasValidSocial = socials.some(s => s.platform && s.username && s.profileUrl);
      if (!hasValidSocial) {
        errors.push('Please ensure your social platform has a valid handle and profile URL');
      }
    }

    if (!profile.primaryPlatform?.trim()) {
      errors.push('Primary Platform is required');
    }

    if (!profile.accuracyConsent) {
      errors.push('You must confirm that the provided information is accurate');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors[0], errors });
    }

    // Transition status to PENDING_REVIEW
    profile.status = 'PENDING_REVIEW';
    profile.submittedAt = new Date();
    profile.isPublic = false; // Never public until approved
    await profile.save();

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
