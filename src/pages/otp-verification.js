"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import PremiumButton from "@/components/premium/PremiumButton";

export default function OtpVerification() {
  const router = useRouter();
  const otpRefs = useRef([]);
  const [resetRequest, setResetRequest] = useState(null);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const otp = useMemo(() => otpDigits.join(""), [otpDigits]);

  useEffect(() => {
    const storedRequest = sessionStorage.getItem("passwordResetRequest");

    if (!storedRequest) return;

    try {
      setResetRequest(JSON.parse(storedRequest));
    } catch {
      sessionStorage.removeItem("passwordResetRequest");
    }
  }, []);

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = digit;
    setOtpDigits(nextDigits);
    setMessage({ type: "", text: "" });

    if (digit && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    if (!resetRequest?.identifier) {
      setMessage({ type: "error", text: "Please request an OTP first." });
      return;
    }

    if (otp.length !== 6) {
      setMessage({ type: "error", text: "Enter the 6 digit OTP." });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: resetRequest.identifier,
          otp,
          newPassword: passwords.newPassword,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: result.error || "Failed to reset password." });
        return;
      }

      sessionStorage.removeItem("passwordResetRequest");
      setMessage({ type: "success", text: "Password reset successfully. Redirecting to login..." });
      setTimeout(() => router.push("/login"), 1200);
    } catch (resetError) {
      setMessage({ type: "error", text: resetError.message || "Failed to reset password." });
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
              width: { xs: 44, sm: 54 },
              height: { xs: 44, sm: 54 },
              borderRadius: "18px",
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              boxShadow: "0 0 34px rgba(6,182,212,0.36)",
            }}
          >
            <KeyRound size={25} color="#fff" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Verify OTP
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 1 }}>
            Enter the 6 digit code sent to {resetRequest?.destination || "your email or mobile number"}.
          </Typography>
        </Box>

        {!resetRequest?.identifier && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please request an OTP before resetting your password.
          </Alert>
        )}
        {resetRequest?.devOtp && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Demo OTP: {resetRequest.devOtp}
          </Alert>
        )}
        {message.text && (
          <Alert severity={message.type || "info"} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ justifyContent: "center" }}>
          {otpDigits.map((digit, item) => (
            <TextField
              key={item}
              value={digit}
              onChange={(event) => handleOtpChange(item, event.target.value)}
              onKeyDown={(event) => handleOtpKeyDown(item, event)}
              inputRef={(element) => {
                otpRefs.current[item] = element;
              }}
              sx={{ width: { xs: 40, sm: 52 } }}
              inputProps={{ maxLength: 1, style: { textAlign: "center", fontSize: "1.2rem", fontWeight: 800 } }}
            />
          ))}
        </Stack>
        <TextField
          fullWidth
          label="New password"
          type="password"
          margin="normal"
          value={passwords.newPassword}
          onChange={(event) => {
            setPasswords((prev) => ({ ...prev, newPassword: event.target.value }));
            setMessage({ type: "", text: "" });
          }}
        />
        <TextField
          fullWidth
          label="Confirm password"
          type="password"
          margin="normal"
          value={passwords.confirmPassword}
          onChange={(event) => {
            setPasswords((prev) => ({ ...prev, confirmPassword: event.target.value }));
            setMessage({ type: "", text: "" });
          }}
        />
        <PremiumButton fullWidth sx={{ mt: 2 }} type="submit" disabled={loading || !resetRequest?.identifier}>
          {loading ? "Resetting..." : "Reset Password"}
        </PremiumButton>
        <Button fullWidth component={Link} href="/forgot-password" sx={{ mt: 1, color: "text.secondary" }}>
          Request new OTP
        </Button>
        <Button fullWidth component={Link} href="/login" sx={{ mt: 1.5, color: "text.secondary" }}>
          Back to login
        </Button>
      </Paper>
    </Box>
  );
}
