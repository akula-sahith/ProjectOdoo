const prisma = require('../../config/db');
const bookingRepository = require('../../repositories/bookingRepository');
const assetRepository = require('../../repositories/assetRepository');
const activityLogRepository = require('../../repositories/activityLogRepository');

const createBooking = async (data) => {
  const assetId = Number(data.asset_id);
  const employeeId = Number(data.employee_id);
  const deptId = data.department_id ? Number(data.department_id) : null;
  const startTime = new Date(data.start_time);
  const endTime = new Date(data.end_time);

  // 1. Verify asset exists and is bookable
  const asset = await assetRepository.findById(assetId);
  if (!asset) {
    throw new Error('Asset not found');
  }

  if (!asset.is_bookable) {
    throw new Error('This asset is not flagged as bookable');
  }

  // 2. Check for overlapping bookings
  const overlappingBooking = await bookingRepository.findFirst({
    asset_id: assetId,
    status: { not: 'CANCELLED' },
    start_time: { lt: endTime },
    end_time: { gt: startTime },
  });

  if (overlappingBooking) {
    throw new Error('The asset is already booked during this time range');
  }

  // 3. Create the booking
  return await bookingRepository.create({
    asset_id: assetId,
    employee_id: employeeId,
    department_id: deptId,
    start_time: startTime,
    end_time: endTime,
    status: 'UPCOMING',
  });
};

const getBookings = async (filters = {}) => {
  const where = {};
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.asset_id) {
    where.asset_id = Number(filters.asset_id);
  }
  if (filters.employee_id) {
    where.employee_id = Number(filters.employee_id);
  }

  return await bookingRepository.findMany(where);
};

const getBookingById = async (id) => {
  return await bookingRepository.findById(id);
};

const cancelBooking = async (id, cancelledByUserId) => {
  const booking = await bookingRepository.findById(id);
  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.status === 'CANCELLED') {
    throw new Error('Booking is already cancelled');
  }

  return await prisma.$transaction(async (tx) => {
    const updated = await bookingRepository.update(id, {
      status: 'CANCELLED'
    }, tx);

    // Write to Activity Log
    await activityLogRepository.create({
      user_id: cancelledByUserId || null,
      action: `Booking for asset '${booking.asset.asset_name}' was cancelled`,
      module: 'BOOKING',
      entity_id: booking.asset_id,
      new_value: { booking_id: booking.booking_id },
    }, tx);

    return updated;
  });
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
};
