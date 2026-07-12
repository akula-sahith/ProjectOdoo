const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/transfers', controller.createTransfer);
router.get('/transfers', controller.getTransfers);
router.get('/transfers/:id', controller.getTransferById);
router.put('/transfers/:id/approve', controller.approveTransfer);
router.put('/transfers/:id/reject', controller.rejectTransfer);
router.put('/transfers/:id/complete', controller.completeTransfer);

module.exports = router;
