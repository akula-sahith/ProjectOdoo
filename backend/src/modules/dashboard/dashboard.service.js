const assetRepository = require('../../repositories/assetRepository');
const allocationRepository = require('../../repositories/allocationRepository');
const bookingRepository = require('../../repositories/bookingRepository');
const maintenanceRepository = require('../../repositories/maintenanceRepository');
const transferRepository = require('../../repositories/transferRepository');
const auditRepository = require('../../repositories/auditRepository');
const notificationRepository = require('../../repositories/notificationRepository');
const departmentRepository = require('../../repositories/departmentRepository');
const categoryRepository = require('../../repositories/categoryRepository');

/**
 * Get dashboard statistics summary.
 * @returns {Promise<Object>}
 */
const getStats = async () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    totalAssets,
    availableAssets,
    allocatedAssets,
    underMaintenanceAssets,
    lostAssets,
    retiredAssets,
    deptAssets,
    categories,
    todaysBookings,
    activeAllocations,
    pendingMaintenance,
    pendingTransfers,
    pendingAudits,
    recentNotifications
  ] = await Promise.all([
    // Asset counts
    assetRepository.count(),
    assetRepository.count({ status: 'AVAILABLE' }),
    assetRepository.count({ status: 'ALLOCATED' }),
    assetRepository.count({ status: 'UNDER_MAINTENANCE' }),
    assetRepository.count({ status: 'LOST' }),
    assetRepository.count({ status: 'RETIRED' }),
    
    // Department-wise asset active allocation counts
    departmentRepository.findDepartmentAssetCounts(),

    // Category-wise asset counts
    categoryRepository.findMany(),

    // Today's bookings count
    bookingRepository.count({
      status: { not: 'CANCELLED' },
      start_time: {
        gte: todayStart,
        lte: todayEnd
      }
    }),

    // Active allocations count
    allocationRepository.count({ status: 'ACTIVE' }),

    // Pending maintenance count
    maintenanceRepository.count({ status: 'PENDING' }),

    // Pending transfers count
    transferRepository.count({ status: 'REQUESTED' }),

    // Pending/Scheduled audits count
    auditRepository.countCycles({ status: { in: ['SCHEDULED', 'IN_PROGRESS'] } }),

    // Recent notifications
    notificationRepository.findMany({ take: 5 })
  ]);

  // Process department-wise active allocations
  const departmentWiseAssetCount = deptAssets.map(dept => {
    let count = 0;
    dept.users.forEach(user => {
      count += user.allocationsTo.length;
    });
    return {
      department_id: dept.department_id,
      department_name: dept.department_name,
      count
    };
  });

  // Process category-wise assets
  const categoryWiseAssetCount = categories.map(cat => ({
    category_id: cat.category_id,
    category_name: cat.category_name,
    count: cat._count?.assets || 0
  }));

  return {
    totalAssets,
    availableAssets,
    allocatedAssets,
    underMaintenanceAssets,
    lostAssets,
    retiredAssets,
    departmentWiseAssetCount,
    categoryWiseAssetCount,
    todaysBookings,
    activeAllocations,
    pendingMaintenance,
    pendingTransfers,
    pendingAudits,
    recentNotifications
  };
};

module.exports = {
  getStats
};
