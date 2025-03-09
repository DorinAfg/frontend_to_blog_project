import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Box, Typography, Card, CardMedia, CardContent, IconButton, CircularProgress, Alert, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite'; 
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = "http://127.0.0.1:8000/api";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likeError, setLikeError] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [openLikesDialog, setOpenLikesDialog] = useState(false); 
  const [likedUsers, setLikedUsers] = useState([]); 
  const [visibleComments, setVisibleComments] = useState(3);

  const fetchPosts = async (page) => {
    try {
      const response = await axios.get(`${API_URL}/posts/`, {
        params: { page: page, page_size: 5 },
      });

      if (response.data.results) {
        setPosts(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 5)); 
      } else {
        setError("Invalid page or page size.");
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(`Error fetching posts: ${err.response?.data?.detail || err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage); 
  }, [currentPage]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/comments/`);
      const formattedComments = response.data.results || [];
      setComments(formattedComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Error fetching comments.");
    }
  };

  useEffect(() => {
    fetchComments(); 
  }, []); 

  const fetchLikedUsers = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(`${API_URL}/likes/?post=${postId}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      console.log("Fetched liked users:", response.data);  

      if (response.data && response.data.results) {
        const likedUsers = response.data.results.map(like => like.user);
        setLikedUsers(likedUsers);
      }

      setOpenLikesDialog(true); 
    } catch (error) {
      console.error("Error fetching liked users:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeletePost = async (postId, postAuthor) => {
    const username = localStorage.getItem("username"); 
    if (username !== postAuthor) {
      setError("You can only delete posts that you have authored.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          setError("You must be logged in to delete posts.");
          return;
        }

        await axios.delete(`${API_URL}/posts/${postId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
        setError("Failed to delete the post.");
      }
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to like posts.");
        return;
      }

      if (likedPosts.has(postId)) {
        setLikeError("You have already liked this post!");
        return;
      }

      await axios.post(
        `${API_URL}/likes/create/`,
        { post: postId },
        { headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" } }
      );

      setLikedPosts((prevLikedPosts) => new Set(prevLikedPosts).add(postId));
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes_count: (post.likes_count || 0) + 1 } : post
        )
      );
      setLikeError("");
    } catch (error) {
      setError("Failed to like the post.");
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("User is not authenticated.");
        return;
      }

      const data = { comment: commentId };

      const response = await axios.post(
        `${API_URL}/likes/create/`,
        data,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes_count: (comment.likes_count || 0) + 1 }
            : comment
        )
      );
    } catch (error) {
      console.error("Error liking the comment:", error);
    }
  };

  const handleCommentClick = (postId) => {
    return comments.filter((comment) => comment.post === postId);
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to post comments.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/comments/`,
        { post: postId, content: newComment },
        { headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" } }
      );

      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error.response);
      setError("Failed to add comment.");
    }
  };

  return (
    <Container maxWidth="sm">
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{ mt: 3 }}>
          {likeError && <Alert severity="info">{likeError}</Alert>}
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card
                key={post.id}
                sx={{
                  mb: 2,
                  boxShadow: 3,
                  borderRadius: 2,
                  maxWidth: 350,
                  mx: "auto",
                }}
              >
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

                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Typography variant="body2" sx={{ color: "#777", mr: 1 }}>
                      {post.likes_count || 0}
                    </Typography>

                    <IconButton
                      onClick={() => handleLikePost(post.id)}
                      color={likedPosts.has(post.id) ? "error" : "default"}
                    >
                      <FavoriteIcon />
                    </IconButton>

                    <IconButton onClick={() => handleDeletePost(post.id, post.author)} color="error" sx={{ ml: "auto" }}>
                      <DeleteIcon />
                    </IconButton>

                    <Button onClick={() => fetchLikedUsers(post.id)}>View Likes</Button>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>Comments:</Typography>
                    {handleCommentClick(post.id).slice(0, visibleComments).map((comment) => (
                      <Box key={comment.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: "#777", mr: 1 }}>
                          {comment.likes_count || 0}
                        </Typography>

                        <IconButton
                          onClick={() => handleLikeComment(comment.id)}
                          sx={{ color: "pink", fontSize: 20, mr: 1 }}
                        >
                          <FavoriteIcon />
                        </IconButton>

                        <Typography variant="body2" sx={{ color: "#555", flex: 1 }}>
                          {comment.author}: {comment.content}
                        </Typography>
                      </Box>
                    ))}
                    
                    {handleCommentClick(post.id).length > visibleComments && (
                      <Button onClick={() => setVisibleComments(visibleComments + 3)} sx={{ mt: 2 }}>
                        See more
                      </Button>
                    )}

                    <TextField
                      label="Add a comment"
                      variant="outlined"
                      fullWidth
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      sx={{ mt: 2 }}
                    />
                    <Button
                      onClick={() => handleAddComment(post.id)}
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                    >
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
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}
      
      <Dialog open={openLikesDialog} onClose={() => setOpenLikesDialog(false)}>
        <DialogTitle>Liked Users</DialogTitle>
        <DialogContent>
          {likedUsers.length > 0 ? (
            likedUsers.map((username, index) => (
              <Typography key={index} variant="body2">
                {username}
              </Typography>
            ))
          ) : (
            <Typography variant="body2">No likes yet</Typography>
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

export default PostsPage;
