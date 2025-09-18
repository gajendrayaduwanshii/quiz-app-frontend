"use client";

import React from "react";
import { Box, Typography, Paper, Grid, LinearProgress } from "@mui/material";

const QuizResultsSummery = ({ quizResults }) => {
  let totalQuestions = 0;
  let totalCorrect = 0;

  quizResults.forEach((quiz) => {
    quiz.quizQuestion.forEach((q) => {
      totalQuestions++;
      if (q.answer.trim() === q.correctAnswer.trim()) {
        totalCorrect++;
      }
    });
  });

  const totalWrong = totalQuestions - totalCorrect;
  const correctPercentage = (totalCorrect / totalQuestions) * 100 || 0;

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      

      <Box sx={{ p: 3, border:'0' }} className="card fullWidth">
      <h3 sx={{ mb: 2 }}>
        Quiz Results Summary
      </h3>
        <Grid container spacing={3}>
          <Grid item size={{xs:12, sm:4}}>
            <Typography variant="subtitle1">Total Questions</Typography>
            <Typography variant="h6">{totalQuestions}</Typography>
          </Grid>
          <Grid item size={{xs:12, sm:4}}>
            <Typography variant="subtitle1" color="success.main">
              Correct Answers
            </Typography>
            <Typography variant="h6" color="success.main">
              {totalCorrect}
            </Typography>
          </Grid>
          <Grid item size={{xs:12, sm:4}}>
            <Typography variant="subtitle1" color="error.main">
              Wrong Answers
            </Typography>
            <Typography variant="h6" color="error.main">
              {totalWrong}
            </Typography>
          </Grid>

          <Grid item size={{xs:12, sm:12}}>
            <Typography variant="body1" gutterBottom>
              Accuracy: {correctPercentage.toFixed(1)}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={correctPercentage}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default QuizResultsSummery;
