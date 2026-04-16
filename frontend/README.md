# EduCMS Frontend

React-based frontend for the Educational Content Management System with Material-UI.

## Features

- **Authentication**: Login/Register with JWT
- **Dashboard**: Overview of posts, comments, categories, and tags
- **Content Management**: Create, edit, delete posts with WYSIWYG features
- **Media Library**: Upload and manage images and documents
- **Comment Moderation**: Approve/reject user comments
- **Category & Tag Management**: Organize content with categories and tags
- **User Management**: Admin controls for user roles and permissions
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Zustand for state management

## Tech Stack

- **React 18**: UI library
- **Material-UI (MUI 5)**: Component library
- **React Router 6**: Client-side routing
- **Axios**: HTTP client for API calls
- **Zustand**: State management
- **Vite**: Build tool and dev server
- **date-fns**: Date formatting

## Getting Started

### Prerequisites

- Node.js 16+
- npm 8+
- Backend API running on `http://localhost:5000`

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.jsx      # Main layout with sidebar
│   ├── Sidebar.jsx     # Navigation sidebar
│   └── PostCard.jsx    # Post card component
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── PostList.jsx
│   ├── PostDetail.jsx
│   ├── PostEditor.jsx
│   ├── CommentList.jsx
│   ├── CategoryList.jsx
│   ├── TagList.jsx
│   ├── MediaLibrary.jsx
│   └── UserManagement.jsx
├── services/           # API services
│   ├── apiClient.js    # Axios config
│   ├── authService.js  # Auth API calls
│   ├── postService.js  # Post API calls
│   └── index.js        # Other services
├── store/              # Zustand stores
│   ├── authStore.js    # Auth state
│   └── index.js        # Other stores
├── styles/             # CSS
│   └── index.css
├── App.jsx            # Main app component
└── main.jsx           # Entry point
```

## API Integration

The frontend automatically connects to the backend at `http://localhost:5000/api/v1`.

### Services Available

- **Auth**: Login, register, profile management
- **Posts**: CRUD operations with search and filtering
- **Comments**: View, create, approve comments
- **Categories**: Manage content categories
- **Tags**: Create and manage tags
- **Media**: Upload and manage files
- **Users**: Admin user management

## Authentication

- JWT tokens stored in cookies
- Automatic token refresh on requests
- Redirect to login on 401 response
- Test credentials:
  - Admin: `admin@educms.com` / `password123`
  - Editor: `editor@educms.com` / `password123`

## Development Tips

### Adding a New Page

1. Create new file in `src/pages/`
2. Create corresponding API service in `src/services/`
3. Create Zustand store in `src/store/` if needed
4. Add route to `src/App.jsx`
5. Add menu item to `src/components/Sidebar.jsx`

### State Management with Zustand

```javascript
const { data, loading, fetchData } = useMyStore();
```

### Making API Calls

```javascript
import { postService } from "../services/index";

const posts = await postService.getAllPosts({ limit: 10 });
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with Vite
- Lazy loading for routes
- Image optimization
- Caching of API responses

## Troubleshooting

### Backend Connection Issues

If you get CORS errors:

1. Ensure backend is running on port 5000
2. Check CORS_ORIGIN in backend `.env`
3. Verify API proxy in `vite.config.js`

### Authentication Problems

- Clear cookies and localStorage
- Check JWT secret matches backend
- Verify token is in Authorization header

### Build Issues

```bash
rm -rf node_modules
npm install
npm run build
```

## License

MIT

## Support

For issues or questions, contact the development team.
