const express = require('express');
const router = express.Router();

const organizationRoutes = require('./organization/routes');
const assetsRoutes = require('./assets/routes');
const allocationRoutes = require('./allocation/routes');
const transferRoutes = require('./transfer/routes');
const bookingRoutes = require('./booking/routes');
const maintenanceRoutes = require('./maintenance/routes');
const auditRoutes = require('./audit/routes');
const dashboardRoutes = require('./dashboard/dashboard.routes');
const notificationsRoutes = require('./notifications/routes');
const reportsRoutes = require('./reports/routes');

// Mount all modular business routes
router.use(organizationRoutes);
router.use(assetsRoutes);
router.use(allocationRoutes);
router.use(transferRoutes);
router.use(bookingRoutes);
router.use(maintenanceRoutes);
router.use(auditRoutes);
router.use(dashboardRoutes);
router.use(notificationsRoutes);
router.use(reportsRoutes);

module.exports = router;
