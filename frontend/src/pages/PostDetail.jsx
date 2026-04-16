import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Avatar,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { usePostStore } from '../store/index';

function PostDetail() {
  const { id } = useParams();
  const { currentPost, loading, fetchPostById } = usePostStore();

  useEffect(() => {
    fetchPostById(id);
  }, [id, fetchPostById]);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!currentPost) {
    return (
      <Container>
        <Paper sx={{ p: 3 }}>
          <Typography color="error">Post not found</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {currentPost.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar>
            {currentPost.author_id?.username?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2">
              {currentPost.author_id?.username}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {formatDistanceToNow(new Date(currentPost.createdAt), {
                addSuffix: true,
              })}
            </Typography>
          </Box>
        </Box>

        {currentPost.featured_image && (
          <Box
            component="img"
            src={currentPost.featured_image}
            alt={currentPost.title}
            sx={{ width: '100%', mb: 3, maxHeight: 400, objectFit: 'cover' }}
          />
        )}

        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          {currentPost.tags?.map((tag) => (
            <Chip key={tag._id} label={tag.name} />
          ))}
        </Box>

        <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
          {currentPost.content}
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, pt: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="caption">
            <strong>{currentPost.view_count || 0}</strong> views
          </Typography>
          <Typography variant="caption">
            <strong>{currentPost.like_count || 0}</strong> likes
          </Typography>
          <Typography variant="caption">
            <strong>{currentPost.comment_count || 0}</strong> comments
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default PostDetail;
