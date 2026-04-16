# EduCMS - Educational Content Management System

**An Educational Content Management System built with the modern MERN stack**

## Overview

EduCMS is a comprehensive, production-ready educational content management platform built with:

- **Backend:** Node.js + Express + MongoDB
- **Frontend:** React + Material-UI (coming soon)
- **Database:** MongoDB with Mongoose ODM
- **Caching:** Redis for performance
- **Authentication:** JWT-based with role management

The system is designed to manage educational content with advanced features including:

- Full-featured content management (posts, categories, tags)
- User authentication and role-based access control
- Comment moderation workflow
- Media management with file uploads
- Real-time capabilities
- Comprehensive logging and error handling
- Rate limiting and security hardening
- Caching layer for performance optimization

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB 5.0+
- Redis 4.0+ (optional)
- Docker & Docker Compose (optional)

### Local Development

```bash
# 1. Clone repository
cd educms-master

# 2. Setup backend
cd backend
cp .env.example .env
npm install

# 3. Start MongoDB and Redis
# Option A: Using Docker
docker-compose up -d mongodb redis

# Option B: Local installation
# mongod  # in one terminal
# redis-server  # in another terminal

# 4. Seed database
npm run seed

# 5. Start development server
npm run dev
```

The backend API will be available at `http://localhost:5000/api/v1`

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## 📚 Project Structure

```
educms-master/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── config/            # Database & Redis configuration
│   │   ├── models/            # Mongoose schemas (6 models)
│   │   ├── controllers/       # Business logic (7 controllers)
│   │   ├── routes/            # API routes (7 route files)
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── utils/             # Helper functions & logging
│   │   └── app.js             # Express app setup
│   ├── scripts/
│   │   └── seed.js            # Database seeding with Faker
│   ├── server.js              # Server entry point
│   ├── Dockerfile             # Docker configuration
│   ├── .dockerignore
│   ├── package.json           # Dependencies
│   ├── .env.example           # Environment template
│   ├── README.md              # Backend documentation
│   ├── API_DOCUMENTATION.md   # Full API reference
│   ├── DATABASE_SCHEMA.md     # Schema design
│   └── DEVELOPMENT.md         # Development guidelines
├── frontend/                  # React frontend (coming soon)
├── docker-compose.yml         # Full stack Docker setup
└── .gitignore
```

## 🔑 Key Features

### ✅ Core Features

- **User Management** - Registration, authentication, profiles
- **Content Management** - Create, read, update, delete posts
- **Content Organization** - Categories with hierarchy, tags
- **Comment System** - User discussions with moderation workflow
- **Media Management** - File upload and organization
- **Search & Filtering** - Full-text search and advanced filtering
- **Real-time Ready** - Socket.io support (frontend implementation pending)

### ⚡ Performance & Scalability

- **Redis Caching** - 1-hour TTL for frequently accessed data
- **Database Indexing** - Optimized indexes on all query fields
- **Connection Pooling** - MongoDB pool management
- **Compression** - GZIP response compression
- **Rate Limiting** - DDoS protection (100 requests/15 min)

### 🔒 Security

- **Password Security** - bcryptjs hashing with salt rounds
- **JWT Authentication** - Stateless token-based auth
- **Authorization** - Role-based access control (4 roles)
- **Input Validation** - Express-validator on all endpoints
- **Security Headers** - Helmet.js protection
- **CORS** - Configurable cross-origin support

### 📊 Developer Experience

- **Comprehensive Logging** - Winston logger with file persistence
- **Error Handling** - Structured error responses
- **API Documentation** - Complete endpoint documentation
- **Seeding Script** - Pre-populated database with Faker
- **Development Tools** - Nodemon, ESLint, Jest ready

## 📖 Documentation

### Backend Documentation

- [README.md](./backend/README.md) - Backend overview and setup
- [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) - Complete API reference with examples
- [DATABASE_SCHEMA.md](./backend/DATABASE_SCHEMA.md) - Detailed schema design and relationships
- [DEVELOPMENT.md](./backend/DEVELOPMENT.md) - Development guidelines and patterns

### Key API Endpoints

| Method         | Endpoint                        | Purpose                            |
| -------------- | ------------------------------- | ---------------------------------- |
| **Auth**       |                                 |                                    |
| POST           | `/api/v1/auth/register`         | Register new user                  |
| POST           | `/api/v1/auth/login`            | User login (returns JWT)           |
| GET            | `/api/v1/auth/me`               | Get current user (protected)       |
| **Posts**      |                                 |                                    |
| GET            | `/api/v1/posts`                 | List posts (paginated, filterable) |
| POST           | `/api/v1/posts`                 | Create post (protected)            |
| GET            | `/api/v1/posts/:id`             | Get single post                    |
| PUT            | `/api/v1/posts/:id`             | Update post (protected)            |
| DELETE         | `/api/v1/posts/:id`             | Delete post (protected)            |
| **Comments**   |                                 |                                    |
| GET            | `/api/v1/comments/post/:postId` | Get post comments                  |
| POST           | `/api/v1/comments/post/:postId` | Create comment (protected)         |
| POST           | `/api/v1/comments/:id/approve`  | Approve comment (admin/editor)     |
| **Categories** |                                 |                                    |
| GET            | `/api/v1/categories`            | List categories                    |
| POST           | `/api/v1/categories`            | Create category (admin)            |
| **Tags**       |                                 |                                    |
| GET            | `/api/v1/tags`                  | List tags                          |
| GET            | `/api/v1/tags/popular/list`     | Get popular tags                   |
| **Media**      |                                 |                                    |
| POST           | `/api/v1/media/upload`          | Upload file (protected)            |
| GET            | `/api/v1/media/type/:type`      | Get media by type                  |
| **Users**      |                                 |                                    |
| GET            | `/api/v1/users`                 | List users (admin)                 |
| PUT            | `/api/v1/users/:id/role`        | Update user role (admin)           |

