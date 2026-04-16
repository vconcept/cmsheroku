const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { successResponse, errorResponse, paginate } = require('../utils/helpers');
const cache = require('../config/redis');
const logger = require('../utils/logger');

// Get comments for a post
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { status = 'approved', page = 1, limit = 10 } = req.query;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json(errorResponse('Post not found', 404));
    }

    const filter = { post_id: postId };
    if (status) filter.status = status;

    const { offset } = paginate(page, limit);

    const comments = await Comment.find(filter)
      .populate('user_id', 'username email first_name')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments(filter);

    res.json(successResponse({
      comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }, 'Comments retrieved successfully'));
  } catch (error) {
    logger.error('Get comments error:', error.message);
    res.status(500).json(errorResponse('Failed to retrieve comments', 500));
  }
};

// Get single comment
exports.getCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId)
      .populate('user_id', 'username email first_name')
      .populate('post_id', 'title slug');

    if (!comment) {
      return res.status(404).json(errorResponse('Comment not found', 404));
    }

    res.json(successResponse(comment, 'Comment retrieved successfully'));
  } catch (error) {
    logger.error('Get comment error:', error.message);
    res.status(500).json(errorResponse('Failed to retrieve comment', 500));
  }
};

// Create comment
exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parent_id } = req.body;
    const userId = req.user.id;

    // Validate post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json(errorResponse('Post not found', 404));
    }

    // Validate post allows comments
    if (!post.allow_comments) {
      return res.status(403).json(errorResponse('Comments are disabled for this post', 403));
    }

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json(errorResponse('Comment content is required', 400));
    }

    const commentData = {
      post_id: postId,
      user_id: userId,
      content: content.trim(),
      ip_address: req.ip,
      status: 'pending' // Requires moderation
    };

    if (parent_id) {
      // Validate parent comment exists and belongs to same post
      const parentComment = await Comment.findById(parent_id);
      if (!parentComment || parentComment.post_id.toString() !== postId) {
        return res.status(400).json(errorResponse('Invalid parent comment', 400));
      }
      commentData.parent_id = parent_id;
    }

    const comment = await Comment.create(commentData);
    await comment.populate('user_id', 'username email first_name');

    // Invalidate cache
    await cache.delPattern(`comments:${postId}:*`);

    logger.info(`Comment created by user ${userId} on post ${postId}`);

    res.status(201).json(successResponse(comment, 'Comment created successfully. Awaiting moderation.'));
  } catch (error) {
    logger.error('Create comment error:', error.message);
    res.status(500).json(errorResponse('Failed to create comment', 500));
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json(errorResponse('Comment not found', 404));
    }

    // Check authorization (only author or admin can edit)
    if (comment.user_id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json(errorResponse('Not authorized to update this comment', 403));
    }

    if (content) {
      comment.content = content.trim();
    }

    await comment.save();
    await comment.populate('user_id', 'username email first_name');

    // Invalidate cache
    const postId = comment.post_id;
    await cache.delPattern(`comments:${postId}:*`);

    logger.info(`Comment ${commentId} updated by user ${userId}`);

    res.json(successResponse(comment, 'Comment updated successfully'));
  } catch (error) {
    logger.error('Update comment error:', error.message);
    res.status(500).json(errorResponse('Failed to update comment', 500));
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json(errorResponse('Comment not found', 404));
    }

    // Check authorization
    if (comment.user_id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json(errorResponse('Not authorized to delete this comment', 403));
    }

    const postId = comment.post_id;

    await Comment.findByIdAndDelete(commentId);

    // Update post comment count
    const commentCount = await Comment.countDocuments({
      post_id: postId,
      status: 'approved'
    });
    await Post.findByIdAndUpdate(postId, { comment_count: commentCount });

    // Invalidate cache
    await cache.delPattern(`comments:${postId}:*`);

    logger.info(`Comment ${commentId} deleted by user ${userId}`);

    res.json(successResponse(null, 'Comment deleted successfully'));
  } catch (error) {
    logger.error('Delete comment error:', error.message);
    res.status(500).json(errorResponse('Failed to delete comment', 500));
  }
};

// Approve comment (admin/editor only)
exports.approveComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json(errorResponse('Comment not found', 404));
    }

    comment.status = 'approved';
    await comment.save();

    // Update post comment count
    const postId = comment.post_id;
    const commentCount = await Comment.countDocuments({
      post_id: postId,
      status: 'approved'
    });
    await Post.findByIdAndUpdate(postId, { comment_count: commentCount });

    // Invalidate cache
    await cache.delPattern(`comments:${postId}:*`);

    logger.info(`Comment ${commentId} approved by user ${req.user.id}`);

    res.json(successResponse(comment, 'Comment approved successfully'));
  } catch (error) {
    logger.error('Approve comment error:', error.message);
    res.status(500).json(errorResponse('Failed to approve comment', 500));
  }
};

// Reject comment (admin/editor only)
exports.rejectComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reason } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json(errorResponse('Comment not found', 404));
    }

    comment.status = 'spam';
    if (reason) {
      comment.rejection_reason = reason;
    }
    await comment.save();

    // Invalidate cache
    const postId = comment.post_id;
    await cache.delPattern(`comments:${postId}:*`);

    logger.info(`Comment ${commentId} rejected by user ${req.user.id}`);

    res.json(successResponse(comment, 'Comment rejected successfully'));
  } catch (error) {
    logger.error('Reject comment error:', error.message);
    res.status(500).json(errorResponse('Failed to reject comment', 500));
  }
};

// Like/unlike comment
exports.toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json(errorResponse('Comment not found', 404));
    }

    // Track likes with a simple increment/decrement (in production, use a likes array)
    if (!comment.liked_by) {
      comment.liked_by = [];
    }

    const userLiked = comment.liked_by.includes(userId);

    if (userLiked) {
      comment.liked_by = comment.liked_by.filter(id => id.toString() !== userId);
      comment.like_count = Math.max(0, comment.like_count - 1);
    } else {
      comment.liked_by.push(userId);
      comment.like_count = comment.like_count + 1;
    }

    await comment.save();

    // Invalidate cache
    const postId = comment.post_id;
    await cache.delPattern(`comments:${postId}:*`);

    res.json(successResponse(
      { like_count: comment.like_count, liked: !userLiked },
      `Comment ${userLiked ? 'unliked' : 'liked'} successfully`
    ));
  } catch (error) {
    logger.error('Toggle like error:', error.message);
    res.status(500).json(errorResponse('Failed to toggle like', 500));
  }
};
