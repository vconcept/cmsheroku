# EduCMS Development Guide

Guidelines and best practices for developing on EduCMS.

## Code Organization

### Directory Structure

```
backend/
├── src/
│   ├── config/           # Configuration modules
│   │   ├── database.js   # MongoDB connection
│   │   └── redis.js      # Redis cache setup
│   ├── models/           # Mongoose schemas
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Category.js
│   │   ├── Tag.js
│   │   └── Media.js
│   ├── controllers/      # Business logic
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   │   ├── categoryController.js
│   │   ├── tagController.js
│   │   ├── mediaController.js
│   │   └── userController.js
│   ├── routes/           # API route definitions
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── tagRoutes.js
│   │   ├── mediaRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # JWT authentication
│   │   ├── validation.js # Input validation
│   │   ├── errorHandler.js # Error handling
│   │   └── upload.js     # File upload handling
│   ├── utils/            # Helper functions
│   │   ├── helpers.js    # Utility functions
│   │   └── logger.js     # Winston logger
│   ├── services/         # Business logic services (todo)
│   │   ├── emailService.js   # Email sending
│   │   └── notificationService.js # Notifications
│   └── app.js            # Express app setup
├── scripts/              # Utility scripts
│   └── seed.js           # Database seeding
├── server.js             # Server entry point
├── package.json
├── .env.example
├── .gitignore
├── Dockerfile            # Docker configuration (todo)
├── docker-compose.yml    # Docker compose (todo)
└── README.md
```

## Coding Standards

### JavaScript Style Guide

#### Variable Naming

```javascript
// ✅ Good
const userId = req.params.id;
const postAuthor = post.author_id;
const isPostPublished = post.status === "published";

// ❌ Bad
const uid = req.params.id;
const author = post.author_id;
const published = post.status === "published";
```

#### Function Naming

```javascript
// ✅ Good - Descriptive verb
async function getUserPosts(userId) {}
function calculateReadingTime(content) {}
function validateEmailFormat(email) {}

// ❌ Bad - Vague naming
async function get(userId) {}
function calc(content) {}
function check(email) {}
```

#### Error Handling

```javascript
// ✅ Good - Explicit error handling
try {
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json(errorResponse("User not found", 404));
  }
  // Process user
} catch (error) {
  logger.error("Get user error:", error.message);
  res.status(500).json(errorResponse("Failed to retrieve user", 500));
}

// ❌ Bad - Silent failures
try {
  const user = await User.findById(userId);
  // Process without checking
} catch (error) {
  console.log("error"); // Don't use console.log
}
```

#### Async/Await Pattern

```javascript
// ✅ Good
async function createPost(req, res) {
  try {
    const post = await Post.create(req.body);
    res.json(successResponse(post));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
}

// ❌ Bad - Mixing callbacks
function createPost(req, res) {
  Post.create(req.body, (err, post) => {
    if (err) res.status(500).json({ error: err });
    else res.json({ post: post });
  });
}
```

### Controller Pattern

```javascript
// ✅ Standard controller structure
exports.getResourceById = async (req, res) => {
  try {
    // 1. Extract and validate inputs
    const { resourceId } = req.params;

    // 2. Query database
    const resource = await Resource.findById(resourceId);

    // 3. Check if resource exists
    if (!resource) {
      return res.status(404).json(errorResponse("Resource not found", 404));
    }

    // 4. Check authorization if needed
    if (resource.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json(errorResponse("Not authorized", 403));
    }

    // 5. Return success response
    res.json(successResponse(resource));
  } catch (error) {
    logger.error("Get resource error:", error.message);
    res.status(500).json(errorResponse("Failed to retrieve resource", 500));
  }
};
```

### Route Pattern

```javascript
// ✅ Clear route definitions with middleware
router.get("/", getResource); // Public
router.get("/:id", getResourceById); // Public
router.post("/", authMiddleware, createResource); // Protected
router.put("/:id", authMiddleware, updateResource); // Protected
router.delete("/:id", authMiddleware, deleteResource); // Protected
router.post(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("admin", "editor"),
  approveResource,
); // Admin/Editor
```

### Model/Schema Pattern

```javascript
// ✅ Complete schema with indexes and hooks
const schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes
schema.index({ email: 1 });
schema.index({ status: 1, createdAt: -1 });

// Hooks
schema.pre("save", async function (next) {
  // Logic before save
  next();
});

// Methods
schema.methods.customMethod = function () {
  // Instance method
};

// Statics
schema.statics.customStatic = function () {
  // Static method
};
```

## Development Workflow

### Starting Development

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Seed database
npm run seed

# 4. Start development server
npm run dev
```

### Making Changes

1. **Create feature branch:**

   ```bash
   git checkout -b feature/feature-name
   ```

2. **Make changes following coding standards**

3. **Test changes:**

   ```bash
   npm test
   ```

4. **Lint code:**

   ```bash
   npm run lint
   ```

5. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: Add feature description"
   ```

### Adding New Endpoint

1. **Create model** (if new collection):

   ```javascript
   // src/models/NewResource.js
   const schema = new Schema({
     /* fields */
   });
   module.exports = mongoose.model("NewResource", schema);
   ```

