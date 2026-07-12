const service = require('./service');
const validator = require('./validator');

// Category Controllers
const createCategory = async (req, res, next) => {
  try {
    const valErrors = validator.validateCategory(req.body);
    if (valErrors) {
      return res.status(400).json({ success: false, errors: valErrors });
    }
    const cat = await service.createCategory(req.body);
    return res.status(201).json({ success: true, data: cat });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const cats = await service.getCategories();
    return res.status(200).json({ success: true, data: cats });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const cat = await service.getCategoryById(req.params.id);
    if (!cat) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.status(200).json({ success: true, data: cat });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const valErrors = validator.validateCategory(req.body, true);
    if (valErrors) {
      return res.status(400).json({ success: false, errors: valErrors });
    }
    const cat = await service.updateCategory(req.params.id, req.body);
    return res.status(200).json({ success: true, data: cat });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await service.deleteCategory(req.params.id);
    return res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Asset Controllers
const createAsset = async (req, res, next) => {
  try {
    const valErrors = validator.validateAsset(req.body);
    if (valErrors) {
      return res.status(400).json({ success: false, errors: valErrors });
    }
    // Set created_by if present in req.user
    if (req.user && req.user.user_id) {
      req.body.created_by = req.user.user_id;
    }
    const asset = await service.createAsset(req.body);
    return res.status(201).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};

const getAssets = async (req, res, next) => {
  try {
    const assets = await service.getAssets(req.query);
    return res.status(200).json({ success: true, data: assets });
  } catch (error) {
    next(error);
  }
};

const getAssetById = async (req, res, next) => {
  try {
    const asset = await service.getAssetById(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }
    return res.status(200).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};

const updateAsset = async (req, res, next) => {
  try {
    const valErrors = validator.validateAsset(req.body, true);
    if (valErrors) {
      return res.status(400).json({ success: false, errors: valErrors });
    }
    const asset = await service.updateAsset(req.params.id, req.body);
    return res.status(200).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};

const deleteAsset = async (req, res, next) => {
  try {
    await service.deleteAsset(req.params.id);
    return res.status(200).json({ success: true, message: 'Asset deleted successfully' });
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
