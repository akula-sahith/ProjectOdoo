const prisma = require('../config/db');

/**
 * Find first booking matching a condition.
 */
const findFirst = async (where, tx = prisma) => {
  return tx.resourceBooking.findFirst({ where });
};

/**
 * Find all bookings matching filters.
 */
const findMany = async (where, tx = prisma) => {
  return tx.resourceBooking.findMany({
    where,
    include: {
      asset: true,
      employee: true,
      department: true
    },
    orderBy: {
      start_time: 'asc'
    }
  });
};

/**
 * Find booking by ID.
 */
const findById = async (id, tx = prisma) => {
  return tx.resourceBooking.findUnique({
    where: { booking_id: Number(id) },
    include: {
      asset: true,
      employee: true,
      department: true
    }
  });
};

/**
 * Create a new booking.
 */
const create = async (data, tx = prisma) => {
  return tx.resourceBooking.create({
    data,
    include: {
      asset: true,
      employee: true,
      department: true
    }
  });
};

/**
 * Update a booking.
 */
const update = async (id, data, tx = prisma) => {
  return tx.resourceBooking.update({
    where: { booking_id: Number(id) },
    data,
    include: {
      asset: true,
      employee: true
    }
  });
};

/**
 * Count bookings matching criteria.
 */
const count = async (where = {}, tx = prisma) => {
  return tx.resourceBooking.count({ where });
};

module.exports = {
  findFirst,
  findMany,
  findById,
  create,
  update,
  count
};
