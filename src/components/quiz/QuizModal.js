import React from "react";
import { Modal, Box, Typography, IconButton, Button, Stack } from "@mui/material";
import { ArrowLeft, Play, RotateCcw, X } from "lucide-react";
import QuizResult from "./QuizResult";
import PremiumButton from "@/components/premium/PremiumButton";

const QuizModal = ({
  open,
  onClose,
  title,
  description,
  onStart,
  onRestart,
  correctCount,
  incorrectCount,
  handleGoBack,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: onRestart ? { xs: "calc(100vw - 28px)", sm: 560 } : { xs: "calc(100vw - 28px)", sm: 440 },
          maxHeight: "88vh",
          overflow: "hidden",
          bgcolor: "rgba(11,17,32,0.94)",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.035)), radial-gradient(circle at 30% 0%, rgba(124,58,237,0.22), transparent 36%)",
          border: "1px solid rgba(255,255,255,0.10)",
          backdropFilter: "blur(24px)",
          p: { xs: 2.4, sm: 3.4 },
          boxShadow: "0 34px 120px rgba(0,0,0,0.62), 0 0 60px rgba(124,58,237,0.20)",
          borderRadius: "28px",
          textAlign: "center",
          outline: "none",
        }}
      >
        {onRestart && (
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
              color: "#94A3B8",
              border: "1px solid rgba(255,255,255,0.10)",
              bgcolor: "rgba(255,255,255,0.04)",
              zIndex: 2,
              "&:hover": {
                color: "#fff",
                bgcolor: "rgba(239,68,68,0.14)",
              },
            }}
          >
            <X size={19} />
          </IconButton>
        )}

        <Typography
          variant="h5"
          className="gradient-text"
          sx={{ fontWeight: 900, mb: onRestart ? 1 : 0 }}
        >
          {title}
        </Typography>

        {onRestart ? (
          <>
            <Typography sx={{ color: "text.secondary", mb: 1 }}>
              Your assessment result is ready.
            </Typography>
            <QuizResult correctAnswers={correctCount} incorrectAnswers={incorrectCount} />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} justifyContent="center" sx={{ mt: 2 }}>
              <PremiumButton onClick={onRestart} startIcon={<RotateCcw size={17} />}>
                Restart Quiz
              </PremiumButton>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.14)" }}
              >
                Review Answers
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
              {description}
            </Typography>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
              <PremiumButton onClick={onStart} startIcon={<Play size={17} />}>
                Start Quiz
              </PremiumButton>
              <Button
                variant="outlined"
                onClick={handleGoBack}
                startIcon={<ArrowLeft size={17} />}
                sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.14)" }}
              >
                Back
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default QuizModal;
