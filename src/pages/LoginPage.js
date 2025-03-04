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
    const [showPassword, setShowPassword] = useState(false); // סטייט חדש כדי לעקוב אחרי הצגת הסיסמה

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

            // שמירה רק של שם המשתמש ב-localStorage
            localStorage.setItem("username", formData.username);

            // קריאה לפונקציית ה-login בהקשר של AuthContext
            login(formData.username);

            setSuccess(true);
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            if (err.response?.status === 401) {
                // בדוק אם ההודעה היא על שם משתמש שלא קיים
                if (err.response.data.detail === "user not exist") {
                    setError("user not exist");
                } else {
                    setError("password incorrect");
                }
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
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"} // שינוי סוג השדה לפי הסטייט
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)} // הפיכת הסטייט כשנלחצים על הכפתור
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />} 
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
                            Login successful!
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
                        Log in
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default LoginPage;
