/**
 * Helper to send successful JSON responses.
 * @param {Object} res - Express response object
 * @param {Object|Array} data - Data to send in the response
 * @param {string} message - Message to describe the outcome
 * @param {number} statusCode - HTTP status code
 */
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Helper to send error JSON responses.
 * @param {Object} res - Express response object
 * @param {string} message - Error description
 * @param {number} statusCode - HTTP status code
 * @param {Object|Array|null} errors - Detailed errors (e.g. validation errors)
 */
const sendError = (res, message = 'Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};

module.exports = {
  sendSuccess,
  sendError
};
