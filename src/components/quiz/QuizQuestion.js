import React, { memo, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

const QuizQuestion = memo(({
  question,
  options = [],
  value,
  onChange,
  submitted,
  answer,
}) => {
  const handleChange = useCallback((event) => {
    if (onChange) {
      onChange(event);
    }
  }, [onChange]);

  const optionElements = useMemo(() => {
    return options.map((opt, index) => {
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
    });
  }, [options, submitted, answer, value]);

  const resultText = useMemo(() => {
    if (!submitted) return null;
    return value === answer
      ? "Correct! ✅"
      : `Wrong ❌ (Correct: ${answer} ✅)`;
  }, [submitted, value, answer]);

  const resultColor = useMemo(() => {
    if (!submitted) return "inherit";
    return value === answer ? "green" : "red";
  }, [submitted, value, answer]);

  return (
    <Card variant="outlined" sx={{ mt: 2, p: 2 }}>
      <CardContent>
        <Typography variant="h6">{question}</Typography>
        <FormControl component="fieldset" sx={{ my: 2 }}>
          <RadioGroup value={value || ""} onChange={handleChange}>
            {optionElements}
          </RadioGroup>
        </FormControl>
        {submitted && (
          <Typography
            variant="subtitle1"
            sx={{ mt: 2, color: resultColor }}
          >
            {resultText}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
});

QuizQuestion.displayName = 'QuizQuestion';

export default QuizQuestion;
