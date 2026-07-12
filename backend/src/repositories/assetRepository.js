const prisma = require('../config/db');

/**
 * Create a new asset.
 */
const create = async (data) => {
  return prisma.asset.create({
    data,
    include: {
      category: true,
      creator: true
    }
  });
};

/**
 * Find assets matching filter/search options.
 */
const findMany = async (where) => {
  return prisma.asset.findMany({
    where,
    include: {
      category: true,
      creator: true
    }
  });
};

/**
 * Find assets matching filters with custom includes (e.g. for reports).
 */
const findManyWithDetails = async (where) => {
  return prisma.asset.findMany({
    where,
    include: {
      category: true,
      allocations: {
        include: {
          employee: {
            select: {
              user_id: true,
              full_name: true,
              employee_code: true
            }
          }
        }
      },
      transfers: true
    },
    orderBy: {
      created_at: 'desc'
    }
  });
};

/**
 * Find asset by ID.
 */
const findById = async (id) => {
  return prisma.asset.findUnique({
    where: { asset_id: Number(id) },
    include: {
      category: true,
      creator: true,
      allocations: {
        include: {
          employee: true,
          allocator: true
        }
      },
      transfers: true,
      bookings: true,
      maintenance: true
    }
  });
};

/**
 * Update asset data.
 */
const update = async (id, data) => {
  return prisma.asset.update({
    where: { asset_id: Number(id) },
    data,
    include: {
      category: true
    }
  });
};

/**
 * Delete asset by ID.
 */
const deleteAsset = async (id) => {
  return prisma.asset.delete({
    where: { asset_id: Number(id) }
  });
};

/**
 * Count total assets matching a condition.
 */
const count = async (where = {}) => {
  return prisma.asset.count({ where });
};

/**
 * Find unique asset record matching a criteria.
 */
const findUnique = async (where) => {
  return prisma.asset.findUnique({ where });
};

module.exports = {
  create,
  findMany,
  findManyWithDetails,
  findById,
  update,
  deleteAsset,
  count,
  findUnique
};
