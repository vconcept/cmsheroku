import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

function PostCard({ post }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 4 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" component="div">
            {post.title}
          </Typography>
          <Chip
            label={post.status}
            size="small"
            color={post.status === 'published' ? 'success' : 'default'}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {post.author_id?.username?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="caption" display="block">
              {post.author_id?.username}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {post.created_at ? (() => {
                const date = new Date(post.created_at);
                return isNaN(date.getTime()) 
                  ? 'Just now' 
                  : formatDistanceToNow(date, { addSuffix: true });
              })() : 'Just now'}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
          }}
        >
          {post.excerpt || post.content}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
          {post.tags?.slice(0, 3).map((tag) => (
            <Chip
              key={tag._id}
              label={tag.name}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>

        <Typography variant="caption" color="textSecondary">
          {post.view_count || 0} views • {post.comment_count || 0} comments
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          onClick={() => navigate(`/posts/${post._id}`)}
        >
          View
        </Button>
        <Button
          size="small"
          onClick={() => navigate(`/posts/${post._id}/edit`)}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  );
}

export default PostCard;
