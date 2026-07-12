const prisma = require('../config/db');

/**
 * Find maintenance request by ID.
 */
const findById = async (id, tx = prisma) => {
  return tx.maintenanceRequest.findUnique({
    where: { maintenance_id: Number(id) },
    include: {
      asset: true,
      raisedByUser: true,
      approvedByUser: true
    }
  });
};

/**
 * Find all maintenance requests matching filters.
 */
const findMany = async (where, tx = prisma) => {
  return tx.maintenanceRequest.findMany({
    where,
    include: {
      asset: true,
      raisedByUser: {
        select: {
          user_id: true,
          full_name: true,
          employee_code: true
        }
      },
      approvedByUser: {
        select: {
          user_id: true,
          full_name: true
        }
      }
    },
    orderBy: {
      maintenance_id: 'desc'
    }
  });
};

/**
 * Create a new maintenance request.
 */
const create = async (data, tx = prisma) => {
  return tx.maintenanceRequest.create({
    data,
    include: {
      asset: true,
      raisedByUser: true
    }
  });
};

/**
 * Update maintenance request.
 */
const update = async (id, data, tx = prisma) => {
  return tx.maintenanceRequest.update({
    where: { maintenance_id: Number(id) },
    data,
    include: {
      asset: true,
      raisedByUser: true,
      approvedByUser: true
    }
  });
};

/**
 * Count maintenance requests matching criteria.
 */
const count = async (where = {}, tx = prisma) => {
  return tx.maintenanceRequest.count({ where });
};

module.exports = {
  findById,
  findMany,
  create,
  update,
  count
};
