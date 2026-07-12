const prisma = require('../../config/db');

const createAllocation = async (data) => {
  const assetId = Number(data.asset_id);
  const employeeId = Number(data.employee_id);
  const allocatedById = Number(data.allocated_by);

  // 1. Verify asset exists
  const asset = await prisma.asset.findUnique({
    where: { asset_id: assetId },
  });

  if (!asset) {
    throw new Error('Asset not found');
  }

  // 2. Check if asset is already allocated or unavailable
  if (asset.status !== 'AVAILABLE') {
    throw new Error(`Asset is not available for allocation (Current status: ${asset.status})`);
  }

  // 3. Check for existing active allocation
  const activeAllocation = await prisma.assetAllocation.findFirst({
    where: {
      asset_id: assetId,
      status: 'ACTIVE',
    },
  });

  if (activeAllocation) {
    throw new Error('Asset already has an active allocation');
  }

  // 4. Create allocation and update asset status in a transaction
  return await prisma.$transaction(async (tx) => {
    const allocation = await tx.assetAllocation.create({
      data: {
        asset_id: assetId,
        employee_id: employeeId,
        allocated_by: allocatedById,
        allocation_date: data.allocation_date ? new Date(data.allocation_date) : new Date(),
        expected_return_date: data.expected_return_date ? new Date(data.expected_return_date) : null,
        status: 'ACTIVE',
      },
      include: {
        asset: true,
        employee: true,
        allocator: true,
      },
    });

    await tx.asset.update({
      where: { asset_id: assetId },
      data: { status: 'ALLOCATED' },
    });

    // Write to Activity Log
    await tx.activityLog.create({
      data: {
        user_id: allocatedById,
        action: `Asset '${asset.asset_name}' allocated to ${allocation.employee.full_name}`,
        module: 'ASSET',
        entity_id: assetId,
        new_value: { allocation_id: allocation.allocation_id },
      },
    });

    return allocation;
  });
};

const getAllocations = async (filters = {}) => {
  const where = {};
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.employee_id) {
    where.employee_id = Number(filters.employee_id);
  }
  if (filters.asset_id) {
    where.asset_id = Number(filters.asset_id);
  }

  return await prisma.assetAllocation.findMany({
    where,
    include: {
      asset: true,
      employee: true,
      allocator: true,
    },
    orderBy: {
      allocation_date: 'desc',
    },
  });
};

const getAllocationById = async (id) => {
  return await prisma.assetAllocation.findUnique({
    where: { allocation_id: Number(id) },
    include: {
      asset: true,
      employee: true,
      allocator: true,
    },
  });
};

const returnAsset = async (id, data, returnedByUserId) => {
  const allocation = await prisma.assetAllocation.findUnique({
    where: { allocation_id: Number(id) },
    include: { asset: true },
  });

  if (!allocation) {
    throw new Error('Allocation record not found');
  }

  if (allocation.status !== 'ACTIVE' && allocation.status !== 'OVERDUE') {
    throw new Error('Asset is already returned');
  }

  return await prisma.$transaction(async (tx) => {
    const updatedAllocation = await tx.assetAllocation.update({
      where: { allocation_id: Number(id) },
      data: {
        status: 'RETURNED',
        actual_return_date: new Date(),
        checkin_notes: data.checkin_notes || null,
      },
      include: {
        asset: true,
        employee: true,
      },
    });

    await tx.asset.update({
      where: { asset_id: allocation.asset_id },
      data: { status: 'AVAILABLE' },
    });

    // Write to Activity Log
    await tx.activityLog.create({
      data: {
        user_id: returnedByUserId || null,
        action: `Asset '${allocation.asset.asset_name}' returned by ${updatedAllocation.employee.full_name}`,
        module: 'ASSET',
        entity_id: allocation.asset_id,
        new_value: { checkin_notes: data.checkin_notes },
      },
    });

    return updatedAllocation;
  });
};

module.exports = {
  createAllocation,
  getAllocations,
  getAllocationById,
  returnAsset,
};
