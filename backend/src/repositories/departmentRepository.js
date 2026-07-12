const prisma = require('../config/db');

/**
 * Create a new department.
 * @param {Object} data
 * @returns {Promise<Object>}
 */
const create = async (data) => {
  return prisma.department.create({
    data,
    include: {
      parentDepartment: true,
      departmentHead: true
    }
  });
};

/**
 * Get all departments.
 * @returns {Promise<Array>}
 */
const findMany = async () => {
  return prisma.department.findMany({
    include: {
      parentDepartment: true,
      departmentHead: true,
      subDepartments: true
    }
  });
};

/**
 * Find department by ID.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
const findById = async (id) => {
  return prisma.department.findUnique({
    where: { department_id: Number(id) },
    include: {
      parentDepartment: true,
      departmentHead: true,
      subDepartments: true,
      users: true
    }
  });
};

/**
 * Update a department.
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
const update = async (id, data) => {
  return prisma.department.update({
    where: { department_id: Number(id) },
    data,
    include: {
      parentDepartment: true,
      departmentHead: true
    }
  });
};

/**
 * Delete a department.
 * @param {number} id
 * @returns {Promise<Object>}
 */
const deleteDepartment = async (id) => {
  return prisma.department.delete({
    where: { department_id: Number(id) }
  });
};

/**
 * Get departments with users and their active allocations to calculate department-wise asset count.
 */
const findDepartmentAssetCounts = async () => {
  return prisma.department.findMany({
    include: {
      users: {
        include: {
          allocationsTo: {
            where: { status: 'ACTIVE' }
          }
        }
      }
    }
  });
};

module.exports = {
  create,
  findMany,
  findById,
  update,
  deleteDepartment,
  findDepartmentAssetCounts
};
