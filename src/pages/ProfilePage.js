import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Container, Box, Typography, Card, CardMedia, CardContent, IconButton, Alert, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText 
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite'; 
import DeleteIcon from '@mui/icons-material/Delete'; // אייקון פח הזבל

const API_URL = "http://127.0.0.1:8000/api";

const ProfilePage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likedUsers, setLikedUsers] = useState([]); // לשמור את המשתמשים שעשו לייק
  const [openLikesDialog, setOpenLikesDialog] = useState(false); // דיאלוג להצגת המשתמשים
  const username = localStorage.getItem("username") || "";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts/`);
        const userPosts = response.data.results.filter(post => post.author === username);
        setPosts(userPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Error fetching posts.");
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_URL}/comments/`);
        setComments(response.data.results || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Error fetching comments.");
      }
    };

    if (username) {
      fetchPosts();
      fetchComments();
    }
  }, [username]);

  const handleLikePost = async (postId) => {
    if (likedPosts.has(postId)) return;

    try {
      await axios.post(`${API_URL}/likes/create/`, { post: postId });
      setLikedPosts((prevLikedPosts) => new Set(prevLikedPosts).add(postId));
    } catch (error) {
      setError("Failed to like the post.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`${API_URL}/posts/${postId}/`);
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } catch (error) {
        setError("Failed to delete the post.");
      }
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/comments/`, {
        post: postId,
        content: newComment,
        author: username,  
      });

      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment("");
    } catch (error) {
      setError("Failed to add comment.");
    }
  };

  const fetchLikedUsers = async (postId) => {
    try {
      const response = await axios.get(`${API_URL}/likes/?post=${postId}`);
      setLikedUsers(response.data.results);
      setOpenLikesDialog(true); // פתיחת הדיאלוג לאחר שליפה
    } catch (error) {
      setError("Failed to fetch liked users.");
    }
  };

  return (
    <Container maxWidth="sm">
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ mt: 3 }}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} sx={{ mb: 2, boxShadow: 3, borderRadius: 2, maxWidth: 350, mx: "auto" }}>
              {post.image && (
                <CardMedia component="img" height="200" image={post.image} alt="Post Image" sx={{ objectFit: "cover" }} />
              )}
              <CardContent>
                <Typography variant="body2" sx={{ color: "#555", fontWeight: "bold" }}>
                  {post.author} {/* שם המשתמש */}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mt: 1 }}>
                  {post.title}
                </Typography>

                <Typography variant="body2" sx={{ color: "#777", mt: 1 }}>
                  {post.content}
                </Typography>

                <Typography variant="body2" sx={{ color: "#888", fontStyle: "italic", mt: 1 }}>
                  Created on: {new Date(post.created_at).toLocaleDateString()}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <Typography variant="body2" sx={{ color: "#777", mr: 1 }}>
                    {post.likes_count || 0}
                  </Typography>
                  <IconButton onClick={() => handleLikePost(post.id)} color="error">
                    <FavoriteIcon />                    
                  </IconButton>
                  <IconButton onClick={() => handleDeletePost(post.id)} color="error" sx={{ ml: "auto" }}>
                    <DeleteIcon /> {/* אייקון פח הזבל */}
                  </IconButton>
                  <IconButton onClick={() => fetchLikedUsers(post.id)} color="primary" sx={{ ml: 1 }}>
                    {/* אייקון להצגת המשתמשים שעשו לייק */}
                    <Typography variant="body2">View Likes</Typography>
                  </IconButton>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>Comments:</Typography>
                  {comments.filter(comment => comment.post === post.id).length === 0 ? (
                    <Typography variant="body2" sx={{ color: "#777" }}>No comments yet.</Typography>
                  ) : (
                    comments.filter(comment => comment.post === post.id).map((comment) => (
                      <Box key={comment.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: "#555", flex: 1 }}>
                          {comment.author}: {comment.content}
                        </Typography>
                      </Box>
                    ))
                  )}

                  <TextField
                    label="Add a comment"
                    variant="outlined"
                    fullWidth
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  <Button onClick={() => handleAddComment(post.id)} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Add Comment
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Alert severity="info" sx={{ textAlign: "center" }}>
            No posts yet
          </Alert>
        )}
      </Box>

      {/* דיאלוג להצגת המשתמשים שעשו לייק */}
      <Dialog open={openLikesDialog} onClose={() => setOpenLikesDialog(false)}>
        <DialogTitle>Liked Users</DialogTitle>
        <DialogContent>
          {likedUsers.length > 0 ? (
            <List>
              {likedUsers.map((user, index) => (
                <ListItem key={index}>
                  <ListItemText primary={user.username} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" sx={{ color: "#777" }}>
              No users liked this post.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLikesDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
