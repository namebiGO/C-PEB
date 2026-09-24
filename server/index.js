import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
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

// Secure HTTP headers
app.use(helmet());

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

// 404 handler — catches unknown API routes
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Central error handler (must be last)
app.use(errorHandler);

// ── Start server ───────────────────────────────
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 C-PEB API & Socket.io running on http://localhost:${PORT}`);
});
