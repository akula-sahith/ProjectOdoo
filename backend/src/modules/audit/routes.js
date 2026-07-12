const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Cycle Routes
router.post('/audit/cycles', controller.createCycle);
router.get('/audit/cycles', controller.getCycles);
router.get('/audit/cycles/:id', controller.getCycleById);

// Record Routes
router.post('/audit/records', controller.createRecord);
router.get('/audit/records', controller.getRecords);

module.exports = router;
