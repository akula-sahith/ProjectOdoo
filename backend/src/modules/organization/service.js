const departmentRepository = require('../../repositories/departmentRepository');
const roleRepository = require('../../repositories/roleRepository');
const userRepository = require('../../repositories/userRepository');
const bcrypt = require('bcrypt');

// Departments Services
const createDepartment = async (data) => {
  const payload = {
    department_name: data.department_name,
    status: data.status || 'ACTIVE',
  };

  if (data.parent_department_id) {
    payload.parent_department_id = Number(data.parent_department_id);
  }

  if (data.department_head_id) {
    payload.department_head_id = Number(data.department_head_id);
  }

  return await departmentRepository.create(payload);
};

const getDepartments = async () => {
  return await departmentRepository.findMany();
};

const getDepartmentById = async (id) => {
  return await departmentRepository.findById(id);
};

const updateDepartment = async (id, data) => {
  const payload = {};
  if (data.department_name !== undefined) payload.department_name = data.department_name;
  if (data.status !== undefined) payload.status = data.status;
  
  if (data.parent_department_id !== undefined) {
    payload.parent_department_id = data.parent_department_id ? Number(data.parent_department_id) : null;
  }
  
  if (data.department_head_id !== undefined) {
    payload.department_head_id = data.department_head_id ? Number(data.department_head_id) : null;
  }

  return await departmentRepository.update(id, payload);
};

const deleteDepartment = async (id) => {
  return await departmentRepository.deleteDepartment(id);
};

// Roles Services
const getRoles = async () => {
  return await roleRepository.findMany();
};

// Users Services
const createUser = async (data) => {
  const saltRounds = 10;
  const password = data.password || data.password_hash;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const payload = {
    employee_code: data.employee_code,
    full_name: data.full_name,
    email: data.email,
    password_hash: password_hash,
    role_id: Number(data.role_id),
    status: data.status || 'ACTIVE',
  };

  if (data.department_id) {
    payload.department_id = Number(data.department_id);
  }

  return await userRepository.createUser(payload);
};

const getUsers = async () => {
  return await userRepository.findMany();
};

const getUserById = async (id) => {
  return await userRepository.findById(id);
};

const updateUser = async (id, data) => {
  const payload = {};
  if (data.employee_code !== undefined) payload.employee_code = data.employee_code;
  if (data.full_name !== undefined) payload.full_name = data.full_name;
  if (data.email !== undefined) payload.email = data.email;
  if (data.status !== undefined) payload.status = data.status;

  if (data.password) {
    payload.password_hash = await bcrypt.hash(data.password, 10);
  }

  if (data.role_id !== undefined) {
    payload.role_id = Number(data.role_id);
  }

  if (data.department_id !== undefined) {
    payload.department_id = data.department_id ? Number(data.department_id) : null;
  }

  return await userRepository.update(id, payload);
};

const deleteUser = async (id) => {
  return await userRepository.deleteUser(id);
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getRoles,
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
