# EduCMS API Documentation

Complete API reference for EduCMS with request/response examples.

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

**Obtain token:**

```bash
POST /api/v1/auth/login
```

---

## API Endpoints

### Authentication Endpoints

#### Register User

```
POST /api/v1/auth/register
```

**Request Body:**

```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "newuser",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "subscriber",
    "email_verified": false,
    "is_active": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### Login User

```
POST /api/v1/auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "newuser",
      "email": "user@example.com",
      "role": "subscriber",
      "first_name": "John",
      "last_name": "Doe"
    },
    "expiresIn": "7d"
  }
}
```

---

#### Get Current User

```
GET /api/v1/auth/me
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "newuser",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "subscriber",
    "post_count": 5,
    "comment_count": 12,
    "last_login": "2024-01-15T10:30:00Z"
  }
}
```

---

#### Update Profile

```
PUT /api/v1/auth/profile
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "first_name": "Jonathan",
  "last_name": "Smith",
  "bio": "Educational content creator",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "newuser",
    "email": "user@example.com",
    "first_name": "Jonathan",
    "last_name": "Smith",
    "bio": "Educational content creator",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

---

### Posts Endpoints

#### List Posts

```
GET /api/v1/posts?page=1&limit=10&status=published&search=javascript&category=507f1f77bcf86cd799439011&tag=507f1f77bcf86cd799439012
```

**Query Parameters:**

- `page` (optional, default: 1)
- `limit` (optional, default: 10, max: 100)
- `status` (optional): 'draft', 'published', 'archived'
- `search` (optional): Search in title and content
- `category` (optional): Filter by category ID
- `tag` (optional): Filter by tag ID
- `featured` (optional): true/false for featured posts

**Response (200):**

```json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "data": {
    "posts": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Getting Started with Node.js",
        "slug": "getting-started-with-nodejs-1705320600000",
        "excerpt": "Learn the basics of Node.js...",
        "featured_image": "https://example.com/image.jpg",
        "author_id": {
          "_id": "507f1f77bcf86cd799439011",
          "username": "author1",
          "first_name": "John"
        },
        "category_id": {
          "_id": "507f1f77bcf86cd799439020",
          "name": "Web Development"
        },
        "status": "published",
        "published_at": "2024-01-15T10:30:00Z",
        "reading_time": 5,
        "view_count": 245,
        "like_count": 18,
        "comment_count": 5,
        "is_featured": false,
        "allow_comments": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "pages": 5
    }
  }
}
```

---

#### Get Single Post

```
GET /api/v1/posts/:postId
```

**Response (200):**

```json
{
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Getting Started with Node.js",
    "slug": "getting-started-with-nodejs-1705320600000",
    "content": "<h2>Node.js Basics</h2><p>...</p>",
    "excerpt": "Learn the basics of Node.js...",
    "featured_image": "https://example.com/image.jpg",
    "author_id": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "author1",
      "first_name": "John",
      "last_name": "Author"
    },
    "category_id": {
      "_id": "507f1f77bcf86cd799439020",
      "name": "Web Development",
      "slug": "web-development"
    },
    "tags": [
      {
        "_id": "507f1f77bcf86cd799439030",
        "name": "JavaScript",
        "slug": "javascript"
      }
    ],
    "meta_title": "Getting Started with Node.js",
    "meta_description": "Learn the basics of Node.js...",
    "meta_keywords": ["node.js", "javascript", "backend"],
    "status": "published",
    "published_at": "2024-01-15T10:30:00Z",
    "reading_time": 5,
    "view_count": 246,
    "like_count": 18,
    "comment_count": 5,
    "is_featured": false,
    "allow_comments": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T14:22:00Z"
  }
}
```

---

#### Create Post

```
POST /api/v1/posts
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "title": "Advanced Node.js Patterns",
  "content": "<h2>Advanced Patterns</h2><p>...</p>",
  "excerpt": "Learn advanced Node.js patterns...",
  "category_id": "507f1f77bcf86cd799439020",
  "tags": ["507f1f77bcf86cd799439030", "507f1f77bcf86cd799439031"],
  "featured_image": "https://example.com/image.jpg",
  "meta_title": "Advanced Node.js Patterns",
  "meta_description": "Learn advanced Node.js patterns...",
  "meta_keywords": ["node.js", "patterns"],
  "status": "draft"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "title": "Advanced Node.js Patterns",
    "slug": "advanced-nodejs-patterns-1705320600000",
    "status": "draft",
    "author_id": "507f1f77bcf86cd799439011",
    "reading_time": 8,
    "createdAt": "2024-01-15T15:45:00Z"
  }
}
```

---

#### Update Post

```
PUT /api/v1/posts/:postId
Authorization: Bearer <token>
```

**Request Body:** (Same as Create Post)

**Response (200):** (Updated post object)

---

#### Delete Post

```
DELETE /api/v1/posts/:postId
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Post deleted successfully",
  "data": null
}
```

---

### Comments Endpoints

#### Get Comments for Post

```
GET /api/v1/comments/post/:postId?page=1&limit=10&status=approved
```

**Response (200):**

