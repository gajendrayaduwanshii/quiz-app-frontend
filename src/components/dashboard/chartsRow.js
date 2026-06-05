import { Box, Chip, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import { Award, BarChart3, BrainCircuit, Gauge, PieChart, Sparkles, Target } from "lucide-react";
import PremiumCard from "@/components/premium/PremiumCard";
import SectionHeader from "@/components/premium/SectionHeader";

const chartTextColor = "#A7B3C6";
const chartGridColor = "rgba(148,163,184,0.10)";
const palette = ["#7C3AED", "#06B6D4", "#22C55E", "#F59E0B", "#EF4444", "#A78BFA", "#67E8F9", "#FB7185"];
const levelMap = { Beginner: 33, Intermediate: 66, Expert: 100 };

const ChartsRow = ({ skills = [] }) => {
  const safeSkills = Array.isArray(skills) ? skills : [];
  const labels = safeSkills.map((s) => s.skillName || "Skill");
  const strongestExperience = Math.max(
    ...safeSkills.map((skill) => Number(skill.yearsExperience) || 0)
  );
  const experienceLabel =
    strongestExperience > 0 ? `${strongestExperience} yrs` : "N/A";
  const expertCount = safeSkills.filter((skill) => skill.level === "Expert").length;
  const topSkill = [...safeSkills].sort(
    (a, b) => (Number(b.yearsExperience) || 0) - (Number(a.yearsExperience) || 0)
  )[0];
  const rankedSkills = [...safeSkills]
    .map((skill, index) => ({
      ...skill,
      score: levelMap[skill.level] || Math.min(100, (Number(skill.yearsExperience) || 0) * 18),
      accent: palette[index % palette.length],
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const pieData = {
    labels,
    datasets: [
      {
        label: "Skill Proficiency (Years)",
        data: safeSkills.map((s) => Number(s.yearsExperience) || 1),
        backgroundColor: palette,
        borderColor: "rgba(5,8,22,0.9)",
        borderWidth: 4,
        hoverOffset: 10,
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: "Skill Level",
        data: safeSkills.map((s) => levelMap[s.level] || 0),
        backgroundColor: safeSkills.map((_, index) => `${palette[index % palette.length]}CC`),
        borderColor: safeSkills.map((_, index) => palette[index % palette.length]),
        borderWidth: 1.5,
        borderRadius: 12,
        maxBarThickness: 44,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: chartTextColor, boxWidth: 10, usePointStyle: true, padding: 16 },
      },
      tooltip: {
        backgroundColor: "rgba(5,8,22,0.96)",
        borderColor: "rgba(148,163,184,0.18)",
        borderWidth: 1,
        titleColor: "#fff",
        bodyColor: "#DDE7F3",
        padding: 12,
        cornerRadius: 12,
      },
    },
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      x: { ticks: { color: chartTextColor, font: { weight: 700 } }, grid: { display: false } },
      y: { ticks: { color: chartTextColor }, grid: { color: chartGridColor }, max: 100 },
    },
  };

  if (!safeSkills.length) {
    return (
      <Box sx={{ mt: 4 }}>
        <PremiumCard hover={false} sx={{ p: { xs: 2.4, md: 3.2 }, textAlign: "center" }}>
          <BrainCircuit size={42} color="#06B6D4" />
          <Typography variant="h5" sx={{ mt: 1.4, fontWeight: 950 }}>
            Skill Intelligence will unlock after skills are added
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.6 }}>
            Add skills in profile to see premium analytics, proficiency mix, and focus areas.
          </Typography>
        </PremiumCard>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <PremiumCard
        hover={false}
        glow="rgba(6,182,212,0.18)"
        sx={{
          p: { xs: 2.2, md: 3 },
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.84), rgba(5,8,22,0.78)), radial-gradient(circle at 92% 0%, rgba(6,182,212,0.16), transparent 34%), radial-gradient(circle at 12% 12%, rgba(124,58,237,0.14), transparent 34%)",
        }}
      >
        <SectionHeader
          eyebrow="Analytics"
          title="Skill Intelligence"
          description="Premium skill signal, depth, and proficiency analytics."
          action={
            <Chip
              icon={<Sparkles size={15} />}
              label="Live profile data"
              sx={{
                color: "#CFFAFE",
                bgcolor: "rgba(6,182,212,0.12)",
                border: "1px solid rgba(103,232,249,0.22)",
                fontWeight: 900,
              }}
            />
          }
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
            gap: 1.4,
            mb: 2.4,
          }}
        >
          {[
            { icon: <BrainCircuit size={18} />, label: "Mapped Skills", value: safeSkills.length, color: "#06B6D4" },
            { icon: <Gauge size={18} />, label: "Experience Signal", value: experienceLabel, color: "#22C55E" },
            { icon: <Award size={18} />, label: "Expert Skills", value: expertCount, color: "#F59E0B" },
          ].map((stat) => (
            <Box
              key={stat.label}
              sx={{
                p: 1.7,
                borderRadius: "16px",
                border: `1px solid ${stat.color}33`,
                bgcolor: `${stat.color}12`,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ color: stat.color, mb: 0.8 }}>
                {stat.icon}
                <Typography sx={{ color: "text.secondary", fontSize: "0.75rem", fontWeight: 850 }}>
                  {stat.label}
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: "1.625rem", fontWeight: 950, lineHeight: 1 }}>
                {stat.value}
              </Typography>
            </Box>
          ))}
        </Box>

        <Grid container spacing={2.2} sx={{ width: "100%" }}>
          <Grid size={{ xs: 12, lg: 5 }}>
            <Box
              sx={{
                height: "100%",
                minHeight: 420,
                p: 2.2,
                borderRadius: "18px",
                border: "1px solid rgba(148,163,184,0.14)",
                bgcolor: "rgba(255,255,255,0.035)",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 1.5 }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: 950 }}>
                    Skill Mix
                  </Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>
                    Experience weight by technology
                  </Typography>
                </Box>
                <PieChart size={22} color="#06B6D4" />
              </Stack>
              <Box sx={{ height: { xs: 250, sm: 300 } }}>
                <Pie data={pieData} options={commonOptions} />
              </Box>
              <Box
                sx={{
                  mt: 1.2,
                  p: 1.4,
                  borderRadius: "14px",
                  bgcolor: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.18)",
                }}
              >
                <Typography sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>
                  Strongest depth
                </Typography>
                <Typography sx={{ fontWeight: 950 }}>
                  {topSkill?.skillName || "Skill"} • {topSkill?.yearsExperience || 0} years
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, lg: 7 }}>
            <Box
              sx={{
                height: "100%",
                minHeight: 420,
                p: 2.2,
                borderRadius: "18px",
                border: "1px solid rgba(148,163,184,0.14)",
                bgcolor: "rgba(255,255,255,0.035)",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 1.5 }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: 950 }}>
                    Proficiency Radar
                  </Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>
                    Beginner to expert calibration
                  </Typography>
                </Box>
                <BarChart3 size={22} color="#7C3AED" />
              </Stack>
              <Box sx={{ height: { xs: 230, sm: 248 } }}>
                <Bar data={barData} options={barOptions} />
              </Box>

              <Box sx={{ mt: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.2 }}>
                  <Target size={18} color="#22C55E" />
                  <Typography sx={{ fontWeight: 950 }}>Top skill signals</Typography>
                </Stack>
                <Stack spacing={1}>
                  {rankedSkills.map((skill) => (
                    <Box key={skill.id || skill.skillName}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.6 }}>
                        <Typography sx={{ fontSize: "0.8125rem", fontWeight: 850, overflowWrap: "anywhere" }}>
                          {skill.skillName}
                        </Typography>
                        <Typography sx={{ color: skill.accent, fontSize: "0.75rem", fontWeight: 950 }}>
                          {skill.score}/100
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={skill.score}
                        sx={{
                          height: 7,
                          borderRadius: 999,
                          bgcolor: "rgba(255,255,255,0.08)",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 999,
                            background: `linear-gradient(90deg, ${skill.accent}, #06B6D4)`,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </PremiumCard>
    </Box>
  );
};

export default ChartsRow;
