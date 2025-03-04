import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/posts"; // ה-URL ל-API של הפוסטים

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null); // מצב לשמירת התמונה
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file); // לשמור את התמונה במצב
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // לאתחל את השגיאה

        try {
            const token = localStorage.getItem('token'); // קבלת ה-token מ-localStorage
            if (!token) {
                setError("You must be logged in to create a post");
                return;
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (image) {
                formData.append('image', image); // הוספת התמונה ל-FormData
            }

            // יצירת פוסט חדש על ידי שליחת נתונים ל-API
            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // חשוב לציין שהפוסט הוא מסוג multipart/form-data
                    'Authorization': `Bearer ${token}`, // שליחת ה-token עם הבקשה
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
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ marginTop: '16px' }}
                />
                {image && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        {image.name}
                    </Typography>
                )}
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
