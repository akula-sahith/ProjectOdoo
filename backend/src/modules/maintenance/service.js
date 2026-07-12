const prisma = require('../../config/db');

const createRequest = async (data, raisedByUserId) => {
  const assetId = Number(data.asset_id);

  const asset = await prisma.asset.findUnique({
    where: { asset_id: assetId },
  });

  if (!asset) {
    throw new Error('Asset not found');
  }

  return await prisma.maintenanceRequest.create({
    data: {
      asset_id: assetId,
      raised_by: raisedByUserId,
      priority: data.priority,
      issue_description: data.issue_description,
      photo_url: data.photo_url || null,
      status: 'PENDING',
    },
    include: {
      asset: true,
      raisedByUser: true,
    },
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

  return await prisma.maintenanceRequest.findMany({
    where,
    include: {
      asset: true,
      raisedByUser: true,
      approvedByUser: true,
    },
    orderBy: {
      maintenance_id: 'desc',
    },
  });
};

const getRequestById = async (id) => {
  return await prisma.maintenanceRequest.findUnique({
    where: { maintenance_id: Number(id) },
    include: {
      asset: true,
      raisedByUser: true,
      approvedByUser: true,
    },
  });
};

const updateRequestStatus = async (id, data, actionByUserId) => {
  const request = await prisma.maintenanceRequest.findUnique({
    where: { maintenance_id: Number(id) },
    include: { asset: true },
  });

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
    const updatedRequest = await tx.maintenanceRequest.update({
      where: { maintenance_id: Number(id) },
      data: payload,
      include: {
        asset: true,
        raisedByUser: true,
        approvedByUser: true,
      },
    });

    if (assetStatusUpdate) {
      await tx.asset.update({
        where: { asset_id: request.asset_id },
        data: { status: assetStatusUpdate },
      });
    }

    // Write to Activity Log
    await tx.activityLog.create({
      data: {
        user_id: actionByUserId || null,
        action: `Maintenance request for asset '${request.asset.asset_name}' updated to status ${data.status}`,
        module: 'MAINTENANCE',
        entity_id: request.asset_id,
        new_value: { maintenance_id: request.maintenance_id, status: data.status },
      },
    });

    return updatedRequest;
  });
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
};
