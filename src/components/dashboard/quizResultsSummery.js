"use client";

import React from "react";
import { Box, Typography, Paper, Grid, LinearProgress } from "@mui/material";

const QuizResultsSummaryBySkill = ({ quizResults, skills }) => {
  // Helper to calculate summary for a specific technology
  const getSummaryForSkill = (skillName) => {
    let totalQuestions = 0;
    let totalCorrect = 0;

    // Filter quiz results for this skill (case-insensitive)
    const filteredResults = quizResults.filter(
      (quiz) => quiz.technology.toLowerCase() === skillName.toLowerCase()
    );

    filteredResults.forEach((quiz) => {
      quiz.quizQuestion.forEach((q) => {
        totalQuestions++;

        // Safely handle potential null/undefined answers
        const userAnswer =
          typeof q.answer === "string" ? q.answer.trim() : "";
        const correctAnswer =
          typeof q.correctAnswer === "string" ? q.correctAnswer.trim() : "";

        if (userAnswer === correctAnswer) {
          totalCorrect++;
        }
      });
    });

    const totalWrong = totalQuestions - totalCorrect;
    const correctPercentage =
      totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

    return { totalQuestions, totalCorrect, totalWrong, correctPercentage };
  };

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <h3>Quiz Results Summary by Skill</h3>

      <Grid container spacing={3}>
        {skills.map((skill) => {
          const {
            totalQuestions,
            totalCorrect,
            totalWrong,
            correctPercentage,
          } = getSummaryForSkill(skill.skillName);

          return (
            <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={skill.id}>
              <Box className="card fullWidth" sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  {skill.skillName} (Level: {skill.level})
                </Typography>

                {totalQuestions === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    No quiz attempts for this skill.
                  </Typography>
                ) : (
                  <>
                    <Grid container spacing={1}>
                      <Grid item size={{ xs: 4 }}>
                        <Typography variant="subtitle2">Total Questions</Typography>
                        <Typography variant="h6">{totalQuestions}</Typography>
                      </Grid>
                      <Grid item size={{ xs: 4 }}>
                        <Typography variant="subtitle2" color="success.main">
                          Correct Answers
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          {totalCorrect}
                        </Typography>
                      </Grid>
                      <Grid item size={{ xs: 4 }}>
                        <Typography variant="subtitle2" color="error.main">
                          Wrong Answers
                        </Typography>
                        <Typography variant="h6" color="error.main">
                          {totalWrong}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Accuracy: {correctPercentage.toFixed(1)}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={correctPercentage}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                  </>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default QuizResultsSummaryBySkill;