See [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) for complete reference.

## 🔐 Test Credentials

After seeding, use these credentials:

| User       | Email                 | Password  | Role       |
| ---------- | --------------------- | --------- | ---------- |
| Admin      | admin@educms.com      | admin123  | Admin      |
| Editor     | editor@educms.com     | editor123 | Editor     |
| Author 1   | author1@educms.com    | author123 | Author     |
| Author 2   | author2@educms.com    | author123 | Author     |
| Subscriber | subscriber@educms.com | sub123    | Subscriber |

## 🛠️ Development

### Available Scripts

```bash
npm start              # Start production server
npm run dev            # Start with hot reload (nodemon)
npm run seed           # Seed database with sample data
npm test               # Run tests
npm run lint           # Run ESLint
```

### Tech Stack

#### Backend

- **Runtime:** Node.js 16+
- **Framework:** Express 4.18
- **Database:** MongoDB 7.0 + Mongoose 7.6
- **Cache:** Redis 4.6
- **Authentication:** JSON Web Tokens (jsonwebtoken 9.0)
- **Password Hashing:** bcryptjs 2.4
- **File Upload:** Multer 1.4
- **Logging:** Winston 3.11
- **Security:** Helmet 7.1, CORS 2.8, express-rate-limit 7.1
- **Validation:** express-validator 7.0
- **Development:** Nodemon 3.0, ESLint 8.55

#### Frontend (Coming Soon)

- **Framework:** React 18
- **UI Library:** Material-UI 5
- **HTTP Client:** Axios
- **State Management:** Redux (optional)
- **Testing:** Vitest + React Testing Library

## 📊 Database Models

### 6 Main Collections:

1. **Users** - Authentication, profiles, role management
2. **Posts** - Content with SEO, versioning, engagement tracking
3. **Categories** - Hierarchical content organization
4. **Tags** - Content labeling and discovery
5. **Comments** - Threaded discussions with moderation
6. **Media** - File uploads with metadata

See [DATABASE_SCHEMA.md](./backend/DATABASE_SCHEMA.md) for detailed design.

## 🚀 Deployment

### Docker Deployment

```bash
docker-compose up -d
```

Includes:

- MongoDB service with persistent storage
- Redis service for caching
- EduCMS backend service
- Health checks and auto-restart

### Cloud Deployment Ready

Configuration supports deployment to:

- Heroku
- Render
- AWS (EC2, Elastic Beanstalk)
- DigitalOcean
- Google Cloud
- Azure

See backend [README.md](./backend/README.md) for deployment guides.

## 📋 Environment Configuration

Create `.env` file in backend directory (copy from `.env.example`):

```env
# Database
MONGODB_URI=mongodb://localhost:27017/educms
MONGODB_POOL_SIZE=10

# Cache
REDIS_ENABLED=true
REDIS_HOST=localhost
REDIS_PORT=6379

# Authentication
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development
API_VERSION=v1
FRONTEND_URL=http://localhost:3000

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp,application/pdf
```

## 🐛 Troubleshooting

### MongoDB Connection Failed

```
Solution:
1. Ensure MongoDB is running: mongod
2. Check MONGODB_URI in .env
3. If using Docker: docker-compose logs mongodb
```

### Redis Connection Failed

```
Solution:
1. Set REDIS_ENABLED=false in .env to disable caching
2. Or start Redis: redis-server
3. If using Docker: docker-compose logs redis
```

### Port Already in Use

```
Solution:
# Change PORT in .env or run on different port:
PORT=5001 npm run dev
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- authController.test.js
```

## 📝 Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Follow code style in [DEVELOPMENT.md](./backend/DEVELOPMENT.md)
3. Write tests for new features
4. Ensure all tests pass: `npm test`
5. Commit changes: `git commit -m "feat: Add feature"`
6. Push and create pull request

## 📚 Learning Resources

- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [REST API Best Practices](https://restfulapi.net/)

## 🎯 Roadmap

### Phase 1 (Complete) ✅

- [x] Backend API setup with Express
- [x] MongoDB models and schemas
- [x] User authentication (JWT)
- [x] CRUD operations for posts, categories, tags
- [x] Comment moderation system
- [x] Media file uploads
- [x] Caching with Redis
- [x] Error handling & logging
- [x] API documentation

### Phase 2 (Next)

- [ ] Frontend with React & Material-UI
- [ ] Real-time features with Socket.io
- [ ] Search optimization with Elasticsearch
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Two-factor authentication

### Phase 3 (Future)

- [ ] Mobile app (React Native)
- [ ] GraphQL API
- [ ] Microservices architecture
- [ ] AI-powered content recommendations
- [ ] Multi-language support

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💼 Author

Master's Degree Project - Educational Content Management System

## 📧 Support

For issues, questions, or feedback:

1. Check [Troubleshooting](#-troubleshooting) section
2. Review relevant documentation files
3. Open an issue with detailed description

---

**Version:** 1.0.0  
**Last Updated:** April 16, 2026  
**Status:** Production Ready 
