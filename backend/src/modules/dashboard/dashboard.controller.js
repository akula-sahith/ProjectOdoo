const dashboardService = require('./dashboard.service');
const { sendSuccess } = require('../../utils/responseHelpers');

/**
 * Get dashboard stats summary controller.
 */
const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats();
    return sendSuccess(res, stats, 'Dashboard stats retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats
};
