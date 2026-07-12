const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/reports/assets', controller.getAssetsReport);
router.get('/reports/allocations', controller.getAllocationsReport);
router.get('/reports/maintenance', controller.getMaintenanceReport);

module.exports = router;
