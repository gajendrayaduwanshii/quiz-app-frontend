import React from "react";
import { Stepper, Step, StepLabel } from "@mui/material";

const QuizStepper = ({ activeStep, questions }) => (
  <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
    {questions.map((question, index) => (
      <Step key={question.id || index}>
        <StepLabel>Q{index + 1}</StepLabel>
      </Step>
    ))}
  </Stepper>
);

export default QuizStepper;
