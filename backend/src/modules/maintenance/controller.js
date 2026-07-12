const service = require('./service');
const validator = require('./validator');
const { sendSuccess, sendError } = require('../../utils/responseHelpers');

const createRequest = async (req, res, next) => {
  try {
    const valErrors = validator.validateMaintenanceRequest(req.body);
    if (valErrors) {
      return sendError(res, 'Validation error', 400, valErrors);
    }
    const raisedByUserId = req.user ? req.user.user_id : req.body.raised_by;
    if (!raisedByUserId) {
      return sendError(res, 'Raised by user ID is required', 400);
    }
    const request = await service.createRequest(req.body, Number(raisedByUserId));
    return sendSuccess(res, request, 'Maintenance request created successfully', 201);
  } catch (error) {
    if (error.message.includes('not found')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};

const getRequests = async (req, res, next) => {
  try {
    const requests = await service.getRequests(req.query);
    return sendSuccess(res, requests, 'Maintenance requests retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getRequestById = async (req, res, next) => {
  try {
    const request = await service.getRequestById(req.params.id);
    if (!request) {
      return sendError(res, 'Maintenance request not found', 404);
    }
    return sendSuccess(res, request, 'Maintenance request retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const updateRequestStatus = async (req, res, next) => {
  try {
    const valErrors = validator.validateStatusUpdate(req.body);
    if (valErrors) {
      return sendError(res, 'Validation error', 400, valErrors);
    }
    const actionByUserId = req.user ? req.user.user_id : req.body.action_by;
    const request = await service.updateRequestStatus(req.params.id, req.body, actionByUserId ? Number(actionByUserId) : null);
    return sendSuccess(res, request, 'Maintenance request status updated successfully', 200);
  } catch (error) {
    if (error.message.includes('not found')) {
      return sendError(res, error.message, 400);
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
