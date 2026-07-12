const service = require('./service');
const validator = require('./validator');
const { sendSuccess, sendError } = require('../../utils/responseHelpers');

const createTransfer = async (req, res, next) => {
  try {
    const valErrors = validator.validateTransferRequest(req.body);
    if (valErrors) {
      return sendError(res, 'Validation error', 400, valErrors);
    }
    const requestedByUserId = req.user ? req.user.user_id : req.body.requested_by;
    if (!requestedByUserId) {
      return sendError(res, 'Requested by user ID is required', 400);
    }

    const transfer = await service.createTransfer(req.body, Number(requestedByUserId));
    return sendSuccess(res, transfer, 'Transfer request created successfully', 201);
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('different')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};

const getTransfers = async (req, res, next) => {
  try {
    const transfers = await service.getTransfers(req.query);
    return sendSuccess(res, transfers, 'Transfers retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getTransferById = async (req, res, next) => {
  try {
    const transfer = await service.getTransferById(req.params.id);
    if (!transfer) {
      return sendError(res, 'Transfer request not found', 404);
    }
    return sendSuccess(res, transfer, 'Transfer retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const approveTransfer = async (req, res, next) => {
  try {
    const approvedByUserId = req.user ? req.user.user_id : req.body.approved_by;
    if (!approvedByUserId) {
      return sendError(res, 'Approved by user ID is required', 400);
    }
    const transfer = await service.approveTransfer(req.params.id, Number(approvedByUserId));
    return sendSuccess(res, transfer, 'Transfer request approved', 200);
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Cannot')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};

const rejectTransfer = async (req, res, next) => {
  try {
    const approvedByUserId = req.user ? req.user.user_id : req.body.approved_by;
    if (!approvedByUserId) {
      return sendError(res, 'Approved by user ID is required', 400);
    }
    const transfer = await service.rejectTransfer(req.params.id, Number(approvedByUserId));
    return sendSuccess(res, transfer, 'Transfer request rejected', 200);
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Cannot')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};

const completeTransfer = async (req, res, next) => {
  try {
    const completedByUserId = req.user ? req.user.user_id : req.body.completed_by;
    const transfer = await service.completeTransfer(req.params.id, completedByUserId ? Number(completedByUserId) : null);
    return sendSuccess(res, transfer, 'Transfer completed successfully', 200);
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Cannot')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};

module.exports = {
  createTransfer,
  getTransfers,
  getTransferById,
  approveTransfer,
  rejectTransfer,
  completeTransfer,
};
