import React, { useContext, useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import { AuthContext } from '../AuthContext'; // ייבוא של AuthContext

const API_URL = "http://localhost:8000/api"; 

const LoginPage = () => {
    const { login } = useContext(AuthContext); // קבלת פונקציית login
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        try {
            const response = await axios.post(`${API_URL}/auth/login/`, formData);
            console.log("Login successful:", response.data);
            
            // שמירת ה-token במקומי אחסון
            localStorage.setItem("token", response.data.token);
            login(); // עדכון הסטייט להצלחה בהתחברות
            
            setSuccess(true);
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 5, textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>Login</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    {success && <Typography color="success.main">Login successful!</Typography>}
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default LoginPage;
