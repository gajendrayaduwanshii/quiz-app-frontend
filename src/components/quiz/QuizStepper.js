import React, { memo, useMemo } from "react";
import { Stepper, Step, StepLabel } from "@mui/material";

const QuizStepper = memo(({ activeStep, questions }) => {
  const steps = useMemo(() => {
    return questions.map((question, index) => (
      <Step key={question.id || index}>
        <StepLabel>Q{index + 1}</StepLabel>
      </Step>
    ));
  }, [questions]);

  return (
    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
      {steps}
    </Stepper>
  );
});

QuizStepper.displayName = 'QuizStepper';

export default QuizStepper;
