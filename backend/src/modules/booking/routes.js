const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/bookings', controller.createBooking);
router.get('/bookings', controller.getBookings);
router.get('/bookings/:id', controller.getBookingById);
router.put('/bookings/:id/cancel', controller.cancelBooking);

module.exports = router;
