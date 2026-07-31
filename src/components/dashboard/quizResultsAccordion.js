"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Stack,
  Box,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Divider,
  Paper,
  Grid,
  Avatar,
  Badge,
  IconButton,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import QuizIcon from "@mui/icons-material/Quiz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { alpha, useTheme } from "@mui/material/styles";

const QuizResultsAccordion = ({ quizResults }) => {
  const theme = useTheme();
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  if (!quizResults || quizResults.length === 0) {
    return (
      <Card sx={{ 
        background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
      }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <PsychologyIcon sx={{ fontSize: "3rem", color: theme.palette.info.main, mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No quiz results available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Take some quizzes to see your detailed results here
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const calculateQuizStats = (quiz) => {
    const totalQuestions = quiz.quizQuestion?.length || 0;
    const correctAnswers = quiz.quizQuestion?.filter(q => 
      q.answer?.trim() === q.correctAnswer?.trim()
    ).length || 0;
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    return { totalQuestions, correctAnswers, percentage };
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

  return (
    <Box sx={{ 
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
      borderRadius: 4,
      p: 3,
      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
    }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 2,
          p: 2,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
        }}>
          <Avatar sx={{ 
            bgcolor: theme.palette.primary.main,
            width: 48,
            height: 48,
            boxShadow: theme.shadows[4]
          }}>
            <PsychologyIcon sx={{ fontSize: "1.75rem" }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ 
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5
            }}>
              Detailed Quiz Results
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Comprehensive analysis of your quiz performance
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {quizResults.map((quiz, quizIndex) => {
          const stats = calculateQuizStats(quiz);
          const isExpanded = expandedQuiz === quizIndex;
          
          return (
            <Grid item xs={12} key={quizIndex}>
              <Card sx={{ 
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                borderRadius: 4,
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px) scale(1.02)',
                  boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  opacity: 0.8
                }
              }}>
                <CardHeader
                  sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.secondary.main, 0.12)} 100%)`,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60%',
                      height: 2,
                      background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                      opacity: 0.6
                    }
                  }}
                  avatar={
                    <Box sx={{ position: 'relative' }}>
                      <Avatar sx={{ 
                        bgcolor: getPerformanceColor(stats.percentage),
                        width: 64,
                        height: 64,
                        boxShadow: `0 8px 24px ${alpha(getPerformanceColor(stats.percentage), 0.3)}`,
                        border: `3px solid ${alpha(theme.palette.background.paper, 0.8)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1) rotate(5deg)',
                          boxShadow: `0 12px 32px ${alpha(getPerformanceColor(stats.percentage), 0.4)}`,
                        }
                      }}>
                        <QuizIcon sx={{ fontSize: "2rem" }} />
                      </Avatar>
                      <Box sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: getPerformanceColor(stats.percentage),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${theme.palette.background.paper}`,
                        boxShadow: theme.shadows[2]
                      }}>
                        {getPerformanceIcon(stats.percentage)}
                      </Box>
                    </Box>
                  }
                  title={
                    <Typography variant="h6" fontWeight="bold" sx={{
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '1.3rem'
                    }}>
                      {quiz.quizTitle || `${quiz.technology} Quiz ${quizIndex + 1}`}
                    </Typography>
                  }
                  subheader={
                    <Box sx={{ mt: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                        <Chip
                          icon={getPerformanceIcon(stats.percentage)}
                          label={`${stats.percentage}% Score`}
                          color={stats.percentage >= 80 ? 'success' : stats.percentage >= 60 ? 'warning' : 'error'}
                          variant="filled"
                          sx={{ 
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            height: 32,
                            boxShadow: `0 4px 12px ${alpha(getPerformanceColor(stats.percentage), 0.3)}`,
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: `0 6px 16px ${alpha(getPerformanceColor(stats.percentage), 0.4)}`,
                            }
                          }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          fontWeight: 600,
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.background.paper, 0.7),
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                        }}>
                          {stats.correctAnswers} of {stats.totalQuestions} correct
                        </Typography>
                      </Stack>
                    </Box>
                  }
                  action={
                    <IconButton
                      onClick={() => setExpandedQuiz(isExpanded ? null : quizIndex)}
                      sx={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  }
                />

                {isExpanded && (
                  <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Performance Overview
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={stats.percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha(theme.palette.grey[300], 0.3),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getPerformanceColor(stats.percentage),
                            borderRadius: 4,
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {stats.percentage}% completion rate
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                        Question Details
                      </Typography>
                      
                      {quiz.quizQuestion?.map((question, qIndex) => {
                        const isCorrect = question.answer?.trim() === question.correctAnswer?.trim();
                        const isQuestionExpanded = expandedQuestion === `${quizIndex}-${qIndex}`;
                        
                        return (
                          <Accordion 
                            key={qIndex} 
                            sx={{ 
                              mb: 2,
                              borderRadius: 2,
                              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                              '&:before': { display: 'none' },
                              '&.Mui-expanded': {
                                margin: 0,
                                '&:not(:last-child)': {
                                  borderBottom: 0,
                                }
                              }
                            }}
                            expanded={isQuestionExpanded}
                            onChange={() => setExpandedQuestion(isQuestionExpanded ? null : `${quizIndex}-${qIndex}`)}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              sx={{
                                background: isCorrect 
                                  ? alpha(theme.palette.success.main, 0.05)
                                  : alpha(theme.palette.error.main, 0.05),
                                borderRadius: isQuestionExpanded ? '8px 8px 0 0' : '8px',
                                '&.Mui-expanded': {
                                  minHeight: 48,
                                }
                              }}
                            >
                              <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                                <Badge
                                  badgeContent={qIndex + 1}
                                  color="primary"
                                  sx={{
                                    '& .MuiBadge-badge': {
                                      bgcolor: theme.palette.primary.main,
                                      color: 'white',
                                      fontWeight: 'bold'
                                    }
                                  }}
                                >
                                  <Avatar sx={{ 
                                    bgcolor: isCorrect ? theme.palette.success.main : theme.palette.error.main,
                                    width: 32,
                                    height: 32
                                  }}>
                                    {isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
                                  </Avatar>
                                </Badge>
                                
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="body1" fontWeight="medium" sx={{ 
                                    color: isCorrect ? theme.palette.success.dark : theme.palette.error.dark,
                                    lineHeight: 1.3
                                  }}>
                                    {question.question}
                                  </Typography>
                                </Box>

                                <Chip
                                  label={isCorrect ? "Correct" : "Incorrect"}
                                  color={isCorrect ? "success" : "error"}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontWeight: 'bold' }}
                                />
                              </Stack>
                            </AccordionSummary>

                            <AccordionDetails sx={{ 
                              background: alpha(theme.palette.background.paper, 0.5),
                              borderRadius: '0 0 8px 8px'
                            }}>
                              <Box sx={{ p: 2 }}>
                                <Paper sx={{ 
                                  p: 2, 
                                  mb: 2,
                                  bgcolor: isCorrect 
                                    ? alpha(theme.palette.success.main, 0.1)
                                    : alpha(theme.palette.error.main, 0.1),
                                  border: `1px solid ${isCorrect 
                                    ? alpha(theme.palette.success.main, 0.3)
                                    : alpha(theme.palette.error.main, 0.3)}`
                                }}>
                                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Your Answer:
                                  </Typography>
                                  <Typography 
                                    variant="body1" 
                                    sx={{ 
                                      color: isCorrect ? theme.palette.success.dark : theme.palette.error.dark,
                                      fontWeight: 'medium',
                                      fontStyle: question.answer ? 'normal' : 'italic'
                                    }}
                                  >
                                    {question.answer || "No answer provided"}
                                  </Typography>
                                </Paper>

                                {!isCorrect && (
                                  <Paper sx={{ 
                                    p: 2,
                                    bgcolor: alpha(theme.palette.info.main, 0.1),
                                    border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`
                                  }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                      Correct Answer:
                                    </Typography>
                                    <Typography 
                                      variant="body1" 
                                      color="info.dark"
                                      fontWeight="medium"
                                    >
                                      {question.correctAnswer}
                                    </Typography>
                                  </Paper>
                                )}
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        );
                      })}
                    </Box>
                  </CardContent>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default QuizResultsAccordion;
