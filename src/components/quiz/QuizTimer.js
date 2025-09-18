import React from "react";
import { Typography } from "@mui/material";

const QuizTimer = ({ timeLeft }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Typography
      variant="h6"
      color={timeLeft <= 60 ? "error" : "primary"}
      sx={{ fontSize: 16, mt: 2.5, mb: 1 }}
    >
      ⏳ Time Left: {formatTime(timeLeft)}
    </Typography>
  );
};

export default QuizTimer;
