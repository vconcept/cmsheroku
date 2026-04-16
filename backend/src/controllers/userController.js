const User = require('../models/User');
const { successResponse, errorResponse, paginate } = require('../utils/helpers');
const logger = require('../utils/logger');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search, is_active } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } }
      ];
    }
    if (is_active !== undefined) filter.is_active = is_active === 'true';

    const { offset } = paginate(page, limit);

    const users = await User.find(filter)
      .select('-password_hash')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json(successResponse({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }, 'Users retrieved successfully'));
  } catch (error) {
    logger.error('Get users error:', error.message);
    res.status(500).json(errorResponse('Failed to retrieve users', 500));
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password_hash');

    if (!user) {
      return res.status(404).json(errorResponse('User not found', 404));
    }

    res.json(successResponse(user, 'User retrieved successfully'));
  } catch (error) {
    logger.error('Get user error:', error.message);
    res.status(500).json(errorResponse('Failed to retrieve user', 500));
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ['admin', 'editor', 'author', 'subscriber'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json(errorResponse(
        `Invalid role. Valid roles: ${validRoles.join(', ')}`,
        400
      ));
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(errorResponse('User not found', 404));
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    logger.info(`User ${user.email} role changed from ${oldRole} to ${role} by admin ${req.user.id}`);

    res.json(successResponse(user.toObject({ select: '-password_hash' }), 'User role updated successfully'));
  } catch (error) {
    logger.error('Update user role error:', error.message);
    res.status(500).json(errorResponse('Failed to update user role', 500));
  }
};

// Deactivate user (admin only)
exports.deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(errorResponse('User not found', 404));
    }

    user.is_active = false;
    await user.save();

    logger.info(`User ${user.email} deactivated by admin ${req.user.id}`);

    res.json(successResponse(user.toObject({ select: '-password_hash' }), 'User deactivated successfully'));
  } catch (error) {
    logger.error('Deactivate user error:', error.message);
    res.status(500).json(errorResponse('Failed to deactivate user', 500));
  }
};

// Activate user (admin only)
exports.activateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(errorResponse('User not found', 404));
    }

    user.is_active = true;
    await user.save();

    logger.info(`User ${user.email} activated by admin ${req.user.id}`);

    res.json(successResponse(user.toObject({ select: '-password_hash' }), 'User activated successfully'));
  } catch (error) {
    logger.error('Activate user error:', error.message);
    res.status(500).json(errorResponse('Failed to activate user', 500));
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent deleting self
    if (userId === req.user.id) {
      return res.status(400).json(errorResponse('Cannot delete your own account', 400));
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(errorResponse('User not found', 404));
    }

    await User.findByIdAndDelete(userId);

    logger.info(`User ${user.email} deleted by admin ${req.user.id}`);

    res.json(successResponse(null, 'User deleted successfully'));
  } catch (error) {
    logger.error('Delete user error:', error.message);
    res.status(500).json(errorResponse('Failed to delete user', 500));
  }
};

// Get user statistics (admin only)
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ is_active: true });
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      byRole: usersByRole.reduce((acc, cur) => {
        acc[cur._id] = cur.count;
        return acc;
      }, {})
    };

    res.json(successResponse(stats, 'User statistics retrieved successfully'));
  } catch (error) {
    logger.error('Get user stats error:', error.message);
    res.status(500).json(errorResponse('Failed to retrieve user statistics', 500));
  }
};

// Verify email (admin only - manual verification)
exports.verifyUserEmail = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(errorResponse('User not found', 404));
    }

    user.email_verified = true;
    await user.save();

    logger.info(`User ${user.email} email verified by admin ${req.user.id}`);

    res.json(successResponse(user.toObject({ select: '-password_hash' }), 'Email verified successfully'));
  } catch (error) {
    logger.error('Verify email error:', error.message);
    res.status(500).json(errorResponse('Failed to verify email', 500));
  }
};
