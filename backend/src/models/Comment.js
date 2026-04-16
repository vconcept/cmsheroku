const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      maxlength: 1000
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'spam', 'trash'],
      default: 'pending'
    },
    ip_address: {
      type: String,
      default: null
    },
    user_agent: {
      type: String,
      default: null
    },
    like_count: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// Create indexes
commentSchema.index({ post_id: 1 });
commentSchema.index({ user_id: 1 });
commentSchema.index({ status: 1 });
commentSchema.index({ created_at: -1 });

// Populate user info
commentSchema.pre('find', function() {
  this.populate('user_id', 'username first_name last_name avatar');
});

commentSchema.pre('findOne', function() {
  this.populate('user_id', 'username first_name last_name avatar');
});

module.exports = mongoose.model('Comment', commentSchema);
