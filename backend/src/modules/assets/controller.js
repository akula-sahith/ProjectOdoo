const service = require('./service');
const validator = require('./validator');
const { sendSuccess, sendError } = require('../../utils/responseHelpers');

// Category Controllers
const createCategory = async (req, res, next) => {
  try {
    const valErrors = validator.validateCategory(req.body);
    if (valErrors) {
      return sendError(res, 'Validation error', 400, valErrors);
    }
    const cat = await service.createCategory(req.body);
    return sendSuccess(res, cat, 'Asset category created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const cats = await service.getCategories();
    return sendSuccess(res, cats, 'Asset categories retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const cat = await service.getCategoryById(req.params.id);
    if (!cat) {
      return sendError(res, 'Category not found', 404);
    }
    return sendSuccess(res, cat, 'Asset category retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const valErrors = validator.validateCategory(req.body, true);
    if (valErrors) {
      return sendError(res, 'Validation error', 400, valErrors);
    }
    const cat = await service.updateCategory(req.params.id, req.body);
    return sendSuccess(res, cat, 'Asset category updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await service.deleteCategory(req.params.id);
    return sendSuccess(res, null, 'Category deleted successfully', 200);
  } catch (error) {
    next(error);
  }
};

// Asset Controllers
const createAsset = async (req, res, next) => {
  try {
    const valErrors = validator.validateAsset(req.body);
    if (valErrors) {
      return sendError(res, 'Validation error', 400, valErrors);
    }
    // Set created_by if present in req.user
    if (req.user && req.user.user_id) {
      req.body.created_by = req.user.user_id;
    }
    const asset = await service.createAsset(req.body);
    return sendSuccess(res, asset, 'Asset created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getAssets = async (req, res, next) => {
  try {
    const assets = await service.getAssets(req.query);
    return sendSuccess(res, assets, 'Assets retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getAssetById = async (req, res, next) => {
  try {
    const asset = await service.getAssetById(req.params.id);
    if (!asset) {
      return sendError(res, 'Asset not found', 404);
    }
    return sendSuccess(res, asset, 'Asset retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const updateAsset = async (req, res, next) => {
  try {
    const valErrors = validator.validateAsset(req.body, true);
    if (valErrors) {
      return sendError(res, 'Validation error', 400, valErrors);
    }
    const asset = await service.updateAsset(req.params.id, req.body);
    return sendSuccess(res, asset, 'Asset updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

const deleteAsset = async (req, res, next) => {
  try {
    await service.deleteAsset(req.params.id);
    return sendSuccess(res, null, 'Asset deleted successfully', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset
};
