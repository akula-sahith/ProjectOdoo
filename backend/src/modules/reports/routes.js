const express = require('express');
const router = express.Router();
const controller = require('./controller');
const authMiddleware = require('../../middleware/authMiddleware');

// Secure all reports endpoints with authMiddleware
router.get('/reports/assets', authMiddleware, controller.getAssetsReport);
router.get('/reports/allocations', authMiddleware, controller.getAllocationsReport);
router.get('/reports/maintenance', authMiddleware, controller.getMaintenanceReport);
router.get('/reports/audits', authMiddleware, controller.getAuditsReport);

module.exports = router;
