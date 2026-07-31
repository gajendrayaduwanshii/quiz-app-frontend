import { Box, Button, LinearProgress, Stack, Tooltip, Typography } from "@mui/material";
import { CheckCircle2, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import PremiumCard from "@/components/premium/PremiumCard";

const getProfileItems = (user) => [
  {
    label: "Full name",
    done: !!user?.name,
    href: "/profile",
    hint: "Add your name in profile settings",
  },
  {
    label: "Phone number",
    done: !!user?.phoneNumber,
    href: "/profile",
    hint: "Add a contact number to your profile",
  },
  {
    label: "Current role",
    done: !!(user?.currentJobTitle && user?.currentCompany),
    href: "/profile",
    hint: "Add current job title and company",
  },
  {
    label: "Resume uploaded",
    done: !!user?.uploadResume,
    href: "/resumeAnalysis",
    hint: "Upload your resume for ATS analysis",
  },
  {
    label: "Skills (3+)",
    done: (user?.skills?.length || 0) >= 3,
    href: "/profile",
    hint: "Add at least 3 skills to your profile",
  },
  {
    label: "Education",
    done: (user?.educations?.length || 0) >= 1,
    href: "/profile",
    hint: "Add your educational background",
  },
  {
    label: "Work experience",
    done: (user?.workExperiences?.length || 0) >= 1,
    href: "/profile",
    hint: "Add at least one work experience entry",
  },
  {
    label: "First quiz done",
    done: (user?.quizResult?.length || 0) >= 1,
    href: "/technologies",
    hint: "Take a skill quiz to activate your signal",
  },
];

const ProfileCompletion = ({ user }) => {
  const router = useRouter();
  const items = getProfileItems(user);
  const doneCount = items.filter((i) => i.done).length;
  const percentage = Math.round((doneCount / items.length) * 100);
  const nextItem = items.find((i) => !i.done);

  const color =
    percentage >= 80 ? "#22C55E" : percentage >= 50 ? "#F59E0B" : "#06B6D4";

  return (
    <PremiumCard hover={false} sx={{ p: { xs: 2, md: 2.4 }, borderRadius: "22px" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 1.4 }}
      >
        <Box>
          <Typography sx={{ fontWeight: 950, fontSize: "1rem", mb: 0.2 }}>
            Profile Completion
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.80rem" }}>
            {doneCount} of {items.length} items complete
          </Typography>
        </Box>
        <Typography
          sx={{ fontWeight: 950, fontSize: "1.65rem", color, lineHeight: 1 }}
        >
          {percentage}%
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 7,
          borderRadius: 999,
          mb: 1.8,
          bgcolor: "rgba(255,255,255,0.07)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            background: `linear-gradient(90deg, ${color}, ${color}bb)`,
          },
        }}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0.5,
          mb: 1.8,
        }}
      >
        {items.map(({ label, done, hint, href }) => (
          <Tooltip
            key={label}
            title={done ? `${label} — complete` : hint}
            placement="top"
            arrow
          >
            <Stack
              direction="row"
              spacing={0.7}
              alignItems="center"
              onClick={() => !done && router.push(href)}
              sx={{
                py: 0.55,
                px: 0.8,
                borderRadius: "9px",
                cursor: done ? "default" : "pointer",
                "&:hover": {
                  bgcolor: done ? "transparent" : "rgba(255,255,255,0.05)",
                },
                transition: "background 0.18s",
              }}
            >
              {done ? (
                <CheckCircle2
                  size={13}
                  color="#22C55E"
                  style={{ flex: "0 0 auto" }}
                />
              ) : (
                <Circle
                  size={13}
                  color="#444"
                  style={{ flex: "0 0 auto" }}
                />
              )}
              <Typography
                sx={{
                  fontSize: "0.74rem",
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
        <Button
          fullWidth
          size="small"
          onClick={() => router.push(nextItem.href)}
          sx={{
            borderRadius: "11px",
            fontWeight: 800,
            fontSize: "0.76rem",
            py: 0.9,
            border: "1px solid rgba(124,58,237,0.28)",
            color: "#A78BFA",
            bgcolor: "rgba(124,58,237,0.06)",
            "&:hover": {
              bgcolor: "rgba(124,58,237,0.13)",
              borderColor: "#7C3AED",
            },
          }}
        >
          Next: {nextItem.label}
        </Button>
      ) : (
        <Box
          sx={{
            py: 1,
            px: 1.5,
            borderRadius: "11px",
            bgcolor: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.22)",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{ fontSize: "0.78rem", fontWeight: 800, color: "#86EFAC" }}
          >
            Profile 100% complete
          </Typography>
        </Box>
      )}
    </PremiumCard>
  );
};

export default ProfileCompletion;
