import React from "react";
import { Box, Chip, Divider, LinearProgress, Stack, Typography } from "@mui/material";
import { CheckCircle2, Clock3, TimerReset } from "lucide-react";
import PremiumCard from "@/components/premium/PremiumCard";

const QuizTimer = ({ timeLeft, totalSeconds = 300, answeredCount = 0, totalQuestions = 0 }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const percent = Math.max(0, Math.min(100, (timeLeft / totalSeconds) * 100));
  const answeredPercent = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const isUrgent = timeLeft <= 60;

  return (
    <PremiumCard
      hover={false}
      sx={{
        position: { lg: "sticky" },
        top: { lg: 92 },
        mt: { xs: 0, lg: 2 },
        p: 2.2,
        borderRadius: "18px",
      }}
    >
      <Stack spacing={2}>
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
            <Chip
              icon={isUrgent ? <TimerReset size={15} /> : <Clock3 size={15} />}
              label={isUrgent ? "Final Minute" : "Time Left"}
              sx={{
                color: isUrgent ? "#FECACA" : "#CFFAFE",
                bgcolor: isUrgent ? "rgba(239,68,68,0.13)" : "rgba(6,182,212,0.12)",
                border: "1px solid rgba(255,255,255,0.10)",
                fontWeight: 850,
              }}
            />
          </Stack>
          <Typography
            sx={{
              mt: 1.4,
              fontSize: { xs: 34, md: 42 },
              lineHeight: 1,
              fontWeight: 950,
              color: isUrgent ? "#F87171" : "#fff",
            }}
          >
            {formatTime(timeLeft)}
          </Typography>
        </Box>

        <Box>
          <Typography sx={{ mb: 0.8, color: "text.secondary", fontSize: 13, fontWeight: 800 }}>
            Timer Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{
              height: 9,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.08)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                background: isUrgent
                  ? "linear-gradient(90deg, #EF4444, #F59E0B)"
                  : "linear-gradient(90deg, #7C3AED, #06B6D4)",
              },
            }}
          />
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.9 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, color: "#BBF7D0" }}>
              <CheckCircle2 size={17} />
              <Typography sx={{ fontWeight: 850 }}>Answered</Typography>
            </Box>
            <Typography sx={{ fontWeight: 950 }}>
              {answeredCount}/{totalQuestions}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={answeredPercent}
            sx={{
              height: 8,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.08)",
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(90deg, #22C55E, #22D3EE)",
              },
            }}
          />
        </Box>

        <Box
          sx={{
            p: 1.4,
            borderRadius: 999,
            bgcolor: "rgba(255,255,255,0.045)",
            border: "1px solid rgba(255,255,255,0.08)",
            textAlign: "center",
          }}
        >
          <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
            Keep moving. Unanswered questions count as wrong after submit.
          </Typography>
        </Box>
      </Stack>
    </PremiumCard>
  );
};

export default QuizTimer;
