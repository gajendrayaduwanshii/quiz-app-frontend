import { Grid } from "@mui/system";
import { Bar, Pie } from "react-chartjs-2";
import { BarChart3, PieChart } from "lucide-react";
import PremiumCard from "@/components/premium/PremiumCard";
import SectionHeader from "@/components/premium/SectionHeader";

const chartTextColor = "#94A3B8";
const chartGridColor = "rgba(255,255,255,0.08)";

const ChartsRow = ({ skills = [] }) => {
  const labels = skills?.map((s) => s.skillName) || [];

  const pieData = {
    labels,
    datasets: [
      {
        label: "Skill Proficiency (Years)",
        data: skills?.map((s) => Number(s.yearsExperience) || 0),
        backgroundColor: [
          "#7C3AED",
          "#06B6D4",
          "#22C55E",
          "#F59E0B",
          "#EF4444",
          "#A78BFA",
          "#67E8F9",
          "#FB7185",
        ],
        borderColor: "rgba(5,8,22,0.9)",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: "Skill Level",
        data: skills?.map((s) => {
          const levelMap = { Beginner: 33, Intermediate: 66, Expert: 100 };
          return levelMap[s.level] || 0;
        }),
        backgroundColor: "rgba(6,182,212,0.72)",
        borderColor: "#67E8F9",
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: chartTextColor, boxWidth: 12, usePointStyle: true },
      },
    },
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      x: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } },
      y: { ticks: { color: chartTextColor }, grid: { color: chartGridColor }, max: 100 },
    },
  };

  return (
    <div className="chartRow" style={{ marginTop: 32 }}>
      <SectionHeader
        eyebrow="Analytics"
        title="Skill Intelligence"
        description="Visual overview of your skill depth and proficiency mix."
      />
      <Grid container spacing={2.2} sx={{ width: "100%" }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PremiumCard hover={false} sx={{ p: 2.5, height: 430 }}>
            <SectionHeader
              title="Skill Distribution"
              description="Experience weight by skill"
              action={<PieChart size={22} color="#06B6D4" />}
            />
            <div style={{ height: 320 }}>
              <Pie data={pieData} options={commonOptions} />
            </div>
          </PremiumCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PremiumCard hover={false} sx={{ p: 2.5, height: 430 }}>
            <SectionHeader
              title="Skill Level Overview"
              description="Beginner to expert calibration"
              action={<BarChart3 size={22} color="#7C3AED" />}
            />
            <div style={{ height: 320 }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </PremiumCard>
        </Grid>
      </Grid>
    </div>
  );
};

export default ChartsRow;
