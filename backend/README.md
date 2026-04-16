# EduCMS Backend - README

**EduCMS** is a Master's level Educational Content Management System built with Node.js, Express, and MongoDB. It provides a robust, scalable platform for managing educational content with advanced features like caching, role-based access control, and real-time capabilities.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB 5.0+
- Redis 4.0+ (optional, for caching)
- npm or yarn

### Installation

1. **Clone and install dependencies:**

```bash
cd backend
npm install
```

2. **Configure environment:**

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Seed database with sample data:**

```bash
npm run seed
```

4. **Start development server:**

```bash
npm run dev
```

The API will be available at `http://localhost:5000/api/v1`

## 📋 Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/educms
MONGODB_POOL_SIZE=10

# Redis (Optional)
REDIS_ENABLED=true
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp,application/pdf

# Server
PORT=5000
NODE_ENV=development
API_VERSION=v1
FRONTEND_URL=http://localhost:3000

# Pagination
DEFAULT_PAGE_LIMIT=10
MAX_PAGE_LIMIT=100

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 📊 Database Schema

The application uses **6 MongoDB collections**:

### Users

- User authentication and profiles
- Role-based access control (admin, editor, author, subscriber)
- Email verification tracking
- Activity timestamps

### Posts

- Content management
- SEO optimization (meta title, description, keywords)
- Auto-calculated reading time
- Featured image support
- Comment tracking

### Categories

- Hierarchical category support
- Post count tracking
- Display ordering

### Tags

- Post tagging system
- Popular tag tracking
- Tag cloud support

### Comments

- Threaded comment structure
- Moderation workflow (pending, approved, spam)
- User interaction (likes)

### Media

- File upload management
- Multiple file types (images, videos, documents, audio)
- Image dimension tracking
- Usage tracking

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for detailed schema documentation.

## 🔐 Authentication & Authorization

### JWT-Based Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### User Roles & Permissions

| Role           | Permissions                                             |
| -------------- | ------------------------------------------------------- |
| **Admin**      | Full system access, user management, content moderation |
| **Editor**     | Manage all posts, approve comments, manage categories   |
| **Author**     | Create/edit own posts, view analytics                   |
| **Subscriber** | Read content, comment (with moderation)                 |

## 📚 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login (returns JWT)
- `GET /api/v1/auth/me` - Get current user (protected)
- `PUT /api/v1/auth/profile` - Update profile (protected)

### Posts

- `GET /api/v1/posts` - List all published posts (with pagination, filtering, search)
- `GET /api/v1/posts/:id` - Get single post
- `POST /api/v1/posts` - Create post (protected, author+)
- `PUT /api/v1/posts/:id` - Update post (protected, author or admin)
- `DELETE /api/v1/posts/:id` - Delete post (protected, author or admin)

### Categories

- `GET /api/v1/categories` - List all categories
- `GET /api/v1/categories/:id` - Get category with posts
- `POST /api/v1/categories` - Create category (admin only)
- `PUT /api/v1/categories/:id` - Update category (admin only)
- `DELETE /api/v1/categories/:id` - Delete category (admin only)

### Tags

- `GET /api/v1/tags` - List all tags
- `GET /api/v1/tags/popular/list` - Get popular tags
- `GET /api/v1/tags/:id` - Get tag with posts
- `POST /api/v1/tags` - Create tag (admin only)
- `PUT /api/v1/tags/:id` - Update tag (admin only)
- `DELETE /api/v1/tags/:id` - Delete tag (admin only)

### Comments

- `GET /api/v1/comments/post/:postId` - Get post comments
- `GET /api/v1/comments/:id` - Get single comment
- `POST /api/v1/comments/post/:postId` - Create comment (protected)
- `PUT /api/v1/comments/:id` - Update comment (protected, author or admin)
- `DELETE /api/v1/comments/:id` - Delete comment (protected, author or admin)
- `POST /api/v1/comments/:id/approve` - Approve comment (admin/editor only)
- `POST /api/v1/comments/:id/reject` - Reject comment (admin/editor only)
- `POST /api/v1/comments/:id/like` - Like/unlike comment (protected)

### Media

- `GET /api/v1/media` - List all media
- `GET /api/v1/media/:id` - Get single media
- `GET /api/v1/media/type/:type` - Get media by type
- `POST /api/v1/media/upload` - Upload media (protected)
- `PUT /api/v1/media/:id` - Update media metadata (protected)
- `DELETE /api/v1/media/:id` - Delete media (protected, uploader or admin)

### Users (Admin Only)

