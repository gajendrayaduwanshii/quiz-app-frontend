"use client";

import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { PieChart } from "lucide-react";
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
import LoaderTwo from "@/components/LoaderTwo";
import PremiumPage from "@/components/premium/PremiumPage";
import CareerGrowthPanel from "@/components/dashboard/CareerGrowthPanel";
import ChartsRow from "@/components/dashboard/chartsRow";
import QuizResultsSummery from "@/components/dashboard/quizResultsSummery";
import { authService } from "@/services/authService";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const SkillsAnalytics = () => {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!authService.getStoredUser()) router.push("/login");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !user) return <LoaderTwo text="Loading analytics..." />;

  return (
    <>
      <Head>
        <title>Skills Analytics — SkillSync AI</title>
      </Head>

      <PremiumPage sx={{ display: "flex", flexDirection: "column", gap: 2.4 }}>
        {/* ── Header ── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.4 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "16px",
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, #06B6D4, #7C3AED)",
              boxShadow: "0 0 28px rgba(6,182,212,0.36)",
              flexShrink: 0,
            }}
          >
            <PieChart size={24} color="#fff" />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 950, lineHeight: 1.1, fontSize: { xs: "1.45rem", md: "1.75rem" } }}
            >
              Skills Analytics
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.87rem", mt: 0.3 }}>
              Skill charts, quiz performance by technology, and daily career growth plan
            </Typography>
          </Box>
        </Box>

        {/* ── Career growth plan ── */}
        <CareerGrowthPanel user={user} />

        {/* ── Skill charts ── */}
        <ChartsRow skills={user.skills} />

        {/* ── Quiz performance by skill ── */}
        <QuizResultsSummery quizResults={user.quizResult} skills={user.skills} />
      </PremiumPage>
    </>
  );
};

export default SkillsAnalytics;
