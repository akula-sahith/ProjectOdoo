const service = require('./service');
const validator = require('./validator');

const createAllocation = async (req, res, next) => {
  try {
    const valErrors = validator.validateAllocation(req.body);
    if (valErrors) {
      return res.status(400).json({ success: false, errors: valErrors });
    }
    // Inject allocated_by if present in req.user
    if (req.user && req.user.user_id) {
      req.body.allocated_by = req.user.user_id;
    } else if (!req.body.allocated_by) {
      // Graceful fallback for dev or manual API requests
      return res.status(400).json({ success: false, message: 'Allocated by user ID is required' });
    }

    const allocation = await service.createAllocation(req.body);
    return res.status(201).json({ success: true, data: allocation });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('not available') || error.message.includes('active allocation')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const getAllocations = async (req, res, next) => {
  try {
    const allocations = await service.getAllocations(req.query);
    return res.status(200).json({ success: true, data: allocations });
  } catch (error) {
    next(error);
  }
};

const getAllocationById = async (req, res, next) => {
  try {
    const allocation = await service.getAllocationById(req.params.id);
    if (!allocation) {
      return res.status(404).json({ success: false, message: 'Allocation record not found' });
    }
    return res.status(200).json({ success: true, data: allocation });
  } catch (error) {
    next(error);
  }
};

const returnAsset = async (req, res, next) => {
  try {
    const valErrors = validator.validateReturn(req.body);
    if (valErrors) {
      return res.status(400).json({ success: false, errors: valErrors });
    }
    const returnedByUserId = req.user ? req.user.user_id : null;
    const allocation = await service.returnAsset(req.params.id, req.body, returnedByUserId);
    return res.status(200).json({ success: true, data: allocation });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('already returned')) {
      return res.status(400).json({ success: false, message: error.message });
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
