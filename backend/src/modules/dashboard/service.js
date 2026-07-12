const prisma = require('../../config/db');

const getStats = async () => {
  const [
    totalAssets,
    allocatedAssets,
    availableAssets,
    underMaintenanceAssets,
    activeBookings,
    openMaintenanceRequests,
    recentActivities
  ] = await Promise.all([
    prisma.asset.count(),
    prisma.asset.count({ where: { status: 'ALLOCATED' } }),
    prisma.asset.count({ where: { status: 'AVAILABLE' } }),
    prisma.asset.count({ where: { status: 'UNDER_MAINTENANCE' } }),
    prisma.resourceBooking.count({ where: { status: { in: ['UPCOMING', 'ONGOING'] } } }),
    prisma.maintenanceRequest.count({ where: { status: { in: ['PENDING', 'APPROVED', 'TECHNICIAN_ASSIGNED', 'IN_PROGRESS'] } } }),
    prisma.activityLog.findMany({
      take: 5,
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
            employee_code: true
          }
        }
      }
    })
  ]);

  // Convert BigInt log_id to string for JSON serialization
  const serializableActivities = recentActivities.map(log => ({
    ...log,
    log_id: log.log_id.toString()
  }));

  return {
    totalAssets,
    allocatedAssets,
    availableAssets,
    underMaintenanceAssets,
    activeBookings,
    openMaintenanceRequests,
    recentActivities: serializableActivities
  };
};

module.exports = {
  getStats
};
