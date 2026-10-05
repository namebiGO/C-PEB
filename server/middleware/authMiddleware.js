import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ── SECURITY: JWT_SECRET is guaranteed present by server/index.js startup check ──
const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token using the required JWT_SECRET (no fallback)
      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-passwordHash').catch(() => null);

      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authorized, user not found' });
      }

      // Keep req.admin for backward compatibility in routes that haven't been updated
      req.admin = req.user;

      next();
    } catch (error) {
      // Log the error server-side only — do not leak error details to the client
      console.error('[Auth] Token verification failed:', error.message);
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
