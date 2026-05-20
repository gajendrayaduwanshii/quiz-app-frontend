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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useUser } from "@/customHooks/useUser";
// COMMENTED OUT: Disabled to reduce AI API rate limiting
// import { useUserSummary } from "@/customHooks/useUserSummary";
// import { useResumeAnalysis } from "@/customHooks/useResumeAnalysis";
import DashboardHeader from "@/components/dashboard/dashboardHeader";
import SummaryCards from "@/components/dashboard/summaryCards";
import ChartsRow from "@/components/dashboard/chartsRow";
import EducationSection from "@/components/dashboard/educationSection";
import WorkExperienceSection from "@/components/dashboard/workExperienceSectionPremium";
import CertificationsSection from "@/components/dashboard/certificationsSectionPremium";
// import UpskillInsightSection from "@/components/dashboard/upskillInsightSection";
// import DashboardInsightsSection from "@/components/dashboard/dashboardInsightsSection";
import QuizResultsSummery from "@/components/dashboard/quizResultsSummery";
import QuizResultsAccordion from "@/components/dashboard/quizResultsAccordion";
import QuizResultsModal from "@/components/dashboard/quizResultsModal";
// import AISkillAssessment from "@/components/dashboard/aiSkillAssessment";
// import AIInterviewPrep from "@/components/dashboard/aiInterviewPrep";
// import AILearningPath from "@/components/dashboard/aiLearningPath";
// COMMENTED OUT: AI components disabled to reduce AI API rate limiting
// import AISkillAnalytics from "@/components/dashboard/aiSkillAnalytics";
// import AISkillAnalyticsSimple from "@/components/dashboard/aiSkillAnalyticsSimple";
// import AICareerInsights from "@/components/dashboard/aiCareerInsights";
// import AILearningRecommendations from "@/components/dashboard/aiLearningRecommendations";
// import AIMarketInsights from "@/components/dashboard/aiMarketInsights";
// import AIPerformanceMetrics from "@/components/dashboard/aiPerformanceMetrics";
// import AITestComponent from "@/components/dashboard/aiTestComponent";
// import AISimpleTest from "@/components/dashboard/aiSimpleTest";
// import AIResumeInsights from "@/components/dashboard/aiResumeInsights";
// import AIComprehensiveInsights from "@/components/dashboard/aiComprehensiveInsights";
import Loader from "@/components/Loader";
import {
  getSkillSummary,
  getUpskillSuggestion,
  parseCertifications,
} from "@/helper/dashboard";
import LoaderTwo from "@/components/LoaderTwo";
import SectionHeader from "@/components/premium/SectionHeader";
import PremiumCard from "@/components/premium/PremiumCard";
import PremiumPage from "@/components/premium/PremiumPage";
import AIActivityFeed from "@/components/premium/AIActivityFeed";
import ProgressRing from "@/components/premium/ProgressRing";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const router = useRouter();
  const theme = useTheme();
  const { user, loading, refetch: refetchUser } = useUser();
  // COMMENTED OUT: Disabled to reduce AI API rate limiting
  // const { dashboardInsights, loadingDashboard, refetch } = useUserSummary(user);
  // const dashboardInsights = null;
  // const loadingDashboard = false;
  // const refetch = () => {};
  // const {
  //   profileSummary,
  //   learningSuggestions,
  //   loadingResume,
  //   error: resumeError,
  // } = useResumeAnalysis(user);
  const profileSummary = null;
  const learningSuggestions = [];
  const loadingResume = false;
  const resumeError = null;
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showAllResults, setShowAllResults] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    user: null,
    dashboardInsights: null,
    loading: true,
  });

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setDashboardData((prev) => ({ ...prev, loading: false }));
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  // Simple calculations without heavy memoization
  const skillSummary = dashboardData.user?.skills
    ? getSkillSummary(dashboardData.user.skills)
    : { strongest: [], weakest: [] };

  const years = Number(dashboardData.user?.yearsExperience) || 0;
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

  // Simple callback functions
  const handleLearningQuiz = () => {
    router.push("/interactiveLearningHub");
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      router.push("/login");
      return;
    }

    // Always refresh user data on dashboard mount
    refetchUser();
  }, []); // Empty dependency array to run only once

  // Separate useEffect for updating dashboard data
  useEffect(() => {
    console.log(
      "Dashboard: useEffect triggered with loading:",
      loading,
      "user:",
      user
    );
    if (!loading && user) {
      console.log(
        "Dashboard: Setting dashboard data with user:",
        user.documentId
      );
      setDashboardData({
        user,
        dashboardInsights: null,
        loading: false,
      });
    }
  }, [loading, user]);

  // Remove this useEffect to prevent infinite loops

  // Listen for quiz completion and refresh user data
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "quizCompleted") {
        refetchUser();
        localStorage.removeItem("quizCompleted");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events
    const handleQuizComplete = () => {
      refetchUser();
    };

    window.addEventListener("quizCompleted", handleQuizComplete);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("quizCompleted", handleQuizComplete);
    };
  }, []);

  // Show loading only when actually loading or no user data
  if (loading || !user || dashboardData.loading) {
    return <LoaderTwo text="AI Prepare Dashboard ..." />;
  }

  const { strongest, weakest } = skillSummary;

  console.log("Dashboard: Rendering with dashboardData:", dashboardData);

  return (
    <>
      <Head>
        <title>Developer Dashboard</title>
      </Head>

      <PremiumPage
        className="dashboard-container ai-dashboard-container"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <DashboardHeader
          user={dashboardData.user}
          onLearningQuiz={handleLearningQuiz}
        />

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
                        ((dashboardData.user?.skills?.length || 0) * 12) +
                          ((dashboardData.user?.quizResult?.length || 0) * 8) +
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
                      gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
                      gap: 1.2,
                    }}
                  >
                    {[
                      ["Resume", dashboardData.user?.uploadResume ? "Ready" : "Pending", "#06B6D4"],
                      ["Skills", dashboardData.user?.skills?.length || 0, "#22C55E"],
                      ["Attempts", dashboardData.user?.quizResult?.length || 0, "#F59E0B"],
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
                        <Typography sx={{ color: "text.secondary", fontSize: 12, fontWeight: 850 }}>
                          {label}
                        </Typography>
                        <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 950, lineHeight: 1.15 }}>
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
                  detail: `${dashboardData.user?.skills?.length || 0} skill signals are powering your overview.`,
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
                    ? "Resume is attached and ready for AI analysis."
                    : "Upload a resume to activate ATS intelligence.",
                  tag: "ATS",
                },
              ]}
            />
          </Grid>
        </Grid>

        <SummaryCards
          user={dashboardData.user}
          strongest={strongest}
          weakest={weakest}
          years={years}
        />

        <ChartsRow skills={dashboardData.user.skills} />

        <QuizResultsSummery
          quizResults={dashboardData.user.quizResult}
          skills={dashboardData.user.skills}
        />

        <Grid container spacing={2}>
          <Grid item size={{ xs: 12}}>
            <EducationSection educations={dashboardData.user.educations} />
          </Grid>
          <Grid item size={{ xs: 12}}>
            <WorkExperienceSection
              workExperiences={dashboardData.user.workExperiences}
            />
          </Grid>
          <Grid item size={{ xs: 12}}>
            <CertificationsSection
              parseCertifications={parseCertifications}
              certifications={dashboardData.user.certifications}
            />
          </Grid>
          {/* Upskill Insight Section - REMOVED */}
          {/* <Grid item size={{ xs: 12 }}>
            <UpskillInsightSection
              getUpskillSuggestion={getUpskillSuggestion}
              years={years}
            />
          </Grid> */}
          {/* Individual Quiz Results Cards */}
           <Box size={{ xs: 12 }} sx={{ mt: 4, mb: 2, width:"100%" }} >
           <SectionHeader
             eyebrow="Assessment History"
             title="Recent Quiz Attempts"
             description="Open any attempt to review answers, score, and improvement areas."
           />

           <Box
             sx={{
               display: "grid",
               gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
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

            const getPerformanceColor = (percentage) => {
              if (percentage >= 80) return theme.palette.success.main;
              if (percentage >= 60) return theme.palette.warning.main;
              return theme.palette.error.main;
            };

            const getPerformanceIcon = (percentage) => {
              if (percentage >= 80) return <Award size={20} />;
              if (percentage >= 60) return <Target size={20} />;
              return <CircleAlert size={20} />;
            };
            const performanceColor = getPerformanceColor(percentage);
            const statusLabel =
              percentage >= 80 ? "Excellent" : percentage >= 60 ? "On Track" : "Needs Focus";

            return (
              <Box key={quiz.id || quiz.documentId || `${quiz.technology}-${quizIndex}`}>
                <PremiumCard
                  hover
                  sx={{
                    height: "100%",
                    minHeight: 276,
                    border: `1px solid ${alpha(performanceColor, 0.26)}`,
                    borderRadius: "18px",
                    p: 2.2,
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
                  <Stack spacing={2} sx={{ height: "100%" }}>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.5}>
                      <Stack direction="row" spacing={1.4} alignItems="center" sx={{ minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            flex: "0 0 auto",
                            borderRadius: "14px",
                            display: "grid",
                            placeItems: "center",
                            color: "#fff",
                            background: `linear-gradient(135deg, ${performanceColor}, #06B6D4)`,
                            boxShadow: `0 14px 30px ${alpha(performanceColor, 0.26)}`,
                            border: "1px solid rgba(255,255,255,0.16)",
                          }}
                        >
                          <BrainCircuit size={22} />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#fff",
                          fontWeight: 950,
                          fontSize: "1.04rem",
                          lineHeight: 1.2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {quiz.quizTitle || `${quiz.technology} Quiz`}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.85rem" }}
                      >
                        {quiz.technology || "General Quiz"}
                      </Typography>
                        </Box>
                      </Stack>
                      <Chip
                        size="small"
                        icon={getPerformanceIcon(percentage)}
                        label={statusLabel}
                        sx={{
                          color: performanceColor,
                          bgcolor: alpha(performanceColor, 0.12),
                          border: `1px solid ${alpha(performanceColor, 0.24)}`,
                          fontWeight: 900,
                          flex: "0 0 auto",
                          "& .MuiChip-icon": { color: performanceColor },
                        }}
                      />
                    </Stack>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 86,
                          height: 86,
                          flex: "0 0 auto",
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          background: `conic-gradient(${performanceColor} 0deg, ${performanceColor} ${percentage * 3.6}deg, rgba(255,255,255,0.09) ${percentage * 3.6}deg, rgba(255,255,255,0.09) 360deg)`,
                        }}
                      >
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "rgba(5,8,22,0.94)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <Typography sx={{ color: performanceColor, fontWeight: 950, fontSize: 18 }}>
                            {percentage}%
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                          <Typography sx={{ color: "text.secondary", fontSize: 13, fontWeight: 800 }}>
                            Accuracy
                          </Typography>
                          <Typography sx={{ color: performanceColor, fontSize: 13, fontWeight: 950 }}>
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
                      gap: 1,
                    }}
                  >
                    {[
                      { label: "Questions", value: totalQuestions, icon: <BarChart3 size={15} />, color: theme.palette.secondary.main },
                      { label: "Correct", value: correctAnswers, icon: <CheckCircle2 size={15} />, color: theme.palette.success.main },
                      { label: "Wrong", value: totalQuestions - correctAnswers, icon: <XCircle size={15} />, color: theme.palette.error.main },
                    ].map((item) => (
                      <Box
                        key={item.label}
                        sx={{
                          p: 1.15,
                          minHeight: 70,
                          borderRadius: "14px",
                          border: `1px solid ${alpha(item.color, 0.20)}`,
                          bgcolor: alpha(item.color, 0.08),
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

                  <Box
                    sx={{
                      mt: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      py: 1,
                      px: 2,
                      borderRadius: "14px",
                      bgcolor: alpha(performanceColor, 0.11),
                      border: `1px solid ${alpha(performanceColor, 0.22)}`,
                      color: performanceColor,
                    }}
                  >
                    <Eye size={16} />
                    <Typography variant="body2" fontWeight={900}>
                      Open review
                    </Typography>
                  </Box>
                  </Stack>
                </PremiumCard>
              </Box>
            );
          })}
          </Box>
          <div style={{textAlign:"center", marginTop:18}}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowAllResults(!showAllResults)}
            sx={{
              px: 2.6,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              boxShadow: "0 16px 34px rgba(124,58,237,0.28)",
            }}
          >
            {showAllResults ? 'Hide All Results' : 'Show All Results'}
          </Button>
          </div>
          </Box>
          {/* AI Insights Section - COMMENTED OUT to avoid API usage/rate limit pressure */}
          {/* <Grid
            item
            size={{ xs: 12 }}
            sx={{ gap: 2, display: "flex", flexDirection: "column" }}
          >
            {loadingDashboard ? (
              <LoaderTwo text="AI Prepare Dashboard ..." />
            ) : (
              <>
                <DashboardInsightsSection
                  dashboardInsights={dashboardInsights}
                />
              </>
            )}
          </Grid> */}

          {/* AI Simple Test Component - COMMENTED OUT */}
          {/* <Grid
            item
            size={{ xs: 12 }}
            sx={{ gap: 2, display: "flex", flexDirection: "column" }}
          >
            <AISimpleTest user={dashboardData.user} />
          </Grid> */}

          {/* AI Test Component - COMMENTED OUT */}
          {/* <Grid
            item
            size={{ xs: 12 }}
            sx={{ gap: 2, display: "flex", flexDirection: "column" }}
          >
            <AITestComponent user={dashboardData.user} />
          </Grid> */}

          {/* User Data Analysis Section */}
          <Grid
            item
            size={{ xs: 12 }}
            sx={{ gap: 2, display: "flex", flexDirection: "column" }}
          >
            {/* <h3>User Data Analysis</h3> */}

            {/* AI Comprehensive Insights */}
            {/* COMMENTED OUT: AI components disabled to reduce AI API rate limiting */}
            {/* <AIComprehensiveInsights
              user={dashboardData.user}
              resumeData={{
                profileSummary,
                learningSuggestions,
                loadingResume,
                error: resumeError,
              }}
            />

            {/* AI Performance Metrics */}
            {/* <AIPerformanceMetrics
              user={dashboardData.user}
              resumeData={{
                profileSummary,
                learningSuggestions,
                loadingResume,
                error: resumeError,
              }}
            /> */}

            {/* AI Market Insights */}
            {/* <AIMarketInsights
              user={dashboardData.user}
              resumeData={{
                profileSummary,
                learningSuggestions,
                loadingResume,
                error: resumeError,
              }}
            /> */}

            {/* AI Skill Analytics Simple */}
            {/* <AISkillAnalyticsSimple
              user={dashboardData.user}
              resumeData={{
                profileSummary,
                learningSuggestions,
                loadingResume,
                error: resumeError,
              }}
            /> */}

            {/* AI Career Insights */}
            {/* <AICareerInsights
              user={dashboardData.user}
              resumeData={{
                profileSummary,
                learningSuggestions,
                loadingResume,
                error: resumeError,
              }}
            /> */}
          </Grid>
        </Grid>
      </PremiumPage>

      {/* Quiz Results Modal */}
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
