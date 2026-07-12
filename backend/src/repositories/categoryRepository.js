const prisma = require('../config/db');

/**
 * Create a new category.
 */
const create = async (data) => {
  return prisma.assetCategory.create({
    data
  });
};

/**
 * Find all categories.
 */
const findMany = async () => {
  return prisma.assetCategory.findMany({
    include: {
      _count: {
        select: { assets: true }
      }
    }
  });
};

/**
 * Find category by ID.
 */
const findById = async (id) => {
  return prisma.assetCategory.findUnique({
    where: { category_id: Number(id) },
    include: { assets: true }
  });
};

/**
 * Update a category.
 */
const update = async (id, data) => {
  return prisma.assetCategory.update({
    where: { category_id: Number(id) },
    data
  });
};

/**
 * Delete a category.
 */
const deleteCategory = async (id) => {
  return prisma.assetCategory.delete({
    where: { category_id: Number(id) }
  });
};

module.exports = {
  create,
  findMany,
  findById,
  update,
  deleteCategory
};
