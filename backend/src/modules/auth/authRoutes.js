const express = require('express');
const authController = require('./authController');
const { validateRegister, validateLogin } = require('../../validators/authValidator');
const asyncHandler = require('../../middleware/asyncHandler');

const router = express.Router();

// Public routes for Authentication
router.post('/register', validateRegister, asyncHandler(authController.register));
router.post('/login', validateLogin, asyncHandler(authController.login));

module.exports = router;
