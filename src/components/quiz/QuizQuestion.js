import React from "react";
import { Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";

const QuizQuestion = ({ question, options, value, onChange, submitted, answer }) => (
  <Card variant="outlined" style={{ marginTop: "10px", padding: "20px" }}>
    <CardContent>
      <Typography variant="h6">{question}</Typography>
      <FormControl component="fieldset" style={{ margin: "10px 0" }}>
        <RadioGroup value={value || ""} onChange={onChange}>
          {options.map(({ id, option: optionText }, index) => (
            <FormControlLabel
              key={id || index}
              value={optionText}
              control={<Radio disabled={submitted} />}
              label={optionText}
              style={{
                color: submitted
                  ? optionText === answer
                    ? "green"
                    : value === optionText
                    ? "red"
                    : "black"
                  : "inherit",
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {submitted && (
        <Typography variant="subtitle1" style={{ marginTop: "10px", color: value === answer ? "green" : "red" }}>
          {value === answer ? "Correct! ✅" : `Wrong ❌ (Correct: ${answer} ✅)`}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default QuizQuestion;
