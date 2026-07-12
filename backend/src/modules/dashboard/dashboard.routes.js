const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const dashboardValidator = require('./dashboard.validator');

// Get dashboard stats (Secured with JWT auth)
router.get('/dashboard/stats', authMiddleware, dashboardValidator.validateStats, dashboardController.getStats);

module.exports = router;
