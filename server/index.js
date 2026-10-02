import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables from the server folder's .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import connectDB from './config/db.js';
import contactRouter from './routes/contact.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import influencersRouter from './routes/influencers.js';
import servicesRouter from './routes/services.js';
import leadsRouter from './routes/leads.js';
import publicRouter from './routes/public.js';

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

// ── Connect to MongoDB ──────────────────────────
connectDB();

// ── App setup ──────────────────────────────────
const app = express();
const server = http.createServer(app);

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174').split(',');

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Inject io into request object so routes can use it
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Secure HTTP headers (disabled upgrade-insecure-requests so HTTP testing works without SSL timeout)
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "upgrade-insecure-requests": null,
      // Allow Razorpay checkout script to load
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://checkout.razorpay.com"],
      // Allow Razorpay iframe (checkout modal)
      "frame-src": ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
      // Allow API calls to Razorpay servers
      "connect-src": ["'self'", "https://checkout.razorpay.com", "https://api.razorpay.com", "https://lumberjack.razorpay.com"],
      // Allow Razorpay-hosted images (e.g. merchant logos in modal)
      "img-src": ["'self'", "data:", "https:"],
    },
  },
}));
app.use(compression());

// CORS — allow the Vite dev server (and any configured origin)
app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin, or any localhost origin for dev
      if (!origin || origin.startsWith('http://localhost')) return cb(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg = 'CORS: origin ' + origin + ' not allowed';
        return cb(new Error(msg), false);
      }
      return cb(null, true);
    },
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Routes ─────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

app.use('/api/contact', contactRouter);
app.use('/api/admin/auth', authRouter);
app.use('/api/admin/influencers', influencersRouter);
app.use('/api/admin/services', servicesRouter);
app.use('/api/admin/leads', leadsRouter);
app.use('/api/admin/creators', adminCreatorsRouter);
app.use('/api/admin', adminRouter); // for /stats

app.use('/api/creators/auth', creatorAuthRouter);
app.use('/api/creators/profile', creatorProfileRouter);
app.use('/api/creators', creatorApplyRouter);
app.use('/api/advisory', advisoryRouter);
app.use('/api/homepage', homepageRouter);

app.use('/api/public/creators', publicCreatorsRouter);
app.use('/api/public', publicRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/queries', queriesRouter);
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
});
