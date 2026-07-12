const assetRepository = require('../../repositories/assetRepository');
const allocationRepository = require('../../repositories/allocationRepository');
const maintenanceRepository = require('../../repositories/maintenanceRepository');
const auditRepository = require('../../repositories/auditRepository');

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

  return await assetRepository.findManyWithDetails(where);
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

  return await allocationRepository.findMany(where);
};

const getMaintenanceReport = async (filters = {}) => {
  const where = {};
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.priority) {
    where.priority = filters.priority;
  }

  return await maintenanceRepository.findMany(where);
};

const getAuditsReport = async (filters = {}) => {
  const where = {};
  if (filters.audit_cycle_id) {
    where.audit_cycle_id = Number(filters.audit_cycle_id);
  }
  if (filters.verification_status) {
    where.verification_status = filters.verification_status;
  }

  return await auditRepository.findRecords(where);
};

module.exports = {
  getAssetsReport,
  getAllocationsReport,
  getMaintenanceReport,
  getAuditsReport,
};
