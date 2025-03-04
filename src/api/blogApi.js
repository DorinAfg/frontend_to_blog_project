import axios from 'axios';


const API_URL = 'http://127.0.0.1:8000/api';

export const fetchPosts = async () => {
    try {
        const response = await axios.get(`${API_URL}/posts`);
        console.log("API Response:", response.data);  // Debugging

        return Array.isArray(response.data.results) ? response.data.results : [];
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];  
    }
};

// פונקציה ליצירת פוסט חדש
export const createPost = async (postData) => {
    try {
        const response = await axios.post(`${API_URL}/posts/`, postData, {
            headers: {
                'Content-Type': 'application/json',
                // אם יש צורך ב-Token של המשתמש, הוסף כאן
                // 'Authorization': `Bearer ${token}`
            },
        });
        
        return response.data;  // החזרת הפוסט שנוצר
    } catch (error) {
        console.error('Error creating post:', error);
        throw new Error('Failed to create post');
    }
};
