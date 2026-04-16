# EduCMS Database Schema Documentation

## Overview

EduCMS uses MongoDB with Mongoose ODM. The database consists of 6 main collections with relationships, indexes, and hooks for data integrity.

## Collections

### 1. Users

Stores user account information and authentication data.

```javascript
{
  _id: ObjectId,

  // Authentication
  username: String (unique, required),
  email: String (unique, required),
  password_hash: String (bcrypt hashed, required),

  // Profile
  first_name: String,
  last_name: String,
  bio: String,
  avatar: String (URL),

  // Authorization
  role: String (enum: 'admin', 'editor', 'author', 'subscriber', default: 'subscriber'),

  // Account Status
  is_active: Boolean (default: true),
  email_verified: Boolean (default: false),

  // Statistics
  post_count: Number (default: 0),
  comment_count: Number (default: 0),

  // Activity Tracking
  last_login: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `email` (unique)
- `username` (unique)
- `role`
- `is_active`

**Hooks:**

- Pre-save: Hash password if modified (bcryptjs)

**Methods:**

- `comparePassword(password)` - Compare password with hash

---

### 2. Posts

Main content management collection for articles and educational content.

```javascript
{
  _id: ObjectId,

  // Content
  title: String (required),
  slug: String (unique, required),
  content: String (HTML content, required),
  excerpt: String,
  featured_image: String (URL),

  // Metadata
  meta_title: String (for SEO),
  meta_description: String (for SEO),
  meta_keywords: [String],

  // Relationships
  author_id: ObjectId (ref: 'User', required),
  category_id: ObjectId (ref: 'Category'),
  tags: [ObjectId] (ref: 'Tag'),

  // Status & Publishing
  status: String (enum: 'draft', 'published', 'archived', default: 'draft'),
  published_at: Date,

  // Content Features
  reading_time: Number (minutes),
  is_featured: Boolean (default: false),
  allow_comments: Boolean (default: true),

  // Engagement Metrics
  view_count: Number (default: 0),
  like_count: Number (default: 0),
  comment_count: Number (default: 0),

  // Versioning (Optional)
  versions: [{
    content: String,
    changedAt: Date,
    changedBy: ObjectId
  }],

  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `author_id`
- `category_id`
- `tags`
- `status`
- `published_at` (descending)
- `slug` (unique)
- `is_featured`

**Pre-hooks:**

- `find`: Populate author_id and category_id

---

### 3. Categories

Content organization hierarchy.

```javascript
{
  _id: ObjectId,

  // Basic Info
  name: String (required),
  slug: String (unique, required),
  description: String,

  // Hierarchy
  parent_id: ObjectId (ref: 'Category', self-referential),

  // Display
  display_order: Number (default: 0),
  icon: String (URL or icon class),
  color: String (hex color),

  // Status
  is_active: Boolean (default: true),

  // Statistics
  post_count: Number (default: 0),

  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `slug` (unique)
- `parent_id`
- `display_order`
- `is_active`

---

### 4. Tags

Post labeling system for better content discovery.

```javascript
{
  _id: ObjectId,

  // Basic Info
  name: String (required, unique),
  slug: String (unique, required),
  description: String,

  // Statistics
  post_count: Number (default: 0),

  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `slug` (unique)
- `name` (unique)
- `post_count` (descending)

---

### 5. Comments

User comments and discussion on posts.

```javascript
{
  _id: ObjectId,

  // Relationships
  post_id: ObjectId (ref: 'Post', required),
  user_id: ObjectId (ref: 'User', required),
  parent_id: ObjectId (ref: 'Comment', for threading),

  // Content
  content: String (required),

  // Moderation
  status: String (enum: 'pending', 'approved', 'spam', 'trash', default: 'pending'),
  rejection_reason: String (if rejected),

  // User Info
  ip_address: String (for moderation),
  user_agent: String,

  // Engagement
  like_count: Number (default: 0),
  liked_by: [ObjectId] (ref: 'User'),

  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `post_id`
- `user_id`
- `parent_id`
- `status`
- `createdAt` (descending)

**Pre-hooks:**

- `find`: Populate user_id

---

### 6. Media

File upload and asset management.

```javascript
{
  _id: ObjectId,

  // File Info
  filename: String (unique, required),
  original_name: String (required),
  file_path: String (filesystem path),
  file_type: String (enum: 'image', 'video', 'audio', 'document', 'other'),
  file_size: Number (bytes),
  mime_type: String,

  // Public URL
  url: String,

  // Metadata
  alt_text: String,
  caption: String,

  // Image Specific
  width: Number,
  height: Number,

  // Relationships
  uploaded_by: ObjectId (ref: 'User', required),

  // Usage Tracking
  used_in_posts: Number (default: 0),

  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `uploaded_by`
- `file_type`
- `createdAt` (descending)
- `filename` (unique)

---

## Relationships Diagram

```
User
├── Post (one-to-many)
├── Comment (one-to-many)
└── Media (one-to-many)

Post
├── Category (many-to-one)
├── User/Author (many-to-one)
├── Tag (many-to-many)
└── Comment (one-to-many)

Category
├── Post (one-to-many)
└── Category (self-referential, parent-child)

Tag
└── Post (many-to-many)

Comment
├── Post (many-to-one)
├── User (many-to-one)
└── Comment (self-referential, threading)

Media
└── User (many-to-one)
```

## Data Integrity

### Constraints

1. **Unique Constraints:**
   - Users: `username`, `email`
   - Posts: `slug`
   - Categories: `slug`
   - Tags: `name`, `slug`
   - Media: `filename`

2. **Enum Constraints:**
   - User.role: 'admin', 'editor', 'author', 'subscriber'
   - Post.status: 'draft', 'published', 'archived'
   - Comment.status: 'pending', 'approved', 'spam', 'trash'
   - Media.file_type: 'image', 'video', 'audio', 'document', 'other'

3. **Foreign Key Constraints:**
   - Post.author_id → User.\_id
   - Post.category_id → Category.\_id (optional)
   - Post.tags → Tag.\_id array
   - Comment.post_id → Post.\_id
   - Comment.user_id → User.\_id
   - Comment.parent_id → Comment.\_id (optional)
   - Media.uploaded_by → User.\_id

### Cascading Rules

- **Delete User:** Soft delete (deactivate), posts remain (update author tracking)
- **Delete Post:** Delete all comments, update category post_count
- **Delete Category:** Only if no posts in category
- **Delete Tag:** Only if not used in any posts
- **Delete Comment:** Update post comment_count
- **Delete Media:** Only if not used in any posts

## Performance Considerations

### Indexing Strategy

1. **Frequently Queried Fields:**
   - Post.author_id (filter by author)
   - Post.status (filter published/draft)
   - Post.category_id (filter by category)
   - User.role (filter by role)

2. **Sort Operations:**
   - Post.published_at (descending)
   - Category.display_order (ascending)
   - Tag.post_count (descending)
   - Comment.createdAt (descending)

3. **Search Fields:**
   - User.username, User.email
   - Post.title, Post.slug
   - Tag.name, Tag.slug
   - Category.name, Category.slug

### Pagination

All list endpoints support:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

### Caching Strategy

- **Cache TTL:** 1 hour for post lists, 30 minutes for categories
- **Invalidation:** Cache cleared on create/update/delete operations
- **Cache Keys:** Constructed from filter + pagination parameters

## Aggregation Examples

### Most Active Authors

```javascript
Post.aggregate([
  { $match: { status: "published" } },
  { $group: { _id: "$author_id", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "author",
    },
  },
]);
```

### Most Commented Posts

```javascript
Post.aggregate([
  { $match: { status: "published" } },
  { $sort: { comment_count: -1 } },
  { $limit: 10 },
]);
```

### Category Statistics

```javascript
Category.aggregate([
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "category_id",
      as: "posts",
    },
  },
  { $addFields: { post_count: { $size: "$posts" } } },
]);
```

## Migration Guide

### Adding New Fields

1. Add field to schema with default value
2. Create migration script if needed
3. Update controllers to handle new field
4. Update API documentation

### Removing Fields

1. Update schema (remove field or mark deprecated)
2. Create cleanup migration
3. Update controllers
4. Version API endpoint

### Renaming Collections

1. Rename in MongoDB
2. Update all model references
3. Update all queries
4. Update routes and controllers

---

**Last Updated:** 2024
