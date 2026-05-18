import React from "react";
import { Grid } from "@mui/material";
import { BriefcaseBusiness, Gauge, ShieldCheck, Sparkles, TrendingDown, Trophy } from "lucide-react";
import MetricCard from "@/components/premium/MetricCard";
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

  return (
    <>
      <SectionHeader
        eyebrow="Career Intelligence"
        title="Professional Snapshot"
        description="A premium overview of your profile strength, skill signal, and growth readiness."
      />
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
    </>
  );
};

export default SummaryCards;
