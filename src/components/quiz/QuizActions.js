import React, { memo, useMemo, useCallback } from "react";
import { Box, Button, Stack } from "@mui/material";
import { ArrowLeft, ArrowRight, BarChart3, Home, RotateCcw, Send } from "lucide-react";
import PremiumButton from "@/components/premium/PremiumButton";

const QuizActions = memo(({
  activeStep,
  totalQuestions,
  onNext,
  onBack,
  onSubmit,
  onRestart,
  onGoToDashboard,
  answers,
  submitted,
  showResultModal,
}) => {
  const isFirstStep = useMemo(() => activeStep === 0, [activeStep]);
  const isLastStep = useMemo(() => activeStep >= totalQuestions - 1, [activeStep, totalQuestions]);
  const hasAnswer = useMemo(() => answers[activeStep], [answers, activeStep]);

  const handleBack = useCallback(() => {
    if (onBack) onBack();
  }, [onBack]);

  const handleNext = useCallback(() => {
    if (onNext) onNext();
  }, [onNext]);

  const handleSubmit = useCallback(() => {
    if (onSubmit) onSubmit();
  }, [onSubmit]);

  const handleRestart = useCallback(() => {
    if (onRestart) onRestart();
  }, [onRestart]);

  const handleGoToDashboard = useCallback(() => {
    if (onGoToDashboard) onGoToDashboard();
  }, [onGoToDashboard]);

  const handleShowResult = useCallback(() => {
    if (showResultModal) showResultModal();
  }, [showResultModal]);

  const actionButtons = useMemo(() => {
    if (isLastStep) {
      return (
        <PremiumButton onClick={handleSubmit} disabled={submitted} startIcon={<Send size={17} />}>
          Submit
        </PremiumButton>
      );
    }
    
    return (
      <PremiumButton
        disabled={!hasAnswer}
        onClick={handleNext}
        endIcon={<ArrowRight size={17} />}
      >
        Next
      </PremiumButton>
    );
  }, [isLastStep, hasAnswer, submitted, handleSubmit, handleNext]);

  const resultButtons = useMemo(() => {
    if (!submitted) return null;
    
    return (
      <>
        <Button
          onClick={handleShowResult}
          variant="outlined"
          startIcon={<BarChart3 size={17} />}
          sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.14)" }}
        >
          Show Result
        </Button>
        <Button
          onClick={handleRestart}
          variant="outlined"
          startIcon={<RotateCcw size={17} />}
          sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.14)" }}
        >
          Restart Quiz
        </Button>
        <PremiumButton onClick={handleGoToDashboard} startIcon={<Home size={17} />}>
          Go To Dashboard
        </PremiumButton>
      </>
    );
  }, [submitted, handleShowResult, handleRestart, handleGoToDashboard]);

  return (
    <Box
      sx={{
        mt: 2,
        p: 1.2,
        display: "flex",
        gap: 1.2,
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.08)",
        bgcolor: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(18px)",
      }}
    >
      <Button
        disabled={isFirstStep}
        onClick={handleBack}
        variant="outlined"
        startIcon={<ArrowLeft size={17} />}
        sx={{
          width: { xs: "100%", sm: "auto" },
          color: "#fff",
          borderColor: "rgba(255,255,255,0.14)",
          "&.Mui-disabled": {
            color: "rgba(255,255,255,0.28)",
            borderColor: "rgba(255,255,255,0.06)",
          },
        }}
      >
        Previous
      </Button>

      <Box sx={{ width: { xs: "100%", sm: "auto" }, "& > button": { width: { xs: "100%", sm: "auto" } } }}>
        {actionButtons}
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1}
        sx={{
          ml: { sm: "auto" },
          width: { xs: "100%", sm: "auto" },
          "& > button": { width: { xs: "100%", sm: "auto" } },
        }}
      >
        {resultButtons}
      </Stack>
    </Box>
  );
});

QuizActions.displayName = 'QuizActions';

export default QuizActions;
