import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import { Clock3 } from "lucide-react";

const QuizTimer = ({ timeLeft }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const percent = Math.max(0, Math.min(100, (timeLeft / 300) * 100));

  return (
    <Box
      sx={{
        mt: 2.5,
        mb: 1,
        p: 1.6,
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,0.08)",
        bgcolor: "rgba(255,255,255,0.04)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: timeLeft <= 60 ? "error.main" : "secondary.main" }}>
          <Clock3 size={18} />
          <Typography variant="h6" sx={{ fontSize: 16 }}>
            Time Left
          </Typography>
        </Box>
        <Typography sx={{ fontWeight: 900, color: timeLeft <= 60 ? "error.main" : "#fff" }}>
          {formatTime(timeLeft)}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 7,
          borderRadius: 999,
          bgcolor: "rgba(255,255,255,0.08)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            background: timeLeft <= 60
              ? "linear-gradient(90deg, #EF4444, #F59E0B)"
              : "linear-gradient(90deg, #7C3AED, #06B6D4)",
          },
        }}
      />
    </Box>
  );
};

export default QuizTimer;
