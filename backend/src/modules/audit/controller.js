const service = require('./service');
const validator = require('./validator');
const { sendSuccess, sendError } = require('../../utils/responseHelpers');

// Cycle Controllers
const createCycle = async (req, res, next) => {
  try {
    const valErrors = validator.validateAuditCycle(req.body);
    if (valErrors) {
      return sendError(res, 'Validation error', 400, valErrors);
    }
    const createdByUserId = req.user ? req.user.user_id : req.body.created_by;
    if (!createdByUserId) {
      return sendError(res, 'Created by user ID is required', 400);
    }
    const cycle = await service.createCycle(req.body, Number(createdByUserId));
    return sendSuccess(res, cycle, 'Audit cycle created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getCycles = async (req, res, next) => {
  try {
    const cycles = await service.getCycles(req.query);
    return sendSuccess(res, cycles, 'Audit cycles retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getCycleById = async (req, res, next) => {
  try {
    const cycle = await service.getCycleById(req.params.id);
    if (!cycle) {
      return sendError(res, 'Audit cycle not found', 404);
    }
    return sendSuccess(res, cycle, 'Audit cycle retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

// Record Controllers
const createRecord = async (req, res, next) => {
  try {
    const valErrors = validator.validateAuditRecord(req.body);
    if (valErrors) {
      return sendError(res, 'Validation error', 400, valErrors);
    }
    const auditorUserId = req.user ? req.user.user_id : req.body.auditor_id;
    if (!auditorUserId) {
      return sendError(res, 'Auditor ID is required', 400);
    }
    const record = await service.createRecord(req.body, Number(auditorUserId));
    return sendSuccess(res, record, 'Audit record submitted successfully', 201);
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('already audited')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};

const getRecords = async (req, res, next) => {
  try {
    const records = await service.getRecords(req.query);
    return sendSuccess(res, records, 'Audit records retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCycle,
  getCycles,
  getCycleById,
  createRecord,
  getRecords,
};
