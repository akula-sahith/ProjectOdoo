const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/allocations', controller.createAllocation);
router.get('/allocations', controller.getAllocations);
router.get('/allocations/:id', controller.getAllocationById);
router.put('/allocations/:id/return', controller.returnAsset);

module.exports = router;
