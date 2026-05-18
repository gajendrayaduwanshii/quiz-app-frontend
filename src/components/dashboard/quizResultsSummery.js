"use client";

import React from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  LinearProgress, 
  Card, 
  CardContent, 
  Avatar, 
  Chip, 
  Stack, 
  Divider,
  Badge,
  IconButton,
  Tooltip
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import StarIcon from "@mui/icons-material/Star";
import CodeIcon from "@mui/icons-material/Code";
import PremiumCard from "@/components/premium/PremiumCard";
import SectionHeader from "@/components/premium/SectionHeader";

const QuizResultsSummaryBySkill = ({ quizResults, skills }) => {
  const theme = useTheme();

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

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return theme.palette.success.main;
    if (percentage >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getPerformanceIcon = (percentage) => {
    if (percentage >= 80) return <EmojiEventsIcon />;
    if (percentage >= 60) return <TrendingUpIcon />;
    return <TrendingDownIcon />;
  };

  const getPerformanceEmoji = (percentage) => {
    if (percentage >= 80) return "🏆";
    if (percentage >= 60) return "📈";
    return "📉";
  };

  return (
    <Box sx={{ mt: 3 }}>
      <SectionHeader
        eyebrow="Quiz Analytics"
        title="Quiz Results Summary by Skill"
        description="Skill-wise quiz performance, attempts, and improvement signals."
      />
      <Grid container spacing={2.2}>
        {(skills || []).map((skill) => {
          const {
            totalQuestions,
            totalCorrect,
            totalWrong,
            correctPercentage,
          } = getSummaryForSkill(skill.skillName);

          const performanceColor = getPerformanceColor(correctPercentage);
          const performanceIcon = getPerformanceIcon(correctPercentage);
          const performanceEmoji = getPerformanceEmoji(correctPercentage);

          return (
            <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={skill.id}>
              <PremiumCard glow={`${performanceColor}33`} sx={{ height: 300 }}>
                <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '17px',
                        background: `linear-gradient(135deg, ${performanceColor}, ${alpha(performanceColor, 0.7)})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 16px 34px ${alpha(performanceColor, 0.38)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        }
                      }} className="skill-icon">
                        <CodeIcon sx={{ fontSize: 22, color: 'white' }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ 
                          color: theme.palette.text.primary,
                          fontSize: '1.15rem',
                          mb: 0.5
                        }}>
                          {skill.skillName}
                        </Typography>
                        <Chip 
                          label={skill.level} 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha(performanceColor, 0.1),
                            color: performanceColor,
                            border: `1px solid ${alpha(performanceColor, 0.3)}`,
                            fontWeight: 'bold',
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ 
                      textAlign: 'center',
                      background: alpha(performanceColor, 0.1),
                      borderRadius: '16px',
                      width: 50,
                      height: 50,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${alpha(performanceColor, 0.2)}`
                    }}>
                      <Typography variant="h5" sx={{ color: performanceColor }}>
                        {performanceEmoji}
                      </Typography>
                    </Box>
                  </Box>

                  {totalQuestions === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 2.5,
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025))`,
                      borderRadius: '20px',
                      border: `1px dashed rgba(255,255,255,0.14)`
                    }}>
                      <Box sx={{
                        width: 58,
                        height: 58,
                        borderRadius: '18px',
                        background: `linear-gradient(135deg, rgba(124,58,237,0.18), rgba(6,182,212,0.12))`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.5
                      }}>
                        <PsychologyIcon sx={{ fontSize: 30, color: theme.palette.secondary.main }} />
                      </Box>
                      <Typography variant="h6" color="text.secondary" fontWeight="bold" sx={{ mb: 1 }}>
                        No Quiz Attempts
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Take a quiz to see your performance
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Performance Circle */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mb: 2,
                        position: 'relative'
                      }}>
                        <Box sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: `conic-gradient(${performanceColor} 0deg, ${performanceColor} ${correctPercentage * 3.6}deg, ${alpha(theme.palette.grey[300], 0.3)} ${correctPercentage * 3.6}deg, ${alpha(theme.palette.grey[300], 0.3)} 360deg)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: 58,
                            height: 58,
                            borderRadius: '50%',
                            background: '#0B1120',
                            zIndex: 1
                          }
                        }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ 
                            color: performanceColor,
                            zIndex: 2,
                            position: 'relative'
                          }}>
                            {correctPercentage.toFixed(0)}%
                          </Typography>
                        </Box>
                      </Box>

                      {/* Stats in Different Layout */}
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: 1.5, 
                        mb: 2 
                      }}>
                        <Box sx={{ 
                          textAlign: 'center',
                          p: 1.5,
                          background: alpha(theme.palette.info.main, 0.11),
                          borderRadius: '16px',
                          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                        }}>
                          <Typography variant="h6" fontWeight="bold" color="info.main">
                            {totalQuestions}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Questions
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          textAlign: 'center',
                          p: 1.5,
                          background: alpha(theme.palette.success.main, 0.11),
                          borderRadius: '16px',
                          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                        }}>
                          <Typography variant="h6" fontWeight="bold" color="success.main">
                            {totalCorrect}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Correct
                          </Typography>
                        </Box>
                      </Box>

                      {/* Performance Status */}
                      <Box sx={{ 
                        mt: 'auto',
                        p: 1.5,
                        background: `linear-gradient(135deg, ${alpha(performanceColor, 0.1)} 0%, ${alpha(performanceColor, 0.05)} 100%)`,
                        borderRadius: '16px',
                        border: `1px solid ${alpha(performanceColor, 0.2)}`,
                        textAlign: 'center'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                          {performanceIcon}
                          <Typography variant="body2" fontWeight="bold" sx={{ color: performanceColor }}>
                            {correctPercentage >= 80 ? 'Excellent' : correctPercentage >= 60 ? 'Good' : 'Needs Improvement'}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {totalWrong} incorrect
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </PremiumCard>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default QuizResultsSummaryBySkill;
