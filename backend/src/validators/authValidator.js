/**
 * Validator middleware for user registration.
 */
const validateRegister = (req, res, next) => {
  const { employee_code, full_name, email, password, role_name, department_id } = req.body;
  const errors = {};

  if (!employee_code || typeof employee_code !== 'string' || employee_code.trim() === '') {
    errors.employee_code = 'Employee code is required';
  }

  if (!full_name || typeof full_name !== 'string' || full_name.trim() === '') {
    errors.full_name = 'Full name is required';
  }

  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'A valid email address is required';
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.password = 'Password is required and must be at least 6 characters long';
  }

  if (role_name && !['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE'].includes(role_name)) {
    errors.role_name = 'Role must be one of: ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD, EMPLOYEE';
  }

  if (department_id !== undefined && department_id !== null && !Number.isInteger(Number(department_id))) {
    errors.department_id = 'Department ID must be an integer';
  }

  if (Object.keys(errors).length > 0) {
    const err = new Error('Validation failed');
    err.statusCode = 400;
    err.errors = errors;
    return next(err);
  }

  next();
};

/**
 * Validator middleware for user login.
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'A valid email address is required';
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    const err = new Error('Validation failed');
    err.statusCode = 400;
    err.errors = errors;
    return next(err);
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin
};
