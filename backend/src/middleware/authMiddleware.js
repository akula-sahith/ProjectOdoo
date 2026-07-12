const { verifyAccessToken } = require('../utils/jwtUtils');
const userRepository = require('../repositories/userRepository');

/**
 * Authentication middleware to verify JWT access tokens and attach user to the request.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied: No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Access denied: Invalid or expired token'
      });
    }

    // Fetch the user from the database to check status and load role details
    const user = await userRepository.findById(decoded.user_id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied: User no longer exists'
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(401).json({
        success: false,
        message: 'Access denied: Account is inactive'
      });
    }

    // Attach user (with role) to req
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
