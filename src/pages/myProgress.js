"use client";

import { useEffect } from "react";
import { Box, Chip, Grid, LinearProgress, Stack, Tooltip, Typography } from "@mui/material";
import {
  Award, BrainCircuit, CheckCircle2, Circle, Crown,
  FileText, Flame, Lock, Medal, Star, Target, Trophy, Zap,
} from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useUser } from "@/customHooks/useUser";
import LoaderTwo from "@/components/LoaderTwo";
import PremiumCard from "@/components/premium/PremiumCard";
import PremiumPage from "@/components/premium/PremiumPage";
import SectionHeader from "@/components/premium/SectionHeader";
import { authService } from "@/services/authService";

// ── Achievements definition ──────────────────────────────────────────────────
const ACHIEVEMENTS = [
  {
    id: "welcome",
    title: "Welcome",
    description: "Joined SkillSync AI",
    Icon: Star,
    color: "#06B6D4",
    check: () => true,
  },
  {
    id: "profile_set",
    title: "Profile Set",
    description: "Added name, email, and job title",
    Icon: CheckCircle2,
    color: "#22C55E",
    check: (u) => !!(u?.name && u?.email && u?.currentJobTitle),
  },
  {
    id: "resume_ready",
    title: "Resume Ready",
    description: "Uploaded your resume",
    Icon: FileText,
    color: "#A78BFA",
    check: (u) => !!u?.uploadResume,
  },
  {
    id: "skill_builder",
    title: "Skill Builder",
    description: "Added 3+ skills to profile",
    Icon: BrainCircuit,
    color: "#F59E0B",
    check: (u) => (u?.skills?.length || 0) >= 3,
  },
  {
    id: "first_quiz",
    title: "First Attempt",
    description: "Completed your first quiz",
    Icon: Target,
    color: "#06B6D4",
    check: (u) => (u?.quizResult?.length || 0) >= 1,
  },
  {
    id: "consistent",
    title: "Consistent",
    description: "Completed 5 quizzes",
    Icon: Flame,
    color: "#EF4444",
    check: (u) => (u?.quizResult?.length || 0) >= 5,
  },
  {
    id: "dedicated",
    title: "Dedicated",
    description: "Completed 10 quizzes",
    Icon: Award,
    color: "#F59E0B",
    check: (u) => (u?.quizResult?.length || 0) >= 10,
  },
  {
    id: "high_achiever",
    title: "High Achiever",
    description: "Scored 80%+ on a quiz",
    Icon: Trophy,
    color: "#22C55E",
    check: (u) =>
      (u?.quizResult || []).some((quiz) => {
        const qs = quiz.quizQuestion || [];
        if (!qs.length) return false;
        const correct = qs.filter(
          (q) => q.answer?.trim() === q.correctAnswer?.trim()
        ).length;
        return correct / qs.length >= 0.8;
      }),
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Scored 100% on a quiz",
    Icon: Crown,
    color: "#F59E0B",
    check: (u) =>
      (u?.quizResult || []).some((quiz) => {
        const qs = quiz.quizQuestion || [];
        if (!qs.length) return false;
        const correct = qs.filter(
          (q) => q.answer?.trim() === q.correctAnswer?.trim()
        ).length;
        return correct === qs.length;
      }),
  },
  {
    id: "versatile",
    title: "Versatile",
    description: "Quizzed on 3+ technologies",
    Icon: Zap,
    color: "#8B5CF6",
    check: (u) =>
      new Set(
        (u?.quizResult || []).map((q) => q.technology).filter(Boolean)
      ).size >= 3,
  },
];

// ── Profile checklist definition ─────────────────────────────────────────────
const getProfileItems = (user) => [
  { label: "Full name", done: !!user?.name, href: "/profile", hint: "Add your name in profile settings" },
  { label: "Phone number", done: !!user?.phoneNumber, href: "/profile", hint: "Add a contact number" },
  { label: "Current role", done: !!(user?.currentJobTitle && user?.currentCompany), href: "/profile", hint: "Add your current job title and company" },
  { label: "Resume uploaded", done: !!user?.uploadResume, href: "/resumeAnalysis", hint: "Upload your resume for AI analysis" },
  { label: "Skills (3+)", done: (user?.skills?.length || 0) >= 3, href: "/profile", hint: "Add at least 3 skills" },
  { label: "Education", done: (user?.educations?.length || 0) >= 1, href: "/profile", hint: "Add your educational background" },
  { label: "Work experience", done: (user?.workExperiences?.length || 0) >= 1, href: "/profile", hint: "Add at least one work experience" },
  { label: "First quiz done", done: (user?.quizResult?.length || 0) >= 1, href: "/technologies", hint: "Take a skill quiz" },
];

