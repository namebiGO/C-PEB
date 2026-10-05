import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET; // Guaranteed present by startup check in index.js
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '7d', // Reduced from 30d — limits exposure window of stolen tokens
  });
};

// @route   POST /api/creators/auth/register
// @desc    Register a new creator
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide all fields' });
    }

    // Enforce minimum password length
    if (String(password).length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters.' });
    }

    const userExists = await User.findOne({ email: String(email).toLowerCase().trim() });

    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: String(name).trim().slice(0, 100),
      email: String(email).toLowerCase().trim(),
      passwordHash,
      role: 'CREATOR',
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error('[CreatorAuth] Register error:', error.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/creators/auth/login
// @desc    Auth creator & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    // SECURITY: Hardcoded demo account bypass is only available in non-production environments.
    // In production this block is completely skipped — it MUST NOT exist as a backdoor.
    if (!IS_PRODUCTION && email?.toLowerCase() === 'creator@cpeb.com' && password === 'password123') {
      const demoId = '654321098765432109876543';
      return res.json({
        success: true,
        data: {
          _id: demoId,
          name: 'Demo Influencer',
          email: 'creator@cpeb.com',
          role: 'CREATOR',
          token: generateToken(demoId),
        },
      });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim(), role: 'CREATOR' }).catch(() => null);

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    } else {
      // Always return 401 regardless of whether email exists (prevent user enumeration)
      res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('[CreatorAuth] Login error:', error.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
