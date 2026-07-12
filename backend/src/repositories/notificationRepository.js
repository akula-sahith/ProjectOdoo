const prisma = require('../config/db');

/**
 * Find notifications matching filters.
 */
const findMany = async (optionsOrWhere = {}, tx = prisma) => {
  const queryOptions = {
    orderBy: {
      created_at: 'desc'
    }
  };
  if (optionsOrWhere && (optionsOrWhere.where || optionsOrWhere.take)) {
    queryOptions.where = optionsOrWhere.where;
    if (optionsOrWhere.take) queryOptions.take = optionsOrWhere.take;
  } else {
    queryOptions.where = optionsOrWhere;
  }

  return tx.notification.findMany(queryOptions);
};

/**
 * Find notification by ID.
 */
const findById = async (id, tx = prisma) => {
  return tx.notification.findUnique({
    where: { notification_id: Number(id) }
  });
};

/**
 * Update a notification record.
 */
const update = async (id, data, tx = prisma) => {
  return tx.notification.update({
    where: { notification_id: Number(id) },
    data
  });
};

/**
 * Create a new notification.
 */
const create = async (data, tx = prisma) => {
  return tx.notification.create({
    data
  });
};

module.exports = {
  findMany,
  findById,
  update,
  create
};
