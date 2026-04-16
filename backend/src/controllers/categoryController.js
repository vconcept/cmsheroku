const Category = require('../models/Category');
const Post = require('../models/Post');
const { generateSlug, paginate, getPaginationMeta } = require('../utils/helpers');
const logger = require('../utils/logger');

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ is_active: true }).sort({ display_order: 1 });

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    logger.error('Get all categories error:', error.message);
    next(error);
  }
};

// Get category by ID with posts
exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const { offset } = paginate(page, limit);

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const posts = await Post.find({
      category_id: id,
      status: 'published'
    })
      .limit(limit)
      .skip(offset)
      .sort({ published_at: -1 });

    const totalPosts = await Post.countDocuments({
      category_id: id,
      status: 'published'
    });

    const pagination = getPaginationMeta(totalPosts, page, limit);

    res.json({
      success: true,
      data: { category, posts, pagination }
    });
  } catch (error) {
    logger.error('Get category by ID error:', error.message);
    next(error);
  }
};

// Create category (Admin only)
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, parent_id, display_order } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const slug = generateSlug(name);

    const category = new Category({
      name,
      slug,
      description,
      parent_id: parent_id || null,
      display_order: display_order || 0
    });

    await category.save();

    logger.info(`New category created: ${name}`);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    logger.error('Create category error:', error.message);
    next(error);
  }
};

// Update category (Admin only)
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, parent_id, display_order, is_active } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, description, parent_id, display_order, is_active },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    logger.info(`Category updated: ${id}`);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    logger.error('Update category error:', error.message);
    next(error);
  }
};

// Delete category (Admin only)
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if category has posts
    const postCount = await Post.countDocuments({ category_id: id });

    if (postCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing posts'
      });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    logger.info(`Category deleted: ${id}`);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    logger.error('Delete category error:', error.message);
    next(error);
  }
};
