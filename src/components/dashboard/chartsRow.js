import { Bar, Pie } from "react-chartjs-2";

const ChartsRow = ({ skills }) => {
  const pieData = {
    labels: skills?.map((s) => s.skillName),
    datasets: [
      {
        label: "Skill Proficiency (Years)",
        data: skills?.map((s) => s.yearsExperience),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  const barData = {
    labels: skills?.map((s) => s.skillName),
    datasets: [
      {
        label: "Skill Level",
        data: skills?.map((s) => {
          const levelMap = { Beginner: 33, Intermediate: 66, Expert: 100 };
          return levelMap[s.level] || 0;
        }),
        backgroundColor: "#4BC0C0",
        borderRadius: 5,
      },
    ],
  };

  return (
    <div className="chartRow">
      <div className="card pie-chart">
        <h3>🧠 Skill Distribution</h3>
        <Pie data={pieData} />
      </div>
      <div className="card">
        <h3>📚 Skill Level Overview</h3>
        <Bar data={barData} />
      </div>
    </div>
  );
};

export default ChartsRow;