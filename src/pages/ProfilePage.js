import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://localhost:8000/api"; // עדכן עם ה-API שלך

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // קבלת שם המשתמש מה-localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // קבלת הפוסטים מהשרת
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log("Fetched posts:", response.data); // הוספת לוג לבדוק את התגובה
        setPosts(response.data); // הנח שהנתונים חוזרים כמערך של פוסטים
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>היי, {username}!</Typography>
        <Typography variant="h6" gutterBottom>הפוסטים שלך:</Typography>
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>{post.title}</li> // הנח שכותרת הפוסט היא post.title
            ))}
          </ul>
        ) : (
          <Typography variant="body1">אין לך פוסטים עדיין.</Typography>
        )}
        <Button 
          component={Link} 
          to="/" 
          variant="contained" 
          color="primary"
          sx={{ mt: 2 }}
        >
          חזרה לדף הבית
        </Button>
      </Box>
    </Container>
  );
};

export default ProfilePage;
