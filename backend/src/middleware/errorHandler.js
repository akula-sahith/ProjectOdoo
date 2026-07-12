/**
 * Centralized global error handler.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Handle Prisma Specific Errors
  if (err.code) {
    switch (err.code) {
      case 'P2002': {
        statusCode = 409;
        const targetFields = err.meta?.target || [];
        message = `Unique constraint failed. A record with this ${targetFields.join(', ')} already exists.`;
        break;
      }
      case 'P2003': {
        statusCode = 400;
        message = `Foreign key constraint failed on reference field: ${err.meta?.field_name || 'relation'}.`;
        break;
      }
      case 'P2025': {
        statusCode = 404;
        message = err.meta?.cause || 'Requested record was not found.';
        break;
      }
      default:
        break;
    }
  }

  // Handle express validation error arrays if any
  if (Array.isArray(err.errors)) {
    statusCode = 400;
    errors = err.errors;
  }

  // Log the error in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Error Pipeline]:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorHandler;
