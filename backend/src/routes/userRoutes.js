const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deactivateUser,
  activateUser,
  deleteUser,
  getUserStats,
  verifyUserEmail
} = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Admin only routes
router.get('/', authMiddleware, roleMiddleware('admin'), getAllUsers);
router.get('/stats/overview', authMiddleware, roleMiddleware('admin'), getUserStats);
router.get('/:userId', authMiddleware, roleMiddleware('admin'), getUserById);
router.put('/:userId/role', authMiddleware, roleMiddleware('admin'), updateUserRole);
router.put('/:userId/deactivate', authMiddleware, roleMiddleware('admin'), deactivateUser);
router.put('/:userId/activate', authMiddleware, roleMiddleware('admin'), activateUser);
router.put('/:userId/verify-email', authMiddleware, roleMiddleware('admin'), verifyUserEmail);
router.delete('/:userId', authMiddleware, roleMiddleware('admin'), deleteUser);

module.exports = router;
