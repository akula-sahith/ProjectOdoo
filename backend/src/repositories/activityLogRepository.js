const prisma = require('../config/db');

/**
 * Create a new activity log.
 */
const create = async (data, tx = prisma) => {
  return tx.activityLog.create({
    data
  });
};

/**
 * Find activity logs.
 */
const findMany = async (options = {}, tx = prisma) => {
  const queryOptions = {
    orderBy: { timestamp: 'desc' }
  };
  if (options.take) {
    queryOptions.take = options.take;
  }
  if (options.where) {
    queryOptions.where = options.where;
  }
  if (options.include) {
    queryOptions.include = options.include;
  }
  return tx.activityLog.findMany(queryOptions);
};

module.exports = {
  create,
  findMany
};
