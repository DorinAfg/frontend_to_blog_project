import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/posts/";

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      console.log("Selected image:", file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !content) {
      setError("Title and Content are required");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("You must be logged in to create a post");
        return;
      }

      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`,
        },
      });

      if (response.status === 201) {
        console.log("Post created successfully:", response.data);
        navigate('/posts');
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (err) {
      console.error("Error occurred:", err);
      setError(err.response?.data?.detail || 'Failed to create post');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper sx={{ padding: 4, borderRadius: 2, boxShadow: 6 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
          Create New Post
        </Typography>

        {error && <Typography variant="body1" color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{
              borderRadius: 2,
              backgroundColor: '#f5f5f5',
              '&:hover': { backgroundColor: '#e0e0e0' },
              '& .MuiInputBase-root': { borderRadius: 2 },
            }}
          />
          <TextField
            label="Content"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            sx={{
              borderRadius: 2,
              backgroundColor: '#f5f5f5',
              '&:hover': { backgroundColor: '#e0e0e0' },
              '& .MuiInputBase-root': { borderRadius: 2 },
            }}
          />
          <Box sx={{ marginTop: 2 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                padding: '8px',
                display: 'block',
                width: '100%',
                backgroundColor: '#fafafa',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 2,
                padding: '10px 20px',
                '&:hover': { backgroundColor: '#303f9f' },
                boxShadow: 3,
              }}
            >
              Create Post
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreatePost;
