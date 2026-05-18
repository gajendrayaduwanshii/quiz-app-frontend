import React, { memo, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import PremiumCard from "@/components/premium/PremiumCard";

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
            m: 0,
            px: 1.6,
            py: 1.25,
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            bgcolor: value === optionText ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.035)",
            transition: "all 0.22s ease",
            "&:hover": {
              bgcolor: "rgba(6,182,212,0.10)",
              transform: "translateX(3px)",
            },
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
    <PremiumCard hover={false} sx={{ mt: 2, p: { xs: 2.2, md: 3 } }}>
      <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 900 }}>
        AI Assessment Question
      </Typography>
      <Typography variant="h5" sx={{ mt: 1, mb: 2.5, fontWeight: 850 }}>
        {question}
      </Typography>
      <FormControl component="fieldset" sx={{ width: "100%" }}>
        <RadioGroup value={value || ""} onChange={handleChange}>
          <Box sx={{ display: "grid", gap: 1.3 }}>
            {optionElements}
          </Box>
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
    </PremiumCard>
  );
});

QuizQuestion.displayName = 'QuizQuestion';

export default QuizQuestion;
