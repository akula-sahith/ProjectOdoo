const validateTransferRequest = (data) => {
  const errors = [];
  if (!data.asset_id) errors.push('Asset ID is required');
  if (!data.to_employee) errors.push('Target employee ID (to_employee) is required');

  if (data.asset_id && !Number.isInteger(Number(data.asset_id))) {
    errors.push('Asset ID must be an integer');
  }
  if (data.from_employee && !Number.isInteger(Number(data.from_employee))) {
    errors.push('From employee ID must be an integer');
  }
  if (data.to_employee && !Number.isInteger(Number(data.to_employee))) {
    errors.push('To employee ID must be an integer');
  }
  if (data.from_employee && data.to_employee && Number(data.from_employee) === Number(data.to_employee)) {
    errors.push('Source and target employees must be different');
  }
  return errors.length > 0 ? errors : null;
};

module.exports = {
  validateTransferRequest
};
