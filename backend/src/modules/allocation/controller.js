const service = require('./service');
const validator = require('./validator');
const { sendSuccess, sendError } = require('../../utils/responseHelpers');

const createAllocation = async (req, res, next) => {
  try {
    const valErrors = validator.validateAllocation(req.body);
    if (valErrors) {
      return sendError(res, 'Validation error', 400, valErrors);
    }
    // Inject allocated_by if present in req.user
    if (req.user && req.user.user_id) {
      req.body.allocated_by = req.user.user_id;
    } else if (!req.body.allocated_by) {
      return sendError(res, 'Allocated by user ID is required', 400);
    }

    const allocation = await service.createAllocation(req.body);
    return sendSuccess(res, allocation, 'Asset allocated successfully', 201);
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('not available') || error.message.includes('active allocation')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};

const getAllocations = async (req, res, next) => {
  try {
    const allocations = await service.getAllocations(req.query);
    return sendSuccess(res, allocations, 'Allocations retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getAllocationById = async (req, res, next) => {
  try {
    const allocation = await service.getAllocationById(req.params.id);
    if (!allocation) {
      return sendError(res, 'Allocation record not found', 404);
    }
    return sendSuccess(res, allocation, 'Allocation retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const returnAsset = async (req, res, next) => {
  try {
    const valErrors = validator.validateReturn(req.body);
    if (valErrors) {
      return sendError(res, 'Validation error', 400, valErrors);
    }
    const returnedByUserId = req.user ? req.user.user_id : null;
    const allocation = await service.returnAsset(req.params.id, req.body, returnedByUserId);
    return sendSuccess(res, allocation, 'Asset returned successfully', 200);
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('already returned')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};

module.exports = {
  createAllocation,
  getAllocations,
  getAllocationById,
  returnAsset,
};
