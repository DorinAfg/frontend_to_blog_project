import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ייבוא axios לשליחת בקשה ל-API

const API_URL = "http://127.0.0.1:8000/api/posts"; // ה-URL ל-API של הפוסטים

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // לאתחל את השגיאה

        try {
            const token = localStorage.getItem('token');
                           console.log('Token:', token);

            if (!token) {
                setError("You must be logged in to create a post");
                return;
            }

            // יצירת פוסט חדש על ידי שליחת נתונים ל-API
            const response = await axios.post(API_URL, {
                title,
                content,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // שליחה של ה-token בכותרת
                },
            });

            // במקרה של הצלחה, הניווט יבוצע לעמוד הפוסטים
            if (response.status === 201) {
                navigate('/posts');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create post');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5, fontFamily: "'Roboto', sans-serif" }}>
            <Typography variant="h4" gutterBottom>
                Create New Post
            </Typography>
            {error && (
                <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <TextField
                    label="Content"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="contained" color="primary">
                        Create Post
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default CreatePost;