2. **Create controller:**

   ```javascript
   // src/controllers/newResourceController.js
   exports.getAllNewResources = async (req, res) => {
     /* ... */
   };
   exports.getNewResourceById = async (req, res) => {
     /* ... */
   };
   // ... other actions
   ```

3. **Create routes:**

   ```javascript
   // src/routes/newResourceRoutes.js
   const router = express.Router();
   router.get("/", getAll);
   router.get("/:id", getById);
   // ... other routes
   module.exports = router;
   ```

4. **Register routes in app.js:**

   ```javascript
   app.use(`/api/${apiVersion}/newresources`, newResourceRoutes);
   ```

5. **Document endpoints** in API_DOCUMENTATION.md

### Testing Guidelines

```javascript
// ✅ Good test structure
describe('Post Controller', () => {
  describe('getAllPosts', () => {
    test('should return paginated posts', async () => {
      // Arrange
      const mockPosts = [...];

      // Act
      const response = await request(app)
        .get('/api/v1/posts')
        .query({ page: 1, limit: 10 });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.posts)).toBe(true);
    });
  });
});
```

## Common Tasks

### Add New Field to Existing Model

```javascript
// 1. Update schema
schema.add({ newField: { type: String, default: "" } });

// 2. Run migration (if data transformation needed)
// 3. Update controller to handle new field
// 4. Update API documentation
// 5. Update tests
```

### Add Caching to New Endpoint

```javascript
const cacheKey = `posts:${JSON.stringify(filter)}:${page}`;
let data = await cache.get(cacheKey);

if (!data) {
  data = await Post.find(filter).skip(offset).limit(limit);
  await cache.set(cacheKey, data, 3600); // 1 hour TTL
}

res.json(successResponse(data));
```

### Add Authorization Check

```javascript
// Check if user is owner or admin
if (resource.userId !== req.user.id && req.user.role !== "admin") {
  return res.status(403).json(errorResponse("Not authorized", 403));
}

// Check specific role
if (!["admin", "editor"].includes(req.user.role)) {
  return res.status(403).json(errorResponse("Insufficient permissions", 403));
}
```

### Add Input Validation

```javascript
const { body, validationResult } = require("express-validator");

// In route definition
router.post(
  "/",
  [
    body("email").isEmail(),
    body("name").notEmpty(),
    body("age").isInt({ min: 18 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Continue with controller
  },
);
```

## Performance Optimization

### Database Queries

```javascript
// ✅ Good - Selective field selection
const user = await User.findById(userId).select("name email role");

// ✅ Good - Pagination for large results
const limit = 10;
const offset = (page - 1) * limit;
const posts = await Post.find(filter).skip(offset).limit(limit);

// ❌ Bad - Fetching all records
const users = await User.find(); // Can crash with millions of records

// ❌ Bad - N+1 queries
const posts = await Post.find();
for (const post of posts) {
  post.author = await User.findById(post.author_id); // Multiple queries!
}
```

### Caching Strategy

```javascript
// Cache frequently accessed data
const cacheKey = "featured-posts";
let posts = await cache.get(cacheKey);

if (!posts) {
  posts = await Post.find({ is_featured: true }).limit(5);
  await cache.set(cacheKey, posts, 3600); // 1 hour
}

// Invalidate cache on update
await cache.delPattern("posts:*");
```

### Request Optimization

```javascript
// Use compression middleware
app.use(compression());

// Limit request body size
app.use(express.json({ limit: "10mb" }));

// Use rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);
```

## Debugging

### Using Logger

```javascript
logger.error("Critical error", error); // Error logs
logger.warn("Warning message"); // Warning logs
logger.info("Info message"); // Info logs
logger.debug("Debug info", { data }); // Debug logs
```

### Using Postman

1. Import collection from API_DOCUMENTATION.md
2. Set environment variables
3. Test endpoints with various inputs
4. Check response status and data
5. Verify error handling

### Using Node Debugger

```bash
# Start with debugger
node --inspect server.js

# Open chrome://inspect in Chrome
# Set breakpoints and step through code
```

## Deployment Preparation

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] Code linted with no errors
- [ ] Environment variables configured
- [ ] Database migrations complete
- [ ] API documentation updated
- [ ] Error handling comprehensive
- [ ] Rate limiting configured
- [ ] Security headers set (Helmet)
- [ ] CORS properly configured
- [ ] Logging configured

### Build for Production

```bash
# Set NODE_ENV
export NODE_ENV=production

# Install dependencies
npm ci --production

# Run tests
npm test

# Start server
npm start
```

## Common Issues

### MongoDB Connection Error

```
Solution:
1. Check if MongoDB is running
2. Verify MONGODB_URI in .env
3. Check firewall rules
4. Verify username/password if using auth
```

### JWT Token Issues

```
Solution:
1. Ensure JWT_SECRET matches across instances
2. Check token expiration time
3. Verify Authorization header format: "Bearer <token>"
4. Check token payload structure
```

### File Upload Issues

```
Solution:
1. Ensure /uploads directory is writable
2. Check ALLOWED_FILE_TYPES in .env
3. Verify MAX_FILE_SIZE limit
4. Check disk space availability
```

---

**Last Updated:** 2024
