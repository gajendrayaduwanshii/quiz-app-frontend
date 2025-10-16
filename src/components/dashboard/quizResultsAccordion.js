"use client";

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Stack,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { textTransform } from "@mui/system";

const QuizResultsAccordion = ({ quizResults }) => {
  if (!quizResults || quizResults.length === 0) {
    return <Typography>No quiz results available.</Typography>;
  }

  return (
    <Box>
      <h3 sx={{ mb: 2 }}>
        Detailed Quiz Results
      </h3>
      <Box display={"flex"} flexDirection="column" gap={1}>
      {quizResults.map((quiz, quizIndex) => (
        <Accordion className="accordion-card" key={quizIndex}>
          <AccordionSummary className="main-accordion-title"  expandIcon={<ExpandMoreIcon />}>
            <h3 className="h3-title">
              {quiz.quizTitle || `${quiz.technology} Quiz ${quizIndex + 1}`}
            </h3>
          </AccordionSummary>

          <AccordionDetails>
            {quiz.quizQuestion.map((question, qIndex) => {
              const isCorrect =
                question.answer?.trim() === question.correctAnswer?.trim();

              return (
                <Accordion key={qIndex} sx={{ mb: 1 }}>
                  <AccordionSummary className="qus-accordion-title" expandIcon={<ExpandMoreIcon />}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ width: "100%", justifyContent: "space-between" }}
                    >
                      <Typography sx={{ flexGrow: 1, pr: 2 }}>
                        {qIndex + 1}. {question.question}
                      </Typography>

                      <Chip
                        icon={
                          isCorrect ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <CancelIcon color="error" />
                          )
                        }
                        label={isCorrect ? "Correct" : "Wrong"}
                        color={isCorrect ? "success" : "error"}
                        variant="outlined"
                      />
                    </Stack>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Typography>
                      <strong>Your Answer:</strong>{" "}
                      <span
                        style={{
                          color: isCorrect ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {question.answer || "No Answer"}
                      </span>
                    </Typography>
                    {!isCorrect && (
                      <Typography sx={{ mt: 1 }}>
                        <strong>Correct Answer:</strong> {question.correctAnswer}
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </AccordionDetails>
        </Accordion>
      ))}
      </Box>
    </Box>
  );
};

export default QuizResultsAccordion;
