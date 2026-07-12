const service = require('./service');
const validator = require('./validator');

const createBooking = async (req, res, next) => {
  try {
    const valErrors = validator.validateBooking(req.body);
    if (valErrors) {
      return res.status(400).json({ success: false, errors: valErrors });
    }
    // Inject employee_id if present in req.user
    if (req.user && req.user.user_id) {
      req.body.employee_id = req.user.user_id;
    }
    const booking = await service.createBooking(req.body);
    return res.status(201).json({ success: true, data: booking });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('not flagged') || error.message.includes('already booked') || error.message.includes('overlapping')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const bookings = await service.getBookings(req.query);
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await service.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const cancelledByUserId = req.user ? req.user.user_id : null;
    const booking = await service.cancelBooking(req.params.id, cancelledByUserId);
    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('already cancelled')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
};
