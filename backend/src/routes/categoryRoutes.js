const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes (Admin only)
router.post('/', authMiddleware, roleMiddleware('admin'), categoryController.createCategory);
router.put('/:id', authMiddleware, roleMiddleware('admin'), categoryController.updateCategory);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), categoryController.deleteCategory);

module.exports = router;
