const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Category Routes
router.post('/categories', controller.createCategory);
router.get('/categories', controller.getCategories);
router.get('/categories/:id', controller.getCategoryById);
router.put('/categories/:id', controller.updateCategory);
router.delete('/categories/:id', controller.deleteCategory);

// Asset Routes
router.post('/assets', controller.createAsset);
router.get('/assets', controller.getAssets);
router.get('/assets/:id', controller.getAssetById);
router.put('/assets/:id', controller.updateAsset);
router.delete('/assets/:id', controller.deleteAsset);

module.exports = router;
