const service = require('./service');

const getAssetsReport = async (req, res, next) => {
  try {
    const report = await service.getAssetsReport(req.query);
    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

const getAllocationsReport = async (req, res, next) => {
  try {
    const report = await service.getAllocationsReport(req.query);
    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

const getMaintenanceReport = async (req, res, next) => {
  try {
    const report = await service.getMaintenanceReport(req.query);
    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssetsReport,
  getAllocationsReport,
  getMaintenanceReport,
};
