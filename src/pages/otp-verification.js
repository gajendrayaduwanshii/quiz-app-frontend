"use client";

import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import PremiumButton from "@/components/premium/PremiumButton";

export default function OtpVerification() {
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
              boxShadow: "0 0 34px rgba(6,182,212,0.36)",
            }}
          >
            <KeyRound size={25} color="#fff" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Verify OTP
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 1 }}>
            Enter the 6 digit code sent to your email.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <TextField
              key={item}
              inputProps={{ maxLength: 1, style: { textAlign: "center", fontSize: 22, fontWeight: 800 } }}
            />
          ))}
        </Stack>
        <PremiumButton fullWidth sx={{ mt: 2 }}>
          Verify Account
        </PremiumButton>
        <Button fullWidth component={Link} href="/login" sx={{ mt: 1.5, color: "text.secondary" }}>
          Back to login
        </Button>
      </Paper>
    </Box>
  );
}
