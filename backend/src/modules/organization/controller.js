const service = require('./service');
const validator = require('./validator');

// Department Controllers
const createDepartment = async (req, res, next) => {
  try {
    const valErrors = validator.validateDepartment(req.body);
    if (valErrors) {
      return res.status(400).json({ success: false, errors: valErrors });
    }
    const dept = await service.createDepartment(req.body);
    return res.status(201).json({ success: true, data: dept });
  } catch (error) {
    next(error);
  }
};

const getDepartments = async (req, res, next) => {
  try {
    const depts = await service.getDepartments();
    return res.status(200).json({ success: true, data: depts });
  } catch (error) {
    next(error);
  }
};

const getDepartmentById = async (req, res, next) => {
  try {
    const dept = await service.getDepartmentById(req.params.id);
    if (!dept) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    return res.status(200).json({ success: true, data: dept });
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const valErrors = validator.validateDepartment(req.body, true);
    if (valErrors) {
      return res.status(400).json({ success: false, errors: valErrors });
    }
    const dept = await service.updateDepartment(req.params.id, req.body);
    return res.status(200).json({ success: true, data: dept });
  } catch (error) {
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    await service.deleteDepartment(req.params.id);
    return res.status(200).json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Role Controllers
const getRoles = async (req, res, next) => {
  try {
    const roles = await service.getRoles();
    return res.status(200).json({ success: true, data: roles });
  } catch (error) {
    next(error);
  }
};

// User Controllers
const createUser = async (req, res, next) => {
  try {
    const valErrors = validator.validateUser(req.body);
    if (valErrors) {
      return res.status(400).json({ success: false, errors: valErrors });
    }
    const user = await service.createUser(req.body);
    return res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await service.getUsers();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await service.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const valErrors = validator.validateUser(req.body, true);
    if (valErrors) {
      return res.status(400).json({ success: false, errors: valErrors });
    }
    const user = await service.updateUser(req.params.id, req.body);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await service.deleteUser(req.params.id);
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
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
