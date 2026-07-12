const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/notifications', controller.getNotifications);
router.put('/notifications/:id/read', controller.markAsRead);

module.exports = router;
