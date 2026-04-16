const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      unique: true
    },
    original_name: {
      type: String,
      required: true
    },
    file_path: {
      type: String,
      required: true
    },
    file_type: {
      type: String,
      enum: ['image', 'document', 'video', 'audio', 'other'],
      required: true
    },
    file_size: {
      type: Number,
      required: true
    },
    mime_type: {
      type: String,
      required: true
    },
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    alt_text: {
      type: String,
      maxlength: 255
    },
    caption: {
      type: String,
      maxlength: 500
    },
    width: {
      type: Number,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    url: {
      type: String,
      required: true
    },
    used_in_posts: {
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
mediaSchema.index({ uploaded_by: 1 });
mediaSchema.index({ file_type: 1 });
mediaSchema.index({ created_at: -1 });

// Populate uploader info
mediaSchema.pre('find', function() {
  this.populate('uploaded_by', 'username first_name last_name');
});

module.exports = mongoose.model('Media', mediaSchema);
