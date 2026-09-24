import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      req.user = await User.findById(decoded.id).select('-passwordHash').catch(() => null);

      // Support fallback for demo creator account
      if (!req.user && decoded.id === '654321098765432109876543') {
        req.user = {
          _id: '654321098765432109876543',
          name: 'Demo Influencer',
          email: 'creator@cpeb.com',
          role: 'CREATOR'
        };
      }

      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authorized, user not found' });
      }

      // Keep req.admin for backward compatibility in routes that haven't been updated
      req.admin = req.user;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Not authorized as an admin' });
  }
};

const creator = (req, res, next) => {
  if (req.user && req.user.role === 'CREATOR') {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Not authorized as a creator' });
  }
};

export { protect, admin, creator };
