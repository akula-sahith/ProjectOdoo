const service = require('./service');

const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.user_id : req.query.user_id;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    const notifs = await service.getNotifications(userId, req.query);
    return res.status(200).json({ success: true, data: notifs });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.user_id : req.body.user_id;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    const notif = await service.markAsRead(req.params.id, userId);
    return res.status(200).json({ success: true, data: notif });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Unauthorized')) {
      return res.status(error.message.includes('Unauthorized') ? 403 : 400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
