import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

const QuizQuestion = ({
  question,
  options = [],
  value,
  onChange,
  submitted,
  answer,
}) => (
  <Card variant="outlined" sx={{ mt: 2, p: 2 }}>
    <CardContent>
      <Typography variant="h6">{question}</Typography>
      <FormControl component="fieldset" sx={{ my: 2 }}>
        <RadioGroup value={value || ""} onChange={onChange}>
          {options.map((opt, index) => {
            // If opt is object with 'option' prop use it; else assume opt is string
            const optionText = typeof opt === "object" ? opt.option : opt;
            const optionId = typeof opt === "object" ? opt.id : index;

            return (
              <FormControlLabel
                key={optionId ?? index}
                value={optionText}
                control={<Radio disabled={submitted} />}
                label={optionText}
                sx={{
                  color: submitted
                    ? optionText === answer
                      ? "green"
                      : value === optionText
                      ? "red"
                      : "text.primary"
                    : "inherit",
                }}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
      {submitted && (
        <Typography
          variant="subtitle1"
          sx={{ mt: 2, color: value === answer ? "green" : "red" }}
        >
          {value === answer
            ? "Correct! ✅"
            : `Wrong ❌ (Correct: ${answer} ✅)`}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default QuizQuestion;
