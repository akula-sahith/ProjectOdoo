const prisma = require('../config/db');

/**
 * Find all roles.
 * @returns {Promise<Array>}
 */
const findMany = async () => {
  return prisma.role.findMany();
};

/**
 * Find role by ID.
 * @param {number} role_id
 * @returns {Promise<Object|null>}
 */
const findById = async (role_id) => {
  return prisma.role.findUnique({
    where: { role_id: Number(role_id) }
  });
};

/**
 * Find role by Name.
 * @param {string} role_name
 * @returns {Promise<Object|null>}
 */
const findByName = async (role_name) => {
  return prisma.role.findUnique({
    where: { role_name }
  });
};

module.exports = {
  findMany,
  findById,
  findByName
};
