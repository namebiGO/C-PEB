import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import AdvisorySubscription from '../models/AdvisorySubscription.js';
import Razorpay from 'razorpay';

const router = express.Router();

// GET /api/admin/payments
// Fetch all payments/transactions with pagination and optional filters
router.get('/', protect, admin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    
    const query = {};
    
    if (status && status !== 'ALL') {
      query.paymentStatus = status;
    }

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
        { razorpayPaymentId: { $regex: search, $options: 'i' } }
      ];
    }

    const subscriptions = await AdvisorySubscription.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    const total = await AdvisorySubscription.countDocuments(query);

    // Map subscriptions to a unified "transaction" shape
    const transactions = subscriptions.map(sub => ({
      _id: sub._id,
      transactionId: sub.razorpayPaymentId || sub.orderId,
      customer: {
        name: sub.customerName,
        email: sub.email,
        company: sub.businessName
      },
      item: sub.planTitle,
      amount: sub.amount,
      status: sub.paymentStatus,
      method: sub.paymentMethod || 'Razorpay',
      date: sub.createdAt
    }));

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Fetch payments error:', error);
    res.status(500).json({ success: false, error: 'Server error fetching payments' });
  }
});

// GET /api/admin/payments/stats
// Get high-level revenue stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const subscriptions = await AdvisorySubscription.find({ paymentStatus: 'PAID' });
    
    const totalRevenue = subscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0);
    const successfulTransactions = subscriptions.length;
    
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSubscriptions = subscriptions.filter(s => s.createdAt >= thirtyDaysAgo);
    const recentRevenue = recentSubscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0);

    const pendingCount = await AdvisorySubscription.countDocuments({ paymentStatus: 'PENDING' });
    const failedCount = await AdvisorySubscription.countDocuments({ paymentStatus: 'FAILED' });

    res.json({
      success: true,
      data: {
        totalRevenue,
        recentRevenue,
        successfulTransactions,
        pendingTransactions: pendingCount,
        failedTransactions: failedCount
      }
    });
  } catch (error) {
    console.error('Fetch payment stats error:', error);
    res.status(500).json({ success: false, error: 'Server error fetching payment stats' });
  }
});

// GET /api/admin/payments/razorpay
// Fetch real transactions directly from the Razorpay API
router.get('/razorpay', protect, admin, async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { count = 50, skip = 0 } = req.query;

    const payments = await razorpay.payments.all({
      count: parseInt(count),
      skip: parseInt(skip)
    });

    // Transform to standard format
    const transactions = payments.items.map(p => ({
      _id: p.id,
      transactionId: p.id,
      orderId: p.order_id,
      customer: {
        name: p.notes?.name || p.email?.split('@')[0] || 'Unknown',
        email: p.email,
        phone: p.contact
      },
      item: p.description || 'Razorpay Checkout',
      amount: p.amount / 100, // Convert paise to INR
      status: p.status === 'captured' ? 'PAID' : p.status === 'failed' ? 'FAILED' : 'PENDING',
      method: p.method,
      date: new Date(p.created_at * 1000)
    }));

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Razorpay fetch error:', error);
    res.status(500).json({ success: false, error: 'Server error fetching Razorpay data' });
  }
});

export default router;
