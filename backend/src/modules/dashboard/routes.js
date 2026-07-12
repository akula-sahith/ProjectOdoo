const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/dashboard/stats', controller.getStats);

module.exports = router;
