const service = require('./service');
const validator = require('./validator');
const { sendSuccess, sendError } = require('../../utils/responseHelpers');

const createBooking = async (req, res, next) => {
  try {
    const valErrors = validator.validateBooking(req.body);
    if (valErrors) {
      return sendError(res, 'Validation error', 400, valErrors);
    }
    // Inject employee_id if present in req.user
    if (req.user && req.user.user_id) {
      req.body.employee_id = req.user.user_id;
    }
    const booking = await service.createBooking(req.body);
    return sendSuccess(res, booking, 'Booking created successfully', 201);
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('not flagged') || error.message.includes('already booked') || error.message.includes('overlapping')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const bookings = await service.getBookings(req.query);
    return sendSuccess(res, bookings, 'Bookings retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await service.getBookingById(req.params.id);
    if (!booking) {
      return sendError(res, 'Booking not found', 404);
    }
    return sendSuccess(res, booking, 'Booking retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const cancelledByUserId = req.user ? req.user.user_id : null;
    const booking = await service.cancelBooking(req.params.id, cancelledByUserId);
    return sendSuccess(res, booking, 'Booking cancelled successfully', 200);
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('already cancelled')) {
      return sendError(res, error.message, 400);
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
