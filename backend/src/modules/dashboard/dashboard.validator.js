/**
 * Dashboard input validators.
 */

const validateStats = (req, res, next) => {
  // Stats endpoint does not accept parameters, so passes validation
  next();
};

module.exports = {
  validateStats
};
