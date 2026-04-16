const express = require('express');
const {
  getAllMedia,
  getMediaById,
  uploadMedia,
  updateMedia,
  deleteMedia,
  getMediaByType
} = require('../controllers/mediaController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getAllMedia);
router.get('/:mediaId', getMediaById);
router.get('/type/:type', getMediaByType);

// Protected routes (authenticated users)
router.post('/upload', authMiddleware, upload.single('file'), uploadMedia);
router.put('/:mediaId', authMiddleware, updateMedia);
router.delete('/:mediaId', authMiddleware, deleteMedia);

module.exports = router;
