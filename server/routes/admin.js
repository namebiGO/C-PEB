import express from 'express';
import CreatorProfile from '../models/CreatorProfile.js';
import Service from '../models/Service.js';
import Lead from '../models/Lead.js';
import AdvisorySubscription from '../models/AdvisorySubscription.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // 1. Creators
    const totalInfluencers = await CreatorProfile.countDocuments();
    const approvedInfluencers = await CreatorProfile.countDocuments({ status: 'APPROVED' });
    const pendingApplications = await CreatorProfile.countDocuments({ status: 'PENDING_REVIEW' });
    const featuredInfluencers = await CreatorProfile.countDocuments({ featured: true });

    // 2. Services
    const totalServices = await Service.countDocuments();
    const activeServices = await Service.countDocuments({ isActive: true });

    // 3. Leads
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });

    // 4. Advisory
    const activeAdvisoryPlans = await AdvisorySubscription.countDocuments({ supportStatus: 'ACTIVE' });
    
    // Expiring Advisory Plans (expiring in next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const expiringAdvisoryPlans = await AdvisorySubscription.countDocuments({
      supportStatus: 'ACTIVE',
      endDate: { $lte: sevenDaysFromNow, $gte: new Date() }
    });

    res.json({
      success: true,
      data: {
        totalInfluencers,
        approvedInfluencers,
        pendingApplications,
        featuredInfluencers,
        totalServices,
        activeServices,
        totalLeads,
        newLeads,
        activeAdvisoryPlans,
        expiringAdvisoryPlans
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   GET /api/admin/dashboard-lists
// @desc    Get lists for dashboard (Pending Creators, Recent Leads, Active Advisory, Recent Activity)
router.get('/dashboard-lists', async (req, res) => {
  try {
    const pendingCreators = await CreatorProfile.find({ status: 'PENDING_REVIEW' })
      .sort({ submittedAt: -1, createdAt: -1 })
      .limit(5)
      .select('displayName slug primaryCategory status profileImage submittedAt');
    
    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const activeAdvisoryRequests = await AdvisorySubscription.find({ supportStatus: 'ACTIVE' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('customerName businessName planTitle supportStatus createdAt requests');
      
    // Creator Activity (recently updated)
    const recentCreatorActivity = await CreatorProfile.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('displayName slug status updatedAt');

    res.json({
      success: true,
      data: {
        pendingCreators,
        recentLeads,
        activeAdvisoryRequests,
        recentCreatorActivity
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

import SystemSetting from '../models/SystemSetting.js';

// @route   GET /api/admin/settings/:key
// @desc    Get system settings by key
router.get('/settings/:key', async (req, res) => {
  try {
    const setting = await SystemSetting.findOne({ key: req.params.key.toUpperCase() });
    res.json({ success: true, data: setting ? setting.values : [] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   PUT /api/admin/settings/:key
// @desc    Update system settings by key
router.put('/settings/:key', async (req, res) => {
  try {
    const key = req.params.key.toUpperCase();
    const { values } = req.body;
    const setting = await SystemSetting.findOneAndUpdate(
      { key },
      { key, values },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: setting.values });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
