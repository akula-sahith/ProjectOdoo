const prisma = require('../config/db');

/**
 * Create a new transfer.
 */
const create = async (data, tx = prisma) => {
  return tx.assetTransfer.create({
    data,
    include: {
      asset: true,
      fromEmployee: true,
      toEmployee: true,
      requester: true
    }
  });
};

/**
 * Find all transfers matching filters.
 */
const findMany = async (where, tx = prisma) => {
  return tx.assetTransfer.findMany({
    where,
    include: {
      asset: true,
      fromEmployee: true,
      toEmployee: true,
      requester: true,
      approver: true
    },
    orderBy: {
      requested_at: 'desc'
    }
  });
};

/**
 * Find transfer by ID.
 */
const findById = async (id, tx = prisma) => {
  return tx.assetTransfer.findUnique({
    where: { transfer_id: Number(id) },
    include: {
      asset: true,
      fromEmployee: true,
      toEmployee: true,
      requester: true,
      approver: true
    }
  });
};

/**
 * Update a transfer record.
 */
const update = async (id, data, tx = prisma) => {
  return tx.assetTransfer.update({
    where: { transfer_id: Number(id) },
    data,
    include: {
      asset: true,
      toEmployee: true
    }
  });
};

/**
 * Count transfer records matching criteria.
 */
const count = async (where = {}, tx = prisma) => {
  return tx.assetTransfer.count({ where });
};

module.exports = {
  create,
  findMany,
  findById,
  update,
  count
};
