const prisma = require('../../config/db');

const createTransfer = async (data, requestedByUserId) => {
  const assetId = Number(data.asset_id);
  const toEmployee = Number(data.to_employee);
  let fromEmployee = data.from_employee ? Number(data.from_employee) : null;

  // 1. Verify asset exists
  const asset = await prisma.asset.findUnique({
    where: { asset_id: assetId },
  });

  if (!asset) {
    throw new Error('Asset not found');
  }

  // 2. Determine from_employee if not provided
  if (!fromEmployee) {
    const activeAlloc = await prisma.assetAllocation.findFirst({
      where: { asset_id: assetId, status: 'ACTIVE' },
    });
    if (activeAlloc) {
      fromEmployee = activeAlloc.employee_id;
    }
  }

  // 3. Ensure from and to are different
  if (fromEmployee === toEmployee) {
    throw new Error('Source and target employees must be different');
  }

  // 4. Create the transfer request
  return await prisma.assetTransfer.create({
    data: {
      asset_id: assetId,
      from_employee: fromEmployee,
      to_employee: toEmployee,
      requested_by: requestedByUserId,
      status: 'REQUESTED',
    },
    include: {
      asset: true,
      fromEmployee: true,
      toEmployee: true,
      requester: true,
    },
  });
};

const getTransfers = async (filters = {}) => {
  const where = {};
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.asset_id) {
    where.asset_id = Number(filters.asset_id);
  }

  return await prisma.assetTransfer.findMany({
    where,
    include: {
      asset: true,
      fromEmployee: true,
      toEmployee: true,
      requester: true,
      approver: true,
    },
    orderBy: {
      requested_at: 'desc',
    },
  });
};

const getTransferById = async (id) => {
  return await prisma.assetTransfer.findUnique({
    where: { transfer_id: Number(id) },
    include: {
      asset: true,
      fromEmployee: true,
      toEmployee: true,
      requester: true,
      approver: true,
    },
  });
};

const approveTransfer = async (id, approvedByUserId) => {
  const transfer = await prisma.assetTransfer.findUnique({
    where: { transfer_id: Number(id) },
  });

  if (!transfer) {
    throw new Error('Transfer request not found');
  }

  if (transfer.status !== 'REQUESTED') {
    throw new Error(`Cannot approve a transfer with status: ${transfer.status}`);
  }

  return await prisma.assetTransfer.update({
    where: { transfer_id: Number(id) },
    data: {
      status: 'APPROVED',
      approved_by: approvedByUserId,
      approved_at: new Date(),
    },
    include: {
      asset: true,
      toEmployee: true,
    },
  });
};

const rejectTransfer = async (id, approvedByUserId) => {
  const transfer = await prisma.assetTransfer.findUnique({
    where: { transfer_id: Number(id) },
  });

  if (!transfer) {
    throw new Error('Transfer request not found');
  }

  if (transfer.status !== 'REQUESTED') {
    throw new Error(`Cannot reject a transfer with status: ${transfer.status}`);
  }

  return await prisma.assetTransfer.update({
    where: { transfer_id: Number(id) },
    data: {
      status: 'REJECTED',
      approved_by: approvedByUserId,
      approved_at: new Date(),
    },
  });
};

const completeTransfer = async (id, completedByUserId) => {
  const transfer = await prisma.assetTransfer.findUnique({
    where: { transfer_id: Number(id) },
    include: { asset: true },
  });

  if (!transfer) {
    throw new Error('Transfer request not found');
  }

  if (transfer.status !== 'APPROVED' && transfer.status !== 'REQUESTED') {
    throw new Error(`Cannot complete a transfer with status: ${transfer.status}`);
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Mark previous active allocation for this asset as RETURNED
    await tx.assetAllocation.updateMany({
      where: {
        asset_id: transfer.asset_id,
        status: 'ACTIVE',
      },
      data: {
        status: 'RETURNED',
        actual_return_date: new Date(),
        checkin_notes: `Returned via transfer ID ${transfer.transfer_id}`,
      },
    });

    // 2. Create new active allocation for target user
    const newAllocation = await tx.assetAllocation.create({
      data: {
        asset_id: transfer.asset_id,
        employee_id: transfer.to_employee,
        allocated_by: completedByUserId || transfer.approved_by || transfer.requested_by,
        allocation_date: new Date(),
        status: 'ACTIVE',
      },
      include: {
        employee: true,
      },
    });

    // 3. Ensure asset status is set to ALLOCATED
    await tx.asset.update({
      where: { asset_id: transfer.asset_id },
      data: { status: 'ALLOCATED' },
    });

    // 4. Update the transfer status to COMPLETED
    const updatedTransfer = await tx.assetTransfer.update({
      where: { transfer_id: Number(id) },
      data: {
        status: 'COMPLETED',
        approved_by: completedByUserId || transfer.approved_by,
        approved_at: transfer.approved_at || new Date(),
      },
      include: {
        asset: true,
        toEmployee: true,
      },
    });

    // 5. Write to Activity Log
    await tx.activityLog.create({
      data: {
        user_id: completedByUserId || null,
        action: `Asset '${transfer.asset.asset_name}' transfer completed to ${newAllocation.employee.full_name}`,
        module: 'ASSET',
        entity_id: transfer.asset_id,
        new_value: { transfer_id: transfer.transfer_id },
      },
    });

    return updatedTransfer;
  });
};

module.exports = {
  createTransfer,
  getTransfers,
  getTransferById,
  approveTransfer,
  rejectTransfer,
  completeTransfer,
};
