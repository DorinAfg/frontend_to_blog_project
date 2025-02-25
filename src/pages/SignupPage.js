import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:8000/api"; 

const SignupPage = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password1: "", password2: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setSuccessMessage("");

        // בדיקה אם הסיסמאות תואמות
        if (formData.password1 !== formData.password2) {
            setError("Passwords do not match");
            return;
        }

        try {
            // שליחת המידע לשרת
            const response = await axios.post(`${API_URL}/auth/registration/`, {
                username: formData.username,
                email: formData.email,
                password1: formData.password1,
                password2: formData.password2,
            });
            console.log("Signup successful:", response.data);
            setSuccess(true);
            setSuccessMessage("Registration successful! You can now log in."); // הוספת הודעת הצלחה
            setFormData({ username: "", email: "", password1: "", password2: "" }); // ריקון השדות
        } catch (err) {
            console.error("Signup error:", err.response?.data || err.message);
            const errorMessage = err.response?.data?.password1 || err.response?.data?.password2 || "Registration failed";
            setError(errorMessage);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 5, textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>Sign Up</Typography>
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
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Password"
                        name="password1"
                        type="password"
                        value={formData.password1}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Confirm Password"
                        name="password2"
                        type="password"
                        value={formData.password2}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    {success && <Typography color="success">{successMessage}</Typography>} {/* הודעת הצלחה */}
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Sign Up
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default SignupPage;
