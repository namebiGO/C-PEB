import express from 'express';
import CreatorProfile from '../models/CreatorProfile.js';
import Service from '../models/Service.js';
import Lead from '../models/Lead.js';
import AdvisorySubscription from '../models/AdvisorySubscription.js';
import User from '../models/User.js';
import Contact from '../models/Contact.js';
import SupportQuery from '../models/SupportQuery.js';
import bcrypt from 'bcrypt';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(admin); // Make sure only admins can access

// @route   GET /api/admin/users
// @desc    Get all users (Staff & Creators)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/admin/users
// @desc    Create a new user/admin
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash, role: role || 'CREATOR' });
    res.status(201).json({ success: true, data: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, error: 'Cannot delete yourself' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

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

    // 5. Contacts / Strategy wizard submissions
    const totalContacts = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'new' });

    // 6. Support Queries
    const openQueries = await SupportQuery.countDocuments({ status: 'OPEN' });
    const urgentQueries = await SupportQuery.countDocuments({ priority: 'URGENT', status: { $in: ['OPEN', 'IN_PROGRESS'] } });

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
        expiringAdvisoryPlans,
        totalContacts,
        newContacts,
        openQueries,
        urgentQueries,
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
  } catch (error) { console.error(error);  }
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
  } catch (error) { console.error(error);  }
});

export default router;
