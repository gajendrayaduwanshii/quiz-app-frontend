import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import QuizModal from "./quiz/QuizModal";
import QuizStepper from "./quiz/QuizStepper";
import QuizQuestion from "./quiz/QuizQuestion";
import Timer from "./quiz/QuizTimer";
import QuizActions from "./quiz/QuizActions";
import { Box } from "@mui/material";

const getRandomQuestions = (questions, count = 10) => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const QuizMainComponent = ({ questions }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [startPromptOpen, setStartPromptOpen] = useState(true);
  const timerRef = useRef(null);
  const router = useRouter();

  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    setSelectedQuestions(getRandomQuestions(questions));
  }, [questions]);

  useEffect(() => {
    if (startPromptOpen || submitted) return;
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else {
      handleSubmit();
    }
    return () => clearInterval(timerRef.current);
  }, [startPromptOpen, timeLeft, submitted]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleChange = (event) => setAnswers({ ...answers, [activeStep]: event.target.value });

  const handleSubmit = () => {
    setSubmitted(true);
    setOpen(true);
    clearInterval(timerRef.current);
  };

  const handleShowResult = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleStartQuiz = () => setStartPromptOpen(false);
  const handleRestartQuiz = () => {
    setOpen(false);
    setActiveStep(0);
    setAnswers({});
    setSubmitted(false);
    setStartPromptOpen(true);
    setTimeLeft(300);
    setSelectedQuestions(getRandomQuestions(questions));
  };
  const handleGoToDashboard = () => router.push("/dashboard");

  const handleGoBack = () => router.back();

  const correctCount = Object.keys(answers).reduce(
    (count, key) => count + (answers[key] === selectedQuestions[key]?.answer ? 1 : 0),
    0
  );
  const incorrectCount = selectedQuestions.length - correctCount;

  return (
    <>
      <QuizModal
        open={startPromptOpen}
        onStart={handleStartQuiz}
        title="Start the Quiz?"
        description="You have 5 minutes to complete the test."
        handleGoBack = {handleGoBack}
      />
      {!startPromptOpen && (
        <Box>
          <QuizStepper activeStep={activeStep} questions={selectedQuestions} />
          <Timer timeLeft={timeLeft} />
          <QuizQuestion
            question={selectedQuestions[activeStep]?.question}
            options={selectedQuestions[activeStep]?.options}
            value={answers[activeStep]}
            onChange={handleChange}
            submitted={submitted}
            answer={selectedQuestions[activeStep]?.answer}
          />
          <QuizActions
            activeStep={activeStep}
            totalQuestions={selectedQuestions.length}
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={handleSubmit}
            onRestart={handleRestartQuiz}
            onGoToDashboard={handleGoToDashboard}
            answers={answers}
            submitted={submitted}
            showResultModal= {handleShowResult}
          />
          <QuizModal
            open={open}
            onClose={handleClose}
            title="Quiz Submitted!"
            description={`✅ Correct: ${correctCount}, ❌ Wrong: ${incorrectCount}`}
            correctCount={correctCount}
            incorrectCount={incorrectCount}
            onRestart={handleRestartQuiz}
          />
        </Box>
      )}
    </>
  );
};

export default QuizMainComponent;
