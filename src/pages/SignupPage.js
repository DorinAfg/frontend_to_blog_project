import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, Paper, Alert, IconButton } from "@mui/material";
import axios from "axios";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const API_URL = "http://127.0.0.1:8000/api";

const SignupPage = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password1: "", password2: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showPassword1, setShowPassword1] = useState(false); // סטייט חדש לסיסמה הראשונה
    const [showPassword2, setShowPassword2] = useState(false); // סטייט חדש לסיסמה השנייה

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setSuccessMessage("");

        if (formData.password1 !== formData.password2) {
            setError("The passwords do not match.");
            return;
        }

        console.log("Submitting form data:", formData); // הדפסת הנתונים שנשלחים לשרת

        try {
            const response = await axios.post(`${API_URL}/auth/registration/`, formData, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log("Response status:", response.status); // הדפסת סטטוס התגובה
            console.log("Response data:", response.data); // הדפסת התוכן שהשרת מחזיר

            if (response.status === 201) {
                setSuccess(true);
                setSuccessMessage("Registration was successful! You can now log in.");
                setFormData({ username: "", email: "", password1: "", password2: "" });
            } else {
                setError("Something went wrong during registration. Please try again.");
            }
        } catch (err) {
            console.error("Registration error:", err.response ? err.response.data : err.message); // הדפסת השגיאה שהתקבלה
            const errorMessage = err.response?.data?.detail || "The registration failed, try again";
            console.log("Error details:", err.response?.data); // הדפסת פרטי השגיאה המלאים
            setError(errorMessage);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={4} sx={{ mt: 8, p: 4, borderRadius: 3 }}>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography 
                        variant="h4" 
                        gutterBottom 
                        sx={{ fontWeight: 700, color: "#2c3e50" }}
                    >
                        Sign Up
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Password"
                        name="password1"
                        type={showPassword1 ? "text" : "password"}
                        value={formData.password1}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => setShowPassword1(!showPassword1)}
                                    edge="end"
                                >
                                    {showPassword1 ? <VisibilityOff /> : <Visibility />} 
                                </IconButton>
                            ),
                        }}
                    />
                    <TextField
                        label="Confirm Password"
                        name="password2"
                        type={showPassword2 ? "text" : "password"}
                        value={formData.password2}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => setShowPassword2(!showPassword2)}
                                    edge="end"
                                >
                                    {showPassword2 ? <VisibilityOff /> : <Visibility />} 
                                </IconButton>
                            ),
                        }}
                    />
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {successMessage}
                        </Alert>
                    )}
                    <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth
                        sx={{ 
                            mt: 1, 
                            fontWeight: 600, 
                            paddingY: 1.5, 
                            textTransform: "none", 
                            borderRadius: 2,
                            backgroundColor: "#1e3a5f",
                            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                            "&:hover": { 
                                backgroundColor: "#1e3a5f",
                                boxShadow: "0px 6px 15px rgba(0,0,0,0.15)" 
                            }
                        }}
                    >
                        Sign Up
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default SignupPage;
