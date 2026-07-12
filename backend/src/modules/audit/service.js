const prisma = require('../../config/db');

// Audit Cycle Services
const createCycle = async (data, createdByUserId) => {
  const deptId = data.department_id ? Number(data.department_id) : null;
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  const creatorId = Number(createdByUserId);

  return await prisma.$transaction(async (tx) => {
    // 1. Create Cycle
    const cycle = await tx.auditCycle.create({
      data: {
        audit_name: data.audit_name,
        department_id: deptId,
        start_date: startDate,
        end_date: endDate,
        created_by: creatorId,
        status: data.status || 'SCHEDULED',
      },
      include: {
        department: true,
        creator: true,
      },
    });

    // 2. Add Auditors if provided
    if (data.auditor_ids && data.auditor_ids.length > 0) {
      const auditorRelations = data.auditor_ids.map(auditorId => ({
        audit_cycle_id: cycle.audit_cycle_id,
        auditor_id: Number(auditorId),
      }));

      await tx.auditCycleAuditor.createMany({
        data: auditorRelations,
      });
    }

    return cycle;
  });
};

const getCycles = async (filters = {}) => {
  const where = {};
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.department_id) {
    where.department_id = Number(filters.department_id);
  }

  return await prisma.auditCycle.findMany({
    where,
    include: {
      department: true,
      creator: true,
      auditors: {
        include: {
          auditor: true,
        },
      },
    },
    orderBy: {
      audit_cycle_id: 'desc',
    },
  });
};

const getCycleById = async (id) => {
  return await prisma.auditCycle.findUnique({
    where: { audit_cycle_id: Number(id) },
    include: {
      department: true,
      creator: true,
      auditors: {
        include: {
          auditor: true,
        },
      },
      records: {
        include: {
          asset: true,
          auditor: true,
        },
      },
    },
  });
};

// Audit Record Services
const createRecord = async (data, auditorUserId) => {
  const cycleId = Number(data.audit_cycle_id);
  const assetId = Number(data.asset_id);
  const auditorId = Number(auditorUserId || data.auditor_id);

  // 1. Verify audit cycle and asset exist
  const cycle = await prisma.auditCycle.findUnique({ where: { audit_cycle_id: cycleId } });
  if (!cycle) throw new Error('Audit cycle not found');

  const asset = await prisma.asset.findUnique({ where: { asset_id: assetId } });
  if (!asset) throw new Error('Asset not found');

  // 2. Check if already checked in this cycle
  const existingRecord = await prisma.auditRecord.findUnique({
    where: {
      audit_cycle_id_asset_id: {
        audit_cycle_id: cycleId,
        asset_id: assetId,
      },
    },
  });

  if (existingRecord) {
    throw new Error('This asset has already been audited for this cycle');
  }

  // 3. Prepare asset updates based on verification_status
  const assetUpdates = {};
  if (data.verification_status === 'MISSING') {
    assetUpdates.status = 'LOST';
  } else if (data.verification_status === 'DAMAGED') {
    assetUpdates.condition = 'DAMAGED';
  }

  return await prisma.$transaction(async (tx) => {
    // A. Create record
    const record = await tx.auditRecord.create({
      data: {
        audit_cycle_id: cycleId,
        asset_id: assetId,
        auditor_id: auditorId,
        verification_status: data.verification_status,
        remarks: data.remarks || null,
        verified_at: new Date(),
      },
      include: {
        asset: true,
        auditor: true,
      },
    });

    // B. Update asset if condition/status changes
    if (Object.keys(assetUpdates).length > 0) {
      await tx.asset.update({
        where: { asset_id: assetId },
        data: assetUpdates,
      });
    }

    // C. Write to Activity Log
    await tx.activityLog.create({
      data: {
        user_id: auditorId,
        action: `Asset '${asset.asset_name}' audited in cycle '${cycle.audit_name}' (${data.verification_status})`,
        module: 'AUDIT',
        entity_id: assetId,
        new_value: { record_id: record.record_id, status: data.verification_status },
      },
    });

    return record;
  });
};

const getRecords = async (filters = {}) => {
  const where = {};
  if (filters.audit_cycle_id) {
    where.audit_cycle_id = Number(filters.audit_cycle_id);
  }
  if (filters.verification_status) {
    where.verification_status = filters.verification_status;
  }

  return await prisma.auditRecord.findMany({
    where,
    include: {
      auditCycle: true,
      asset: true,
      auditor: true,
    },
    orderBy: {
      verified_at: 'desc',
    },
  });
};

module.exports = {
  createCycle,
  getCycles,
  getCycleById,
  createRecord,
  getRecords,
};
