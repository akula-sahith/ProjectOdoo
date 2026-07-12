const service = require('./service');
const validator = require('./validator');

const createTransfer = async (req, res, next) => {
  try {
    const valErrors = validator.validateTransferRequest(req.body);
    if (valErrors) {
      return res.status(400).json({ success: false, errors: valErrors });
    }
    const requestedByUserId = req.user ? req.user.user_id : req.body.requested_by;
    if (!requestedByUserId) {
      return res.status(400).json({ success: false, message: 'Requested by user ID is required' });
    }

    const transfer = await service.createTransfer(req.body, Number(requestedByUserId));
    return res.status(201).json({ success: true, data: transfer });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('different')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const getTransfers = async (req, res, next) => {
  try {
    const transfers = await service.getTransfers(req.query);
    return res.status(200).json({ success: true, data: transfers });
  } catch (error) {
    next(error);
  }
};

const getTransferById = async (req, res, next) => {
  try {
    const transfer = await service.getTransferById(req.params.id);
    if (!transfer) {
      return res.status(404).json({ success: false, message: 'Transfer request not found' });
    }
    return res.status(200).json({ success: true, data: transfer });
  } catch (error) {
    next(error);
  }
};

const approveTransfer = async (req, res, next) => {
  try {
    const approvedByUserId = req.user ? req.user.user_id : req.body.approved_by;
    if (!approvedByUserId) {
      return res.status(400).json({ success: false, message: 'Approved by user ID is required' });
    }
    const transfer = await service.approveTransfer(req.params.id, Number(approvedByUserId));
    return res.status(200).json({ success: true, data: transfer });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Cannot')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const rejectTransfer = async (req, res, next) => {
  try {
    const approvedByUserId = req.user ? req.user.user_id : req.body.approved_by;
    if (!approvedByUserId) {
      return res.status(400).json({ success: false, message: 'Approved by user ID is required' });
    }
    const transfer = await service.rejectTransfer(req.params.id, Number(approvedByUserId));
    return res.status(200).json({ success: true, data: transfer });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Cannot')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const completeTransfer = async (req, res, next) => {
  try {
    const completedByUserId = req.user ? req.user.user_id : req.body.completed_by;
    const transfer = await service.completeTransfer(req.params.id, completedByUserId ? Number(completedByUserId) : null);
    return res.status(200).json({ success: true, data: transfer });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Cannot')) {
      return res.status(400).json({ success: false, message: error.message });
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
