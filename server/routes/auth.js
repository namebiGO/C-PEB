import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET; // Guaranteed present by startup check in index.js

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '7d', // Reduced from 30d — limits exposure window of stolen tokens
  });
};

// @route   POST /api/admin/auth/login
// @desc    Auth admin & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const adminUser = await User.findOne({ email: String(email).toLowerCase().trim(), role: 'ADMIN' });

    if (adminUser && (await adminUser.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          token: generateToken(adminUser._id),
        },
      });
    } else {
      // Always return 401 regardless of whether email exists (prevent user enumeration)
      res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('[Auth] Login error:', error.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// NOTE: The /seed endpoint has been REMOVED from this file.
// To create the initial admin user, run the offline script: node seed_admin.js
// This endpoint was a critical security vulnerability — publicly accessible,
// creating an admin with a hardcoded password.

export default router;
