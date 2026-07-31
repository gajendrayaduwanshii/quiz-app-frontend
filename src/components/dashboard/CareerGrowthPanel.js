import { Box, Button, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { ArrowUpRight, CalendarCheck2, Target, Trophy } from "lucide-react";
import Link from "next/link";
import PremiumCard from "@/components/premium/PremiumCard";
import SectionHeader from "@/components/premium/SectionHeader";
import {
  buildDailyCareerActions,
  calculateCareerReadiness,
} from "@/utils/careerGrowth";

const CareerGrowthPanel = ({ user }) => {
  const readiness = calculateCareerReadiness(user);
  const actions = buildDailyCareerActions(user);

  return (
    <PremiumCard hover={false} sx={{ p: { xs: 2.2, md: 2.8 }, borderRadius: "22px" }}>
      <SectionHeader
        eyebrow="Retention Engine"
        title="Today’s Career Growth Plan"
        description="A practical daily loop that gives users a reason to return: improve profile, practice, and test job fit."
        action={
          <Button
            component={Link}
            href="/jobMatch"
            variant="outlined"
            endIcon={<ArrowUpRight size={17} />}
            sx={{ borderColor: "rgba(6,182,212,0.45)", color: "#fff" }}
          >
            Job Match
          </Button>
        }
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "300px minmax(0, 1fr)" },
          gap: 2,
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: "18px",
            border: "1px solid rgba(34,197,94,0.22)",
            bgcolor: "rgba(34,197,94,0.08)",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "#86EFAC", mb: 1 }}>
            <Trophy size={18} />
            <Typography sx={{ fontWeight: 900 }}>Career Readiness</Typography>
          </Stack>
          <Typography sx={{ fontSize: "2.4rem", lineHeight: 1, fontWeight: 950 }}>
            {readiness}
            <Typography component="span" sx={{ color: "text.secondary", fontWeight: 900 }}>
              /100
            </Typography>
          </Typography>
          <LinearProgress
            variant="determinate"
            value={readiness}
            sx={{
              mt: 1.5,
              height: 10,
              borderRadius: 99,
              bgcolor: "rgba(255,255,255,0.08)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 99,
                background: "linear-gradient(90deg, #22C55E, #06B6D4)",
              },
            }}
          />
          <Typography sx={{ color: "text.secondary", mt: 1.2, fontSize: "0.86rem" }}>
            Calculated from profile completion, skills, resume, quizzes, education, and experience.
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gap: 1.2 }}>
          {actions.map((action) => (
            <Box
              key={action.title}
              sx={{
                p: 1.55,
                borderRadius: "16px",
                border: "1px solid rgba(148,163,184,0.14)",
                bgcolor: "rgba(255,255,255,0.045)",
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) auto" },
                gap: 1.2,
                alignItems: "center",
              }}
            >
              <Stack direction="row" spacing={1.1} alignItems="flex-start" sx={{ minWidth: 0 }}>
                <Box sx={{ color: "#67E8F9", mt: 0.2 }}>
                  {action.priority === "High" ? <Target size={18} /> : <CalendarCheck2 size={18} />}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 900, overflowWrap: "anywhere" }}>
                    {action.title}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: "0.88rem", overflowWrap: "anywhere" }}>
                    {action.detail}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: "flex-start", sm: "flex-end" }}>
                <Chip size="small" label={action.priority} sx={{ fontWeight: 850 }} />
                <Button component={Link} href={action.href} size="small" sx={{ color: "#67E8F9", fontWeight: 900 }}>
                  Open
                </Button>
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>
    </PremiumCard>
  );
};

export default CareerGrowthPanel;
