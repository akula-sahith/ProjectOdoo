const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/maintenance', controller.createRequest);
router.get('/maintenance', controller.getRequests);
router.get('/maintenance/:id', controller.getRequestById);
router.put('/maintenance/:id/status', controller.updateRequestStatus);

module.exports = router;
