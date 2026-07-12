const validateAuditCycle = (data) => {
  const errors = [];
  if (!data.audit_name) errors.push('Audit name is required');
  if (!data.start_date) errors.push('Start date is required');
  if (!data.end_date) errors.push('End date is required');

  if (data.department_id && !Number.isInteger(Number(data.department_id))) {
    errors.push('Department ID must be an integer');
  }
  if (data.created_by && !Number.isInteger(Number(data.created_by))) {
    errors.push('Created by user ID must be an integer');
  }

  let start, end;
  if (data.start_date) {
    start = Date.parse(data.start_date);
    if (isNaN(start)) {
      errors.push('Start date must be a valid date');
    }
  }
  if (data.end_date) {
    end = Date.parse(data.end_date);
    if (isNaN(end)) {
      errors.push('End date must be a valid date');
    }
  }
  if (start && end && start > end) {
    errors.push('End date must be on or after start date');
  }

  if (data.auditor_ids && !Array.isArray(data.auditor_ids)) {
    errors.push('Auditor IDs must be an array of integers');
  } else if (data.auditor_ids) {
    for (const val of data.auditor_ids) {
      if (!Number.isInteger(Number(val))) {
        errors.push('Auditor IDs must be integers');
        break;
      }
    }
  }

  return errors.length > 0 ? errors : null;
};

const validateAuditRecord = (data) => {
  const errors = [];
  if (!data.audit_cycle_id) errors.push('Audit cycle ID is required');
  if (!data.asset_id) errors.push('Asset ID is required');
  if (!data.verification_status) errors.push('Verification status is required');

  if (data.audit_cycle_id && !Number.isInteger(Number(data.audit_cycle_id))) {
    errors.push('Audit cycle ID must be an integer');
  }
  if (data.asset_id && !Number.isInteger(Number(data.asset_id))) {
    errors.push('Asset ID must be an integer');
  }
  if (data.auditor_id && !Number.isInteger(Number(data.auditor_id))) {
    errors.push('Auditor ID must be an integer');
  }
  if (data.verification_status && !['VERIFIED', 'MISSING', 'DAMAGED'].includes(data.verification_status)) {
    errors.push('Verification status must be VERIFIED, MISSING, or DAMAGED');
  }
  return errors.length > 0 ? errors : null;
};

module.exports = {
  validateAuditCycle,
  validateAuditRecord
};
