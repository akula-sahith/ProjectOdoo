/**
 * Centralized global error handler.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Handle Prisma Unique Constraint Violations
  if (err.code === 'P2002') {
    statusCode = 409;
    const targetFields = err.meta?.target || [];
    message = `A record with this ${targetFields.join(', ')} already exists.`;
  }

  // Log the error in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorHandler;
