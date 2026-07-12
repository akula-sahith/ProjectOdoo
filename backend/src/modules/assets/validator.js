const validateCategory = (data, isUpdate = false) => {
  const errors = [];
  if (!isUpdate && !data.category_name) {
    errors.push('Category name is required');
  }
  if (data.category_name && typeof data.category_name !== 'string') {
    errors.push('Category name must be a string');
  }
  if (data.warranty_period && !Number.isInteger(Number(data.warranty_period))) {
    errors.push('Warranty period must be an integer (months)');
  }
  if (data.status && !['ACTIVE', 'INACTIVE'].includes(data.status)) {
    errors.push('Status must be ACTIVE or INACTIVE');
  }
  return errors.length > 0 ? errors : null;
};

const validateAsset = (data, isUpdate = false) => {
  const errors = [];
  if (!isUpdate) {
    if (!data.asset_name) errors.push('Asset name is required');
    if (!data.serial_number) errors.push('Serial number is required');
    if (!data.category_id) errors.push('Category ID is required');
    if (!data.condition) errors.push('Condition is required');
    if (!data.status) errors.push('Status is required');
  }

  if (data.category_id && !Number.isInteger(Number(data.category_id))) {
    errors.push('Category ID must be an integer');
  }
  if (data.purchase_cost && isNaN(Number(data.purchase_cost))) {
    errors.push('Purchase cost must be a number');
  }
  if (data.condition && !['NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED'].includes(data.condition)) {
    errors.push('Invalid condition value');
  }
  if (data.status && !['AVAILABLE', 'ALLOCATED', 'RESERVED', 'UNDER_MAINTENANCE', 'LOST', 'RETIRED', 'DISPOSED'].includes(data.status)) {
    errors.push('Invalid status value');
  }
  if (data.is_bookable !== undefined && typeof data.is_bookable !== 'boolean') {
    errors.push('is_bookable must be a boolean');
  }
  return errors.length > 0 ? errors : null;
};

module.exports = {
  validateCategory,
  validateAsset
};
