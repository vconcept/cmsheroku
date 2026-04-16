const Tag = require('../models/Tag');
const Post = require('../models/Post');
const { successResponse, errorResponse, paginate } = require('../utils/helpers');
const logger = require('../utils/logger');

// Get all tags
exports.getAllTags = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }

    const { offset } = paginate(page, limit);

    const tags = await Tag.find(filter)
      .sort({ post_count: -1 })
      .skip(offset)
      .limit(parseInt(limit));

    const total = await Tag.countDocuments(filter);

    res.json(successResponse({
      tags,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }, 'Tags retrieved successfully'));
  } catch (error) {
    logger.error('Get tags error:', error.message);
    res.status(500).json(errorResponse('Failed to retrieve tags', 500));
  }
};

// Get single tag with posts
exports.getTagById = async (req, res) => {
  try {
    const { tagId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const tag = await Tag.findById(tagId);
    if (!tag) {
      return res.status(404).json(errorResponse('Tag not found', 404));
    }

    const { offset } = paginate(page, limit);

    const posts = await Post.find({
      tags: tagId,
      status: 'published'
    })
      .populate('author_id', 'username email first_name')
      .populate('category_id', 'name slug')
      .sort({ published_at: -1 })
      .skip(offset)
      .limit(parseInt(limit));

    const total = await Post.countDocuments({
      tags: tagId,
      status: 'published'
    });

    res.json(successResponse({
      tag,
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }, 'Tag retrieved successfully'));
  } catch (error) {
    logger.error('Get tag error:', error.message);
    res.status(500).json(errorResponse('Failed to retrieve tag', 500));
  }
};

// Create tag (admin only)
exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json(errorResponse('Tag name is required', 400));
    }

    // Check if tag already exists
    const existingTag = await Tag.findOne({
      slug: require('../utils/helpers').generateSlug(name)
    });

    if (existingTag) {
      return res.status(409).json(errorResponse('Tag already exists', 409));
    }

    const tag = await Tag.create({
      name: name.trim(),
      slug: require('../utils/helpers').generateSlug(name),
      description: description || ''
    });

    logger.info(`Tag created: ${tag.name} by user ${req.user.id}`);

    res.status(201).json(successResponse(tag, 'Tag created successfully'));
  } catch (error) {
    logger.error('Create tag error:', error.message);
    res.status(500).json(errorResponse('Failed to create tag', 500));
  }
};

// Update tag (admin only)
exports.updateTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const { name, description } = req.body;

    const tag = await Tag.findById(tagId);
    if (!tag) {
      return res.status(404).json(errorResponse('Tag not found', 404));
    }

    if (name) {
      tag.name = name.trim();
      tag.slug = require('../utils/helpers').generateSlug(name);
    }

    if (description !== undefined) {
      tag.description = description;
    }

    await tag.save();

    logger.info(`Tag updated: ${tag.name} by user ${req.user.id}`);

    res.json(successResponse(tag, 'Tag updated successfully'));
  } catch (error) {
    logger.error('Update tag error:', error.message);
    res.status(500).json(errorResponse('Failed to update tag', 500));
  }
};

// Delete tag (admin only)
exports.deleteTag = async (req, res) => {
  try {
    const { tagId } = req.params;

    const tag = await Tag.findById(tagId);
    if (!tag) {
      return res.status(404).json(errorResponse('Tag not found', 404));
    }

    // Check if tag is used in posts
    const postCount = await Post.countDocuments({ tags: tagId });
    if (postCount > 0) {
      return res.status(409).json(errorResponse(
        `Cannot delete tag. It is used in ${postCount} posts.`,
        409
      ));
    }

    await Tag.findByIdAndDelete(tagId);

    logger.info(`Tag deleted: ${tag.name} by user ${req.user.id}`);

    res.json(successResponse(null, 'Tag deleted successfully'));
  } catch (error) {
    logger.error('Delete tag error:', error.message);
    res.status(500).json(errorResponse('Failed to delete tag', 500));
  }
};

// Get popular tags
exports.getPopularTags = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const tags = await Tag.find({})
      .sort({ post_count: -1 })
      .limit(parseInt(limit));

    res.json(successResponse(tags, 'Popular tags retrieved successfully'));
  } catch (error) {
    logger.error('Get popular tags error:', error.message);
    res.status(500).json(errorResponse('Failed to retrieve popular tags', 500));
  }
};
