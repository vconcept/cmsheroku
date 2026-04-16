import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { usePostStore, useCategoryStore, useTagStore } from '../store/index';
import PostCard from '../components/PostCard';

function Dashboard() {
  const { posts, loading: postsLoading, error: postsError, fetchPosts } = usePostStore();
  const { categories, loading: catsLoading, error: catsError, fetchCategories } = useCategoryStore();
  const { tags, loading: tagsLoading, error: tagsError, fetchTags } = useTagStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPosts({ limit: 5 });
        await fetchCategories();
        await fetchTags();
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    };
    
    fetchData();
  }, [fetchPosts, fetchCategories, fetchTags]);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 2,
              backgroundColor: color,
              borderRadius: 2,
              display: 'flex',
            }}
          >
            <Icon sx={{ color: 'white', fontSize: 32 }} />
          </Box>
          <Box>
            <Typography color="textSecondary" variant="body2">
              {title}
            </Typography>
            <Typography variant="h5">{value}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography color="textSecondary">
          Welcome to your Educational Content Management System
        </Typography>
      </Box>

      {/* Error Messages */}
      {(postsError || catsError || tagsError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {postsError || catsError || tagsError}
        </Alert>
      )}

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={ArticleIcon}
            title="Total Posts"
            value={posts.length}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={CategoryIcon}
            title="Categories"
            value={categories.length}
            color="#388e3c"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={LocalOfferIcon}
            title="Tags"
            value={tags.length}
            color="#7b1fa2"
          />
        </Grid>
      </Grid>

      {/* Recent Posts */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Recent Posts
        </Typography>

        {postsLoading ? (
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
              No posts yet. Create your first post to get started!
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default Dashboard;
