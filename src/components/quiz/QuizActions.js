import React, { memo, useMemo, useCallback } from "react";
import { Button } from "@mui/material";

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
        <Button onClick={handleSubmit} disabled={submitted} variant="contained" color="success">
          Submit
        </Button>
      );
    }
    
    return (
      <Button
        disabled={!hasAnswer}
        onClick={handleNext}
        variant="contained"
        color="primary"
      >
        Next
      </Button>
    );
  }, [isLastStep, hasAnswer, submitted, handleSubmit, handleNext]);

  const resultButtons = useMemo(() => {
    if (!submitted) return null;
    
    return (
      <>
        <Button onClick={handleShowResult} variant="contained" color="success">
          Show Result
        </Button>
        <Button onClick={handleRestart} variant="contained" color="success">
          Restart Quiz
        </Button>
        <Button onClick={handleGoToDashboard} variant="contained" color="secondary">
          Go To Dashboard
        </Button>
      </>
    );
  }, [submitted, handleShowResult, handleRestart, handleGoToDashboard]);

  return (
    <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center" }}>
      <Button
        disabled={isFirstStep}
        onClick={handleBack}
        variant="contained"
        color="secondary"
      >
        Previous
      </Button>

      {actionButtons}

      <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
        {resultButtons}
      </div>
    </div>
  );
});

QuizActions.displayName = 'QuizActions';

export default QuizActions;
