import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Typography } from "@mui/material";

const QuizResult = ({ correctAnswers, incorrectAnswers }) => {
  const data = [
    { name: "Correct", value: correctAnswers, color: "#22C55E" },
    { name: "Incorrect", value: incorrectAnswers, color: "#EF4444" },
  ];
  const total = correctAnswers + incorrectAnswers;
  const score = total ? Math.round((correctAnswers / total) * 100) : 0;

  return (
    <Box sx={{ textAlign: "center", mt: 2, px: { xs: 0, sm: 2 } }}>
      <Box
        sx={{
          mx: "auto",
          mb: 1.5,
          width: 96,
          height: 96,
          borderRadius: "18px",
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(135deg, rgba(124,58,237,0.24), rgba(6,182,212,0.14))",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 0 40px rgba(6,182,212,0.14)",
        }}
      >
        <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: "1.875rem" }}>
          {score}%
        </Typography>
        <Typography sx={{ color: "#94A3B8", fontSize: "0.6875rem", mt: -1.5 }}>
          Score
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            innerRadius={38}
            fill="#8884d8"
            dataKey="value"
            stroke="rgba(11,17,32,0.9)"
            strokeWidth={3}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelStyle={{ fill: "#FFFFFF", fontWeight: 800 }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(11,17,32,0.96)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 14,
              color: "#fff",
            }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend
            formatter={(value) => <span style={{ color: "#FFFFFF" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default QuizResult;
