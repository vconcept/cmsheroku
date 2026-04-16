const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      maxlength: 255,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    content: {
      type: String,
      required: [true, 'Post content is required']
    },
    excerpt: {
      type: String,
      maxlength: 500
    },
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    featured_image: {
      type: String,
      default: null
    },
    view_count: {
      type: Number,
      default: 0
    },
    like_count: {
      type: Number,
      default: 0
    },
    is_featured: {
      type: Boolean,
      default: false
    },
    allow_comments: {
      type: Boolean,
      default: true
    },
    reading_time: {
      type: Number, // in minutes
      default: 0
    },
    
    // SEO Fields
    meta_title: {
      type: String,
      maxlength: 255
    },
    meta_description: {
      type: String,
      maxlength: 500
    },
    meta_keywords: {
      type: String,
      maxlength: 500
    },
    
    published_at: {
      type: Date,
      default: null
    },
    comment_count: {
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

// Create indexes for performance
postSchema.index({ author_id: 1 });
postSchema.index({ category_id: 1 });
postSchema.index({ status: 1 });
postSchema.index({ published_at: -1 });
postSchema.index({ slug: 1 });
postSchema.index({ is_featured: 1 });
postSchema.index({ tags: 1 });

// Populate author and category by default
postSchema.pre('find', function() {
  this.populate('author_id', 'username first_name last_name avatar').populate('category_id', 'name slug');
});

postSchema.pre('findOne', function() {
  this.populate('author_id', 'username first_name last_name avatar').populate('category_id', 'name slug');
});

module.exports = mongoose.model('Post', postSchema);
