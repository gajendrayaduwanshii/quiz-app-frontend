import React from "react";
import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import {
  BriefcaseBusiness,
  Gauge,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Trophy,
} from "lucide-react";
import MetricCard from "@/components/premium/MetricCard";
import PremiumCard from "@/components/premium/PremiumCard";
import SectionHeader from "@/components/premium/SectionHeader";

const SummaryCards = ({ user, strongest, weakest, years }) => {
  const quizResults = user?.quizResult || [];
  const skills = user?.skills || [];
  const latestQuiz = quizResults[quizResults.length - 1];
  const latestQuestions = latestQuiz?.quizQuestion || [];
  const latestScore = latestQuestions.length
    ? Math.round(
        (latestQuestions.filter((q) => q.answer?.trim() === q.correctAnswer?.trim()).length /
          latestQuestions.length) *
          100
      )
    : 0;

  const atsScore = Math.min(96, 52 + skills.length * 6 + (user?.uploadResume ? 12 : 0));
  const interviewReadiness = Math.min(98, latestScore ? Math.round((latestScore + skills.length * 7) / 1.5) : 58);
  const careerReadiness = Math.min(99, Math.round((atsScore + interviewReadiness + Math.min(years * 8, 32)) / 2.4));
  const completedQuestions = quizResults.reduce((total, quiz) => total + (quiz?.quizQuestion?.length || 0), 0);
  const profileSignal = Math.min(100, Math.round((skills.length * 12 + quizResults.length * 10 + (user?.uploadResume ? 24 : 0) + Math.min(years * 8, 24))));

  return (
    <div style={{marginTop: "32px"}}>
      <SectionHeader
        eyebrow="Career Intelligence"
        title="Professional Snapshot"
        description="A modern view of profile strength, assessment momentum, and growth readiness."
      />
      <Grid container spacing={2.2} sx={{ mb: 2.2 }}>
        <Grid item size={{ xs: 12, lg: 7 }}>
          <PremiumCard
            hover={false}
            glow="rgba(6,182,212,0.18)"
            sx={{
              height: "100%",
              minHeight: 238,
              p: { xs: 2.2, md: 2.8 },
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.80), rgba(5,8,22,0.74)), radial-gradient(circle at 92% 8%, rgba(6,182,212,0.17), transparent 35%)",
            }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2.4} alignItems={{ xs: "flex-start", sm: "center" }}>
              <Box
                sx={{
                  width: 124,
                  height: 124,
                  flex: "0 0 auto",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: `conic-gradient(#22C55E 0deg, #22C55E ${profileSignal * 3.6}deg, rgba(255,255,255,0.08) ${profileSignal * 3.6}deg, rgba(255,255,255,0.08) 360deg)`,
                  boxShadow: "0 22px 48px rgba(34,197,94,0.16)",
                }}
              >
                <Box
                  sx={{
                    width: 92,
                    height: 92,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "rgba(5,8,22,0.94)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontSize: 28, fontWeight: 950, lineHeight: 1 }}>
                      {profileSignal}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: 12, fontWeight: 800 }}>
                      signal
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Chip
                  size="small"
                  icon={<Sparkles size={14} />}
                  label="Demo-ready insight"
                  sx={{
                    mb: 1.4,
                    color: "#CFFAFE",
                    bgcolor: "rgba(6,182,212,0.11)",
                    border: "1px solid rgba(103,232,249,0.22)",
                    fontWeight: 900,
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: 950, lineHeight: 1.15, mb: 1 }}>
                  {user?.currentJobTitle || "Developer"} profile is {profileSignal >= 75 ? "strong" : "building momentum"}
                </Typography>
                <Typography sx={{ color: "text.secondary", maxWidth: 620 }}>
                  {skills.length} skills, {quizResults.length} quiz attempts, and {completedQuestions} answered questions are combined into a quick readiness signal for your next review.
                </Typography>
              </Box>
            </Stack>
          </PremiumCard>
        </Grid>

        <Grid item size={{ xs: 12, lg: 5 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
              gap: 2.2,
              height: "100%",
            }}
          >
            <MetricCard
              icon={GraduationCap}
              label="Quiz Attempts"
              value={quizResults.length}
              helper={`${completedQuestions} total questions answered`}
              progress={Math.min(100, quizResults.length * 18)}
              accent="#22C55E"
            />
            <MetricCard
              icon={Sparkles}
              label="Skills Added"
              value={skills.length}
              helper={skills.length ? "Profile map is active" : "Add skills to unlock signals"}
              progress={Math.min(100, skills.length * 14)}
              accent="#06B6D4"
            />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2.2} sx={{ mb: 3 }}>
        <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={BriefcaseBusiness}
            label="Current Role"
            value={user.currentJobTitle || "Software Developer"}
            helper={user.currentCompany ? `at ${user.currentCompany}` : "Role profile pending"}
            progress={Math.min(100, years * 10)}
            accent="#7C3AED"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={Trophy}
            label="Strongest Skill"
            value={strongest?.[0] || skills?.[0]?.skillName || "Add skills"}
            helper={`${strongest?.[1] || skills?.[0]?.yearsExperience || 0} years experience`}
            progress={Math.min(100, Number(strongest?.[1] || 0) * 14)}
            accent="#22C55E"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={TrendingDown}
            label="Focus Skill"
            value={weakest?.[0] || skills?.[skills.length - 1]?.skillName || "No weak signal"}
            helper="AI learning priority"
            progress={Math.min(100, Number(weakest?.[1] || 2) * 12)}
            accent="#F59E0B"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={Gauge}
            label="Latest Quiz Score"
            value={`${latestScore}%`}
            helper={latestQuiz?.technology ? `${latestQuiz.technology} assessment` : "Take a quiz to calibrate"}
            progress={latestScore}
            accent="#06B6D4"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, lg: 4 }}>
          <MetricCard
            icon={ShieldCheck}
            label="ATS Strength"
            value={`${atsScore}%`}
            helper="Estimated from resume and profile completeness"
            progress={atsScore}
            accent="#7C3AED"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, lg: 4 }}>
          <MetricCard
            icon={Sparkles}
            label="Interview Readiness"
            value={`${interviewReadiness}%`}
            helper="Based on quiz history and skill depth"
            progress={interviewReadiness}
            accent="#06B6D4"
          />
        </Grid>
        <Grid item size={{ xs: 12, lg: 4 }}>
          <MetricCard
            icon={ShieldCheck}
            label="Career Readiness"
            value={`${careerReadiness}%`}
            helper="Combined learning and profile intelligence"
            progress={careerReadiness}
            accent="#22C55E"
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default SummaryCards;
