const prisma = require('../config/db');

/**
 * Create a new session.
 */
const create = async (data, tx = prisma) => {
  return tx.session.create({
    data
  });
};

/**
 * Find session by session ID.
 */
const findById = async (id, tx = prisma) => {
  return tx.session.findUnique({
    where: { session_id: id }
  });
};

/**
 * Revoke session by ID.
 */
const revoke = async (id, tx = prisma) => {
  return tx.session.update({
    where: { session_id: id },
    data: { revoked: true }
  });
};

/**
 * Delete expired/revoked sessions for a user.
 */
const deleteMany = async (where, tx = prisma) => {
  return tx.session.deleteMany({
    where
  });
};

module.exports = {
  create,
  findById,
  revoke,
  deleteMany
};
