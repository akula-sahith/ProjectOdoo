const prisma = require('../../config/db');

// Asset Category Services
const createCategory = async (data) => {
  return await prisma.assetCategory.create({
    data: {
      category_name: data.category_name,
      description: data.description,
      warranty_period: data.warranty_period ? Number(data.warranty_period) : null,
      status: data.status || 'ACTIVE',
    },
  });
};

const getCategories = async () => {
  return await prisma.assetCategory.findMany({
    include: {
      _count: {
        select: { assets: true },
      },
    },
  });
};

const getCategoryById = async (id) => {
  return await prisma.assetCategory.findUnique({
    where: { category_id: Number(id) },
    include: { assets: true },
  });
};

const updateCategory = async (id, data) => {
  const payload = {};
  if (data.category_name !== undefined) payload.category_name = data.category_name;
  if (data.description !== undefined) payload.description = data.description;
  if (data.status !== undefined) payload.status = data.status;
  if (data.warranty_period !== undefined) {
    payload.warranty_period = data.warranty_period ? Number(data.warranty_period) : null;
  }

  return await prisma.assetCategory.update({
    where: { category_id: Number(id) },
    data: payload,
  });
};

const deleteCategory = async (id) => {
  return await prisma.assetCategory.delete({
    where: { category_id: Number(id) },
  });
};

// Asset Services
const createAsset = async (data) => {
  let assetTag = data.asset_tag;
  if (!assetTag) {
    let tagExists = true;
    let index = 1;
    const count = await prisma.asset.count();
    index = count + 1;
    while (tagExists) {
      assetTag = `AF-${String(index).padStart(4, '0')}`;
      const existing = await prisma.asset.findUnique({ where: { asset_tag: assetTag } });
      if (!existing) {
        tagExists = false;
      } else {
        index++;
      }
    }
  }

  const payload = {
    asset_tag: assetTag,
    asset_name: data.asset_name,
    serial_number: data.serial_number,
    category_id: Number(data.category_id),
    condition: data.condition,
    status: data.status || 'AVAILABLE',
    location: data.location || null,
    is_bookable: data.is_bookable === true || data.is_bookable === 'true',
    photo_url: data.photo_url || null,
  };

  if (data.purchase_date) {
    payload.purchase_date = new Date(data.purchase_date);
  }
  if (data.purchase_cost) {
    payload.purchase_cost = Number(data.purchase_cost);
  }
  if (data.created_by) {
    payload.created_by = Number(data.created_by);
  }

  return await prisma.asset.create({
    data: payload,
    include: {
      category: true,
      creator: true,
    },
  });
};

const getAssets = async (filters = {}) => {
  const where = {};
  
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.category_id) {
    where.category_id = Number(filters.category_id);
  }
  if (filters.is_bookable !== undefined) {
    where.is_bookable = filters.is_bookable === 'true' || filters.is_bookable === true;
  }
  
  if (filters.search) {
    where.OR = [
      { asset_name: { contains: filters.search, mode: 'insensitive' } },
      { asset_tag: { contains: filters.search, mode: 'insensitive' } },
      { serial_number: { contains: filters.search, mode: 'insensitive' } },
      { location: { contains: filters.search, mode: 'insensitive' } }
    ];
  }

  return await prisma.asset.findMany({
    where,
    include: {
      category: true,
      creator: true,
    },
  });
};

const getAssetById = async (id) => {
  return await prisma.asset.findUnique({
    where: { asset_id: Number(id) },
    include: {
      category: true,
      creator: true,
      allocations: {
        include: {
          employee: true,
          allocator: true
        }
      },
      transfers: true,
      bookings: true,
      maintenance: true
    },
  });
};

const updateAsset = async (id, data) => {
  const payload = {};
  if (data.asset_name !== undefined) payload.asset_name = data.asset_name;
  if (data.serial_number !== undefined) payload.serial_number = data.serial_number;
  if (data.condition !== undefined) payload.condition = data.condition;
  if (data.status !== undefined) payload.status = data.status;
  if (data.location !== undefined) payload.location = data.location;
  if (data.photo_url !== undefined) payload.photo_url = data.photo_url;
  
  if (data.category_id !== undefined) {
    payload.category_id = Number(data.category_id);
  }
  if (data.is_bookable !== undefined) {
    payload.is_bookable = data.is_bookable === true || data.is_bookable === 'true';
  }
  if (data.purchase_date !== undefined) {
    payload.purchase_date = data.purchase_date ? new Date(data.purchase_date) : null;
  }
  if (data.purchase_cost !== undefined) {
    payload.purchase_cost = data.purchase_cost ? Number(data.purchase_cost) : null;
  }

  return await prisma.asset.update({
    where: { asset_id: Number(id) },
    data: payload,
    include: {
      category: true,
    },
  });
};

const deleteAsset = async (id) => {
  return await prisma.asset.delete({
    where: { asset_id: Number(id) },
  });
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
