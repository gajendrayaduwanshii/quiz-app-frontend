import React, { memo, useMemo } from "react";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { Check } from "lucide-react";

const QuizStepper = memo(({ activeStep, questions, answers = {}, submitted = false }) => {
  const steps = useMemo(() => {
    return questions.map((question, index) => {
      const answered = Boolean(answers[index]);
      const active = activeStep === index;

      return (
        <Box
          key={question.id || index}
          sx={{
            width: { xs: 30, sm: 34 },
            height: { xs: 30, sm: 34 },
            flex: "0 0 auto",
            display: "grid",
            placeItems: "center",
            borderRadius: "12px",
            color: active || answered ? "#fff" : "rgba(226,232,240,0.64)",
            border: active
              ? "1px solid rgba(34,211,238,0.65)"
              : "1px solid rgba(255,255,255,0.10)",
            bgcolor: active
              ? "rgba(34,211,238,0.18)"
              : answered
              ? "rgba(34,197,94,0.14)"
              : "rgba(255,255,255,0.045)",
            boxShadow: active ? "0 12px 28px rgba(34,211,238,0.18)" : "none",
            fontSize: { xs: 12, sm: 13 },
            fontWeight: 900,
          }}
        >
          {answered && !active ? <Check size={16} /> : index + 1}
        </Box>
      );
    });
  }, [activeStep, answers, questions]);

  const progress = questions.length ? ((activeStep + 1) / questions.length) * 100 : 0;

  return (
    <Box
      sx={{
        p: { xs: 1.4, md: 1.7 },
        borderRadius: "22px",
        border: "1px solid rgba(255,255,255,0.08)",
        bgcolor: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(18px)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.25 }}>
        <Typography sx={{ color: "text.secondary", fontWeight: 850, fontSize: 13 }}>
          Question Map
        </Typography>
        <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 13 }}>
          {submitted ? "Submitted" : `${Math.round(progress)}%`}
        </Typography>
      </Stack>
      <Box
        sx={{
          overflowX: "auto",
          pb: 0.6,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Stack direction="row" spacing={0.8} sx={{ minWidth: "max-content" }}>
          {steps}
        </Stack>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          mt: 1.1,
          height: 6,
          borderRadius: 999,
          bgcolor: "rgba(255,255,255,0.08)",
          "& .MuiLinearProgress-bar": {
            background: "linear-gradient(90deg, #7C3AED, #22D3EE)",
          },
        }}
      />
    </Box>
  );
});

QuizStepper.displayName = 'QuizStepper';

export default QuizStepper;
