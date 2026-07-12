const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Departments Routes
router.post('/departments', controller.createDepartment);
router.get('/departments', controller.getDepartments);
router.get('/departments/:id', controller.getDepartmentById);
router.put('/departments/:id', controller.updateDepartment);
router.delete('/departments/:id', controller.deleteDepartment);

// Roles Routes
router.get('/roles', controller.getRoles);

// Users Routes
router.post('/users', controller.createUser);
router.get('/users', controller.getUsers);
router.get('/users/:id', controller.getUserById);
router.put('/users/:id', controller.updateUser);
router.delete('/users/:id', controller.deleteUser);

module.exports = router;
