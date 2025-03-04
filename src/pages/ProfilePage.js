import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Paper, Divider, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api"; 

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // מצב טעינה

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      console.error("Username not found in localStorage");
      setUsername("User");
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const userPosts = response.data.results.filter(post => post.author === username);
        setPosts(userPosts);
        setLoading(false); // עדכון מצב טעינה אחרי שהפוסטים נטענו
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false); // עדכון מצב טעינה אם הייתה שגיאה
      }
    };

    if (username) {
      fetchPosts();
    }
  }, [username]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await axios.delete(`${API_URL}/posts/${postId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.status === 204) {
          setPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
          console.log("Post deleted successfully.");
        } else {
          console.error("Failed to delete post:", response.data);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleLikePost = async (postId) => {
    try {
        await axios.post("http://127.0.0.1:8000/api/likes/create/", 
            { post_id: postId }, // שולחים את ה-ID בגוף הבקשה
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
            }
        );

        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId ? { ...post, likes_count: post.likes_count + 1 } : post
            )
        );
    } catch (error) {
        console.error('Error liking post:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, fontFamily: "'Roboto', sans-serif" }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
          {loading ? "Loading..." : `Welcome, ${username || 'User'}!`}
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 500, color: '#555' }}>
          Your Posts:
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ bgcolor: '#f9f9f9', borderRadius: 3, p: 3 }}>
        {posts.length > 0 ? (
          <List>
            {posts.map((post) => (
              <div key={post.id}>
                <ListItem sx={{ borderBottom: '1px solid #ddd', '&:hover': { bgcolor: '#223b63' } }}>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#555' }}>
                        {post.author}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', marginBottom: '4px' }}>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#777', fontStyle: 'italic' }}>
                          Created on: {formatDate(post.created_at)}
                        </Typography>
                      </>
                    }
                  />
                  <IconButton onClick={() => handleLikePost(post.id)} sx={{ ml: 2 }} color="primary">
                    <ThumbUpIcon />
                  </IconButton>
                  <Typography variant="body2" sx={{ color: '#777', fontWeight: 500, ml: 1 }}>
                    {post.likes_count}
                  </Typography>
                  <IconButton onClick={() => handleDeletePost(post.id)} sx={{ ml: 2 }} color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', fontStyle: 'italic', color: '#777' }}>
            No posts yet.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ProfilePage;
