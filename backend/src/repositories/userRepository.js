const prisma = require('../config/db');

/**
 * Find user by email.
 * @param {string} email
 * @returns {Promise<Object|null>} User with role
 */
const findByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    include: { role: true }
  });
};

/**
 * Find user by employee code.
 * @param {string} employeeCode
 * @returns {Promise<Object|null>} User with role
 */
const findByEmployeeCode = async (employeeCode) => {
  return prisma.user.findUnique({
    where: { employee_code: employeeCode },
    include: { role: true }
  });
};

/**
 * Find user by ID.
 * @param {number} userId
 * @returns {Promise<Object|null>} User with role
 */
const findById = async (userId) => {
  return prisma.user.findUnique({
    where: { user_id: userId },
    include: { role: true }
  });
};

/**
 * Create a new user.
 * @param {Object} data - User creation data
 * @returns {Promise<Object>} Created user
 */
const createUser = async (data) => {
  return prisma.user.create({
    data,
    include: { role: true }
  });
};

/**
 * Find role by its name.
 * @param {string} roleName - UserRole enum value (ADMIN, EMPLOYEE, etc.)
 * @returns {Promise<Object|null>} Role record
 */
const findRoleByName = async (roleName) => {
  return prisma.role.findUnique({
    where: { role_name: roleName }
  });
};

module.exports = {
  findByEmail,
  findByEmployeeCode,
  findById,
  createUser,
  findRoleByName
};
