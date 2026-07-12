const service = require('./service');
const { sendSuccess } = require('../../utils/responseHelpers');

const getAssetsReport = async (req, res, next) => {
  try {
    const report = await service.getAssetsReport(req.query);
    return sendSuccess(res, report, 'Asset report generated successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getAllocationsReport = async (req, res, next) => {
  try {
    const report = await service.getAllocationsReport(req.query);
    return sendSuccess(res, report, 'Allocation report generated successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getMaintenanceReport = async (req, res, next) => {
  try {
    const report = await service.getMaintenanceReport(req.query);
    return sendSuccess(res, report, 'Maintenance report generated successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getAuditsReport = async (req, res, next) => {
  try {
    const report = await service.getAuditsReport(req.query);
    return sendSuccess(res, report, 'Audit report generated successfully', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssetsReport,
  getAllocationsReport,
  getMaintenanceReport,
  getAuditsReport,
};
