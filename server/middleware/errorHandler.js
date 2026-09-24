/**
 * Central error-handling middleware for Express.
 * Catches anything passed via next(err).
 */
const errorHandler = (err, req, res, _next) => {
  console.error(`[ErrorHandler] ${req.method} ${req.originalUrl} →`, err.message);

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, error: messages.join(', ') });
  }

  // Mongoose duplicate key (unique index violation)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res
      .status(409)
      .json({ success: false, error: `Duplicate value for field: ${field}` });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
