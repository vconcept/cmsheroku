import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import PostEditor from './pages/PostEditor';
import CommentList from './pages/CommentList';
import CategoryList from './pages/CategoryList';
import TagList from './pages/TagList';
import MediaLibrary from './pages/MediaLibrary';
import UserManagement from './pages/UserManagement';
import { useAuthStore } from './store/authStore';
import { authService } from './services/authService';

function App() {
  const { isAuthenticated, setUser } = useAuthStore();
  
  useEffect(() => {
    // Check if user is already logged in
    const user = authService.getCurrentUser();
    if (user) {
      setUser(user);
    }
  }, [setUser]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={isAuthenticated ? (
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/posts" element={<PostList />} />
                <Route path="/posts/new" element={<PostEditor />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/posts/:id/edit" element={<PostEditor />} />
                <Route path="/comments" element={<CommentList />} />
                <Route path="/categories" element={<CategoryList />} />
                <Route path="/tags" element={<TagList />} />
                <Route path="/media" element={<MediaLibrary />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" />
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
