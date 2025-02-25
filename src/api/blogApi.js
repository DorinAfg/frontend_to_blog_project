import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

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

