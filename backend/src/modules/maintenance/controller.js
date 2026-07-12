const service = require('./service');
const validator = require('./validator');

const createRequest = async (req, res, next) => {
  try {
    const valErrors = validator.validateMaintenanceRequest(req.body);
    if (valErrors) {
      return res.status(400).json({ success: false, errors: valErrors });
    }
    const raisedByUserId = req.user ? req.user.user_id : req.body.raised_by;
    if (!raisedByUserId) {
      return res.status(400).json({ success: false, message: 'Raised by user ID is required' });
    }
    const request = await service.createRequest(req.body, Number(raisedByUserId));
    return res.status(201).json({ success: true, data: request });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const getRequests = async (req, res, next) => {
  try {
    const requests = await service.getRequests(req.query);
    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

const getRequestById = async (req, res, next) => {
  try {
    const request = await service.getRequestById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Maintenance request not found' });
    }
    return res.status(200).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

const updateRequestStatus = async (req, res, next) => {
  try {
    const valErrors = validator.validateStatusUpdate(req.body);
    if (valErrors) {
      return res.status(400).json({ success: false, errors: valErrors });
    }
    const actionByUserId = req.user ? req.user.user_id : req.body.action_by;
    const request = await service.updateRequestStatus(req.params.id, req.body, actionByUserId ? Number(actionByUserId) : null);
    return res.status(200).json({ success: true, data: request });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
};
