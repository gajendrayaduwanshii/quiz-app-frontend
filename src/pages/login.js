"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextField, Button, Typography, Box, Grid, Paper } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const mockUser = { email: "user@gmail.com", password: "1234" };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (storedUser) {
                router.push("/dashboard");
            }
        }
    }, [router]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.email.includes("@")) {
            newErrors.email = "Invalid email address";
        }
        if (formData.password.length < 4) {
            newErrors.password = "Password must be at least 4 characters";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGoogleLogin = () => {
        console.log("Google login clicked");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setTimeout(() => {
            if (formData.email === mockUser.email && formData.password === mockUser.password) {
                login({ email: formData.email });
            } else {
                setErrors({ apiError: "Invalid email or password" });
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <Box className="login-wrapper">
            <Box>
                <Typography variant="h5" className="stylish-title title">
                    AI Quiz
                </Typography>
                <Paper className="login-container">
                    <Grid container>
                        <Grid item size={{xs:12, md:6}} >
                            <img src="/images/login-image.jpg" alt="Login" style={{ width: "100%" }} />
                        </Grid>
                        <Grid item size={{xs:12, md:6}}>
                            <Box sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="h5" gutterBottom>
                                        Login Quiz
                                    </Typography>
                                    <Typography component="p" gutterBottom>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    </Typography>
                                </Box>
                                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: "100%" }}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        margin="normal"
                                        variant="outlined"
                                        required
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                            setErrors((prev) => ({ ...prev, email: "" })); // Clear email error on change
                                        }}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        margin="normal"
                                        variant="outlined"
                                        required
                                        value={formData.password}
                                        onChange={(e) => {
                                            setFormData({ ...formData, password: e.target.value });
                                            setErrors((prev) => ({ ...prev, password: "" })); // Clear password error on change
                                        }}
                                        error={!!errors.password}
                                        helperText={errors.password}
                                    />
                                    {errors.apiError && <Typography color="error">{errors.apiError}</Typography>}
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        sx={{ mt: 2 }}
                                        disabled={loading}
                                    >
                                        {loading ? "Logging in..." : "Login"}
                                    </Button>
                                </Box>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<GoogleIcon />}
                                    onClick={handleGoogleLogin}
                                    sx={{ mt: 2 }}
                                >
                                    Login with Google
                                </Button>
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    Don't have an account?{" "}
                                    <Link href="/registration" style={{ color: "#1976d2", textDecoration: "none" }}>
                                        Register
                                    </Link>
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Box>
    );
};

export default Login;
