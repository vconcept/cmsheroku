const express = require('express');
const {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  approveComment,
  rejectComment,
  toggleCommentLike
} = require('../controllers/commentController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// Public routes
router.get('/post/:postId', getComments);
router.get('/:commentId', getCommentById);

// Protected routes (authenticated users)
router.post('/post/:postId', authMiddleware, createComment);
router.put('/:commentId', authMiddleware, updateComment);
router.delete('/:commentId', authMiddleware, deleteComment);
router.post('/:commentId/like', authMiddleware, toggleCommentLike);

// Admin/editor routes
router.post('/:commentId/approve', authMiddleware, roleMiddleware('admin', 'editor'), approveComment);
router.post('/:commentId/reject', authMiddleware, roleMiddleware('admin', 'editor'), rejectComment);

module.exports = router;
