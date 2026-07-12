const validateDepartment = (data, isUpdate = false) => {
  const errors = [];
  if (!isUpdate && !data.department_name) {
    errors.push('Department name is required');
  }
  if (data.department_name && typeof data.department_name !== 'string') {
    errors.push('Department name must be a string');
  }
  if (data.parent_department_id && !Number.isInteger(Number(data.parent_department_id))) {
    errors.push('Parent department ID must be an integer');
  }
  if (data.department_head_id && !Number.isInteger(Number(data.department_head_id))) {
    errors.push('Department head ID must be an integer');
  }
  if (data.status && !['ACTIVE', 'INACTIVE'].includes(data.status)) {
    errors.push('Status must be either ACTIVE or INACTIVE');
  }
  return errors.length > 0 ? errors : null;
};

const validateUser = (data, isUpdate = false) => {
  const errors = [];
  if (!isUpdate) {
    if (!data.employee_code) errors.push('Employee code is required');
    if (!data.full_name) errors.push('Full name is required');
    if (!data.email) errors.push('Email is required');
    if (!data.password_hash && !data.password) errors.push('Password is required');
    if (!data.role_id) errors.push('Role ID is required');
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  if (data.department_id && !Number.isInteger(Number(data.department_id))) {
    errors.push('Department ID must be an integer');
  }
  if (data.role_id && !Number.isInteger(Number(data.role_id))) {
    errors.push('Role ID must be an integer');
  }
  if (data.status && !['ACTIVE', 'INACTIVE'].includes(data.status)) {
    errors.push('Status must be either ACTIVE or INACTIVE');
  }
  return errors.length > 0 ? errors : null;
};

module.exports = {
  validateDepartment,
  validateUser
};
