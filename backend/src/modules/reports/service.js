const prisma = require('../../config/db');

const getAssetsReport = async (filters = {}) => {
  const where = {};
  if (filters.category_id) {
    where.category_id = Number(filters.category_id);
  }
  if (filters.condition) {
    where.condition = filters.condition;
  }
  if (filters.status) {
    where.status = filters.status;
  }

  return await prisma.asset.findMany({
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
      transfers: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
};

const getAllocationsReport = async (filters = {}) => {
  const where = {};
  if (filters.employee_id) {
    where.employee_id = Number(filters.employee_id);
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.start_date && filters.end_date) {
    where.allocation_date = {
      gte: new Date(filters.start_date),
      lte: new Date(filters.end_date),
    };
  }

  return await prisma.assetAllocation.findMany({
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
      allocation_date: 'desc',
    },
  });
};

const getMaintenanceReport = async (filters = {}) => {
  const where = {};
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.priority) {
    where.priority = filters.priority;
  }

  return await prisma.maintenanceRequest.findMany({
    where,
    include: {
      asset: true,
      raisedByUser: {
        select: {
          user_id: true,
          full_name: true,
          employee_code: true
        }
      },
      approvedByUser: {
        select: {
          user_id: true,
          full_name: true
        }
      }
    },
    orderBy: {
      maintenance_id: 'desc',
    },
  });
};

module.exports = {
  getAssetsReport,
  getAllocationsReport,
  getMaintenanceReport,
};
