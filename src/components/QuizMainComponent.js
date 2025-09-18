import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
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

const QuizMainComponent = ({ questions, documentId }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [startPromptOpen, setStartPromptOpen] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [userData, setUserData] = useState(null);

  const timerRef = useRef(null);
  const router = useRouter();

  // Get random questions on load
  useEffect(() => {
    setSelectedQuestions(getRandomQuestions(questions));
  }, [questions]);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!documentId) {
        alert("You are not logged in! Please login again.");
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:1337/api/userlists/${documentId}?populate[uploadResume][populate]=*&populate[skills]=*&populate[workExperiences]=*&populate[educations]=*&populate[quizResult][populate]=*`
        );
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [documentId, router]);

  // Start timer only after quiz starts
  useEffect(() => {
    if (startPromptOpen || submitted) return;

    if (timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else {
      handleSubmit(); // Auto submit on timeout
    }

    return () => clearInterval(timerRef.current);
  }, [startPromptOpen, timeLeft, submitted]);

  const handleNext = () => {
    if (activeStep < selectedQuestions.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleChange = (event) => {
    setAnswers({ ...answers, [activeStep]: event.target.value });
  };

  const calculateResult = () => {
    const correctCount = Object.keys(answers).reduce(
      (count, key) => count + (answers[key] === selectedQuestions[key]?.answer ? 1 : 0),
      0
    );
    return correctCount >= selectedQuestions.length / 2 ? "pass" : "fail";
  };

  const updateQuizResult = async (quizResult) => {
    if (!userData) {
      alert("User data not loaded yet. Please wait...");
      return;
    }

    try {
      const existingQuizResults = Array.isArray(userData.quizResult) ? userData.quizResult : [];

      const updatedQuizResults = [...existingQuizResults, quizResult];

      const sanitizedQuizResults = updatedQuizResults.map(({ id, ...rest }) => {
        if (rest.quizQuestion && Array.isArray(rest.quizQuestion)) {
          rest.quizQuestion = rest.quizQuestion.map(({ id: qId, ...qRest }) => qRest);
        }
        return rest;
      });

      const updateResponse = await axios.put(
        `http://localhost:1337/api/userlists/${documentId}`,
        {
          data: {
            quizResult: sanitizedQuizResults,
          },
        }
      );

      setUserData(updateResponse.data.data);
    } catch (error) {
      console.error("Error updating quiz result:", error.response?.data || error);
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    setOpen(true);
    clearInterval(timerRef.current);

    const quizResult = {
      result: calculateResult(),
      quizQuestion: selectedQuestions.map((question, index) => ({
        question: question.question,
        answer: answers[index] || null,
        correctAnswer: question.answer,
      })),
    };

    await updateQuizResult(quizResult);
  };

  const handleShowResult = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleStartQuiz = () => setStartPromptOpen(false);

 const handleRestartQuiz = async () => {
  clearInterval(timerRef.current);

  try {
    const response = await axios.get(
      `http://localhost:1337/api/userlists/${documentId}?populate[quizResult][populate]=quizQuestion`
    );
    setUserData(response.data.data);
  } catch (error) {
    console.error("Error fetching updated user data:", error);
  }

  // Reset quiz state
  setOpen(false);
  setActiveStep(0);
  setAnswers({});
  setSubmitted(false);
  setTimeLeft(300);
  setSelectedQuestions(getRandomQuestions(questions));
  setStartPromptOpen(true);
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
        handleGoBack={handleGoBack}
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
            showResultModal={handleShowResult}
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
