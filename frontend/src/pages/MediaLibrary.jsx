import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  ImageList,
  ImageListItem,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useMediaStore } from '../store/index';

function MediaLibrary() {
  const { media, loading, fetchMedia, uploadMedia } = useMediaStore();

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        try {
          await uploadMedia(file);
        } catch (err) {
          console.error('Upload failed:', err);
        }
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Media Library
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component="label"
        >
          Upload
          <input
            hidden
            multiple
            type="file"
            onChange={handleFileUpload}
            accept="image/*,application/pdf"
          />
        </Button>
      </Box>

      {media.length > 0 ? (
        <ImageList sx={{ width: '100%' }} cols={3} gap={8}>
          {media.map((item) => (
            <ImageListItem key={item._id}>
              <img
                src={item.url}
                alt={item.alt_text}
                loading="lazy"
                style={{ width: '100%', height: 200, objectFit: 'cover' }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography color="textSecondary" align="center">
            No media found. Upload your first image!
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

export default MediaLibrary;
