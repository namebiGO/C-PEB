import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables from the server folder's .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// ── SECURITY: Fail hard if critical env vars are missing ───────
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET environment variable is not set. Server cannot start.');
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error('❌ FATAL: MONGO_URI environment variable is not set. Server cannot start.');
  process.exit(1);
}

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import contactRouter from './routes/contact.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import influencersRouter from './routes/influencers.js';
import servicesRouter from './routes/services.js';
import leadsRouter from './routes/leads.js';
import publicRouter from './routes/public.js';
import adminPaymentsRouter from './routes/adminPayments.js';

import creatorAuthRouter from './routes/creatorAuth.js';
import creatorProfileRouter from './routes/creatorProfile.js';
import creatorApplyRouter from './routes/creatorApply.js';
import publicCreatorsRouter from './routes/publicCreators.js';
import adminCreatorsRouter from './routes/adminCreators.js';
import advisoryRouter from './routes/advisory.js';
import homepageRouter from './routes/homepage.js';
import analyticsRouter from './routes/analytics.js';
import queriesRouter from './routes/queries.js';
import activityRouter from './routes/activity.js';
import errorHandler from './middleware/errorHandler.js';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ── Connect to MongoDB ──────────────────────────
connectDB();

// ── App setup ──────────────────────────────────
const app = express();
const server = http.createServer(app);

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174').split(',').map(o => o.trim());

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Inject io into request object so routes can use it
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ── Secure HTTP headers ────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      // Re-enabled in production: HTTP requests auto-upgrade to HTTPS
      "upgrade-insecure-requests": IS_PRODUCTION ? [] : null,
      // Allow Razorpay checkout script to load (unsafe-inline/eval required by Razorpay SDK)
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://checkout.razorpay.com"],
      // Allow Razorpay iframe (checkout modal)
      "frame-src": ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
      // Allow API calls to Razorpay and own backend only
      "connect-src": ["'self'", "https://checkout.razorpay.com", "https://api.razorpay.com", "https://lumberjack.razorpay.com"],
      // Allow images from self and HTTPS sources only
      "img-src": ["'self'", "data:", "https:"],
      // Restrict form actions to self
      "form-action": ["'self'"],
      // Prevent base tag injection
      "base-uri": ["'self'"],
    },
  },
  // Ensure X-Powered-By is hidden
  hidePoweredBy: true,
}));

app.use(compression());

// ── Rate Limiting ──────────────────────────────

// Global rate limiter — broad protection for all API endpoints
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});

// Strict rate limiter for authentication endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many login attempts. Please wait 15 minutes before trying again.' },
  skipSuccessfulRequests: false,
});

// Moderate rate limiter for public-facing form submissions (spam prevention)
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many form submissions. Please try again in an hour.' },
});

// Apply global limiter to all /api routes
app.use('/api', globalLimiter);

// ── CORS — Strict production / relaxed dev ─────
app.use(
  cors({
    origin: (origin, cb) => {
      // In production: never allow missing origin or any localhost
      if (IS_PRODUCTION) {
        if (!origin) return cb(new Error('CORS: missing origin not allowed in production'), false);
        if (allowedOrigins.indexOf(origin) === -1) {
          return cb(new Error('CORS: origin ' + origin + ' not allowed'), false);
        }
        return cb(null, true);
      }

      // In development: allow requests with no origin (Postman, curl, etc.) or any localhost origin
      if (!origin || origin.startsWith('http://localhost')) return cb(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return cb(new Error('CORS: origin ' + origin + ' not allowed'), false);
      }
      return cb(null, true);
    },
    credentials: true,
  })
);

// ── Body parsing — with size limits to prevent DoS ──
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));

// ── Routes ─────────────────────────────────────

// Health check — minimal info disclosure in production
app.get('/api/health', (_req, res) => {
  if (IS_PRODUCTION) {
    return res.json({ status: 'ok' });
  }
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes — apply strict rate limiting
app.use('/api/admin/auth', authLimiter, authRouter);
app.use('/api/creators/auth', authLimiter, creatorAuthRouter);

// Public form submission routes — apply form rate limiting
app.use('/api/contact', formLimiter, contactRouter);
app.use('/api/queries', formLimiter, queriesRouter);

// Admin routes
app.use('/api/admin/influencers', influencersRouter);
app.use('/api/admin/services', servicesRouter);
app.use('/api/admin/leads', leadsRouter);
app.use('/api/admin/creators', adminCreatorsRouter);
app.use('/api/admin/payments', adminPaymentsRouter);
app.use('/api/admin', adminRouter);

// Creator routes
app.use('/api/creators/profile', creatorProfileRouter);
app.use('/api/creators', creatorApplyRouter);

// Public routes
app.use('/api/advisory', advisoryRouter);
app.use('/api/homepage', homepageRouter);
app.use('/api/public/creators', publicCreatorsRouter);
app.use('/api/public', publicRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/activity', activityRouter);

// 404 handler — catches unknown API routes
app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, error: 'API Route not found' });
});

// ── Serve Frontend ─────────────────────────────
// Serve static files from the React app build directory
const frontendPath = path.join(__dirname, '../dist');
app.use(express.static(frontendPath));

// For any other route, send back the React index.html file (React Router)
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Central error handler (must be last)
app.use(errorHandler);

// ── Start server ───────────────────────────────
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 C-PEB API & Socket.io running on http://localhost:${PORT}`);
  if (!IS_PRODUCTION) {
    console.log('⚠️  Running in DEVELOPMENT mode — production security restrictions relaxed');
  }
});
