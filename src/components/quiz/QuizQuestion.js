import React, { memo, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Chip,
  Stack,
} from "@mui/material";
import { CheckCircle2, Circle, CircleDot, XCircle } from "lucide-react";
import PremiumCard from "@/components/premium/PremiumCard";

const QuizQuestion = memo(({
  question,
  options = [],
  value,
  onChange,
  submitted,
  answer,
  questionNumber,
  totalQuestions,
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
      const selected = value === optionText;
      const correct = submitted && optionText === answer;
      const wrong = submitted && selected && optionText !== answer;

      return (
        <FormControlLabel
          key={optionId ?? index}
          value={optionText}
          control={
            <Radio
              disabled={submitted}
              icon={<Circle size={18} />}
              checkedIcon={correct ? <CheckCircle2 size={20} /> : wrong ? <XCircle size={20} /> : <CircleDot size={20} />}
              sx={{
                color: "rgba(226,232,240,0.52)",
                "&.Mui-checked": {
                  color: correct ? "#22C55E" : wrong ? "#EF4444" : "#22D3EE",
                },
              }}
            />
          }
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 1.2,
                width: "100%",
                minWidth: 0,
              }}
            >
              <Typography sx={{ fontWeight: 850, color: selected ? "#fff" : "rgba(226,232,240,0.88)", flex: "0 0 auto" }}>
                {String.fromCharCode(65 + index)}
              </Typography>
              <Typography
                sx={{
                  flex: 1,
                  minWidth: 0,
                  color: "inherit",
                  lineHeight: 1.45,
                  fontSize: { xs: 14, sm: 15 },
                  overflowWrap: "anywhere",
                }}
              >
                {optionText}
              </Typography>
              {correct && <Chip size="small" label="Correct" sx={{ display: { xs: "none", sm: "inline-flex" }, color: "#BBF7D0", bgcolor: "rgba(34,197,94,0.14)" }} />}
              {wrong && <Chip size="small" label="Selected" sx={{ display: { xs: "none", sm: "inline-flex" }, color: "#FECACA", bgcolor: "rgba(239,68,68,0.14)" }} />}
            </Box>
          }
          sx={{
            m: 0,
            px: { xs: 1.2, sm: 1.6 },
            py: 1.45,
            minHeight: 66,
            alignItems: "center",
            borderRadius: "18px",
            border: selected
              ? "1px solid rgba(34,211,238,0.50)"
              : "1px solid rgba(255,255,255,0.09)",
            bgcolor: correct
              ? "rgba(34,197,94,0.12)"
              : wrong
              ? "rgba(239,68,68,0.10)"
              : selected
              ? "rgba(34,211,238,0.13)"
              : "rgba(255,255,255,0.045)",
            boxShadow: selected ? "0 18px 44px rgba(6,182,212,0.14)" : "none",
            transition: "transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease",
            "&:hover": {
              bgcolor: submitted ? undefined : "rgba(6,182,212,0.10)",
              borderColor: submitted ? undefined : "rgba(34,211,238,0.30)",
              transform: submitted ? "none" : "translateY(-2px)",
            },
            "& .MuiFormControlLabel-label": {
              width: "100%",
              minWidth: 0,
            },
            color: wrong ? "#FECACA" : correct ? "#BBF7D0" : "inherit",
          }}
        />
      );
    });
  }, [options, submitted, answer, value]);

  const resultText = useMemo(() => {
    if (!submitted) return null;
    return value === answer
      ? "Correct answer"
      : `Needs review. Correct answer: ${answer}`;
  }, [submitted, value, answer]);

  const resultColor = useMemo(() => {
    if (!submitted) return "inherit";
    return value === answer ? "green" : "red";
  }, [submitted, value, answer]);

  return (
    <PremiumCard
      hover={false}
      sx={{
        mt: 2,
        p: { xs: 2.2, md: 3.2 },
        borderRadius: "20px",
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.085), rgba(255,255,255,0.030)), radial-gradient(circle at 100% 0%, rgba(34,211,238,0.11), transparent 34%)",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 1.4 }}
      >
        <Typography variant="overline" sx={{ color: "#67E8F9", fontWeight: 950 }}>
          AI Assessment Question
        </Typography>
        <Chip
          size="small"
          label={`Q${questionNumber || 1} / ${totalQuestions || options.length || 1}`}
          sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.08)", fontWeight: 850 }}
        />
      </Stack>
      <Typography
        variant="h5"
        sx={{
          mb: 2.6,
          fontWeight: 900,
          lineHeight: 1.28,
          fontSize: { xs: 20, sm: 24 },
          overflowWrap: "anywhere",
        }}
      >
        {question}
      </Typography>
      <FormControl component="fieldset" sx={{ width: "100%" }}>
        <RadioGroup value={value || ""} onChange={handleChange}>
          <Box sx={{ display: "grid", gap: 1.25 }}>
            {optionElements}
          </Box>
        </RadioGroup>
      </FormControl>
        {submitted && (
          <Typography
            variant="subtitle1"
            sx={{ mt: 2, color: resultColor, fontWeight: 900 }}
          >
            {resultText}
          </Typography>
        )}
    </PremiumCard>
  );
});

QuizQuestion.displayName = 'QuizQuestion';

export default QuizQuestion;
