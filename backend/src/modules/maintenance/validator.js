const validateMaintenanceRequest = (data) => {
  const errors = [];
  if (!data.asset_id) errors.push('Asset ID is required');
  if (!data.issue_description) errors.push('Issue description is required');
  if (!data.priority) errors.push('Priority is required');

  if (data.asset_id && !Number.isInteger(Number(data.asset_id))) {
    errors.push('Asset ID must be an integer');
  }
  if (data.raised_by && !Number.isInteger(Number(data.raised_by))) {
    errors.push('Raised by user ID must be an integer');
  }
  if (data.priority && !['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(data.priority)) {
    errors.push('Priority must be LOW, MEDIUM, HIGH, or URGENT');
  }
  return errors.length > 0 ? errors : null;
};

const validateStatusUpdate = (data) => {
  const errors = [];
  if (!data.status) {
    errors.push('Status is required');
  }
  if (data.status && !['PENDING', 'APPROVED', 'REJECTED', 'TECHNICIAN_ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(data.status)) {
    errors.push('Invalid maintenance status value');
  }
  if (data.status === 'TECHNICIAN_ASSIGNED' && !data.technician_name) {
    errors.push('Technician name is required when assigning a technician');
  }
  return errors.length > 0 ? errors : null;
};

module.exports = {
  validateMaintenanceRequest,
  validateStatusUpdate
};
