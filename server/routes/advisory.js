import express from 'express';
import AdvisorySubscription from '../models/AdvisorySubscription.js';
import AdvisoryPlan from '../models/AdvisoryPlan.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─────────────────────────────────────────────────────────────
// PUBLIC ENDPOINTS
// ─────────────────────────────────────────────────────────────

// @route   POST /api/advisory/subscribe
// @desc    Purchase / register an advisory subscription
// @access  Public
router.post('/subscribe', async (req, res) => {
  try {
    const { customerName, email, phone, businessName, requirement, plan } = req.body;

    if (!customerName || !email || !phone || !businessName || !requirement || !plan) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: name, email, phone, business name, requirement, and plan.'
      });
    }

    if (!['ONE_MONTH', 'THREE_MONTHS'].includes(plan)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan selected. Must be ONE_MONTH or THREE_MONTHS.'
      });
    }

    const isThreeMonths = plan === 'THREE_MONTHS';
    const amount = isThreeMonths ? 5999 : 2499;
    const duration = isThreeMonths ? '3 Months' : '1 Month';
    const planTitle = isThreeMonths
      ? 'Ongoing Advisory (3 Months)'
      : 'Starter Advisory (1 Month)';

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + (isThreeMonths ? 90 : 30) * 24 * 60 * 60 * 1000);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `CPEB-ADV-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`;

    const subscription = new AdvisorySubscription({
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      businessName: businessName.trim(),
      requirement: requirement.trim(),
      plan,
      planTitle,
      amount,
      duration,
      startDate,
      endDate,
      paymentStatus: req.body.paymentStatus || 'PENDING',
      paymentMethod: req.body.paymentMethod || 'Razorpay Payment Page',
      orderId,
      prioritySupport: true,
      supportStatus: req.body.paymentStatus === 'PAID' ? 'ACTIVE' : 'PENDING_PAYMENT',
      requests: [
        {
          subject: `Initial Advisory Intake: ${businessName.trim()}`,
          requirement: requirement.trim(),
          status: 'OPEN',
          prioritySupport: true,
          createdAt: new Date()
        }
      ]
    });

    await subscription.save();

    if (req.io) {
      req.io.emit('advisory:new_subscription', {
        id: subscription._id,
        orderId: subscription.orderId,
        customerName: subscription.customerName,
        plan: subscription.planTitle,
        amount: subscription.amount,
        createdAt: subscription.createdAt
      });
    }

    res.status(201).json({
      success: true,
      message: 'Your advisory plan has been successfully activated.',
      data: subscription
    });
  } catch (error) {
    console.error('Error creating advisory subscription:', error);
    res.status(500).json({ success: false, error: error.message || 'Server Error' });
  }
});

// @route   GET /api/advisory/order/:orderId
// @desc    Retrieve active subscription details by orderId or email
// @access  Public
router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    let subscription = await AdvisorySubscription.findOne({
      orderId: { $regex: new RegExp(`^${orderId.trim()}$`, 'i') }
    });

    if (!subscription) {
      // Allow lookup by email as fallback
      subscription = await AdvisorySubscription.findOne({
        email: orderId.trim().toLowerCase()
      }).sort({ createdAt: -1 });
    }

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'No active advisory subscription found with this reference.'
      });
    }

    subscription.updateStatusBasedOnDate();
    await subscription.save();

    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Error fetching subscription by orderId:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/advisory/order/:orderId/confirm-payment
// @desc    Mark subscription as paid after Razorpay payment
// @access  Public
router.post('/order/:orderId/confirm-payment', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentId } = req.body;

    let subscription = await AdvisorySubscription.findOne({
      orderId: { $regex: new RegExp(`^${orderId.trim()}$`, 'i') }
    });

    if (!subscription) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    subscription.paymentStatus = 'PAID';
    subscription.supportStatus = 'ACTIVE';
    if (paymentId) {
      subscription.paymentMethod = `Razorpay (${paymentId})`;
    }
    await subscription.save();

    if (req.io) {
      req.io.emit('advisory:payment_confirmed', {
        id: subscription._id,
        orderId: subscription.orderId,
        customerName: subscription.customerName,
        amount: subscription.amount
      });
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully.',
      data: subscription
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/advisory/subscription/:id/requests
// @desc    Submit a new priority support request for an active plan
// @access  Public
router.post('/subscription/:id/requests', async (req, res) => {
  try {
    const { subject, requirement } = req.body;

    if (!subject || !requirement) {
      return res.status(400).json({
        success: false,
        error: 'Subject and requirement details are required.'
      });
    }

    const subscription = await AdvisorySubscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    }

    subscription.updateStatusBasedOnDate();

    const newRequest = {
      subject: subject.trim(),
      requirement: requirement.trim(),
      status: 'OPEN',
      prioritySupport: subscription.prioritySupport,
      createdAt: new Date(),
      replies: []
    };

    subscription.requests.unshift(newRequest);
    await subscription.save();

    if (req.io) {
      req.io.emit('advisory:new_request', {
        subscriptionId: subscription._id,
        orderId: subscription.orderId,
        customerName: subscription.customerName,
        subject: newRequest.subject,
        createdAt: newRequest.createdAt
      });
    }

    res.status(201).json({
      success: true,
      message: 'Support request submitted with priority handling.',
      data: subscription
    });
  } catch (error) {
    console.error('Error submitting support request:', error);
    res.status(500).json({ success: false, error: error.message || 'Server Error' });
  }
});

