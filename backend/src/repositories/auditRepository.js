const prisma = require('../config/db');

// Audit Cycle operations
const createCycle = async (data, tx = prisma) => {
  return tx.auditCycle.create({
    data,
    include: {
      department: true,
      creator: true
    }
  });
};

const createAuditorRelations = async (data, tx = prisma) => {
  return tx.auditCycleAuditor.createMany({
    data
  });
};

const findCycles = async (where, tx = prisma) => {
  return tx.auditCycle.findMany({
    where,
    include: {
      department: true,
      creator: true,
      auditors: {
        include: {
          auditor: true
        }
      }
    },
    orderBy: {
      audit_cycle_id: 'desc'
    }
  });
};

const findCycleById = async (id, tx = prisma) => {
  return tx.auditCycle.findUnique({
    where: { audit_cycle_id: Number(id) },
    include: {
      department: true,
      creator: true,
      auditors: {
        include: {
          auditor: true
        }
      },
      records: {
        include: {
          asset: true,
          auditor: true
        }
      }
    }
  });
};

// Audit Record operations
const findRecordByUniqueKeys = async (cycleId, assetId, tx = prisma) => {
  return tx.auditRecord.findUnique({
    where: {
      audit_cycle_id_asset_id: {
        audit_cycle_id: Number(cycleId),
        asset_id: Number(assetId)
      }
    }
  });
};

const createRecord = async (data, tx = prisma) => {
  return tx.auditRecord.create({
    data,
    include: {
      asset: true,
      auditor: true
    }
  });
};

const findRecords = async (where, tx = prisma) => {
  return tx.auditRecord.findMany({
    where,
    include: {
      auditCycle: true,
      asset: true,
      auditor: true
    },
    orderBy: {
      verified_at: 'desc'
    }
  });
};

const countCycles = async (where = {}, tx = prisma) => {
  return tx.auditCycle.count({ where });
};

module.exports = {
  createCycle,
  createAuditorRelations,
  findCycles,
  findCycleById,
  findRecordByUniqueKeys,
  createRecord,
  findRecords,
  countCycles
};
