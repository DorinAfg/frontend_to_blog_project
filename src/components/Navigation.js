import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { Home, PersonAdd, Login, Article, Logout, Person, Add } from '@mui/icons-material'; 
import { AuthContext } from '../AuthContext';

const Navigation = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  return (
    <AppBar 
      position="static" 
      sx={{ backgroundColor: '#1e3a5f', boxShadow: 'none' }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            component={Link} 
            to="/" 
            startIcon={<Home />} 
            sx={navButtonStyle}
          >
            Home
          </Button>
          {!isAuthenticated && (
            <Button 
              component={Link} 
              to="/signup" 
              startIcon={<PersonAdd />} 
              sx={navButtonStyle}
            >
              Sign Up
            </Button>
          )}
          {!isAuthenticated ? (
            <Button 
              component={Link} 
              to="/login" 
              startIcon={<Login />} 
              sx={navButtonStyle}
            >
              Login
            </Button>
          ) : (
            <>
              <Button 
                component={Link} 
                to="/profile" 
                startIcon={<Person />} 
                sx={navButtonStyle}
              >
                My Profile
              </Button>
              <Button 
                onClick={logout} 
                startIcon={<Logout />} 
                sx={navButtonStyle}
              >
                Logout
              </Button>
            </>
          )}
          <Button 
            component={Link} 
            to="/posts" 
            startIcon={<Article />} 
            sx={navButtonStyle}
          >
            Posts
          </Button>
          {isAuthenticated && (
            <Button 
              component={Link} 
              to="/create" 
              startIcon={<Add />} 
              sx={navButtonStyle}
            >
              Create
            </Button>
          )}
        </Box>
        {/* הוספת שם המשתמש בצד ימין עם בדיקה אם user קיים */}
        {isAuthenticated && user && (
          <Typography sx={{ color: '#f0f0f0', marginLeft: 'auto', fontWeight: 'bold' }}>
            {user.username} {/* כאן אנחנו מניחים ש-user.username מכיל את שם המשתמש */}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

const navButtonStyle = {
  color: '#f0f0f0',
  fontWeight: 'bold',
  textTransform: 'none',
  transition: '0.3s',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'scale(1.05)',
  }
};

export default Navigation;
