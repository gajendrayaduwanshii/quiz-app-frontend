import { Bar, Pie } from "react-chartjs-2";

const ChartsRow = ({ skills }) => {
  const pieData = {
    labels: skills?.map((s) => s.skillName),
    datasets: [
      {
        label: "Skill Proficiency (Years)",
        data: skills?.map((s) => s.yearsExperience),
        backgroundColor : [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", 
          "#FF9F40", "#FFCD56", "#C9CBCF", "#36A2EB", "#FF6384",
          "#8AFF33", "#33FFBD", "#FF33F6", "#FF5733", "#33FF57",
          "#3357FF", "#F6FF33", "#FF33A6", "#33FFF3", "#A633FF",
          "#FF6F33", "#33FF8A", "#FF3380", "#33A6FF", "#FFBF33",
          "#FF3333", "#33FFBF", "#8033FF", "#FF33FF", "#33FF66",
          "#FF6633", "#33FF99", "#FF3399", "#33CCFF", "#FF9933",
          "#FF3366", "#33FFCC", "#9933FF", "#FF33CC", "#33FF33",
          "#FF9933", "#33FF66", "#FF33FF", "#33CC33", "#FF6666",
          "#66FF33", "#FF33CC", "#33FF99", "#CC33FF", "#FF3399"
        ],
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