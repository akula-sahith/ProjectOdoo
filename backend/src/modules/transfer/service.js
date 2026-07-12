const prisma = require('../../config/db');
const transferRepository = require('../../repositories/transferRepository');
const assetRepository = require('../../repositories/assetRepository');
const allocationRepository = require('../../repositories/allocationRepository');
const activityLogRepository = require('../../repositories/activityLogRepository');

const createTransfer = async (data, requestedByUserId) => {
  const assetId = Number(data.asset_id);
  const toEmployee = Number(data.to_employee);
  let fromEmployee = data.from_employee ? Number(data.from_employee) : null;

  // 1. Verify asset exists
  const asset = await assetRepository.findById(assetId);
  if (!asset) {
    throw new Error('Asset not found');
  }

  // 2. Determine from_employee if not provided
  if (!fromEmployee) {
    const activeAlloc = await allocationRepository.findFirst({
      asset_id: assetId,
      status: 'ACTIVE'
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
  return await transferRepository.create({
    asset_id: assetId,
    from_employee: fromEmployee,
    to_employee: toEmployee,
    requested_by: requestedByUserId,
    status: 'REQUESTED',
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

  return await transferRepository.findMany(where);
};

const getTransferById = async (id) => {
  return await transferRepository.findById(id);
};

const approveTransfer = async (id, approvedByUserId) => {
  const transfer = await transferRepository.findById(id);
  if (!transfer) {
    throw new Error('Transfer request not found');
  }

  if (transfer.status !== 'REQUESTED') {
    throw new Error(`Cannot approve a transfer with status: ${transfer.status}`);
  }

  return await transferRepository.update(id, {
    status: 'APPROVED',
    approved_by: approvedByUserId,
    approved_at: new Date(),
  });
};

const rejectTransfer = async (id, approvedByUserId) => {
  const transfer = await transferRepository.findById(id);
  if (!transfer) {
    throw new Error('Transfer request not found');
  }

  if (transfer.status !== 'REQUESTED') {
    throw new Error(`Cannot reject a transfer with status: ${transfer.status}`);
  }

  return await transferRepository.update(id, {
    status: 'REJECTED',
    approved_by: approvedByUserId,
    approved_at: new Date(),
  });
};

const completeTransfer = async (id, completedByUserId) => {
  const transfer = await transferRepository.findById(id);
  if (!transfer) {
    throw new Error('Transfer request not found');
  }

  if (transfer.status !== 'APPROVED' && transfer.status !== 'REQUESTED') {
    throw new Error(`Cannot complete a transfer with status: ${transfer.status}`);
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Mark previous active allocation for this asset as RETURNED
    await allocationRepository.updateMany({
      asset_id: transfer.asset_id,
      status: 'ACTIVE',
    }, {
      status: 'RETURNED',
      actual_return_date: new Date(),
      checkin_notes: `Returned via transfer ID ${transfer.transfer_id}`,
    }, tx);

    // 2. Create new active allocation for target user
    const newAllocation = await allocationRepository.create({
      asset_id: transfer.asset_id,
      employee_id: transfer.to_employee,
      allocated_by: completedByUserId || transfer.approved_by || transfer.requested_by,
      allocation_date: new Date(),
      status: 'ACTIVE',
    }, tx);

    // 3. Ensure asset status is set to ALLOCATED
    await assetRepository.update(transfer.asset_id, { status: 'ALLOCATED' }, tx);

    // 4. Update the transfer status to COMPLETED
    const updatedTransfer = await transferRepository.update(id, {
      status: 'COMPLETED',
      approved_by: completedByUserId || transfer.approved_by,
      approved_at: transfer.approved_at || new Date(),
    }, tx);

    // 5. Write to Activity Log
    await activityLogRepository.create({
      user_id: completedByUserId || null,
      action: `Asset '${transfer.asset.asset_name}' transfer completed to ${newAllocation.employee.full_name}`,
      module: 'ASSET',
      entity_id: transfer.asset_id,
      new_value: { transfer_id: transfer.transfer_id },
    }, tx);

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
