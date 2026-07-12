const service = require('./service');

const getStats = async (req, res, next) => {
  try {
    const stats = await service.getStats();
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats
};
