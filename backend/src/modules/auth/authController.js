const authService = require('./authService');
const { sendSuccess } = require('../../utils/responseHelpers');

/**
 * Handle user registration request.
 */
const register = async (req, res) => {
  const result = await authService.registerUser(req.body);
  return sendSuccess(res, result, 'User registered successfully', 201);
};

/**
 * Handle user login request.
 */
const login = async (req, res) => {
  const result = await authService.loginUser(req.body);
  return sendSuccess(res, result, 'Login successful', 200);
};

module.exports = {
  register,
  login
};
