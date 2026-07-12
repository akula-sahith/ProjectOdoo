const validateBooking = (data) => {
  const errors = [];
  if (!data.asset_id) errors.push('Asset ID is required');
  if (!data.employee_id) errors.push('Employee ID is required');
  if (!data.start_time) errors.push('Start time is required');
  if (!data.end_time) errors.push('End time is required');

  if (data.asset_id && !Number.isInteger(Number(data.asset_id))) {
    errors.push('Asset ID must be an integer');
  }
  if (data.employee_id && !Number.isInteger(Number(data.employee_id))) {
    errors.push('Employee ID must be an integer');
  }
  if (data.department_id && !Number.isInteger(Number(data.department_id))) {
    errors.push('Department ID must be an integer');
  }
  
  let start, end;
  if (data.start_time) {
    start = Date.parse(data.start_time);
    if (isNaN(start)) {
      errors.push('Start time must be a valid date/time');
    }
  }
  if (data.end_time) {
    end = Date.parse(data.end_time);
    if (isNaN(end)) {
      errors.push('End time must be a valid date/time');
    }
  }
  if (start && end && start >= end) {
    errors.push('End time must be after start time');
  }

  return errors.length > 0 ? errors : null;
};

module.exports = {
  validateBooking
};
