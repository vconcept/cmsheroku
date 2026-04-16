const express = require('express');
const {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  getPopularTags
} = require('../controllers/tagController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllTags);
router.get('/popular/list', getPopularTags);
router.get('/:tagId', getTagById);

// Admin routes
router.post('/', authMiddleware, roleMiddleware('admin'), createTag);
router.put('/:tagId', authMiddleware, roleMiddleware('admin'), updateTag);
router.delete('/:tagId', authMiddleware, roleMiddleware('admin'), deleteTag);

module.exports = router;
