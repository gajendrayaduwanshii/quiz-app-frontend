"use client";

import { useEffect, useState } from "react";
import { Grid, Typography, Box, Card, Button, Avatar } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import PsychologyIcon from "@mui/icons-material/Psychology";
import Head from "next/head";
import { useRouter } from "next/navigation";
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
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(null);
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

      <div className="dashboard-container ai-dashboard-container">
        <DashboardHeader
          user={dashboardData.user}
          onLearningQuiz={handleLearningQuiz}
        />

        <Grid item size={{ xs: 12 }}>
          <QuizResultsSummery
            quizResults={dashboardData.user.quizResult}
            skills={dashboardData.user.skills}
          />
        </Grid>
        <SummaryCards
          user={dashboardData.user}
          strongest={strongest}
          weakest={weakest}
          years={years}
        />

        <ChartsRow skills={dashboardData.user.skills} />

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
           <div>
           <h3 className="gradient-text" style={{fontSize:"1.45rem", marginBottom:16}}>Quiz Results Summary by Skill</h3>
           </div>
           
           <div style={{display:"flex", flexWrap:"wrap", gap:16}}>
           {dashboardData.user?.quizResult
             ?.sort((a, b) => {
               const aPercentage = a.quizQuestion?.length > 0 
                 ? Math.round((a.quizQuestion?.filter(q => q.answer?.trim() === q.correctAnswer?.trim()).length / a.quizQuestion?.length) * 100) 
                 : 0;
               const bPercentage = b.quizQuestion?.length > 0 
                 ? Math.round((b.quizQuestion?.filter(q => q.answer?.trim() === q.correctAnswer?.trim()).length / b.quizQuestion?.length) * 100) 
                 : 0;
               return aPercentage - bPercentage; // Ascending order
             })
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
              if (percentage >= 80) return "🏆";
              if (percentage >= 60) return "📈";
              return "📉";
            };

            return (
              <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={quizIndex}>
                <Card
                  sx={{
                    background: `linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.028)), linear-gradient(135deg, ${alpha(
                      getPerformanceColor(percentage),
                      0.13
                    )}, rgba(6,182,212,0.05))`,
                    border: `1px solid ${alpha(
                      getPerformanceColor(percentage),
                      0.28
                    )}`,
                    backdropFilter: "blur(22px)",
                    borderRadius: "24px",
                    p: 2,
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: `0 24px 70px rgba(0,0,0,0.32), 0 0 36px ${alpha(getPerformanceColor(percentage), 0.16)}`,
                    "&:hover": {
                      transform: "translateY(-4px) scale(1.02)",
                      boxShadow: `0 30px 90px rgba(0,0,0,0.38), 0 0 48px ${alpha(
                        getPerformanceColor(percentage),
                        0.24
                      )}`,
                      border: `1px solid ${alpha(
                        getPerformanceColor(percentage),
                        0.52
                      )}`,
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${getPerformanceColor(
                        percentage
                      )}, ${alpha(getPerformanceColor(percentage), 0.7)})`,
                      opacity: 0.8,
                    },
                  }}
                  onClick={() => {
                    setSelectedQuizIndex(quizIndex);
                    setQuizModalOpen(true);
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        background: `linear-gradient(135deg, ${getPerformanceColor(percentage)}, #06B6D4)`,
                        width: 48,
                        height: 48,
                        boxShadow: `0 4px 12px ${alpha(
                          getPerformanceColor(percentage),
                          0.3
                        )}`,
                        border: `2px solid rgba(255,255,255,0.18)`,
                      }}
                    >
                      <PsychologyIcon sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          background: `linear-gradient(45deg, #FFFFFF, #67E8F9, #A78BFA)`,
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontSize: "1.1rem",
                          lineHeight: 1.2,
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
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{
                          color: getPerformanceColor(percentage),
                          lineHeight: 1,
                        }}
                      >
                        {getPerformanceIcon(percentage)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="medium"
                      >
                        Performance
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: getPerformanceColor(percentage) }}
                      >
                        {percentage}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "rgba(255,255,255,0.08)",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: `${percentage}%`,
                          bgcolor: getPerformanceColor(percentage),
                          borderRadius: 3,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.8rem" }}
                      >
                        Questions
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {totalQuestions}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.8rem" }}
                      >
                        Correct
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: theme.palette.success.main }}
                      >
                        {correctAnswers}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.8rem" }}
                      >
                        Wrong
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: theme.palette.error.main }}
                      >
                        {totalQuestions - correctAnswers}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      py: 1,
                      px: 2,
                      borderRadius: 2,
                      bgcolor: alpha(getPerformanceColor(percentage), 0.12),
                      border: `1px solid ${alpha(
                        getPerformanceColor(percentage),
                        0.2
                      )}`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      sx={{ color: getPerformanceColor(percentage) }}
                    >
                      Click to view details
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: getPerformanceColor(percentage) }}
                    >
                      →
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            );
          })}
          </div>
          <div style={{textAlign:"center", marginTop:16}}>
          <Button variant="contained" color="primary" onClick={() => setShowAllResults(!showAllResults)}>
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
      </div>

      {/* Quiz Results Modal */}
      <QuizResultsModal
        open={quizModalOpen}
        onClose={() => {
          setQuizModalOpen(false);
          setSelectedQuizIndex(null);
        }}
        quizResults={
          selectedQuizIndex !== null
            ? [dashboardData.user?.quizResult?.[selectedQuizIndex]]
            : []
        }
      />
    </>
  );
};

export default Dashboard;
