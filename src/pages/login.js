"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TextField, Typography, Box, Grid, Chip, Stack } from "@mui/material";
import { BrainCircuit, LockKeyhole, Mail, Sparkles, CheckCircle2, Zap, Target, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import PremiumButton from "@/components/premium/PremiumButton";
import NeuralBackground from "@/components/premium/NeuralBackground";

/* ─── Animated counter ─── */
function useCounter(target, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setValue(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } },
};

const features = [
  { icon: <Target size={13} />, label: "Resume analysis" },
  { icon: <Zap size={13} />, label: "AI quiz practice" },
  { icon: <TrendingUp size={13} />, label: "Skill gap tracker" },
  { icon: <CheckCircle2 size={13} />, label: "Smart learning path" },
];

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, registrationCompleted, setRegistrationCompleted } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [counterStarted, setCounterStarted] = useState(false);

  const readinessCount = useCounter(92, 1600, counterStarted);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) router.push("/dashboard");
      else setShowLoginForm(true);
    }
  }, [router]);

  useEffect(() => {
    if (searchParams.get("registered") === "true") setShowLoginForm(true);
  }, [searchParams]);

  useEffect(() => {
    if (registrationCompleted) {
      const t = setTimeout(() => setRegistrationCompleted(false), 5000);
      return () => clearTimeout(t);
    }
  }, [registrationCompleted, setRegistrationCompleted]);

  useEffect(() => {
    if (showLoginForm) {
      const t = setTimeout(() => setCounterStarted(true), 800);
      return () => clearTimeout(t);
    }
  }, [showLoginForm]);

  const validateForm = () => {
    const e = {};
    if (!formData.email.includes("@")) e.email = "Invalid email address";
    if (formData.password.length < 4) e.password = "Password must be at least 4 characters";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok) { setErrors({ apiError: result.error || "Login failed" }); return; }
      login(result.user);
      setRegistrationCompleted(false);
    } catch (err) {
      setErrors({ apiError: err.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  if (!showLoginForm) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #040714 0%, #070d1c 50%, #040714 100%)",
        px: 2,
        py: 4,
      }}
    >
      {/* Full-screen neural network canvas */}
      <NeuralBackground />

      {/* Radial colour wash on top of canvas */}
      <Box
        sx={{
          position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
          background:
            "radial-gradient(ellipse 55% 55% at 15% 20%, rgba(124,58,237,0.22) 0%, transparent 60%)," +
            "radial-gradient(ellipse 45% 45% at 85% 15%, rgba(6,182,212,0.16) 0%, transparent 55%)," +
            "radial-gradient(ellipse 40% 40% at 75% 85%, rgba(167,139,250,0.10) 0%, transparent 55%)",
        }}
      />

      {/* Card */}
      <motion.div
        style={{
          width: "min(1140px, calc(100vw - 28px))",
          borderRadius: 28,
          overflow: "hidden",
          position: "relative",
          zIndex: 2,
          border: "1px solid rgba(124,58,237,0.20)",
          backdropFilter: "blur(32px)",
          background: "rgba(4,7,20,0.76)",
          boxShadow:
            "0 0 0 1px rgba(103,232,249,0.06)," +
            "0 40px 120px rgba(0,0,0,0.60)," +
            "0 0 100px rgba(124,58,237,0.08)",
        }}
        initial={{ opacity: 0, y: 44, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Animated gradient top border */}
        <motion.div
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 10,
            background: "linear-gradient(90deg, transparent 0%, #7C3AED 30%, #06B6D4 60%, #A78BFA 85%, transparent 100%)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
        />

        <Grid container>
          {/* ── LEFT PANEL ── */}
          <Grid item size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
            <Box
              sx={{
                minHeight: { xs: "auto", md: 640 },
                p: { xs: 3, md: 5 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background:
                  "radial-gradient(circle at 18% 12%, rgba(124,58,237,0.22) 0%, transparent 38%)," +
                  "linear-gradient(145deg, rgba(124,58,237,0.09), rgba(6,182,212,0.05))",
                borderRight: { md: "1px solid rgba(255,255,255,0.05)" },
              }}
            >
              <motion.div variants={stagger} initial="hidden" animate="visible">
                {/* Logo */}
                <motion.div variants={fadeUp}>
                  <Stack direction="row" spacing={1.4} alignItems="center" sx={{ mb: { xs: 2.5, md: 4.5 } }}>
                    <motion.div
                      style={{
                        width: 48, height: 48, borderRadius: 16,
                        display: "grid", placeItems: "center",
                        background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                      }}
                      animate={{
                        boxShadow: [
                          "0 0 0 0px rgba(124,58,237,0.55)",
                          "0 0 0 12px rgba(124,58,237,0.00)",
                        ],
                      }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                    >
                      <BrainCircuit size={23} color="#fff" />
                    </motion.div>
                    <Box>
                      <Typography sx={{ fontWeight: 900, fontSize: "1.18rem", lineHeight: 1 }}>SkillSync AI</Typography>
                      <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>Career intelligence platform</Typography>
                    </Box>
                  </Stack>
                </motion.div>

                {/* Badge */}
                <motion.div variants={fadeUp}>
                  <Chip
                    icon={<Sparkles size={13} />}
                    label="AI-powered career growth"
                    sx={{
                      mb: 3, color: "#67E8F9", fontWeight: 600, fontSize: "0.8rem",
                      border: "1px solid rgba(103,232,249,0.28)",
                      bgcolor: "rgba(6,182,212,0.07)",
                    }}
                  />
                </motion.div>

                {/* Static headline — no layout shift */}
                <motion.div variants={fadeUp}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      lineHeight: 1.06,
                      mb: 2,
                      fontSize: { xs: 28, sm: 38, md: 52 },
                      background: "linear-gradient(135deg, #fff 0%, #C4B5FD 42%, #67E8F9 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Build your career edge with AI.
                  </Typography>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Typography sx={{ color: "text.secondary", fontSize: { xs: "0.88rem", md: "0.97rem" }, maxWidth: 430, mb: 3 }}>
                    Analyze your resume, discover skill gaps, practice adaptive quizzes, and follow a smarter learning path — all in one AI workspace.
                  </Typography>
                </motion.div>

                {/* Feature pills */}
                <motion.div variants={fadeUp}>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {features.map((f, i) => (
                      <motion.div
                        key={f.label}
                        initial={{ opacity: 0, scale: 0.82 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.48 + i * 0.09, ease: "backOut", duration: 0.38 }}
                      >
                        <Chip
                          icon={f.icon}
                          label={f.label}
                          size="small"
                          sx={{
                            color: "rgba(255,255,255,0.72)", fontSize: "0.76rem", fontWeight: 600,
                            border: "1px solid rgba(255,255,255,0.08)",
                            bgcolor: "rgba(255,255,255,0.04)",
                            "& .MuiChip-icon": { color: "#A78BFA" },
                          }}
                        />
                      </motion.div>
                    ))}
                  </Stack>
                </motion.div>
              </motion.div>

              {/* Animated stat card */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Box
                  sx={{
                    mt: 4, p: 2.6, borderRadius: "22px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    bgcolor: "rgba(5,8,22,0.55)",
                    backdropFilter: "blur(22px)",
                    position: "relative", overflow: "hidden",
                  }}
                >
                  {/* Travelling shimmer */}
                  <motion.div
                    style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 1,
                      background: "linear-gradient(90deg, transparent, rgba(103,232,249,0.55), transparent)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.8, ease: "linear" }}
                  />

                  <Typography sx={{ color: "text.secondary", fontSize: 11, mb: 0.6, letterSpacing: 1.2, textTransform: "uppercase" }}>
                    Platform signal
                  </Typography>

                  <Stack direction="row" alignItems="flex-end" spacing={1.2} sx={{ mb: 0.6 }}>
                    <Typography sx={{
                      fontWeight: 900, fontSize: 44, lineHeight: 1,
                      background: "linear-gradient(135deg, #fff, #67E8F9)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                      {readinessCount}%
                    </Typography>
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    >
                      <TrendingUp size={20} color="#34D399" style={{ marginBottom: 10 }} />
                    </motion.div>
                  </Stack>

                  <Typography sx={{ color: "text.secondary", fontSize: "0.86rem" }}>
                    Average readiness lift after focused quiz practice.
                  </Typography>

                  {/* Progress bar */}
                  <Box sx={{ mt: 1.6, height: 4, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                    <motion.div
                      style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #7C3AED, #06B6D4)" }}
                      initial={{ width: "0%" }}
                      animate={{ width: counterStarted ? "92%" : "0%" }}
                      transition={{ duration: 1.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Grid>

          {/* ── RIGHT PANEL ── */}
          <Grid item size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
            <Box
              sx={{
                minHeight: { xs: "auto", md: 640 },
                p: { xs: 2.4, sm: 4, md: 5 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <motion.div variants={stagger} initial="hidden" animate="visible">
                <motion.div variants={fadeUp}>
                  <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.8, fontSize: { xs: "1.5rem", sm: "1.8rem" } }}>
                    Welcome back
                  </Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: "0.94rem", mb: 3 }}>
                    Sign in to continue your AI-powered career workspace.
                  </Typography>
                </motion.div>

                <AnimatePresence>
                  {registrationCompleted && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{
                        display: "flex", alignItems: "center", gap: 1.2,
                        p: 1.5, mb: 2.5, borderRadius: 2,
                        bgcolor: "rgba(52,211,153,0.09)",
                        border: "1px solid rgba(52,211,153,0.22)",
                      }}>
                        <CheckCircle2 size={15} color="#34D399" />
                        <Typography sx={{ color: "#34D399", fontSize: 13.5, fontWeight: 600 }}>
                          Registration successful! Please sign in.
                        </Typography>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={fadeUp}>
                  <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                      fullWidth label="Email" margin="normal" variant="outlined" required
                      slotProps={{ input: { startAdornment: <Mail size={17} style={{ marginRight: 10, color: "#94A3B8" }} /> } }}
                      value={formData.email}
                      onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors((p) => ({ ...p, email: "" })); }}
                      error={!!errors.email} helperText={errors.email}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          transition: "box-shadow 0.28s",
                          "&:hover fieldset": { borderColor: "rgba(124,58,237,0.45)" },
                          "&.Mui-focused fieldset": { borderColor: "#7C3AED" },
                          "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(124,58,237,0.13)" },
                        },
                      }}
                    />
                    <TextField
                      fullWidth label="Password" type="password" margin="normal" variant="outlined" required
                      slotProps={{ input: { startAdornment: <LockKeyhole size={17} style={{ marginRight: 10, color: "#94A3B8" }} /> } }}
                      value={formData.password}
                      onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErrors((p) => ({ ...p, password: "" })); }}
                      error={!!errors.password} helperText={errors.password}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          transition: "box-shadow 0.28s",
                          "&:hover fieldset": { borderColor: "rgba(6,182,212,0.45)" },
                          "&.Mui-focused fieldset": { borderColor: "#06B6D4" },
                          "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(6,182,212,0.11)" },
                        },
                      }}
                    />

                    <AnimatePresence>
                      {errors.apiError && (
                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                          <Typography color="error" sx={{ mt: 1, fontSize: 13 }}>{errors.apiError}</Typography>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.982 }} style={{ marginTop: 16 }}>
                      <PremiumButton fullWidth type="submit" disabled={loading}>
                        {loading ? (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles size={15} />
                            </motion.div>
                            <span>Signing in…</span>
                          </Stack>
                        ) : "Sign in"}
                      </PremiumButton>
                    </motion.div>
                  </Box>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                    <Typography variant="body2">
                      Don&apos;t have an account?{" "}
                      <Link href="/registration" style={{ color: "#06B6D4", textDecoration: "none", fontWeight: 800 }}>
                        Register
                      </Link>
                    </Typography>
                    <Link href="/forgot-password" style={{ color: "#94A3B8", textDecoration: "none", fontSize: 13 }}>
                      Forgot password?
                    </Link>
                  </Box>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Stack
                    direction="row" spacing={2} justifyContent="center"
                    sx={{ mt: 3.5, pt: 2.5, borderTop: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    {["AI-Powered", "Secure & Private", "Free to Start"].map((badge, i) => (
                      <motion.span
                        key={badge}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 + i * 0.1 }}
                      >
                        <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 0.5 }}>
                          ✦ {badge}
                        </Typography>
                      </motion.span>
                    ))}
                  </Stack>
                </motion.div>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}
