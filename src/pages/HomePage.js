import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const HomePage = () => {
    return (
        <Container sx={{ textAlign: 'center', mt: 5, fontFamily: 'Roboto, sans-serif' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h2" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                    Welcome to Dorina's Blog
                </Typography>
                <Typography variant="h5" sx={{ color: '#555' }}>
                    A space to share thoughts, stories, and insights.
                </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: '#777', fontSize: '1.2rem' }}>
                Explore our latest posts and join the conversation!
            </Typography>
        </Container>
    );
};

export default HomePage;
