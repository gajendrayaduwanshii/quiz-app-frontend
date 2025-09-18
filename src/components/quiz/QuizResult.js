import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box } from "@mui/material";

const QuizResult = ({ correctAnswers, incorrectAnswers }) => {
  const data = [
    { name: "Correct", value: correctAnswers, color: "#4CAF50" },
    { name: "Incorrect", value: incorrectAnswers, color: "#F44336" },
  ];

  return (
    <Box sx={{ textAlign: "center", mt: 3, px: 2 }}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default QuizResult;
