import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Button,
  TextField,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { usePostStore } from '../store/index';
import PostCard from '../components/PostCard';

function PostList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { posts, loading, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchPosts({ search: searchTerm });
    } else {
      fetchPosts();
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Posts
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/posts/new')}
          >
            New Post
          </Button>
        </Box>

        <form onSubmit={handleSearch}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
            <Button type="submit" variant="outlined">
              Search
            </Button>
          </Box>
        </form>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : posts.length > 0 ? (
        <Box>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </Box>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography color="textSecondary" align="center">
            No posts found. Create your first post!
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

export default PostList;
