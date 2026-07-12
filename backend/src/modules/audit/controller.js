const service = require('./service');
const validator = require('./validator');

// Cycle Controllers
const createCycle = async (req, res, next) => {
  try {
    const valErrors = validator.validateAuditCycle(req.body);
    if (valErrors) {
      return res.status(400).json({ success: false, errors: valErrors });
    }
    const createdByUserId = req.user ? req.user.user_id : req.body.created_by;
    if (!createdByUserId) {
      return res.status(400).json({ success: false, message: 'Created by user ID is required' });
    }
    const cycle = await service.createCycle(req.body, Number(createdByUserId));
    return res.status(201).json({ success: true, data: cycle });
  } catch (error) {
    next(error);
  }
};

const getCycles = async (req, res, next) => {
  try {
    const cycles = await service.getCycles(req.query);
    return res.status(200).json({ success: true, data: cycles });
  } catch (error) {
    next(error);
  }
};

const getCycleById = async (req, res, next) => {
  try {
    const cycle = await service.getCycleById(req.params.id);
    if (!cycle) {
      return res.status(404).json({ success: false, message: 'Audit cycle not found' });
    }
    return res.status(200).json({ success: true, data: cycle });
  } catch (error) {
    next(error);
  }
};

// Record Controllers
const createRecord = async (req, res, next) => {
  try {
    const valErrors = validator.validateAuditRecord(req.body);
    if (valErrors) {
      return res.status(400).json({ success: false, errors: valErrors });
    }
    const auditorUserId = req.user ? req.user.user_id : req.body.auditor_id;
    if (!auditorUserId) {
      return res.status(400).json({ success: false, message: 'Auditor ID is required' });
    }
    const record = await service.createRecord(req.body, Number(auditorUserId));
    return res.status(201).json({ success: true, data: record });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('already audited')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const getRecords = async (req, res, next) => {
  try {
    const records = await service.getRecords(req.query);
    return res.status(200).json({ success: true, data: records });
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
