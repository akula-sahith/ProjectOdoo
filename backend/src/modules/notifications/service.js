const prisma = require('../../config/db');

const getNotifications = async (userId, filters = {}) => {
  const where = { user_id: Number(userId) };
  if (filters.is_read !== undefined) {
    where.is_read = filters.is_read === 'true' || filters.is_read === true;
  }

  return await prisma.notification.findMany({
    where,
    orderBy: {
      created_at: 'desc',
    },
  });
};

const markAsRead = async (id, userId) => {
  const notification = await prisma.notification.findUnique({
    where: { notification_id: Number(id) },
  });

  if (!notification) {
    throw new Error('Notification not found');
  }

  if (notification.user_id !== Number(userId)) {
    throw new Error('Unauthorized to mark this notification as read');
  }

  return await prisma.notification.update({
    where: { notification_id: Number(id) },
    data: { is_read: true },
  });
};

module.exports = {
  getNotifications,
  markAsRead,
};