```json
{
  "success": true,
  "message": "Comments retrieved successfully",
  "data": {
    "comments": [
      {
        "_id": "507f1f77bcf86cd799439040",
        "post_id": "507f1f77bcf86cd799439013",
        "user_id": {
          "_id": "507f1f77bcf86cd799439050",
          "username": "reader1",
          "first_name": "Jane"
        },
        "content": "Great article! Very helpful.",
        "status": "approved",
        "like_count": 3,
        "createdAt": "2024-01-15T16:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

#### Create Comment

```
POST /api/v1/comments/post/:postId
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "content": "Great article! Very helpful.",
  "parent_id": null
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Comment created successfully. Awaiting moderation.",
  "data": {
    "_id": "507f1f77bcf86cd799439040",
    "post_id": "507f1f77bcf86cd799439013",
    "user_id": "507f1f77bcf86cd799439012",
    "content": "Great article! Very helpful.",
    "status": "pending",
    "createdAt": "2024-01-15T16:30:00Z"
  }
}
```

---

#### Approve Comment (Admin/Editor only)

```
POST /api/v1/comments/:commentId/approve
Authorization: Bearer <admin_token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Comment approved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439040",
    "status": "approved"
  }
}
```

---

#### Like Comment

```
POST /api/v1/comments/:commentId/like
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Comment liked successfully",
  "data": {
    "like_count": 4,
    "liked": true
  }
}
```

---

### Categories Endpoints

#### List Categories

```
GET /api/v1/categories?page=1&limit=20
```

**Response (200):**

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "name": "Web Development",
        "slug": "web-development",
        "description": "Web development tutorials...",
        "post_count": 15,
        "display_order": 1,
        "is_active": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

#### Create Category (Admin only)

```
POST /api/v1/categories
Authorization: Bearer <admin_token>
```

**Request Body:**

```json
{
  "name": "Mobile Development",
  "description": "Mobile app development tutorials",
  "parent_id": null,
  "display_order": 2
}
```

**Response (201):** (Created category object)

---

### Tags Endpoints

#### List Tags

```
GET /api/v1/tags?page=1&limit=20&search=java
```

**Response (200):**

```json
{
  "success": true,
  "message": "Tags retrieved successfully",
  "data": {
    "tags": [
      {
        "_id": "507f1f77bcf86cd799439030",
        "name": "JavaScript",
        "slug": "javascript",
        "post_count": 42
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 10,
      "pages": 1
    }
  }
}
```

---

#### Get Popular Tags

```
GET /api/v1/tags/popular/list?limit=10
```

**Response (200):**

```json
{
  "success": true,
  "message": "Popular tags retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "name": "JavaScript",
      "slug": "javascript",
      "post_count": 42
    }
  ]
}
```

---

### Media Endpoints

#### Upload Media

```
POST /api/v1/media/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**

- `file` (required): File to upload
- `alt_text` (optional): Alt text for image
- `caption` (optional): Caption for media

**Response (201):**

```json
{
  "success": true,
  "message": "Media uploaded successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439060",
    "filename": "image-1705320600000-123456789.jpg",
    "original_name": "image.jpg",
    "file_type": "image",
    "file_size": 245782,
    "url": "/uploads/image-1705320600000-123456789.jpg",
    "alt_text": "Sample image",
    "width": 1920,
    "height": 1080,
    "uploaded_by": "507f1f77bcf86cd799439011",
    "used_in_posts": 0
  }
}
```

---

#### Get Media by Type

```
GET /api/v1/media/type/image?page=1&limit=20
```

**Response (200):**

```json
{
  "success": true,
  "message": "image media retrieved successfully",
  "data": {
    "media": [...],
    "pagination": {...}
  }
}
```

---

### Users Endpoints (Admin only)

#### List Users

```
GET /api/v1/users?page=1&limit=20&role=author&search=john&is_active=true
Authorization: Bearer <admin_token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "username": "author1",
        "email": "author1@educms.com",
        "first_name": "John",
        "last_name": "Author",
        "role": "author",
        "is_active": true,
        "email_verified": true,
        "post_count": 12,
        "comment_count": 45,
        "last_login": "2024-01-15T16:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

#### Update User Role

```
PUT /api/v1/users/:userId/role
Authorization: Bearer <admin_token>
```

**Request Body:**

```json
{
  "role": "editor"
}
```

**Response (200):** (Updated user object)

---

#### Get User Statistics (Admin only)

```
GET /api/v1/users/stats/overview
Authorization: Bearer <admin_token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "User statistics retrieved successfully",
  "data": {
    "total": 25,
    "active": 23,
    "inactive": 2,
    "byRole": {
      "admin": 1,
      "editor": 2,
      "author": 8,
      "subscriber": 14
    }
  }
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation error details",
  "status": 400,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "No token provided / Invalid token",
  "status": 401
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions.",
  "status": 403
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Post not found",
  "status": 404
}
```

### 409 Conflict

```json
{
  "success": false,
  "message": "User already exists",
  "status": 409
}
```

### 500 Server Error

```json
{
  "success": false,
  "message": "Internal server error",
  "status": 500
}
```

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per window
- **Response Header:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`

---

**Last Updated:** 2024