// ── Stat tile ─────────────────────────────────────────────────────────────────
const StatTile = ({ label, value, color }) => (
  <Box
    sx={{
      p: { xs: 1.8, md: 2.2 },
      borderRadius: "18px",
      border: `1px solid ${color}33`,
      bgcolor: `${color}10`,
      textAlign: "center",
    }}
  >
    <Typography sx={{ color, fontWeight: 950, fontSize: { xs: "1.7rem", md: "2.1rem" }, lineHeight: 1 }}>
      {value}
    </Typography>
    <Typography sx={{ color: "text.secondary", fontSize: "0.78rem", fontWeight: 700, mt: 0.5 }}>
      {label}
    </Typography>
  </Box>
);

// ── Main page ─────────────────────────────────────────────────────────────────
const MyProgress = () => {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!authService.getStoredUser()) router.push("/login");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !user) return <LoaderTwo text="Loading your progress..." />;

  // Achievement data
  const achievements = ACHIEVEMENTS.map((a) => ({ ...a, earned: a.check(user) }));
  const earnedCount = achievements.filter((a) => a.earned).length;

  // Profile completion data
  const items = getProfileItems(user);
  const doneCount = items.filter((i) => i.done).length;
  const percentage = Math.round((doneCount / items.length) * 100);
  const nextItem = items.find((i) => !i.done);
  const completionColor = percentage >= 80 ? "#22C55E" : percentage >= 50 ? "#F59E0B" : "#06B6D4";

  // Quiz stats
  const quizCount = user?.quizResult?.length || 0;
  const bestScore = quizCount
    ? Math.max(
        ...user.quizResult.map((quiz) => {
          const qs = quiz.quizQuestion || [];
          if (!qs.length) return 0;
          return Math.round(
            (qs.filter((q) => q.answer?.trim() === q.correctAnswer?.trim()).length /
              qs.length) *
              100
          );
        })
      )
    : 0;

  return (
    <>
      <Head>
        <title>My Progress — SkillSync AI</title>
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
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              boxShadow: "0 0 28px rgba(124,58,237,0.36)",
              flexShrink: 0,
            }}
          >
            <Medal size={24} color="#fff" />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 950, lineHeight: 1.1, fontSize: { xs: "1.45rem", md: "1.75rem" } }}>
              My Progress
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.87rem", mt: 0.3 }}>
              Track profile completion, milestones, and achievements
            </Typography>
          </Box>
        </Box>

        {/* ── Quick stats ── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
            gap: 1.6,
          }}
        >
          <StatTile label="Achievements" value={`${earnedCount}/${ACHIEVEMENTS.length}`} color="#7C3AED" />
          <StatTile label="Profile" value={`${percentage}%`} color={completionColor} />
          <StatTile label="Quiz Attempts" value={quizCount} color="#06B6D4" />
          <StatTile label="Best Score" value={`${bestScore}%`} color="#22C55E" />
        </Box>

        {/* ── Profile completion + Achievements ── */}
        <Grid container spacing={2.4}>
          {/* Profile completion */}
          <Grid item size={{ xs: 12, md: 5 }}>
            <PremiumCard hover={false} sx={{ p: { xs: 2.2, md: 2.8 }, borderRadius: "22px", height: "100%" }}>
              <SectionHeader eyebrow="Checklist" title="Profile Completion" />

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.2 }}>
                <Typography sx={{ color: "text.secondary", fontSize: "0.82rem" }}>
                  {doneCount} of {items.length} items complete
                </Typography>
                <Typography sx={{ fontWeight: 950, fontSize: "1.8rem", color: completionColor, lineHeight: 1 }}>
                  {percentage}%
                </Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 8,
                  borderRadius: 999,
                  mb: 2.4,
                  bgcolor: "rgba(255,255,255,0.07)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${completionColor}, ${completionColor}bb)`,
                  },
                }}
              />

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.7, mb: 2 }}>
                {items.map(({ label, done, hint, href }) => (
                  <Tooltip key={label} title={done ? `${label} — complete` : hint} placement="top" arrow>
                    <Stack
                      direction="row"
                      spacing={0.9}
                      alignItems="center"
                      onClick={() => !done && router.push(href)}
                      sx={{
                        py: 0.8,
                        px: 1,
                        borderRadius: "11px",
                        cursor: done ? "default" : "pointer",
                        border: `1px solid ${done ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.05)"}`,
                        bgcolor: done ? "rgba(34,197,94,0.06)" : "transparent",
                        "&:hover": { bgcolor: done ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.05)" },
                        transition: "background 0.18s",
                      }}
                    >
                      {done ? (
                        <CheckCircle2 size={14} color="#22C55E" style={{ flex: "0 0 auto" }} />
                      ) : (
                        <Circle size={14} color="#444" style={{ flex: "0 0 auto" }} />
                      )}
                      <Typography
                        sx={{
                          fontSize: "0.76rem",
                          fontWeight: done ? 700 : 600,
                          color: done ? "#ddd" : "#666",
                          lineHeight: 1.3,
                        }}
                      >
                        {label}
                      </Typography>
                    </Stack>
                  </Tooltip>
                ))}
              </Box>

              {nextItem ? (
                <Box
                  onClick={() => router.push(nextItem.href)}
                  sx={{
                    py: 1.1,
                    px: 1.6,
                    borderRadius: "12px",
                    border: "1px solid rgba(124,58,237,0.28)",
                    bgcolor: "rgba(124,58,237,0.07)",
                    color: "#A78BFA",
                    fontWeight: 800,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    textAlign: "center",
                    "&:hover": { bgcolor: "rgba(124,58,237,0.14)", borderColor: "#7C3AED" },
                    transition: "all 0.18s",
                  }}
                >
                  Next step: {nextItem.label} →
                </Box>
              ) : (
                <Box
                  sx={{
                    py: 1.1,
                    px: 1.6,
                    borderRadius: "12px",
                    bgcolor: "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(34,197,94,0.22)",
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "0.8rem", fontWeight: 800, color: "#86EFAC" }}>
                    Profile 100% complete
                  </Typography>
                </Box>
              )}
            </PremiumCard>
          </Grid>

          {/* Achievements */}
          <Grid item size={{ xs: 12, md: 7 }}>
            <PremiumCard hover={false} sx={{ p: { xs: 2.2, md: 2.8 }, borderRadius: "22px", height: "100%" }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                sx={{ mb: 2.4 }}
              >
                <SectionHeader eyebrow="Gamification" title="Achievements" />
                <Chip
                  label={`${earnedCount} / ${achievements.length} earned`}
                  sx={{
                    mt: { xs: 1, sm: 0 },
                    bgcolor: "rgba(124,58,237,0.14)",
                    color: "#A78BFA",
                    fontWeight: 900,
                    border: "1px solid rgba(124,58,237,0.25)",
                  }}
                />
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(5, 1fr)" },
                  gap: 1.4,
                }}
              >
                {achievements.map(({ id, title, description, Icon, color, earned }) => (
                  <Tooltip
                    key={id}
                    title={
                      <Box sx={{ p: 0.5 }}>
                        <Typography sx={{ fontWeight: 900, fontSize: "0.85rem" }}>{title}</Typography>
                        <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.70)" }}>
                          {description}
                        </Typography>
                        {!earned && (
                          <Typography sx={{ fontSize: "0.72rem", color: "#94A3B8", mt: 0.4 }}>
                            Locked — keep going to unlock
                          </Typography>
                        )}
                      </Box>
                    }
                    placement="top"
                    arrow
                  >
                    <Box
                      sx={{
                        p: 1.8,
                        borderRadius: "18px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        cursor: "default",
                        transition: "all 0.22s ease",
                        opacity: earned ? 1 : 0.35,
                        filter: earned ? "none" : "grayscale(1)",
                        border: `1px solid ${earned ? color + "33" : "rgba(255,255,255,0.06)"}`,
                        bgcolor: earned ? `${color}10` : "rgba(255,255,255,0.02)",
                        "&:hover": earned
                          ? { transform: "translateY(-3px)", boxShadow: `0 10px 28px ${color}28`, border: `1px solid ${color}55` }
                          : {},
                      }}
                    >
                      <Box
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius: "14px",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: earned ? `${color}20` : "rgba(255,255,255,0.06)",
                          color: earned ? color : "#444",
                        }}
                      >
                        {earned ? <Icon size={22} /> : <Lock size={18} />}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: 900,
                          textAlign: "center",
                          color: earned ? "#fff" : "#555",
                          lineHeight: 1.3,
                        }}
                      >
                        {title}
                      </Typography>
                    </Box>
                  </Tooltip>
                ))}
              </Box>

              {/* Progress toward next achievement */}
              {earnedCount < ACHIEVEMENTS.length && (
                <Box
                  sx={{
                    mt: 2.4,
                    p: 1.6,
                    borderRadius: "14px",
                    border: "1px solid rgba(124,58,237,0.20)",
                    bgcolor: "rgba(124,58,237,0.06)",
                  }}
                >
                  <Typography sx={{ color: "#A78BFA", fontSize: "0.78rem", fontWeight: 800, mb: 0.8 }}>
                    Overall progress
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.7 }}>
                    <Typography sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                      {earnedCount} of {ACHIEVEMENTS.length} achievements
                    </Typography>
                    <Typography sx={{ color: "#A78BFA", fontSize: "0.75rem", fontWeight: 900 }}>
                      {Math.round((earnedCount / ACHIEVEMENTS.length) * 100)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.round((earnedCount / ACHIEVEMENTS.length) * 100)}
                    sx={{
                      height: 6,
                      borderRadius: 999,
                      bgcolor: "rgba(255,255,255,0.06)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
                      },
                    }}
                  />
                </Box>
              )}
            </PremiumCard>
          </Grid>
        </Grid>
      </PremiumPage>
    </>
  );
};

export default MyProgress;
