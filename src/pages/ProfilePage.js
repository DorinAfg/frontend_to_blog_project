import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Card, CardContent, CardMedia, IconButton, CircularProgress, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api";

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set()); // לשמור את הפוסטים שעליהם עשינו לייק

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
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        });
        const userPosts = response.data.results.filter(post => post.author === username);
        setPosts(userPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    if (username) {
      fetchPosts();
    }
  }, [username]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await axios.delete(`${API_URL}/posts/${postId}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
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
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found");
      alert("You must be logged in to like posts.");
      return;
    }

    // אם כבר עשינו לייק על הפוסט
    if (likedPosts.has(postId)) {
      alert("You have already liked this post!");
      return;
    }

    try {
      // שליחה של בקשה ללייק
      const response = await axios.post(
        `${API_URL}/likes/create/`,
        { post: postId },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Like response:", response);

      // עדכון המצב: הוסף את הפוסט לרשימת הלייקים
      setLikedPosts((prevLikedPosts) => new Set(prevLikedPosts).add(postId));
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes_count: (post.likes_count || 0) + 1 } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
      alert("Failed to like the post.");
    }
  };

  return (
    <Container maxWidth="sm">
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ mt: 3 }}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} sx={{ mb: 2, boxShadow: 3, borderRadius: 2, maxWidth: 350, mx: 'auto' }}>
                {post.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.image}
                    alt="Post Image"
                    sx={{ objectFit: "cover" }}
                  />
                )}
                <CardContent>
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: "#555" }}>
                    {post.author}
                  </Typography>

                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mt: 1 }}>
                    {post.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "#777", mt: 1 }}>
                    {post.content}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "#888", fontStyle: "italic", mt: 1 }}>
                    Created on: {formatDate(post.created_at)}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton onClick={() => handleLikePost(post.id)} color="error">
                        <FavoriteIcon />
                      </IconButton>
                      <Typography variant="body2" sx={{ color: "#777", ml: 1 }}>
                        {post.likes_count || 0}
                      </Typography>
                    </Box>

                    <IconButton onClick={() => handleDeletePost(post.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Alert severity="info" sx={{ textAlign: 'center' }}>No posts yet</Alert>
          )}
        </Box>
      )}
    </Container>
  );
};

export default ProfilePage;
