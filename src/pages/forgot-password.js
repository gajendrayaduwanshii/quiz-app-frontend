"use client";

import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { BrainCircuit, Mail } from "lucide-react";
import PremiumButton from "@/components/premium/PremiumButton";

export default function ForgotPassword() {
  return (
    <Box className="login-wrapper" sx={{ p: 2 }}>
      <Box className="skillsync-glow-grid" />
      <Paper
        className="login-container"
        sx={{
          width: "min(520px, 100%)",
          p: { xs: 3, md: 4 },
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              mx: "auto",
              mb: 2,
              width: 54,
              height: 54,
              borderRadius: "18px",
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              boxShadow: "0 0 34px rgba(124,58,237,0.42)",
            }}
          >
            <BrainCircuit size={26} color="#fff" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Reset access
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 1 }}>
            Enter your email and continue to OTP verification.
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Email"
          type="email"
          InputProps={{ startAdornment: <Mail size={17} style={{ marginRight: 10, color: "#94A3B8" }} /> }}
        />
        <PremiumButton fullWidth sx={{ mt: 2 }} component={Link} href="/otp-verification">
          Send OTP
        </PremiumButton>
        <Button fullWidth component={Link} href="/login" sx={{ mt: 1.5, color: "text.secondary" }}>
          Back to login
        </Button>
      </Paper>
    </Box>
  );
}
