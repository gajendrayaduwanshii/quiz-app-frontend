"use client";

import { useEffect, useMemo, useState } from "react";
import { Grid, Typography, Box, Button, Chip, LinearProgress, Stack } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import Head from "next/head";
import { useRouter } from "next/navigation";
import {
  Award,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  Eye,
  Target,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@/customHooks/useUser";
import DashboardHeader from "@/components/dashboard/dashboardHeader";
import SummaryCards from "@/components/dashboard/summaryCards";
import QuizResultsModal from "@/components/dashboard/quizResultsModal";
import LoaderTwo from "@/components/LoaderTwo";
import SectionHeader from "@/components/premium/SectionHeader";
import PremiumCard from "@/components/premium/PremiumCard";
import PremiumPage from "@/components/premium/PremiumPage";
import AIActivityFeed from "@/components/premium/AIActivityFeed";
import ProgressRing from "@/components/premium/ProgressRing";
import { getSkillSummary } from "@/helper/dashboard";

const MotionBox = motion(Box);

const row = (i) => ({
  initial: { opacity: 0, y: 36 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.14, duration: 0.56, ease: [0.22, 1, 0.36, 1] },
});

const Dashboard = () => {
  const router = useRouter();
  const theme = useTheme();
  const { user, loading, refetch: refetchUser } = useUser();
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showAllResults, setShowAllResults] = useState(false);
  const [dashboardData, setDashboardData] = useState({ user: null, loading: true });

  // Guard against infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDashboardData((prev) => ({ ...prev, loading: false }));
    }, 10000);
    return () => clearTimeout(timeout);
  }, [loading]);

  const skillSummary = dashboardData.user?.skills
    ? getSkillSummary(dashboardData.user.skills)
    : { strongest: [], weakest: [] };

  const sortedQuizResults = useMemo(() => {
    const getPercentage = (quiz) => {
      const questions = quiz?.quizQuestion || [];
      if (!questions.length) return 0;
      const correct = questions.filter(
        (q) => q.answer?.trim() === q.correctAnswer?.trim()
      ).length;
      return Math.round((correct / questions.length) * 100);
    };
    return [...(dashboardData.user?.quizResult || [])].sort(
      (a, b) => getPercentage(a) - getPercentage(b)
    );
  }, [dashboardData.user?.quizResult]);

  // Auth + initial data load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      router.push("/login");
      return;
    }
    refetchUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync user data into local state
  useEffect(() => {
    if (!loading && user) {
      setDashboardData({ user, loading: false });
    }
  }, [loading, user]);

  // Refresh dashboard when a quiz completes
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "quizCompleted") {
        refetchUser();
        localStorage.removeItem("quizCompleted");
      }
    };
    const handleQuizComplete = () => refetchUser();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("quizCompleted", handleQuizComplete);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("quizCompleted", handleQuizComplete);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !user || dashboardData.loading) {
    return <LoaderTwo text="Preparing your dashboard..." />;
  }

  const { strongest, weakest } = skillSummary;
  const years = Number(dashboardData.user?.yearsExperience) || 0;

  return (
    <>
      <Head>
        <title>Dashboard — SkillSync AI</title>
      </Head>

      <PremiumPage
        className="dashboard-container ai-dashboard-container"
        sx={{ display: "flex", flexDirection: "column", gap: 1, position: "relative" }}
      >
        {/* ── Ambient floating orbs ── */}
        <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <Box sx={{
            position: "absolute", width: 520, height: 520, borderRadius: "50%",
            top: "5%", right: "-12%",
            background: "radial-gradient(circle, rgba(124,58,237,0.10), transparent 68%)",
            animation: "dashOrb1 9s ease-in-out infinite",
            "@keyframes dashOrb1": {
              "0%,100%": { transform: "translate(0,0) scale(1)" },
              "50%": { transform: "translate(-30px, 40px) scale(1.18)" },
            },
          }} />
          <Box sx={{
            position: "absolute", width: 380, height: 380, borderRadius: "50%",
            bottom: "10%", left: "-10%",
            background: "radial-gradient(circle, rgba(6,182,212,0.09), transparent 68%)",
            animation: "dashOrb2 12s ease-in-out infinite",
            "@keyframes dashOrb2": {
              "0%,100%": { transform: "translate(0,0) scale(1)" },
              "50%": { transform: "translate(36px, -28px) scale(1.22)" },
            },
          }} />
          <Box sx={{
            position: "absolute", width: 260, height: 260, borderRadius: "50%",
            top: "45%", left: "42%",
            background: "radial-gradient(circle, rgba(34,197,94,0.07), transparent 68%)",
            animation: "dashOrb3 15s ease-in-out infinite",
            "@keyframes dashOrb3": {
              "0%,100%": { transform: "translate(0,0) scale(1)" },
              "50%": { transform: "translate(-20px, 30px) scale(1.14)" },
            },
          }} />
        </Box>

        <DashboardHeader
          user={dashboardData.user}
          onLearningQuiz={() => router.push("/interactiveLearningHub")}
        />

        {/* ── Row 1: Career overview + Activity Feed ── */}
        <MotionBox {...row(0)}>
        <Grid container spacing={2.4}>
          <Grid item size={{ xs: 12, xl: 8.2 }}>
            <PremiumCard
              hover={false}
              glow="rgba(124,58,237,0.16)"
              sx={{
                p: { xs: 2.2, md: 2.8 },
                height: "100%",
                borderRadius: "24px",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.82), rgba(3,7,18,0.74)), radial-gradient(circle at 92% 0%, rgba(124,58,237,0.16), transparent 34%)",
              }}
            >
              <Grid container spacing={2.2} alignItems="center">
                <Grid item size={{ xs: 12, md: 4 }}>
                  <ProgressRing
                    value={Math.min(
                      100,
                      Math.round(
                        (dashboardData.user?.skills?.length || 0) * 12 +
                          (dashboardData.user?.quizResult?.length || 0) * 8 +
                          (dashboardData.user?.uploadResume ? 22 : 0)
                      )
                    )}
                    size={154}
                    thickness={15}
                    label="readiness"
                    accent="#7C3AED"
                    sx={{ mx: { xs: "auto", md: 0 } }}
                  />
                </Grid>
                <Grid item size={{ xs: 12, md: 8 }}>
                  <SectionHeader
                    eyebrow="Executive Overview"
                    title="AI Career Operating System"
                    description="A high-signal cockpit for resume strength, skill coverage, quiz momentum, and next-best learning actions."
                  />
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr 1fr",
                        md: "repeat(3, minmax(0, 1fr))",
                      },
                      gap: 1.2,
                    }}
                  >
                    {[
                      [
                        "Resume",
                        dashboardData.user?.uploadResume ? "Ready" : "Pending",
                        "#06B6D4",
                      ],
                      [
                        "Skills",
                        dashboardData.user?.skills?.length || 0,
                        "#22C55E",
                      ],
                      [
                        "Attempts",
                        dashboardData.user?.quizResult?.length || 0,
                        "#F59E0B",
                      ],
                    ].map(([label, value, color]) => (
                      <Box
                        key={label}
                        sx={{
                          p: 1.6,
                          borderRadius: "18px",
                          border: `1px solid ${color}33`,
                          bgcolor: `${color}12`,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.75rem",
                            fontWeight: 850,
                          }}
                        >
                          {label}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: "1.5rem",
                            fontWeight: 950,
                            lineHeight: 1.15,
                          }}
                        >
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </PremiumCard>
          </Grid>

          <Grid item size={{ xs: 12, xl: 3.8 }}>
            <AIActivityFeed
              items={[
                {
                  title: "Dashboard recalibrated",
                  detail: `${dashboardData.user?.skills?.length || 0} skill signals powering your overview.`,
                  tag: "Live",
                },
                {
                  title: "Quiz momentum tracked",
                  detail: `${dashboardData.user?.quizResult?.length || 0} attempts available for analytics.`,
                  tag: "Quiz",
                },
                {
                  title: "Resume signal",
                  detail: dashboardData.user?.uploadResume
                    ? "Resume attached and ready for AI analysis."
                    : "Upload a resume to activate ATS intelligence.",
                  tag: "ATS",
                },
              ]}
            />
          </Grid>
        </Grid>
        </MotionBox>

        {/* ── Row 2: Professional snapshot ── */}
        <MotionBox {...row(1)}>
        <SummaryCards
          user={dashboardData.user}
          strongest={strongest}
          weakest={weakest}
          years={years}
        />
        </MotionBox>

        {/* ── Row 3: Recent quiz attempts ── */}
        <MotionBox {...row(2)}>
        <Box sx={{ mt: 4, mb: 2, width: "100%" }}>
          <SectionHeader
            eyebrow="Assessment History"
            title="Recent Quiz Attempts"
            description="Open any attempt to review answers, score breakdown, and improvement areas."
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {sortedQuizResults
              ?.slice(0, showAllResults ? undefined : 3)
              ?.map((quiz, quizIndex) => {
                const totalQuestions = quiz.quizQuestion?.length || 0;
                const correctAnswers =
                  quiz.quizQuestion?.filter(
                    (q) => q.answer?.trim() === q.correctAnswer?.trim()
                  ).length || 0;
                const percentage =
                  totalQuestions > 0
                    ? Math.round((correctAnswers / totalQuestions) * 100)
                    : 0;

                const performanceColor =
                  percentage >= 80
                    ? theme.palette.success.main
                    : percentage >= 60
                    ? theme.palette.warning.main
                    : theme.palette.error.main;

                const performanceIcon =
                  percentage >= 80 ? (
                    <Award size={20} />
                  ) : percentage >= 60 ? (
                    <Target size={20} />
                  ) : (
                    <CircleAlert size={20} />
                  );

                const statusLabel =
                  percentage >= 80
                    ? "Excellent"
                    : percentage >= 60
                    ? "On Track"
                    : "Needs Focus";

                return (
                  <MotionBox
                    key={quiz.id || quiz.documentId || `${quiz.technology}-${quizIndex}`}
                    initial={{ opacity: 0, y: 28, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.18 + quizIndex * 0.1, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <PremiumCard
                      hover
                      sx={{
                        height: "100%",
                        minHeight: { xs: "auto", sm: 276 },
                        border: `1px solid ${alpha(performanceColor, 0.26)}`,
                        borderRadius: "18px",
                        p: { xs: 1.6, sm: 2.2 },
                        cursor: "pointer",
                        background: `linear-gradient(145deg, rgba(255,255,255,0.070), rgba(255,255,255,0.026)), radial-gradient(circle at 100% 0%, ${alpha(performanceColor, 0.16)}, transparent 35%)`,
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          background: `linear-gradient(90deg, ${performanceColor}, ${alpha(performanceColor, 0.7)})`,
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => {
                        setSelectedQuiz(quiz);
                        setQuizModalOpen(true);
                      }}
                    >
                      <Stack spacing={{ xs: 1.4, sm: 2 }} sx={{ height: "100%" }}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          alignItems={{ xs: "stretch", sm: "flex-start" }}
                          justifyContent="space-between"
                          spacing={{ xs: 1.2, sm: 1.5 }}
                        >
                          <Stack
                            direction="row"
                            spacing={{ xs: 1, sm: 1.4 }}
                            alignItems="center"
                            sx={{ minWidth: 0 }}
                          >
                            <Box
                              sx={{
                                width: { xs: 40, sm: 48 },
                                height: { xs: 40, sm: 48 },
                                flex: "0 0 auto",
                                borderRadius: { xs: "12px", sm: "14px" },
                                display: "grid",
                                placeItems: "center",
                                color: "#fff",
                                background: `linear-gradient(135deg, ${performanceColor}, #06B6D4)`,
                                boxShadow: `0 14px 30px ${alpha(performanceColor, 0.26)}`,
                                border: "1px solid rgba(255,255,255,0.16)",
                              }}
                            >
                              <BrainCircuit size={20} />
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: "#fff",
                                  fontWeight: 950,
                                  fontSize: { xs: "0.96rem", sm: "1.04rem" },
                                  lineHeight: 1.2,
                                  overflowWrap: "anywhere",
                                }}
                              >
                                {quiz.quizTitle || `${quiz.technology} Quiz`}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: { xs: "0.78rem", sm: "0.85rem" } }}
                              >
                                {quiz.technology || "General Quiz"}
                              </Typography>
                            </Box>
                          </Stack>
                          <Chip
                            size="small"
                            icon={performanceIcon}
                            label={statusLabel}
                            sx={{
                              color: performanceColor,
                              bgcolor: alpha(performanceColor, 0.12),
                              border: `1px solid ${alpha(performanceColor, 0.24)}`,
                              fontWeight: 900,
                              flex: "0 0 auto",
                              alignSelf: { xs: "flex-start", sm: "auto" },
                              "& .MuiChip-icon": { color: performanceColor },
                            }}
                          />
                        </Stack>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 1.3, sm: 2 },
                          }}
                        >
                          <Box
                            sx={{
                              width: { xs: 68, sm: 86 },
                              height: { xs: 68, sm: 86 },
                              flex: "0 0 auto",
                              borderRadius: "50%",
                              display: "grid",
                              placeItems: "center",
                              background: `conic-gradient(${performanceColor} 0deg, ${performanceColor} ${percentage * 3.6}deg, rgba(255,255,255,0.09) ${percentage * 3.6}deg, rgba(255,255,255,0.09) 360deg)`,
                            }}
                          >
                            <Box
                              sx={{
                                width: { xs: 50, sm: 64 },
                                height: { xs: 50, sm: 64 },
                                borderRadius: "50%",
                                display: "grid",
                                placeItems: "center",
                                bgcolor: "rgba(5,8,22,0.94)",
                                border: "1px solid rgba(255,255,255,0.08)",
                              }}
                            >
                              <Typography
                                sx={{
                                  color: performanceColor,
                                  fontWeight: 950,
                                  fontSize: { xs: "0.9375rem", sm: "1.125rem" },
                                }}
                              >
                                {percentage}%
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              sx={{ mb: 0.8 }}
                            >
                              <Typography
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.8125rem",
                                  fontWeight: 800,
                                }}
                              >
                                Accuracy
                              </Typography>
                              <Typography
                                sx={{
                                  color: performanceColor,
                                  fontSize: "0.8125rem",
                                  fontWeight: 950,
                                }}
                              >
                                {correctAnswers}/{totalQuestions}
                              </Typography>
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              sx={{
                                height: 8,
                                borderRadius: 999,
                                bgcolor: "rgba(255,255,255,0.08)",
                                "& .MuiLinearProgress-bar": {
                                  borderRadius: 999,
                                  background: `linear-gradient(90deg, ${performanceColor}, #06B6D4)`,
                                },
                              }}
                            />
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                            gap: { xs: 0.65, sm: 1 },
                          }}
                        >
                          {[
                            {
                              label: "Questions",
                              value: totalQuestions,
                              icon: <BarChart3 size={15} />,
                              color: theme.palette.secondary.main,
                            },
                            {
                              label: "Correct",
                              value: correctAnswers,
                              icon: <CheckCircle2 size={15} />,
                              color: theme.palette.success.main,
                            },
                            {
                              label: "Wrong",
                              value: totalQuestions - correctAnswers,
                              icon: <XCircle size={15} />,
                              color: theme.palette.error.main,
                            },
                          ].map((item) => (
                            <Box
                              key={item.label}
                              sx={{
                                p: { xs: 0.85, sm: 1.15 },
                                minHeight: { xs: 58, sm: 70 },
                                borderRadius: { xs: "12px", sm: "14px" },
                                border: `1px solid ${alpha(item.color, 0.20)}`,
                                bgcolor: alpha(item.color, 0.08),
                              }}
                            >
                              <Box
                                sx={{ color: item.color, lineHeight: 0, mb: 0.7 }}
                              >
                                {item.icon}
                              </Box>
                              <Typography
                                sx={{
                                  fontWeight: 950,
                                  lineHeight: 1,
                                  fontSize: { xs: "0.875rem", sm: "1rem" },
                                }}
                              >
                                {item.value}
                              </Typography>
                              <Typography
                                sx={{
                                  color: "text.secondary",
                                  fontSize: { xs: "0.65625rem", sm: "0.75rem" },
                                  mt: 0.35,
                                }}
                              >
                                {item.label}
                              </Typography>
                            </Box>
                          ))}
                        </Box>

                        <Box
                          sx={{
                            mt: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            py: 1,
                            px: { xs: 1.4, sm: 2 },
                            borderRadius: { xs: "12px", sm: "14px" },
                            bgcolor: alpha(performanceColor, 0.11),
                            border: `1px solid ${alpha(performanceColor, 0.22)}`,
                            color: performanceColor,
                          }}
                        >
                          <Eye size={16} />
                          <Typography
                            variant="body2"
                            fontWeight={900}
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                          >
                            Open review
                          </Typography>
                        </Box>
                      </Stack>
                    </PremiumCard>
                  </MotionBox>
                );
              })}
          </Box>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowAllResults(!showAllResults)}
              sx={{
                px: 3,
                width: { xs: "100%", sm: "auto" },
                borderRadius: "14px",
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                boxShadow: "0 16px 34px rgba(124,58,237,0.28)",
              }}
            >
              {showAllResults ? "Hide All Results" : "Show All Results"}
            </Button>
          </Box>
        </Box>
        </MotionBox>
      </PremiumPage>

      <QuizResultsModal
        open={quizModalOpen}
        onClose={() => {
          setQuizModalOpen(false);
          setSelectedQuiz(null);
        }}
        quizResults={selectedQuiz ? [selectedQuiz] : []}
      />
    </>
  );
};

export default Dashboard;
