import React from "react";
import { Button } from "@mui/material";

const QuizActions = ({ 
  activeStep, 
  totalQuestions, 
  onNext, 
  onBack, 
  onSubmit, 
  onRestart, 
  onGoToDashboard, 
  answers, 
  submitted, 
  showResultModal 
}) => {
  return (
    <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
      <Button 
        disabled={activeStep === 0} 
        onClick={onBack} 
        variant="contained" 
        color="secondary"
      >
        Previous
      </Button>
      
      {activeStep < totalQuestions - 1 ? (
        <Button 
          disabled={!answers[activeStep]} 
          onClick={onNext} 
          variant="contained" 
          color="primary"
        >
          Next
        </Button>
      ) : (
        <Button 
          onClick={onSubmit} 
          disabled={submitted} 
          variant="contained" 
          color="success"
        >
          Submit
        </Button>
      )}
      
     <div style={{marginLeft: "auto", display: "flex", gap: 10}}>
        {submitted && (
        <>
          <Button 
            onClick={showResultModal} 
            variant="contained" 
            color="success"
          >
            Show Result
          </Button>
          <Button 
            onClick={onRestart} 
            variant="contained" 
            color="success"
          >
            Restart Quiz
          </Button>
          <Button 
            onClick={onGoToDashboard} 
            variant="contained" 
            color="secondary"
          >
            Go To Dashboard
          </Button>
        </>
      )}
     </div>
    </div>
  );
};

export default QuizActions;
