const service = require('./service');
const validator = require('./validator');
const { sendSuccess, sendError } = require('../../utils/responseHelpers');

// Department Controllers
const createDepartment = async (req, res, next) => {
  try {
    const valErrors = validator.validateDepartment(req.body);
    if (valErrors) {
      return sendError(res, 'Validation error', 400, valErrors);
    }
    const dept = await service.createDepartment(req.body);
    return sendSuccess(res, dept, 'Department created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getDepartments = async (req, res, next) => {
  try {
    const depts = await service.getDepartments();
    return sendSuccess(res, depts, 'Departments retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getDepartmentById = async (req, res, next) => {
  try {
    const dept = await service.getDepartmentById(req.params.id);
    if (!dept) {
      return sendError(res, 'Department not found', 404);
    }
    return sendSuccess(res, dept, 'Department retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const valErrors = validator.validateDepartment(req.body, true);
    if (valErrors) {
      return sendError(res, 'Validation error', 400, valErrors);
    }
    const dept = await service.updateDepartment(req.params.id, req.body);
    return sendSuccess(res, dept, 'Department updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    await service.deleteDepartment(req.params.id);
    return sendSuccess(res, null, 'Department deleted successfully', 200);
  } catch (error) {
    next(error);
  }
};

// Role Controllers
const getRoles = async (req, res, next) => {
  try {
    const roles = await service.getRoles();
    return sendSuccess(res, roles, 'Roles retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

// User Controllers
const createUser = async (req, res, next) => {
  try {
    const valErrors = validator.validateUser(req.body);
    if (valErrors) {
      return sendError(res, 'Validation error', 400, valErrors);
    }
    const user = await service.createUser(req.body);
    return sendSuccess(res, user, 'User created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await service.getUsers();
    return sendSuccess(res, users, 'Users retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await service.getUserById(req.params.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    return sendSuccess(res, user, 'User retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const valErrors = validator.validateUser(req.body, true);
    if (valErrors) {
      return sendError(res, 'Validation error', 400, valErrors);
    }
    const user = await service.updateUser(req.params.id, req.body);
    return sendSuccess(res, user, 'User updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await service.deleteUser(req.params.id);
    return sendSuccess(res, null, 'User deleted successfully', 200);
  } catch (error) {
    next(error);
  }
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
