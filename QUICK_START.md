# EduCMS Quick Start Guide

Get EduCMS running in minutes!

## 5-Minute Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env if needed, defaults should work for local development
```

### 3. Start Database Services

**Option A: Using Docker (Recommended)**

```bash
docker-compose up -d mongodb redis
```

**Option B: Local Installation**

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Redis
redis-server
```

### 4. Seed Database

```bash
npm run seed
```

This creates:

- 5 test users with different roles
- 5 categories
- 10 tags
- 12 blog posts
- 30+ comments

### 5. Start Development Server

```bash
npm run dev
```

API is now running at: **http://localhost:5000/api/v1**

---

## 🔐 Login & Test

### Test Accounts

Use these to test the API in Postman or via curl:

**Admin Account:**

- Email: `admin@educms.com`
- Password: `admin123`
- Role: Admin (full access)

**Author Account:**

- Email: `author1@educms.com`
- Password: `author123`
- Role: Author (can create posts)

**Subscriber Account:**

- Email: `subscriber@educms.com`
- Password: `sub123`
- Role: Subscriber (read-only)

---

## 🧪 Test API Endpoints

### Get JWT Token

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author1@educms.com",
    "password": "author123"
  }'
```

Response includes `token` - save this!

### Use Token for Protected Requests

```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get All Posts

```bash
curl http://localhost:5000/api/v1/posts
```

### Create a Post (Protected)

```bash
curl -X POST http://localhost:5000/api/v1/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "<p>Hello world!</p>",
    "excerpt": "My first post",
    "status": "draft"
  }'
```

---

## 📚 API Documentation

All endpoints are documented in **API_DOCUMENTATION.md**

### Common Endpoints

| Method | Path                     | Purpose                 |
| ------ | ------------------------ | ----------------------- |
| POST   | `/auth/login`            | Get JWT token           |
| GET    | `/posts`                 | List all posts          |
| POST   | `/posts`                 | Create post (protected) |
| GET    | `/posts/:id`             | Get single post         |
| PUT    | `/posts/:id`             | Update post (protected) |
| DELETE | `/posts/:id`             | Delete post (protected) |
| GET    | `/categories`            | List categories         |
| GET    | `/tags`                  | List tags               |
| GET    | `/tags/popular/list`     | Popular tags            |
| POST   | `/comments/post/:postId` | Add comment (protected) |

---

## 🛠️ Development Commands

```bash
npm start              # Production server
npm run dev            # Development with hot reload
npm run seed           # Seed database
npm test               # Run tests
npm run lint           # Check code style
npm run lint -- --fix  # Auto-fix style issues
```

---

## 🐛 Common Issues & Solutions

### "MongoDB connection failed"

```
✅ Solution:
1. Start MongoDB: mongod
2. Or: docker-compose up -d mongodb
3. Check MONGODB_URI in .env
```

### "Redis connection error"

```
✅ Solution:
1. Start Redis: redis-server
2. Or: docker-compose up -d redis
3. Or set REDIS_ENABLED=false in .env
```

### "Port 5000 already in use"

```
✅ Solution:
1. Kill existing process: lsof -ti:5000 | xargs kill -9
2. Or change PORT in .env: PORT=5001 npm run dev
```

### "File upload not working"

```
✅ Solution:
1. Create uploads directory: mkdir uploads
2. Check permissions: chmod 755 uploads
3. Check MAX_FILE_SIZE in .env
```

---

## 📂 Project Structure Quick Reference

```
backend/
├── src/
│   ├── models/          # 6 MongoDB schemas
│   ├── controllers/     # 7 business logic files
│   ├── routes/          # 7 API route files
│   ├── middleware/      # Auth, validation, errors
│   ├── config/          # Database & Redis setup
│   ├── utils/           # Helper functions
│   └── app.js           # Express setup
├── scripts/seed.js      # Generate test data
├── server.js            # Entry point
├── package.json         # Dependencies
├── .env.example         # Configuration template
└── README.md            # Full documentation
```

---

## 🚀 Full Docker Setup

Run entire stack with one command:

```bash
# Start all services (MongoDB, Redis, Backend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop everything
docker-compose down

# Remove volumes (data)
docker-compose down -v
```

---

## 📖 Documentation Files

- **README.md** - Full project overview
- **API_DOCUMENTATION.md** - Complete API reference with examples
- **DATABASE_SCHEMA.md** - Data model design
- **DEVELOPMENT.md** - Development patterns & guidelines
- **QUICK_START.md** - This file (quick reference)

---

## ⚡ Next Steps

1. ✅ API is running locally
2. 📖 Read API_DOCUMENTATION.md for all endpoints
3. 🧪 Test endpoints with Postman or curl
4. 🔑 Use test credentials to authenticate
5. 💻 Start building frontend with React
6. 🚀 Deploy to cloud platform

---

## 🤔 Need Help?

1. Check **DEVELOPMENT.md** for common patterns
2. Review **DATABASE_SCHEMA.md** for data structure
3. See **API_DOCUMENTATION.md** for endpoint examples
4. Check logs: `npm run dev` outputs all activity

---

## 🎯 What's Included

✅ Complete backend API with 7 controllers  
✅ 6 MongoDB models with relationships  
✅ User authentication with JWT  
✅ Role-based access control  
✅ Comment moderation workflow  
✅ File upload support  
✅ Redis caching layer  
✅ Comprehensive logging  
✅ Input validation  
✅ Error handling  
✅ Docker configuration  
✅ Database seeding  
✅ API documentation

---

**Happy coding!** 🚀

For detailed information, see the main [README.md](./README.md)
