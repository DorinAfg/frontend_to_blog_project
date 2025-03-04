import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Paper, Divider, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/posts"; // לא שיניתי את ה-URL של הפוסטים

const PostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${API_URL}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log(response.data);  // הדפסת התגובה כדי לראות אם ה-content נמצא כאן
                setPosts(response.data.results || response.data); // התאמה למבנה הנתונים
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleLikePost = async (postId) => {
        try {
            const username = localStorage.getItem('username');
            const token = localStorage.getItem('token'); // קבלת ה-token מ-localStorage
    
            if (!token || !username) {
                console.error("Token or username not found in localStorage");
                return;
            }
    
            const data = {
                post: postId,
                username: username, // שליחת שם המשתמש
            };
    
            const response = await axios.post('http://127.0.0.1:8000/api/likes/create/', data, {
                headers: {
                    Authorization: `Bearer ${token}` // שליחה של הטוקן בכותרת
                }
            });
    
            console.log("Like response:", response);
    
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId ? { ...post, likes_count: post.likes_count + 1 } : post
                )
            );
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        
        try {
            await axios.delete(`${API_URL}/${postId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            
            setPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5, fontFamily: "'Roboto', sans-serif" }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
                    Blog Posts
                </Typography>
            </Box>
            
            <Paper elevation={3} sx={{ bgcolor: '#f9f9f9', borderRadius: 3, p: 3 }}>
                {loading ? (
                    <Typography variant="body1" sx={{ textAlign: 'center', color: '#777' }}>
                        Loading...
                    </Typography>
                ) : posts.length > 0 ? (
                    <List>
                        {posts.map((post) => (
                            <div key={post.id}>
                                <ListItem sx={{ borderBottom: '1px solid #ddd', '&:hover': { bgcolor: '#f0f0f0' } }}>
                                    <ListItemText 
                                        primary={
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#555' }}>
                                                {post.author}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: '4px' }}>
                                                    {post.title}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#777', fontStyle: 'italic' }}>
                                                    Created on: {formatDate(post.created_at)}
                                                </Typography>
                                            </>
                                        }
                                    />
                                    {/* הצגת התוכן של הפוסט */}
                                    <Typography variant="body1" sx={{ color: '#333', mt: 2 }}>
                                        {post.content} {/* הצגת ה-content */}
                                    </Typography>
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
                        No posts found.
                    </Typography>
                )}
            </Paper>
        </Container>
    );
};

export default PostsPage;
