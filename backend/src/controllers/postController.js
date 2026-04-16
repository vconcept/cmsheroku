const Post = require('../models/Post');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const { paginate, getPaginationMeta, calculateReadingTime, extractExcerpt, generateSlug } = require('../utils/helpers');
const { cache } = require('../config/redis');
const logger = require('../utils/logger');

// Get all posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = 'published', search, categoryId, tagId } = req.query;
    const { offset } = paginate(page, limit);

    // Build filter
    const filter = { status };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    if (categoryId) filter.category_id = categoryId;
    if (tagId) filter.tags = tagId;

    // Try to get from cache
    const cacheKey = `posts:${JSON.stringify(filter)}:${page}:${limit}`;
    let posts = await cache.get(cacheKey);

    if (!posts) {
      posts = await Post.find(filter)
        .limit(limit)
        .skip(offset)
        .sort({ published_at: -1 });

      // Cache for 1 hour
      await cache.set(cacheKey, posts, 3600);
    }

    const totalPosts = await Post.countDocuments(filter);
    const pagination = getPaginationMeta(totalPosts, page, limit);

    res.json({
      success: true,
      data: { posts, pagination }
    });
  } catch (error) {
    logger.error('Get all posts error:', error.message);
    next(error);
  }
};

// Get post by ID
exports.getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { view_count: 1 } },
      { new: true }
    ).populate('tags');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Invalidate cache
    await cache.delPattern('posts:*');

    res.json({
      success: true,
      data: { post }
    });
  } catch (error) {
    logger.error('Get post by ID error:', error.message);
    next(error);
  }
};

// Create post
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, categoryId, tags } = req.body;

    if (!title || !content || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Title, content and category are required'
      });
    }

    // Generate slug
    const slug = generateSlug(title) + '-' + Date.now();

    // Calculate reading time
    const readingTime = calculateReadingTime(content);

    // Create post
    const post = new Post({
      title,
      content,
      excerpt: excerpt || extractExcerpt(content),
      slug,
      author_id: req.user.id,
      category_id: categoryId,
      tags: tags || [],
      reading_time: readingTime,
      status: 'draft'
    });

    await post.save();

    // Update user post count
    await User.findByIdAndUpdate(req.user.id, { $inc: { post_count: 1 } });

    // Invalidate cache
    await cache.delPattern('posts:*');

    logger.info(`New post created by ${req.user.id}: ${title}`);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post }
    });
  } catch (error) {
    logger.error('Create post error:', error.message);
    next(error);
  }
};

// Update post
exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, categoryId, tags, status, featured_image, is_featured } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check authorization
    if (post.author_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own posts'
      });
    }

    // Update fields
    if (title) {
      post.title = title;
      post.slug = generateSlug(title) + '-' + post._id;
    }
    if (content) {
      post.content = content;
      post.reading_time = calculateReadingTime(content);
    }
    if (excerpt) post.excerpt = excerpt;
    if (categoryId) post.category_id = categoryId;
    if (tags) post.tags = tags;
    if (status) {
      post.status = status;
      if (status === 'published' && !post.published_at) {
        post.published_at = new Date();
      }
    }
    if (featured_image) post.featured_image = featured_image;
    if (is_featured !== undefined) post.is_featured = is_featured;

    await post.save();

    // Invalidate cache
    await cache.delPattern('posts:*');

    logger.info(`Post updated: ${id}`);

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: { post }
    });
  } catch (error) {
    logger.error('Update post error:', error.message);
    next(error);
  }
};

// Delete post
exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check authorization
    if (post.author_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts'
      });
    }

    await Post.findByIdAndDelete(id);

    // Update user post count
    await User.findByIdAndUpdate(req.user.id, { $inc: { post_count: -1 } });

    // Invalidate cache
    await cache.delPattern('posts:*');

    logger.info(`Post deleted: ${id}`);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    logger.error('Delete post error:', error.message);
    next(error);
  }
};
