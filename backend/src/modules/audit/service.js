const prisma = require('../../config/db');
const auditRepository = require('../../repositories/auditRepository');
const assetRepository = require('../../repositories/assetRepository');
const activityLogRepository = require('../../repositories/activityLogRepository');

// Audit Cycle Services
const createCycle = async (data, createdByUserId) => {
  const deptId = data.department_id ? Number(data.department_id) : null;
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  const creatorId = Number(createdByUserId);

  return await prisma.$transaction(async (tx) => {
    // 1. Create Cycle
    const cycle = await auditRepository.createCycle({
      audit_name: data.audit_name,
      department_id: deptId,
      start_date: startDate,
      end_date: endDate,
      created_by: creatorId,
      status: data.status || 'SCHEDULED',
    }, tx);

    // 2. Add Auditors if provided
    if (data.auditor_ids && data.auditor_ids.length > 0) {
      const auditorRelations = data.auditor_ids.map(auditorId => ({
        audit_cycle_id: cycle.audit_cycle_id,
        auditor_id: Number(auditorId),
      }));

      await auditRepository.createAuditorRelations(auditorRelations, tx);
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

  return await auditRepository.findCycles(where);
};

const getCycleById = async (id) => {
  return await auditRepository.findCycleById(id);
};

// Audit Record Services
const createRecord = async (data, auditorUserId) => {
  const cycleId = Number(data.audit_cycle_id);
  const assetId = Number(data.asset_id);
  const auditorId = Number(auditorUserId || data.auditor_id);

  // 1. Verify audit cycle and asset exist
  const cycle = await auditRepository.findCycleById(cycleId);
  if (!cycle) throw new Error('Audit cycle not found');

  const asset = await assetRepository.findById(assetId);
  if (!asset) throw new Error('Asset not found');

  // 2. Check if already checked in this cycle
  const existingRecord = await auditRepository.findRecordByUniqueKeys(cycleId, assetId);
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
    const record = await auditRepository.createRecord({
      audit_cycle_id: cycleId,
      asset_id: assetId,
      auditor_id: auditorId,
      verification_status: data.verification_status,
      remarks: data.remarks || null,
      verified_at: new Date(),
    }, tx);

    // B. Update asset if condition/status changes
    if (Object.keys(assetUpdates).length > 0) {
      await assetRepository.update(assetId, assetUpdates, tx);
    }

    // C. Write to Activity Log
    await activityLogRepository.create({
      user_id: auditorId,
      action: `Asset '${asset.asset_name}' audited in cycle '${cycle.audit_name}' (${data.verification_status})`,
      module: 'AUDIT',
      entity_id: assetId,
      new_value: { record_id: record.record_id, status: data.verification_status },
    }, tx);

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

  return await auditRepository.findRecords(where);
};

module.exports = {
  createCycle,
  getCycles,
  getCycleById,
  createRecord,
  getRecords,
};
