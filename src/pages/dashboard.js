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
import Loader from "@/components/loaderThree";
import {
  getSkillSummary,
  getUpskillSuggestion,
  parseCertifications,
} from "@/helper/dashboard";
import QuizResultsSummery from "@/components/dashboard/quizResultsSummery";
import QuizResultsAccordion from "./../components/dashboard/quizResultsAccordion";

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
  const { user, loading } = useUser();
  const { dashboardInsights, loadingDashboard } = useUserSummary(user);

  const [dashboardData, setDashboardData] = useState({
    user: null,
    dashboardInsights: null,
    loading: true,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      router.push("/login");
      return;
    }

    if (!loading && user && !loadingDashboard && dashboardInsights) {
      setDashboardData({
        user,
        dashboardInsights,
        loading: false,
      });
    }
  }, [loading, user, loadingDashboard, dashboardInsights, router]);

  if (dashboardData.loading || !dashboardData.user) {
    return <p>Loading...</p>;
  }

  const { strongest, weakest } = getSkillSummary(dashboardData.user.skills);
  const years = Number(dashboardData.user.yearsExperience) || 0;
  console.log("Dashboard Data:", user);
  return (
    <>
      <Head>
        <title>Developer Dashboard</title>
      </Head>

      <div className="dashboard-container">
        <DashboardHeader
          user={dashboardData.user}
          onStartQuiz={() => router.push("/quiz")}
        />
        <Grid item size={{ xs: 12 }}>
          <QuizResultsSummery quizResults={dashboardData.user.quizResult} />
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
          <Grid item  size={{ xs: 12 }}>
  <QuizResultsAccordion quizResults={dashboardData.user.quizResult} />
</Grid>
          {loadingDashboard ? (
            <Loader />
          ) : (
            <Grid
              item
              size={{ xs: 12 }}
              sx={{ gap: 2, display: "flex", flexDirection: "column" }}
            >
              <DashboardInsightsSection
                dashboardInsights={dashboardData.dashboardInsights}
              />
            </Grid>
          )}
        </Grid>
      </div>
    </>
  );
};

export default Dashboard;
