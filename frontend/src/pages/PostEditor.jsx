import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip,
} from '@mui/material';
import { usePostStore } from '../store/index';
import { useCategoryStore, useTagStore } from '../store/index';

function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category_id: '',
    tags: [],
    status: 'draft',
    featured_image: '',
  });
  const [errors, setErrors] = useState({});

  const { currentPost, loading, createPost, updatePost, fetchPostById } = usePostStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { tags, fetchTags } = useTagStore();

  useEffect(() => {
    fetchCategories();
    fetchTags();

    if (id) {
      fetchPostById(id);
    }
  }, [id, fetchCategories, fetchTags, fetchPostById]);

  useEffect(() => {
    if (currentPost && id) {
      setFormData({
        title: currentPost.title,
        content: currentPost.content,
        excerpt: currentPost.excerpt,
        category_id: currentPost.category_id?._id || '',
        tags: currentPost.tags?.map((t) => t._id) || [],
        status: currentPost.status,
        featured_image: currentPost.featured_image,
      });
    }
  }, [currentPost, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      tags: event.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (id) {
        await updatePost(id, formData);
      } else {
        await createPost(formData);
      }
      navigate('/posts');
    } catch (err) {
      // Error is handled by the store
    }
  };

  if (loading && id) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {id ? 'Edit Post' : 'Create New Post'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.title}
            helperText={errors.title}
          />

          <FormControl fullWidth margin="normal" error={!!errors.category_id}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              name="tags"
              value={formData.tags}
              onChange={handleTagChange}
              label="Tags"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const tag = tags.find((t) => t._id === value);
                    return tag ? <Chip key={value} label={tag.name} /> : null;
                  })}
                </Box>
              )}
            >
              {tags.map((tag) => (
                <MenuItem key={tag._id} value={tag._id}>
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={2}
          />

          <TextField
            fullWidth
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={10}
            required
            error={!!errors.content}
            helperText={errors.content}
          />

          <TextField
            fullWidth
            label="Featured Image URL"
            name="featured_image"
            value={formData.featured_image}
            onChange={handleChange}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              type="submit"
              size="large"
            >
              {id ? 'Update Post' : 'Create Post'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/posts')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default PostEditor;
