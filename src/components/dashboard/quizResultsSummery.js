"use client";

import React, { useMemo } from "react";
import { Box, Chip, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { BrainCircuit, CheckCircle2, Code2, Target, TrendingDown, TrendingUp, Trophy, XCircle } from "lucide-react";
import PremiumCard from "@/components/premium/PremiumCard";
import SectionHeader from "@/components/premium/SectionHeader";

const normalize = (value) => String(value || "").trim().toLowerCase();

const QuizResultsSummaryBySkill = ({ quizResults = [], skills = [] }) => {
  const theme = useTheme();

  const summaryBySkill = useMemo(() => {
    return (skills || []).map((skill) => {
      const skillName = skill.skillName || skill.skill || "Skill";
      const attempts = (quizResults || []).filter(
        (quiz) => normalize(quiz?.technology) === normalize(skillName)
      );

      const totals = attempts.reduce(
        (acc, quiz) => {
          (quiz.quizQuestion || []).forEach((question) => {
            const userAnswer = normalize(question.answer);
            const correctAnswer = normalize(question.correctAnswer);
            acc.totalQuestions += 1;
            if (userAnswer && correctAnswer && userAnswer === correctAnswer) {
              acc.totalCorrect += 1;
            }
          });
          return acc;
        },
        { totalQuestions: 0, totalCorrect: 0 }
      );

      const totalWrong = totals.totalQuestions - totals.totalCorrect;
      const percentage = totals.totalQuestions
        ? Math.round((totals.totalCorrect / totals.totalQuestions) * 100)
        : 0;

      return {
        ...skill,
        skillName,
        attempts: attempts.length,
        totalQuestions: totals.totalQuestions,
        totalCorrect: totals.totalCorrect,
        totalWrong,
        percentage,
      };
    });
  }, [quizResults, skills]);

  const getPerformance = (percentage, totalQuestions) => {
    if (!totalQuestions) {
      return {
        label: "Not Started",
        color: theme.palette.secondary.main,
        icon: <BrainCircuit size={16} />,
      };
    }
    if (percentage >= 80) {
      return {
        label: "Excellent",
        color: theme.palette.success.main,
        icon: <Trophy size={16} />,
      };
    }
    if (percentage >= 60) {
      return {
        label: "On Track",
        color: theme.palette.warning.main,
        icon: <TrendingUp size={16} />,
      };
    }
    return {
      label: "Needs Focus",
      color: theme.palette.error.main,
      icon: <TrendingDown size={16} />,
    };
  };

  return (
    <Box sx={{ mt: 3 }}>
      <SectionHeader
        eyebrow="Quiz Analytics"
        title="Quiz Results Summary by Skill"
        description="Skill-wise performance snapshot from your latest quiz attempts."
      />

      <Grid container spacing={2.3}>
        {summaryBySkill.map((skill, index) => {
          const performance = getPerformance(skill.percentage, skill.totalQuestions);
          const ringColor = performance.color;

          return (
            <Grid item size={{ xs: 12, sm: 6, lg: 4 }} key={skill.id || skill.skillName || index}>
              <PremiumCard
                hover
                glow={alpha(ringColor, 0.28)}
                sx={{
                  height: "100%",
                  minHeight: 292,
                  p: 2.4,
                  borderRadius: "18px",
                  border: `1px solid ${alpha(ringColor, 0.26)}`,
                  background:
                    `linear-gradient(145deg, rgba(255,255,255,0.078), rgba(255,255,255,0.028)), radial-gradient(circle at 100% 0%, ${alpha(ringColor, 0.18)}, transparent 34%)`,
                }}
              >
                <Stack spacing={2.1} sx={{ height: "100%" }}>
                  <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.5}>
                    <Stack direction="row" spacing={1.4} alignItems="center" sx={{ minWidth: 0 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          flex: "0 0 auto",
                          borderRadius: "16px",
                          display: "grid",
                          placeItems: "center",
                          background: `linear-gradient(135deg, ${alpha(ringColor, 0.95)}, ${alpha(theme.palette.secondary.main, 0.84)})`,
                          boxShadow: `0 16px 36px ${alpha(ringColor, 0.28)}`,
                          border: "1px solid rgba(255,255,255,0.18)",
                        }}
                      >
                        <Code2 size={22} color="#fff" />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 950,
                            lineHeight: 1.15,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {skill.skillName}
                        </Typography>
                        <Stack direction="row" spacing={0.8} sx={{ mt: 0.8, flexWrap: "wrap", rowGap: 0.8 }}>
                          <Chip
                            size="small"
                            label={skill.level || "Level pending"}
                            sx={{
                              color: "#fff",
                              bgcolor: "rgba(255,255,255,0.07)",
                              border: "1px solid rgba(255,255,255,0.10)",
                              fontWeight: 800,
                            }}
                          />
                          <Chip
                            size="small"
                            icon={performance.icon}
                            label={performance.label}
                            sx={{
                              color: ringColor,
                              bgcolor: alpha(ringColor, 0.13),
                              border: `1px solid ${alpha(ringColor, 0.26)}`,
                              fontWeight: 900,
                            }}
                          />
                        </Stack>
                      </Box>
                    </Stack>

                    <Box
                      sx={{
                        width: 76,
                        height: 76,
                        flex: "0 0 auto",
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        background: `conic-gradient(${ringColor} 0deg, ${ringColor} ${skill.percentage * 3.6}deg, rgba(255,255,255,0.09) ${skill.percentage * 3.6}deg, rgba(255,255,255,0.09) 360deg)`,
                        boxShadow: `0 18px 42px ${alpha(ringColor, 0.18)}`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: "rgba(5,8,22,0.94)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <Typography sx={{ color: ringColor, fontWeight: 950, fontSize: 18 }}>
                          {skill.percentage}%
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>

                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                      <Typography sx={{ color: "text.secondary", fontSize: 13, fontWeight: 800 }}>
                        Accuracy
                      </Typography>
                      <Typography sx={{ color: ringColor, fontSize: 13, fontWeight: 950 }}>
                        {skill.totalCorrect}/{skill.totalQuestions || 0}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={skill.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 999,
                        bgcolor: "rgba(255,255,255,0.08)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 999,
                          background: `linear-gradient(90deg, ${ringColor}, ${theme.palette.secondary.main})`,
                        },
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gap: 1,
                    }}
                  >
                    {[
                      { label: "Attempts", value: skill.attempts, icon: <Target size={15} />, color: theme.palette.secondary.main },
                      { label: "Correct", value: skill.totalCorrect, icon: <CheckCircle2 size={15} />, color: theme.palette.success.main },
                      { label: "Wrong", value: skill.totalWrong, icon: <XCircle size={15} />, color: theme.palette.error.main },
                    ].map((item) => (
                      <Box
                        key={item.label}
                        sx={{
                          p: 1.25,
                          minHeight: 76,
                          borderRadius: "16px",
                          border: `1px solid ${alpha(item.color, 0.22)}`,
                          bgcolor: alpha(item.color, 0.09),
                        }}
                      >
                        <Box sx={{ color: item.color, lineHeight: 0, mb: 0.7 }}>{item.icon}</Box>
                        <Typography sx={{ fontWeight: 950, lineHeight: 1 }}>{item.value}</Typography>
                        <Typography sx={{ color: "text.secondary", fontSize: 12, mt: 0.35 }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {!skill.totalQuestions && (
                    <Box
                      sx={{
                        mt: "auto",
                        p: 1.35,
                        borderRadius: "16px",
                        border: "1px dashed rgba(103,232,249,0.24)",
                        bgcolor: "rgba(6,182,212,0.08)",
                      }}
                    >
                      <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                        Start one quiz for this skill to unlock performance signals.
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </PremiumCard>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default QuizResultsSummaryBySkill;
