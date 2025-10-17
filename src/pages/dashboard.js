"use client";

import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
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
import { useUserSummary } from "@/customHooks/useUserSummary";
import DashboardHeader from "@/components/dashboard/dashboardHeader";
import SummaryCards from "@/components/dashboard/summaryCards";
import ChartsRow from "@/components/dashboard/chartsRow";
import EducationSection from "@/components/dashboard/educationSection";
import WorkExperienceSection from "@/components/dashboard/workExperienceSection";
import CertificationsSection from "@/components/dashboard/certificationsSection";
import UpskillInsightSection from "@/components/dashboard/upskillInsightSection";
import DashboardInsightsSection from "@/components/dashboard/dashboardInsightsSection";
import QuizResultsSummery from "@/components/dashboard/quizResultsSummery";
import QuizResultsAccordion from "@/components/dashboard/quizResultsAccordion";
import AISkillAssessment from "@/components/dashboard/aiSkillAssessment";
import AIInterviewPrep from "@/components/dashboard/aiInterviewPrep";
import AILearningPath from "@/components/dashboard/aiLearningPath";
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
  const { user, loading, refetch: refetchUser } = useUser();
  const { dashboardInsights, loadingDashboard, refetch } = useUserSummary(user);

  const [dashboardData, setDashboardData] = useState({
    user: null,
    dashboardInsights: null,
    loading: true,
  });

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setDashboardData(prev => ({ ...prev, loading: false }));
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
    if (!loading && user) {
      setDashboardData({
        user,
        dashboardInsights: dashboardInsights,
        loading: false,
      });
    }
  }, [loading, user, dashboardInsights]);

  // Remove this useEffect to prevent infinite loops

  // Listen for quiz completion and refresh user data
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'quizCompleted') {
        refetchUser();
        localStorage.removeItem('quizCompleted');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events
    const handleQuizComplete = () => {
      refetchUser();
    };

    window.addEventListener('quizCompleted', handleQuizComplete);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('quizCompleted', handleQuizComplete);
    };
  }, []);

  // Show loading only when actually loading or no user data
  if (loading || !user || dashboardData.loading) {
    return <LoaderTwo text="AI Prepare Dashboard ..." />;
  }

  const { strongest, weakest } = skillSummary;

  return (
    <>
      <Head>
        <title>Developer Dashboard</title>
      </Head>

              <div className="dashboard-container">
                <DashboardHeader
                  user={dashboardData.user}
                  onLearningQuiz={handleLearningQuiz}
                />
                
        <Grid item size={{ xs: 12 }}>
          <QuizResultsSummery quizResults={dashboardData.user.quizResult}  skills={dashboardData.user.skills}/>
        </Grid>
        <SummaryCards
          user={dashboardData.user}
          strongest={strongest}
          weakest={weakest}
          years={years}
        />

        <ChartsRow skills={dashboardData.user.skills} />

        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, sm: 4 }}>
            <EducationSection educations={dashboardData.user.educations} />
          </Grid>
          <Grid item size={{ xs: 12, sm: 4 }}>
            <WorkExperienceSection
              workExperiences={dashboardData.user.workExperiences}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 4 }}>
            <CertificationsSection
              parseCertifications={parseCertifications}
              certifications={dashboardData.user.certifications}
            />
          </Grid>
          <Grid item size={{ xs: 12 }}>
            <UpskillInsightSection
              getUpskillSuggestion={getUpskillSuggestion}
              years={years}
            />
          </Grid>
          <Grid item size={{ xs: 12 }}>
            <QuizResultsAccordion quizResults={dashboardData.user.quizResult} />
          </Grid>
          <Grid
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
          </Grid>
          
          {/* New AI Features - Temporarily disabled for debugging */}
          <Grid
            item
            size={{ xs: 12 }}
            sx={{ gap: 2, display: "flex", flexDirection: "column" }}
          >
            <AISkillAssessment user={dashboardData.user} />
          </Grid>
          
          <Grid
            item
            size={{ xs: 12 }}
            sx={{ gap: 2, display: "flex", flexDirection: "column" }}
          >
            <AIInterviewPrep user={dashboardData.user} />
          </Grid>
          
          <Grid
            item
            size={{ xs: 12 }}
            sx={{ gap: 2, display: "flex", flexDirection: "column" }}
          >
            <AILearningPath user={dashboardData.user} />
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Dashboard;
