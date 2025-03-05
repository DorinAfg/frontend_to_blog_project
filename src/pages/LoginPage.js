import React, { useContext, useState } from "react";
import { TextField, Button, Container, Typography, Box, Alert, Paper, IconButton } from "@mui/material";
import axios from "axios";
import { AuthContext } from '../AuthContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const API_URL = "http://127.0.0.1:8000/api"; 

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
      
        try {
            const response = await axios.post(`${API_URL}/auth/login/`, formData);
            console.log("Full login response:", response); 
            console.log("Login response data:", response.data); 

            const token = response.data.key;  // השרת מחזיר את הטוקן תחת `key`
            if (!token) {
                console.error("No token received from the server! Response data:", response.data);
                setError("No token received. Please try again.");
                return;
            }

            localStorage.setItem("username", formData.username);
            localStorage.setItem("token", token);
            login(formData.username, token);
            setSuccess(true);
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            if (err.response?.status === 401) {
                setError(err.response.data.detail === "user not exist" ? "user not exist" : "password incorrect");
            } else {
                setError("password incorrect");
            }
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={4} sx={{ mt: 8, p: 4, borderRadius: 3 }}>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: "#2c3e50" }}>
                        Login
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        fullWidth
                        margin="normal"
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        fullWidth
                        margin="normal"
                        required
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />} 
                                </IconButton>
                            ),
                        }}
                    />
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>Login successful!</Alert>}
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 1, fontWeight: 600 }}>
                        Log in
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default LoginPage;
