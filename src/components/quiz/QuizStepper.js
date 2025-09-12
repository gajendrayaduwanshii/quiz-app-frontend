import React from "react";
import { Stepper, Step, StepLabel } from "@mui/material";

const QuizStepper = ({ activeStep, questions }) => (
  <Stepper activeStep={activeStep} alternativeLabel>
    {questions.map((_, index) => (
      <Step key={index}><StepLabel>Q{index + 1}</StepLabel></Step>
    ))}
  </Stepper>
);

export default QuizStepper;
