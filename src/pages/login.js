"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TextField, Button, Typography, Box, Grid, Paper } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import FetchData from "./../customHooks/fetchData";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, registrationCompleted, setRegistrationCompleted } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const {
    data: users,
    error: fetchError,
    loading: fetchLoading,
  } = FetchData("http://localhost:1337/api/userlists");

  // Check if user is already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        router.push("/dashboard");
      } else {
        setShowLoginForm(true);
      }
    }
  }, [router]);

  // Check query param ?registered=true
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setShowLoginForm(true);
    }
  }, [searchParams]);

  // Auto-clear registration message after 5s
  useEffect(() => {
    if (registrationCompleted) {
      const timer = setTimeout(() => {
        setRegistrationCompleted(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [registrationCompleted, setRegistrationCompleted]);

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

    if (fetchLoading) {
      setErrors({ apiError: "Still loading users, please wait..." });
      return;
    }

    if (fetchError) {
      setErrors({ apiError: "Failed to fetch users. Try again later." });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const matchedUser = users?.find(
        (user) => user.email === formData.email
      );

      if (matchedUser) {
        if (formData.password === matchedUser.password) {
          login({ email: formData.email });

          localStorage.setItem(
            "user",
            JSON.stringify({
              email: formData.email,
              documentId: matchedUser.documentId,
            })
          );

          router.push("/dashboard");
          setRegistrationCompleted(false);
        } else {
          setErrors({ apiError: "Invalid password" });
        }
      } else {
        setErrors({ apiError: "Email not registered" });
      }
      setLoading(false);
    }, 1000);
  };

  // 🧠 Don't render the login form if already redirecting
  if (!showLoginForm) return null;

  return (
    <Box className="login-wrapper">
      <Box>
        <Box sx={{textAlign:"center"}}>
          <img src="/images/full-logo.png" className="main-logo-one" alt="Logo" />
        </Box>
        <Paper className="login-container">
          <Grid container>
            <Grid item size={{xs:12, md:6}}>
              <img
                src="/images/login-image.jpg"
                alt="Login Illustration"
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item size={{xs:12, md:6}}>
              <Box
                sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h5" gutterBottom>
                    Login Quiz
                  </Typography>
                  <Typography component="p" gutterBottom>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </Typography>
                </Box>

                {registrationCompleted && (
                  <Typography color="success.main" sx={{ mt: 2 }}>
                    Registration successful! Please login with your credentials.
                  </Typography>
                )}

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
                      setErrors((prev) => ({ ...prev, email: "" }));
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
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                  {errors.apiError && (
                    <Typography color="error">{errors.apiError}</Typography>
                  )}
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