// ─────────────────────────────────────────────────────────────
// ADMIN ENDPOINTS
// ─────────────────────────────────────────────────────────────

// @route   GET /api/advisory/admin/subscriptions
// @desc    List all advisory subscriptions with metrics & filters
// @access  Private (Admin)
router.get('/admin/subscriptions', protect, async (req, res) => {
  try {
    const { filter = 'all' } = req.query;

    const allSubscriptions = await AdvisorySubscription.find().sort({ createdAt: -1 });

    // Update statuses for all
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let activeCount = 0;
    let expiringSoonCount = 0;
    let newPurchasesCount = 0;
    let openRequestsCount = 0;
    let totalRevenue = 0;

    allSubscriptions.forEach(sub => {
      sub.updateStatusBasedOnDate();
      if (sub.supportStatus === 'ACTIVE') activeCount++;
      if (sub.supportStatus === 'EXPIRING_SOON') expiringSoonCount++;
      if (sub.createdAt >= sevenDaysAgo) newPurchasesCount++;
      if (sub.paymentStatus === 'PAID') totalRevenue += sub.amount;

      if (sub.requests && sub.requests.length) {
        sub.requests.forEach(r => {
          if (['OPEN', 'IN REVIEW'].includes(r.status)) openRequestsCount++;
        });
      }
    });

    let filtered = allSubscriptions;
    if (filter === 'active') {
      filtered = allSubscriptions.filter(s => s.supportStatus === 'ACTIVE');
    } else if (filter === 'expiring') {
      filtered = allSubscriptions.filter(s => s.supportStatus === 'EXPIRING_SOON');
    } else if (filter === 'new') {
      filtered = allSubscriptions.filter(s => s.createdAt >= sevenDaysAgo);
    } else if (filter === 'requests') {
      filtered = allSubscriptions.filter(s => s.requests && s.requests.some(r => ['OPEN', 'IN REVIEW'].includes(r.status)));
    }

    res.json({
      success: true,
      stats: {
        totalPlans: allSubscriptions.length,
        activePlans: activeCount,
        expiringSoon: expiringSoonCount,
        newPurchases: newPurchasesCount,
        openRequests: openRequestsCount,
        totalRevenue
      },
      data: filtered
    });
  } catch (error) {
    console.error('Error fetching admin advisory subscriptions:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   GET /api/advisory/admin/subscriptions/:id
// @desc    Get detailed subscription record
// @access  Private (Admin)
router.get('/admin/subscriptions/:id', protect, async (req, res) => {
  try {
    const subscription = await AdvisorySubscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    }
    subscription.updateStatusBasedOnDate();
    await subscription.save();

    res.json({ success: true, data: subscription });
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   PATCH /api/advisory/admin/subscriptions/:id
// @desc    Update status or private admin notes
// @access  Private (Admin)
router.patch('/admin/subscriptions/:id', protect, async (req, res) => {
  try {
    const { supportStatus, adminNotes, paymentStatus } = req.body;
    const subscription = await AdvisorySubscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    }

    if (supportStatus) subscription.supportStatus = supportStatus;
    if (adminNotes !== undefined) subscription.adminNotes = adminNotes;
    if (paymentStatus) subscription.paymentStatus = paymentStatus;

    await subscription.save();
    res.json({ success: true, data: subscription });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   PATCH /api/advisory/admin/subscriptions/:id/requests/:reqId
// @desc    Reply to a support request, change status, or add notes
// @access  Private (Admin)
router.patch('/admin/subscriptions/:id/requests/:reqId', protect, async (req, res) => {
  try {
    const { status, replyMessage, adminNotes } = req.body;
    const subscription = await AdvisorySubscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    }

    const requestItem = subscription.requests.id(req.params.reqId);
    if (!requestItem) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    if (status) {
      if (!['OPEN', 'IN REVIEW', 'RESOLVED', 'CLOSED'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status value' });
      }
      requestItem.status = status;
    }

    if (adminNotes !== undefined) {
      requestItem.adminNotes = adminNotes;
    }

    if (replyMessage && replyMessage.trim()) {
      requestItem.replies.push({
        sender: 'ADMIN',
        message: replyMessage.trim(),
        createdAt: new Date()
      });
    }

    await subscription.save();
    res.json({ success: true, data: subscription });
  } catch (error) {
    console.error('Error updating support request:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   GET /api/advisory/admin/plans
// @desc    Get all advisory plans
router.get('/admin/plans', protect, async (req, res) => {
  try {
    const plans = await AdvisoryPlan.find().sort({ displayOrder: 1 });
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/advisory/admin/plans
// @desc    Create a new advisory plan
router.post('/admin/plans', protect, async (req, res) => {
  try {
    const plan = await AdvisoryPlan.create(req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/advisory/admin/plans/:id
// @desc    Update an advisory plan
router.put('/admin/plans/:id', protect, async (req, res) => {
  try {
    const plan = await AdvisoryPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ success: false, error: 'Plan not found' });
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/advisory/admin/plans/:id
// @desc    Delete an advisory plan
router.delete('/admin/plans/:id', protect, async (req, res) => {
  try {
    await AdvisoryPlan.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
