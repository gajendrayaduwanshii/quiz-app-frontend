import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material";
import {
  Award, BrainCircuit, CheckCircle2, Crown, FileText,
  Flame, Lock, Star, Target, Trophy, Zap,
} from "lucide-react";
import PremiumCard from "@/components/premium/PremiumCard";

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

const AchievementBadges = ({ user }) => {
  const achievements = ACHIEVEMENTS.map((a) => ({
    ...a,
    earned: a.check(user),
  }));
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <PremiumCard hover={false} sx={{ p: { xs: 2.2, md: 2.8 }, borderRadius: "22px" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        sx={{ mb: 2.4 }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{ color: "secondary.main", fontWeight: 800, letterSpacing: "0.12em" }}
          >
            Gamification
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.14 }}>
            Achievements
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.4, fontSize: "0.88rem" }}>
            Milestones unlocked from your learning journey
          </Typography>
        </Box>
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
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(5, 1fr)",
          },
          gap: 1.4,
        }}
      >
        {achievements.map(({ id, title, description, Icon, color, earned }) => (
          <Tooltip
            key={id}
            title={
              <Box sx={{ p: 0.5 }}>
                <Typography sx={{ fontWeight: 900, fontSize: "0.85rem" }}>
                  {title}
                </Typography>
                <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.70)" }}>
                  {description}
                </Typography>
                {!earned && (
                  <Typography
                    sx={{ fontSize: "0.72rem", color: "#94A3B8", mt: 0.4 }}
                  >
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
                  ? {
                      transform: "translateY(-3px)",
                      boxShadow: `0 10px 28px ${color}28`,
                      border: `1px solid ${color}55`,
                    }
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
    </PremiumCard>
  );
};

export default AchievementBadges;
