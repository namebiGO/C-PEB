import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @route   POST /api/admin/login
// @desc    Auth admin & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: 'ADMIN' });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          token: generateToken(admin._id),
        },
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/admin/seed
// @desc    Seed initial admin user (Development only / One time)
router.post('/seed', async (req, res) => {
  try {
    const adminExists = await User.findOne({ email: 'admin@c-peb.com' });
    if (adminExists) {
      return res.status(400).json({ success: false, error: 'Admin already seeded' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Site Admin',
      email: 'admin@c-peb.com',
      passwordHash,
      role: 'ADMIN',
    });

    res.status(201).json({ success: true, message: 'Admin seeded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
