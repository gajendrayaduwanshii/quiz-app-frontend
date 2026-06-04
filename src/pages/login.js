"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TextField, Typography, Box, Grid, Paper, Chip, Stack } from "@mui/material";
import { BrainCircuit, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import FetchData from "./../customHooks/fetchData";
import PremiumButton from "@/components/premium/PremiumButton";
import ThreeDScene from "@/components/premium/ThreeDScene";

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
  } = FetchData(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/userlists`);

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
      <Box className="skillsync-glow-grid" />
      <ThreeDScene variant="login" className="login-3d-background" />
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="login-container"
        sx={{ width: "min(1120px, calc(100vw - 28px))" }}
      >
        <Grid container>
          <Grid item size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                minHeight: { xs: 280, md: 620 },
                p: { xs: 3, md: 5 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background:
                  "radial-gradient(circle at 30% 20%, rgba(124,58,237,0.34), transparent 32%), linear-gradient(145deg, rgba(124,58,237,0.22), rgba(6,182,212,0.12))",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box>
                <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 5 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "16px",
                      display: "grid",
                      placeItems: "center",
                      background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                      boxShadow: "0 0 34px rgba(124,58,237,0.42)",
                    }}
                  >
                    <BrainCircuit size={22} color="#fff" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: 20, lineHeight: 1 }}>
                      SkillSync AI
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                      Career intelligence platform
                    </Typography>
                  </Box>
                </Stack>

                <Chip
                  icon={<Sparkles size={15} />}
                  label="AI resume, quiz, and learning copilot"
                  sx={{
                    color: "#fff",
                    border: "1px solid rgba(6,182,212,0.35)",
                    bgcolor: "rgba(6,182,212,0.10)",
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h2"
                  className="gradient-text"
                  sx={{ fontWeight: 900, lineHeight: 1.02, mb: 2 }}
                >
                  Build your career edge with AI.
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 17, maxWidth: 460 }}>
                  Analyze your resume, discover skill gaps, practice quizzes, and follow a smarter learning path.
                </Typography>
              </Box>

              <Box
                className="ss-floating"
                sx={{
                  mt: 4,
                  p: 2.4,
                  borderRadius: "24px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  bgcolor: "rgba(5,8,22,0.44)",
                  backdropFilter: "blur(18px)",
                }}
              >
                <Typography sx={{ color: "text.secondary", fontSize: 13, mb: 0.8 }}>
                  Platform signal
                </Typography>
                <Typography sx={{ fontWeight: 900, fontSize: 30 }}>92%</Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Average readiness lift after focused quiz practice.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                minHeight: { xs: "auto", md: 620 },
                p: { xs: 3, sm: 4, md: 5 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
                  Welcome back
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Sign in to continue your AI-powered career workspace.
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
                    InputProps={{ startAdornment: <Mail size={17} style={{ marginRight: 10, color: "#94A3B8" }} /> }}
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
                    InputProps={{ startAdornment: <LockKeyhole size={17} style={{ marginRight: 10, color: "#94A3B8" }} /> }}
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
                  <PremiumButton
                    fullWidth
                    type="submit"
                    sx={{ mt: 2 }}
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </PremiumButton>
                </Box>
                <Box sx={{ textAlign: "right", mt: 1 }}>
                  <Link href="/forgot-password" style={{ color: "#94A3B8", textDecoration: "none", fontSize: 13 }}>
                    Forgot password?
                  </Link>
                </Box>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Don't have an account?{" "}
                  <Link href="/registration" style={{ color: "#06B6D4", textDecoration: "none", fontWeight: 800 }}>
                    Register
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
    </Box>
  );
};

export default Login;
