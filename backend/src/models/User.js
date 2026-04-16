const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [50, 'Username cannot exceed 50 characters'],
      match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscore and hyphen']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password_hash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false // Don't return password by default
    },
    first_name: {
      type: String,
      maxlength: 50
    },
    last_name: {
      type: String,
      maxlength: 50
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'author', 'subscriber'],
      default: 'subscriber'
    },
    bio: {
      type: String,
      maxlength: 500
    },
    avatar: {
      type: String, // URL to avatar image
      default: null
    },
    is_active: {
      type: Boolean,
      default: true
    },
    email_verified: {
      type: Boolean,
      default: false
    },
    verification_token: {
      type: String,
      default: null
    },
    last_login: {
      type: Date,
      default: null
    },
    post_count: {
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password_hash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

// Virtual for full name
userSchema.virtual('full_name').get(function() {
  return `${this.first_name || ''} ${this.last_name || ''}`.trim();
});

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
