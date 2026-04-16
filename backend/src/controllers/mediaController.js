const Media = require('../models/Media');
const path = require('path');
const fs = require('fs').promises;
const { successResponse, errorResponse, paginate } = require('../utils/helpers');
const logger = require('../utils/logger');

// Get all media
exports.getAllMedia = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, search } = req.query;

    const filter = {};
    if (type) filter.file_type = type;
    if (search) {
      filter.$or = [
        { original_name: { $regex: search, $options: 'i' } },
        { alt_text: { $regex: search, $options: 'i' } }
      ];
    }

    const { offset } = paginate(page, limit);

    const media = await Media.find(filter)
      .populate('uploaded_by', 'username email first_name')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(parseInt(limit));

    const total = await Media.countDocuments(filter);

    res.json(successResponse({
      media,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }, 'Media retrieved successfully'));
  } catch (error) {
    logger.error('Get media error:', error.message);
    res.status(500).json(errorResponse('Failed to retrieve media', 500));
  }
};

// Get single media
exports.getMediaById = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const media = await Media.findById(mediaId)
      .populate('uploaded_by', 'username email first_name');

    if (!media) {
      return res.status(404).json(errorResponse('Media not found', 404));
    }

    res.json(successResponse(media, 'Media retrieved successfully'));
  } catch (error) {
    logger.error('Get media error:', error.message);
    res.status(500).json(errorResponse('Failed to retrieve media', 500));
  }
};

// Upload media
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(errorResponse('No file uploaded', 400));
    }

    const { alt_text, caption } = req.body;
    const userId = req.user.id;

    // Determine file type
    const mimeType = req.file.mimetype;
    let fileType = 'other';

    if (mimeType.startsWith('image/')) fileType = 'image';
    else if (mimeType.startsWith('video/')) fileType = 'video';
    else if (mimeType.startsWith('audio/')) fileType = 'audio';
    else if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('word')) {
      fileType = 'document';
    }

    const mediaData = {
      filename: req.file.filename,
      original_name: req.file.originalname,
      file_path: req.file.path,
      file_type: fileType,
      file_size: req.file.size,
      mime_type: mimeType,
      uploaded_by: userId,
      alt_text: alt_text || req.file.originalname,
      caption: caption || '',
      url: `/uploads/${req.file.filename}`
    };

    // Extract image dimensions for images
    if (fileType === 'image') {
      try {
        const sizeOf = require('image-size');
        const dimensions = sizeOf(req.file.path);
        mediaData.width = dimensions.width;
        mediaData.height = dimensions.height;
      } catch (err) {
        logger.warn('Could not get image dimensions:', err.message);
      }
    }

    const media = await Media.create(mediaData);
    await media.populate('uploaded_by', 'username email first_name');

    logger.info(`Media uploaded: ${media.original_name} by user ${userId}`);

    res.status(201).json(successResponse(media, 'Media uploaded successfully'));
  } catch (error) {
    logger.error('Upload media error:', error.message);
    res.status(500).json(errorResponse('Failed to upload media', 500));
  }
};

// Update media metadata
exports.updateMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const { alt_text, caption } = req.body;

    const media = await Media.findById(mediaId);
    if (!media) {
      return res.status(404).json(errorResponse('Media not found', 404));
    }

    // Check authorization (only uploader or admin can edit)
    if (media.uploaded_by.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(errorResponse('Not authorized to update this media', 403));
    }

    if (alt_text !== undefined) media.alt_text = alt_text;
    if (caption !== undefined) media.caption = caption;

    await media.save();
    await media.populate('uploaded_by', 'username email first_name');

    logger.info(`Media updated: ${media.original_name} by user ${req.user.id}`);

    res.json(successResponse(media, 'Media updated successfully'));
  } catch (error) {
    logger.error('Update media error:', error.message);
    res.status(500).json(errorResponse('Failed to update media', 500));
  }
};

// Delete media
exports.deleteMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const media = await Media.findById(mediaId);
    if (!media) {
      return res.status(404).json(errorResponse('Media not found', 404));
    }

    // Check authorization
    if (media.uploaded_by.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(errorResponse('Not authorized to delete this media', 403));
    }

    // Check if media is used in posts
    if (media.used_in_posts > 0) {
      return res.status(409).json(errorResponse(
        `Cannot delete media. It is used in ${media.used_in_posts} posts.`,
        409
      ));
    }

    // Delete file from filesystem
    try {
      await fs.unlink(media.file_path);
    } catch (err) {
      logger.warn(`Could not delete file ${media.file_path}:`, err.message);
    }

    await Media.findByIdAndDelete(mediaId);

    logger.info(`Media deleted: ${media.original_name} by user ${req.user.id}`);

    res.json(successResponse(null, 'Media deleted successfully'));
  } catch (error) {
    logger.error('Delete media error:', error.message);
    res.status(500).json(errorResponse('Failed to delete media', 500));
  }
};

// Get media by type
exports.getMediaByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const validTypes = ['image', 'video', 'audio', 'document'];
    if (!validTypes.includes(type)) {
      return res.status(400).json(errorResponse(
        `Invalid media type. Valid types: ${validTypes.join(', ')}`,
        400
      ));
    }

    const { offset } = paginate(page, limit);

    const media = await Media.find({ file_type: type })
      .populate('uploaded_by', 'username email first_name')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(parseInt(limit));

    const total = await Media.countDocuments({ file_type: type });

    res.json(successResponse({
      media,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }, `${type} media retrieved successfully`));
  } catch (error) {
    logger.error('Get media by type error:', error.message);
    res.status(500).json(errorResponse('Failed to retrieve media', 500));
  }
};
