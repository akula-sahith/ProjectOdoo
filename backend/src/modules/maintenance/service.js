const prisma = require('../../config/db');
const maintenanceRepository = require('../../repositories/maintenanceRepository');
const assetRepository = require('../../repositories/assetRepository');
const activityLogRepository = require('../../repositories/activityLogRepository');

const createRequest = async (data, raisedByUserId) => {
  const assetId = Number(data.asset_id);

  const asset = await assetRepository.findById(assetId);
  if (!asset) {
    throw new Error('Asset not found');
  }

  return await maintenanceRepository.create({
    asset_id: assetId,
    raised_by: raisedByUserId,
    priority: data.priority,
    issue_description: data.issue_description,
    photo_url: data.photo_url || null,
    status: 'PENDING',
  });
};

const getRequests = async (filters = {}) => {
  const where = {};
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.priority) {
    where.priority = filters.priority;
  }
  if (filters.asset_id) {
    where.asset_id = Number(filters.asset_id);
  }

  return await maintenanceRepository.findMany(where);
};

const getRequestById = async (id) => {
  return await maintenanceRepository.findById(id);
};

const updateRequestStatus = async (id, data, actionByUserId) => {
  const request = await maintenanceRepository.findById(id);
  if (!request) {
    throw new Error('Maintenance request not found');
  }

  const payload = {
    status: data.status,
  };

  // Determine subfield updates based on status
  if (data.status === 'APPROVED' || data.status === 'REJECTED') {
    payload.approved_by = actionByUserId;
  }

  if (data.status === 'TECHNICIAN_ASSIGNED') {
    payload.technician_name = data.technician_name;
  }

  if (data.status === 'IN_PROGRESS') {
    payload.started_at = new Date();
  }

  if (data.status === 'RESOLVED' || data.status === 'CLOSED') {
    payload.completed_at = new Date();
  }

  // Determine asset status transition
  let assetStatusUpdate = null;
  if (['APPROVED', 'TECHNICIAN_ASSIGNED', 'IN_PROGRESS'].includes(data.status)) {
    assetStatusUpdate = 'UNDER_MAINTENANCE';
  } else if (['RESOLVED', 'CLOSED', 'REJECTED'].includes(data.status)) {
    assetStatusUpdate = 'AVAILABLE';
  }

  return await prisma.$transaction(async (tx) => {
    const updatedRequest = await maintenanceRepository.update(id, payload, tx);

    if (assetStatusUpdate) {
      await assetRepository.update(request.asset_id, { status: assetStatusUpdate }, tx);
    }

    // Write to Activity Log
    await activityLogRepository.create({
      user_id: actionByUserId || null,
      action: `Maintenance request for asset '${request.asset.asset_name}' updated to status ${data.status}`,
      module: 'MAINTENANCE',
      entity_id: request.asset_id,
      new_value: { maintenance_id: request.maintenance_id, status: data.status },
    }, tx);

    return updatedRequest;
  });
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
};
