const notificationRepository = require('../../repositories/notificationRepository');

const getNotifications = async (userId, filters = {}) => {
  const where = { user_id: Number(userId) };
  if (filters.is_read !== undefined) {
    where.is_read = filters.is_read === 'true' || filters.is_read === true;
  }

  return await notificationRepository.findMany(where);
};

const markAsRead = async (id, userId) => {
  const notification = await notificationRepository.findById(id);
  if (!notification) {
    throw new Error('Notification not found');
  }

  if (notification.user_id !== Number(userId)) {
    throw new Error('Unauthorized to mark this notification as read');
  }

  return await notificationRepository.update(id, { is_read: true });
};

module.exports = {
  getNotifications,
  markAsRead,
};