- `GET /api/v1/users` - List all users
- `GET /api/v1/users/stats/overview` - Get user statistics
- `GET /api/v1/users/:id` - Get user details
- `PUT /api/v1/users/:id/role` - Update user role
- `PUT /api/v1/users/:id/activate` - Activate user
- `PUT /api/v1/users/:id/deactivate` - Deactivate user
- `PUT /api/v1/users/:id/verify-email` - Verify email
- `DELETE /api/v1/users/:id` - Delete user

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed endpoint documentation with request/response examples.

## 🛠️ Development

### Project Structure

```
backend/
├── src/
│   ├── config/           # Database, Redis, logging configuration
│   ├── models/           # Mongoose schemas
│   ├── controllers/      # Business logic
│   ├── routes/           # API endpoint definitions
│   ├── middleware/       # Auth, validation, error handling
│   ├── utils/            # Helper functions and utilities
│   ├── services/         # (To be implemented) Email, notifications
│   └── app.js            # Express app setup
├── scripts/
│   └── seed.js           # Database seeding script
├── server.js             # Server entry point
├── package.json          # Dependencies and scripts
├── .env.example          # Environment template
└── .gitignore            # Git ignore rules
```

### NPM Scripts

```bash
npm start       # Start production server
npm run dev     # Start with hot reload (nodemon)
npm run seed    # Seed database with sample data
npm test        # Run tests
npm run lint    # Run ESLint
```

### Code Style

- Use **async/await** for asynchronous operations
- Follow **MVC** pattern for code organization
- Implement proper **error handling** with try-catch blocks
- Use **middleware** for cross-cutting concerns
- Write **descriptive comments** for complex logic
- Use **meaningful variable names**

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed development guidelines.

## 🔄 Key Features

### ✅ Core Features

- **User Authentication & Authorization** - JWT-based with role management
- **Content Management** - Full CRUD for posts, categories, tags
- **Comment Moderation** - Workflow for comment approval and rejection
- **Media Management** - File upload with multiple file type support
- **Search & Filtering** - Advanced post filtering and full-text search support
- **Pagination** - Configurable pagination for large datasets
- **Real-time Updates** - Socket.io support (ready for frontend implementation)

### ⚡ Performance Features

- **Caching Layer** - Redis-based caching with automatic invalidation
- **Database Indexing** - Optimized indexes on frequently queried fields
- **Connection Pooling** - MongoDB connection pool management
- **Compression** - GZIP compression for response bodies
- **Rate Limiting** - Request rate limiting to prevent abuse

### 🔒 Security Features

- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Stateless token-based authentication
- **CORS** - Cross-origin resource sharing configuration
- **Helmet** - HTTP header security
- **Input Validation** - Express-validator for request validation
- **Rate Limiting** - Express-rate-limit for DDoS protection

### 📊 Analytics & Logging

- **Winston Logging** - Structured logging with file persistence
- **Request Logging** - Morgan middleware for HTTP logging
- **Error Tracking** - Comprehensive error logging and handling
- **Audit Trail** - Activity logging for important operations

## 📦 Dependencies

### Production

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **redis** - Caching layer
- **multer** - File upload handling
- **winston** - Logging
- **morgan** - HTTP request logging
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **express-validator** - Input validation
- **dotenv** - Environment configuration

### Development

- **nodemon** - Auto-reload during development
- **jest** - Testing framework
- **eslint** - Code linting
- **supertest** - HTTP assertion library

## 🚀 Deployment

### Docker Deployment

```bash
docker build -t educms-backend .
docker run -e MONGODB_URI=... -e JWT_SECRET=... -p 5000:5000 educms-backend
```

### Cloud Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for:

- Heroku deployment
- Render deployment
- AWS deployment
- DigitalOcean deployment

## 📖 Test Credentials

After running `npm run seed`, use these credentials to test:

| User       | Email                 | Password  | Role       |
| ---------- | --------------------- | --------- | ---------- |
| Admin      | admin@educms.com      | admin123  | Admin      |
| Editor     | editor@educms.com     | editor123 | Editor     |
| Author 1   | author1@educms.com    | author123 | Author     |
| Author 2   | author2@educms.com    | author123 | Author     |
| Subscriber | subscriber@educms.com | sub123    | Subscriber |

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB service is running: `mongod`
- Check MONGODB_URI in .env
- Verify network connectivity to MongoDB instance

### Redis Connection Issues

- Set `REDIS_ENABLED=false` in .env to disable caching
- Ensure Redis service is running: `redis-server`
- Check REDIS_HOST and REDIS_PORT in .env

### File Upload Issues

- Ensure uploads directory exists and is writable
- Check MAX_FILE_SIZE and ALLOWED_FILE_TYPES in .env
- Verify UPLOAD_DIR path is correct

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💼 Author

Master's Degree Project - Educational Content Management System

## 📧 Support

For issues and questions, please refer to the documentation files or open an issue in the repository.

---

**Last Updated:** 2024
