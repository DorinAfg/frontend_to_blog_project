import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Box, Typography, Card, CardMedia, CardContent, IconButton, CircularProgress, Alert } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite'; // שימוש ב-FavoriteIcon
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = "http://127.0.0.1:8000/api";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likedPosts, setLikedPosts] = useState(new Set()); // לשמור את הפוסטים שעליהם עשינו לייק
  const [likeError, setLikeError] = useState(""); // הודעה במקרה של לייק כפול

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts/`);
        setPosts(response.data.results || response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(`Error fetching posts: ${err.response?.data?.detail || err.message}`);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (!token) {
          console.error("No token found");
          setError("You must be logged in to delete posts.");
          return;
        }

        const response = await axios.delete(`${API_URL}/posts/${postId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.status === 204) {
          setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
          console.log("Post deleted successfully.");
        } else {
          console.error("Failed to delete post:", response.data);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        setError("Failed to delete the post.");
      }
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      console.log("Post ID:", postId);

      if (!token) {
        console.error("No token found");
        setError("You must be logged in to like posts.");
        return;
      }

      // אם כבר עשינו לייק על הפוסט
      if (likedPosts.has(postId)) {
        setLikeError("You have already liked this post!");
        return;
      }

      // אם הפוסט לא בלייקים, נוסיף את הלייק
      const response = await axios.post(
        `${API_URL}/likes/create/`,
        {
          post: postId,
        },
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
      setLikeError(""); // מנקה את הודעת השגיאה במקרה של לייק מוצלח
    } catch (error) {
      console.error("Error liking post:", error);
      setError("Failed to like the post.");
      console.error("Error response:", error.response?.data);
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
                    {/* הלייק (לב אדום) */}
                    <IconButton onClick={() => handleLikePost(post.id)} color="error">
                      <FavoriteIcon />
                    </IconButton>

                    {/* מספר הלייקים */}
                    <Typography variant="body2" sx={{ color: "#777", mr: 1 }}>
                      {post.likes_count || 0}
                    </Typography>

                    {/* כפתור מחיקה (הפח) בצד ימין */}
                    <IconButton onClick={() => handleDeletePost(post.id)} color="error" sx={{ ml: "auto" }}>
                      <DeleteIcon />
                    </IconButton>
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
      )}
    </Container>
  );
};

export default PostsPage;
