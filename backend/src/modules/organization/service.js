const prisma = require('../../config/db');
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

  return await prisma.department.create({
    data: payload,
    include: {
      parentDepartment: true,
      departmentHead: true,
    },
  });
};

const getDepartments = async () => {
  return await prisma.department.findMany({
    include: {
      parentDepartment: true,
      departmentHead: true,
      subDepartments: true,
    },
  });
};

const getDepartmentById = async (id) => {
  return await prisma.department.findUnique({
    where: { department_id: Number(id) },
    include: {
      parentDepartment: true,
      departmentHead: true,
      subDepartments: true,
      users: true,
    },
  });
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

  return await prisma.department.update({
    where: { department_id: Number(id) },
    data: payload,
    include: {
      parentDepartment: true,
      departmentHead: true,
    },
  });
};

const deleteDepartment = async (id) => {
  return await prisma.department.delete({
    where: { department_id: Number(id) },
  });
};

// Roles Services
const getRoles = async () => {
  return await prisma.role.findMany();
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

  return await prisma.user.create({
    data: payload,
    include: {
      department: true,
      role: true,
    },
  });
};

const getUsers = async () => {
  return await prisma.user.findMany({
    include: {
      department: true,
      role: true,
    },
  });
};

const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { user_id: Number(id) },
    include: {
      department: true,
      role: true,
      headedDepartment: true,
    },
  });
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

  return await prisma.user.update({
    where: { user_id: Number(id) },
    data: payload,
    include: {
      department: true,
      role: true,
    },
  });
};

const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { user_id: Number(id) },
  });
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
