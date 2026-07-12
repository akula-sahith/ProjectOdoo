const prisma = require('../config/db');

/**
 * Find first allocation matching criteria.
 */
const findFirst = async (where, tx = prisma) => {
  return tx.assetAllocation.findFirst({ where });
};

/**
 * Find allocation by ID.
 */
const findById = async (id, tx = prisma) => {
  return tx.assetAllocation.findUnique({
    where: { allocation_id: Number(id) },
    include: {
      asset: true,
      employee: true,
      allocator: true
    }
  });
};

/**
 * Find all allocations matching filters.
 */
const findMany = async (where, tx = prisma) => {
  return tx.assetAllocation.findMany({
    where,
    include: {
      asset: true,
      employee: {
        select: {
          user_id: true,
          full_name: true,
          email: true,
          employee_code: true
        }
      },
      allocator: {
        select: {
          user_id: true,
          full_name: true
        }
      }
    },
    orderBy: {
      allocation_date: 'desc'
    }
  });
};

/**
 * Create a new allocation.
 */
const create = async (data, tx = prisma) => {
  return tx.assetAllocation.create({
    data,
    include: {
      asset: true,
      employee: true,
      allocator: true
    }
  });
};

/**
 * Update an allocation.
 */
const update = async (id, data, tx = prisma) => {
  return tx.assetAllocation.update({
    where: { allocation_id: Number(id) },
    data,
    include: {
      asset: true,
      employee: true
    }
  });
};

/**
 * Update multiple allocations.
 */
const updateMany = async (where, data, tx = prisma) => {
  return tx.assetAllocation.updateMany({
    where,
    data
  });
};

/**
 * Count allocations matching criteria.
 */
const count = async (where = {}, tx = prisma) => {
  return tx.assetAllocation.count({ where });
};

module.exports = {
  findFirst,
  findById,
  findMany,
  create,
  update,
  updateMany,
  count
};
