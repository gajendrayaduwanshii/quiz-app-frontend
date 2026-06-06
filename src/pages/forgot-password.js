"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { BrainCircuit, Mail, Smartphone } from "lucide-react";
import PremiumButton from "@/components/premium/PremiumButton";

export default function ForgotPassword() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError("Enter your registered email or mobile number");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/request-password-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to send OTP");
        return;
      }

      sessionStorage.setItem(
        "passwordResetRequest",
        JSON.stringify({
          identifier: identifier.trim(),
          destination: result.destination,
          channel: result.channel,
          devOtp: result.devOtp,
        })
      );
      router.push("/otp-verification");
    } catch (requestError) {
      setError(requestError.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-wrapper" sx={{ p: 2 }}>
      <Box className="skillsync-glow-grid" />
      <Paper
        component="form"
        onSubmit={handleSubmit}
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
            Enter your registered email or mobile number to receive an OTP.
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Email or mobile number"
          value={identifier}
          onChange={(event) => {
            setIdentifier(event.target.value);
            setError("");
          }}
          InputProps={{
            startAdornment: (
              <Box sx={{ display: "flex", alignItems: "center", mr: 1, color: "#94A3B8" }}>
                {identifier.includes("@") ? <Mail size={17} /> : <Smartphone size={17} />}
              </Box>
            ),
          }}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <PremiumButton fullWidth sx={{ mt: 2 }} type="submit" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </PremiumButton>
        <Button fullWidth component={Link} href="/login" sx={{ mt: 1.5, color: "text.secondary" }}>
          Back to login
        </Button>
      </Paper>
    </Box>
  );
}
