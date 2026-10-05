/**
 * Central error-handling middleware for Express.
 * Catches anything passed via next(err).
 *
 * SECURITY: In production, only a generic message is returned to the client.
 * Full error details are always logged server-side.
 */
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const errorHandler = (err, req, res, _next) => {
  // Always log the full error server-side (never exposed to client in production)
  console.error(`[ErrorHandler] ${req.method} ${req.originalUrl} →`, err.message);
  if (!IS_PRODUCTION) {
    console.error(err.stack);
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, error: messages.join(', ') });
  }

  // Mongoose duplicate key (unique index violation)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res
      .status(409)
      .json({ success: false, error: `Duplicate value for field: ${field}` });
  }

  // JWT errors — unified message (never leak token details)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, error: 'Not authorized, invalid or expired token' });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // In production: hide internal error message from clients
  const clientMessage = IS_PRODUCTION
    ? statusCode >= 500
      ? 'Internal Server Error'
      : (err.message || 'Request failed')
    : (err.message || 'Internal Server Error');

  res.status(statusCode).json({
    success: false,
    error: clientMessage,
  });
};

export default errorHandler;
