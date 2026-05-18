"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
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
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Quiz as QuizIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  EmojiEvents as EmojiEventsIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";

const QuizResultsModal = ({ open, onClose, quizResults }) => {
  const theme = useTheme();
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  if (!quizResults || quizResults.length === 0) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          }
        }}
      >
        <DialogTitle sx={{ 
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            <PsychologyIcon />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            Detailed Quiz Results
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }} style={{padding:'20px'}}>
          <PsychologyIcon sx={{ fontSize: 64, color: theme.palette.info.main, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No quiz results available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Take some quizzes to see your detailed results here
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.secondary.main, 0.12)} 100%)`,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: theme.palette.primary.main,
            width: 48,
            height: 48,
            boxShadow: theme.shadows[4]
          }}>
            <PsychologyIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Detailed Quiz Results
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Comprehensive analysis of your quiz performance
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ 
          bgcolor: alpha(theme.palette.error.main, 0.1),
          '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
        }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 5 }}>
        {quizResults.map((quiz, quizIndex) => {
          const stats = calculateQuizStats(quiz);
          
          return (
            <Box key={quizIndex} sx={{ mb: 4 }} style={{padding:'20px 0'}}>
              {/* Quiz Header */}
              <Card sx={{ 
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 3,
                mb: 3,
                overflow: 'hidden'
              }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ 
                      bgcolor: getPerformanceColor(stats.percentage),
                      width: 48,
                      height: 48,
                      boxShadow: `0 4px 12px ${alpha(getPerformanceColor(stats.percentage), 0.3)}`
                    }}>
                      <QuizIcon sx={{ fontSize: 24 }} />
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6" fontWeight="bold" sx={{
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {quiz.quizTitle || `${quiz.technology} Quiz ${quizIndex + 1}`}
                    </Typography>
                  }
                  subheader={
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                      <Chip
                        icon={getPerformanceIcon(stats.percentage)}
                        label={`${stats.percentage}% Score`}
                        color={stats.percentage >= 80 ? 'success' : stats.percentage >= 60 ? 'warning' : 'error'}
                        variant="filled"
                        sx={{ fontWeight: 'bold' }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {stats.correctAnswers} of {stats.totalQuestions} correct
                      </Typography>
                    </Stack>
                  }
                />
              </Card>

              {/* Question Details - Always Expanded */}
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2, color: theme.palette.primary.main }}>
                  📋 Question Details
                </Typography>
                
                {quiz.quizQuestion?.map((question, qIndex) => {
                  const isCorrect = question.answer?.trim() === question.correctAnswer?.trim();
                  const isQuestionExpanded = expandedQuestion === `${quizIndex}-${qIndex}`;
                  
                  return (
                    <Accordion 
                      key={qIndex} 
                      sx={{ 
                        mb: 2,
                        borderRadius: 3,
                        border: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
                        '&:before': { display: 'none' },
                        '&.Mui-expanded': {
                          margin: 0,
                          '&:not(:last-child)': {
                            borderBottom: 0,
                          }
                        },
                        '&:hover': {
                          border: `2px solid ${isCorrect ? alpha(theme.palette.success.main, 0.3) : alpha(theme.palette.error.main, 0.3)}`,
                          boxShadow: `0 4px 12px ${isCorrect ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1)}`,
                        }
                      }}
                      expanded={isQuestionExpanded}
                      onChange={() => setExpandedQuestion(isQuestionExpanded ? null : `${quizIndex}-${qIndex}`)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          background: isCorrect 
                            ? alpha(theme.palette.success.main, 0.08)
                            : alpha(theme.palette.error.main, 0.08),
                          borderRadius: isQuestionExpanded ? '12px 12px 0 0' : '12px',
                          '&.Mui-expanded': {
                            minHeight: 56,
                          },
                          py: 2
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
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                width: 20,
                                height: 20
                              }
                            }}
                          >
                            <Avatar sx={{ 
                              bgcolor: isCorrect ? theme.palette.success.main : theme.palette.error.main,
                              width: 36,
                              height: 36,
                              boxShadow: `0 2px 8px ${isCorrect ? alpha(theme.palette.success.main, 0.3) : alpha(theme.palette.error.main, 0.3)}`
                            }}>
                              {isCorrect ? <CheckCircleIcon sx={{ fontSize: 20 }} /> : <CancelIcon sx={{ fontSize: 20 }} />}
                            </Avatar>
                          </Badge>
                          
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" fontWeight="medium" sx={{ 
                              color: isCorrect ? theme.palette.success.dark : theme.palette.error.dark,
                              lineHeight: 1.4,
                              fontSize: '0.95rem'
                            }}>
                              {question.question}
                            </Typography>
                          </Box>

                          <Chip
                            label={isCorrect ? "Correct" : "Incorrect"}
                            color={isCorrect ? "success" : "error"}
                            size="small"
                            variant="filled"
                            sx={{ 
                              fontWeight: 'bold', 
                              fontSize: '0.75rem',
                              height: 28,
                              boxShadow: `0 2px 4px ${isCorrect ? alpha(theme.palette.success.main, 0.3) : alpha(theme.palette.error.main, 0.3)}`
                            }}
                          />
                        </Stack>
                      </AccordionSummary>

                      <AccordionDetails sx={{ 
                        background: alpha(theme.palette.background.paper, 0.6),
                        borderRadius: '0 0 12px 12px',
                        p: 3
                      }}>
                        <Paper sx={{ 
                          p: 2, 
                          mb: 2,
                          bgcolor: isCorrect 
                            ? alpha(theme.palette.success.main, 0.1)
                            : alpha(theme.palette.error.main, 0.1),
                          border: `2px solid ${isCorrect 
                            ? alpha(theme.palette.success.main, 0.3)
                            : alpha(theme.palette.error.main, 0.3)}`,
                          borderRadius: 2
                        }}>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ 
                            color: isCorrect ? theme.palette.success.dark : theme.palette.error.dark,
                            mb: 1
                          }}>
                            Your Answer:
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: isCorrect ? theme.palette.success.dark : theme.palette.error.dark,
                              fontWeight: 'medium',
                              fontStyle: question.answer ? 'normal' : 'italic',
                              bgcolor: alpha(theme.palette.background.paper, 0.7),
                              p: 1.5,
                              borderRadius: 1,
                              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                            }}
                          >
                            {question.answer || "No answer provided"}
                          </Typography>
                        </Paper>

                        {!isCorrect && (
                          <Paper sx={{ 
                            p: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            border: `2px solid ${alpha(theme.palette.info.main, 0.3)}`,
                            borderRadius: 2
                          }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ 
                              color: theme.palette.info.dark,
                              mb: 1
                            }}>
                              Correct Answer:
                            </Typography>
                            <Typography 
                              variant="body1" 
                              color="info.dark"
                              fontWeight="medium"
                              sx={{
                                bgcolor: alpha(theme.palette.background.paper, 0.7),
                                p: 1.5,
                                borderRadius: 1,
                                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                              }}
                            >
                              {question.correctAnswer}
                            </Typography>
                          </Paper>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </DialogContent>

      <DialogActions sx={{ 
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        p: 2
      }}>
        <Button onClick={onClose} variant="contained" color="primary" sx={{ 
          borderRadius: 2,
          px: 3,
          py: 1,
          fontWeight: 'bold'
        }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuizResultsModal;
