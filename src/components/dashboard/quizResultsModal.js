"use client";

import React, { useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Award,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Target,
  X,
  XCircle,
} from "lucide-react";
import PremiumButton from "@/components/premium/PremiumButton";

const normalize = (value) => String(value || "").trim().toLowerCase();

const QuizResultsModal = ({ open, onClose, quizResults = [] }) => {
  const theme = useTheme();
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const quizzes = useMemo(() => (quizResults || []).filter(Boolean), [quizResults]);

  const quizStats = useMemo(() => {
    return quizzes.map((quiz, quizIndex) => {
      const questions = quiz.quizQuestion || [];
      const correctAnswers = questions.filter(
        (question) => normalize(question.answer) === normalize(question.correctAnswer)
      ).length;
      const totalQuestions = questions.length;
      const percentage = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

      return {
        quiz,
        quizIndex,
        questions,
        correctAnswers,
        totalQuestions,
        wrongAnswers: totalQuestions - correctAnswers,
        percentage,
      };
    });
  }, [quizzes]);

  const aggregate = useMemo(() => {
    const totalQuestions = quizStats.reduce((sum, item) => sum + item.totalQuestions, 0);
    const correctAnswers = quizStats.reduce((sum, item) => sum + item.correctAnswers, 0);
    const wrongAnswers = totalQuestions - correctAnswers;
    const percentage = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return { totalQuestions, correctAnswers, wrongAnswers, percentage };
  }, [quizStats]);

  const getPerformance = (percentage) => {
    if (percentage >= 80) {
      return { label: "Excellent", color: theme.palette.success.main, icon: <Award size={17} /> };
    }
    if (percentage >= 60) {
      return { label: "On Track", color: theme.palette.warning.main, icon: <Target size={17} /> };
    }
    return { label: "Needs Focus", color: theme.palette.error.main, icon: <BarChart3 size={17} /> };
  };

  const performance = getPerformance(aggregate.percentage);

  const renderAnswerBlock = (label, value, color, icon) => (
    <Box
      sx={{
        p: 1.6,
        borderRadius: "18px",
        border: `1px solid ${alpha(color, 0.24)}`,
        bgcolor: alpha(color, 0.09),
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.9, color }}>
        {icon}
        <Typography sx={{ fontWeight: 950, fontSize: 13 }}>{label}</Typography>
      </Stack>
      <Typography
        sx={{
          p: 1.35,
          borderRadius: "14px",
          bgcolor: "rgba(5,8,22,0.58)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: value ? "#fff" : "text.secondary",
          fontStyle: value ? "normal" : "italic",
          lineHeight: 1.55,
          overflowWrap: "anywhere",
        }}
      >
        {value || "No answer provided"}
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          width: "min(1100px, calc(100vw - 24px))",
          maxHeight: "92vh",
          borderRadius: "30px",
          overflow: "hidden",
          bgcolor: "rgba(5,8,22,0.98)",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.028)), radial-gradient(circle at 12% 0%, rgba(124,58,237,0.26), transparent 34%), radial-gradient(circle at 92% 8%, rgba(6,182,212,0.18), transparent 30%)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 34px 140px rgba(0,0,0,0.72)",
          backdropFilter: "blur(26px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: { xs: 2.2, md: 3 },
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
          <Box>
            <Chip
              icon={<ClipboardCheck size={15} />}
              label="Detailed Quiz Results"
              sx={{
                mb: 1.2,
                color: "#CFFAFE",
                bgcolor: "rgba(6,182,212,0.12)",
                border: "1px solid rgba(103,232,249,0.22)",
                fontWeight: 900,
              }}
            />
            <Typography
              variant="h4"
              className="gradient-text"
              sx={{ fontWeight: 950, lineHeight: 1.05, letterSpacing: 0 }}
            >
              Performance Review
            </Typography>
            <Typography sx={{ mt: 0.8, color: "text.secondary" }}>
              Question-level breakdown with your selected answers and correct answers.
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            sx={{
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.10)",
              bgcolor: "rgba(255,255,255,0.05)",
              "&:hover": { bgcolor: "rgba(239,68,68,0.16)" },
            }}
          >
            <X size={20} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2.2, md: 3 } }}>
        {!quizStats.length ? (
          <Box
            sx={{
              minHeight: 300,
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              borderRadius: "24px",
              border: "1px dashed rgba(103,232,249,0.24)",
              bgcolor: "rgba(6,182,212,0.07)",
            }}
          >
            <Box>
              <CircleHelp size={52} color={theme.palette.secondary.main} />
              <Typography variant="h6" sx={{ mt: 1.4, fontWeight: 950 }}>
                No quiz results available
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Complete a quiz to unlock detailed performance review.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Stack spacing={2.4}>
            <Box
              sx={{
                p: { xs: 2, md: 2.4 },
                borderRadius: "18px",
                border: `1px solid ${alpha(performance.color, 0.28)}`,
                bgcolor: alpha(performance.color, 0.09),
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={2.2} alignItems={{ xs: "stretch", md: "center" }}>
                <Box
                  sx={{
                    width: { xs: 126, md: 142 },
                    height: { xs: 126, md: 142 },
                    mx: { xs: "auto", md: 0 },
                    flex: "0 0 auto",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: `conic-gradient(${performance.color} 0deg, ${performance.color} ${aggregate.percentage * 3.6}deg, rgba(255,255,255,0.09) ${aggregate.percentage * 3.6}deg, rgba(255,255,255,0.09) 360deg)`,
                    boxShadow: `0 22px 60px ${alpha(performance.color, 0.22)}`,
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 96, md: 108 },
                      height: { xs: 96, md: 108 },
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(5,8,22,0.96)",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  >
                    <Typography sx={{ color: performance.color, fontSize: 34, lineHeight: 1, fontWeight: 950 }}>
                      {aggregate.percentage}%
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: 12, mt: -2 }}>
                      score
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap", rowGap: 1 }}>
                    <Chip
                      icon={performance.icon}
                      label={performance.label}
                      sx={{
                        color: performance.color,
                        bgcolor: alpha(performance.color, 0.14),
                        border: `1px solid ${alpha(performance.color, 0.30)}`,
                        fontWeight: 950,
                      }}
                    />
                    <Chip
                      icon={<Clock3 size={15} />}
                      label={`${quizStats.length} attempt${quizStats.length > 1 ? "s" : ""}`}
                      sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.07)", fontWeight: 850 }}
                    />
                  </Stack>
                  <Typography variant="h5" sx={{ fontWeight: 950, mb: 1 }}>
                    Overall Quiz Performance
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={aggregate.percentage}
                    sx={{
                      height: 10,
                      borderRadius: 999,
                      bgcolor: "rgba(255,255,255,0.08)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        background: `linear-gradient(90deg, ${performance.color}, ${theme.palette.secondary.main})`,
                      },
                    }}
                  />

                  <Box
                    sx={{
                      mt: 2,
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                      gap: 1.2,
                    }}
                  >
                    {[
                      { label: "Questions", value: aggregate.totalQuestions, color: theme.palette.secondary.main, icon: <CircleHelp size={16} /> },
                      { label: "Correct", value: aggregate.correctAnswers, color: theme.palette.success.main, icon: <CheckCircle2 size={16} /> },
                      { label: "Wrong", value: aggregate.wrongAnswers, color: theme.palette.error.main, icon: <XCircle size={16} /> },
                    ].map((item) => (
                      <Box
                        key={item.label}
                        sx={{
                          p: 1.35,
                          borderRadius: "16px",
                          border: `1px solid ${alpha(item.color, 0.23)}`,
                          bgcolor: alpha(item.color, 0.09),
                        }}
                      >
                        <Stack direction="row" spacing={0.8} alignItems="center" sx={{ color: item.color }}>
                          {item.icon}
                          <Typography sx={{ fontWeight: 950, fontSize: 20 }}>{item.value}</Typography>
                        </Stack>
                        <Typography sx={{ mt: 0.35, color: "text.secondary", fontSize: 12 }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Stack>
            </Box>

            {quizStats.map((item) => {
              const itemPerformance = getPerformance(item.percentage);
              const quizTitle = item.quiz.quizTitle || `${item.quiz.technology || "General"} Quiz`;

              return (
                <Box
                  key={`${quizTitle}-${item.quizIndex}`}
                  sx={{
                    p: { xs: 1.5, md: 2 },
                    borderRadius: "24px",
                    border: `1px solid ${alpha(itemPerformance.color, 0.22)}`,
                    bgcolor: "rgba(255,255,255,0.04)",
                  }}
                >
                  <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 950 }}>
                        {quizTitle}
                      </Typography>
                      <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                        {item.quiz.technology || "General"} assessment review
                      </Typography>
                    </Box>
                    <Chip
                      label={`${item.percentage}% - ${item.correctAnswers}/${item.totalQuestions}`}
                      sx={{
                        color: itemPerformance.color,
                        bgcolor: alpha(itemPerformance.color, 0.13),
                        border: `1px solid ${alpha(itemPerformance.color, 0.28)}`,
                        fontWeight: 950,
                        alignSelf: { xs: "flex-start", md: "center" },
                      }}
                    />
                  </Stack>

                  <Stack spacing={1.1}>
                    {item.questions.map((question, qIndex) => {
                      const isCorrect = normalize(question.answer) === normalize(question.correctAnswer);
                      const questionColor = isCorrect ? theme.palette.success.main : theme.palette.error.main;
                      const panelId = `${item.quizIndex}-${qIndex}`;
                      const isExpanded = expandedQuestion === panelId;

                      return (
                        <Accordion
                          key={panelId}
                          expanded={isExpanded}
                          onChange={() => setExpandedQuestion(isExpanded ? null : panelId)}
                          sx={{
                            borderRadius: "18px !important",
                            overflow: "hidden",
                            border: `1px solid ${alpha(questionColor, isExpanded ? 0.38 : 0.20)}`,
                            bgcolor: alpha(questionColor, isExpanded ? 0.10 : 0.06),
                            boxShadow: isExpanded ? `0 18px 48px ${alpha(questionColor, 0.13)}` : "none",
                            "&::before": { display: "none" },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ChevronDown size={19} color="#fff" />}
                            sx={{
                              minHeight: 68,
                              "& .MuiAccordionSummary-content": {
                                alignItems: "center",
                                gap: 1.5,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: 34,
                                height: 34,
                                flex: "0 0 auto",
                                borderRadius: "12px",
                                display: "grid",
                                placeItems: "center",
                                color: "#fff",
                                bgcolor: alpha(questionColor, 0.24),
                                border: `1px solid ${alpha(questionColor, 0.32)}`,
                              }}
                            >
                              {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                            </Box>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography sx={{ fontWeight: 850, lineHeight: 1.35 }}>
                                Q{qIndex + 1}. {question.question}
                              </Typography>
                            </Box>
                            <Chip
                              size="small"
                              label={isCorrect ? "Correct" : "Incorrect"}
                              sx={{
                                display: { xs: "none", sm: "inline-flex" },
                                color: questionColor,
                                bgcolor: alpha(questionColor, 0.13),
                                fontWeight: 900,
                              }}
                            />
                          </AccordionSummary>

                          <AccordionDetails sx={{ p: { xs: 1.5, md: 2 }, pt: 0 }}>
                            <Box
                              sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: isCorrect ? "1fr" : "1fr 1fr" },
                                gap: 1.3,
                              }}
                            >
                              {renderAnswerBlock(
                                "Your Answer",
                                question.answer,
                                isCorrect ? theme.palette.success.main : theme.palette.error.main,
                                isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />
                              )}
                              {!isCorrect &&
                                renderAnswerBlock(
                                  "Correct Answer",
                                  question.correctAnswer,
                                  theme.palette.secondary.main,
                                  <CheckCircle2 size={16} />
                                )}
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          bgcolor: "rgba(255,255,255,0.035)",
        }}
      >
        <Button onClick={onClose} variant="outlined" sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.14)" }}>
          Close
        </Button>
        <PremiumButton onClick={onClose} startIcon={<ClipboardCheck size={17} />}>
          Done
        </PremiumButton>
      </DialogActions>
    </Dialog>
  );
};

export default QuizResultsModal;
