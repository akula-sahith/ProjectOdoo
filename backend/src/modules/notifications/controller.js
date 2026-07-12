const service = require('./service');
const { sendSuccess, sendError } = require('../../utils/responseHelpers');

const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.user_id : req.query.user_id;
    if (!userId) {
      return sendError(res, 'User ID is required', 400);
    }
    const notifs = await service.getNotifications(userId, req.query);
    return sendSuccess(res, notifs, 'Notifications retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.user_id : req.body.user_id;
    if (!userId) {
      return sendError(res, 'User ID is required', 400);
    }
    const notif = await service.markAsRead(req.params.id, userId);
    return sendSuccess(res, notif, 'Notification marked as read', 200);
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Unauthorized')) {
      const code = error.message.includes('Unauthorized') ? 403 : 400;
      return sendError(res, error.message, code);
    }
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
