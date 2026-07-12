const validateAllocation = (data, isUpdate = false) => {
  const errors = [];
  if (!isUpdate) {
    if (!data.asset_id) errors.push('Asset ID is required');
    if (!data.employee_id) errors.push('Employee ID is required');
  }
  if (data.asset_id && !Number.isInteger(Number(data.asset_id))) {
    errors.push('Asset ID must be an integer');
  }
  if (data.employee_id && !Number.isInteger(Number(data.employee_id))) {
    errors.push('Employee ID must be an integer');
  }
  if (data.allocated_by && !Number.isInteger(Number(data.allocated_by))) {
    errors.push('Allocated By must be an integer (User ID)');
  }
  if (data.expected_return_date && isNaN(Date.parse(data.expected_return_date))) {
    errors.push('Expected return date must be a valid date');
  }
  return errors.length > 0 ? errors : null;
};

const validateReturn = (data) => {
  const errors = [];
  if (data.checkin_notes && typeof data.checkin_notes !== 'string') {
    errors.push('Checkin notes must be a string');
  }
  return errors.length > 0 ? errors : null;
};

module.exports = {
  validateAllocation,
  validateReturn
};
