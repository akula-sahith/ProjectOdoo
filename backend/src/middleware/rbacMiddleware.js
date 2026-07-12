/**
 * Middleware to restrict access based on user roles.
 * @param {...string} allowedRoles - List of roles permitted to access the route
 * @returns {Function} Express middleware function
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role.role_name)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Insufficient permissions'
      });
    }
    next();
  };
};

module.exports = authorizeRoles;
