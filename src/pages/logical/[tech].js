"use client";

import { useState } from "react";
import {
  Box,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Code2, Lightbulb, RefreshCw, Trophy, XCircle } from "lucide-react";
import { useUser } from "@/customHooks/useUser";
import { useLogicalQuiz } from "@/customHooks/useLogicalQuiz";
import LoaderTwo from "@/components/LoaderTwo";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import PremiumCard from "@/components/premium/PremiumCard";
import PremiumButton from "@/components/premium/PremiumButton";
import SectionHeader from "@/components/premium/SectionHeader";

const TechQuizPage = () => {
  const router = useRouter();
  const { tech } = router.query; // ✅ dynamic route
  const { user, loading } = useUser();
  const { questions, loadingQuiz, error } = useLogicalQuiz(user, tech);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [finalSubmitted, setFinalSubmitted] = useState(false);

  if (loading || loadingQuiz || !tech) return <LoaderTwo text="Preparing logical quiz..." />;
  if (!user) return null;

  if (!questions.length) {
    return (
      <Box sx={{ pb: 4 }}>
        <SectionHeader
          eyebrow="Logical Assessment"
          title={`${String(tech).toUpperCase()} Logic Practice`}
          description="AI will generate fresh logical questions for this skill."
          action={
            <PremiumButton onClick={() => router.reload()} startIcon={<RefreshCw size={16} />}>
              Retry
            </PremiumButton>
          }
        />
        <PremiumCard hover={false} sx={{ p: 3, textAlign: "center" }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
              borderRadius: "22px",
              display: "grid",
              placeItems: "center",
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.24)",
            }}
          >
            <AlertCircle size={30} color="#EF4444" />
          </Box>
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900, mb: 1 }}>
            AI logical questions are not available right now
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {error || "Please retry after a moment. The AI provider may be busy or rate-limited."}
          </Typography>
        </PremiumCard>
      </Box>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const correctCount = Object.values(submitted).filter((item) =>
    item?.feedback?.toLowerCase().includes("correct")
  ).length;

  const handleAnswerChange = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
  };

  const handleNext = () => {
    const userAnswer = answers[currentQ.id]?.trim() || "";
    const expectedOutput = currentQ.expectedOutput?.trim() || "";
    let feedback = "No answer provided.";

    if (userAnswer && expectedOutput && userAnswer.toLowerCase() === expectedOutput.toLowerCase()) {
      feedback = "Correct";
    } else if (userAnswer && expectedOutput) {
      feedback = `Wrong. Expected: ${currentQ.expectedOutput}`;
    }

    setSubmitted((prev) => ({
      ...prev,
      [currentQ.id]: { ...currentQ, userAnswer, feedback },
    }));

    if (currentIndex < questions.length - 1) setCurrentIndex((prev) => prev + 1);
    else setFinalSubmitted(true);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Box sx={{ pb: 4 }}>
      <SectionHeader
        eyebrow="Logical Assessment"
        title={`${String(tech).toUpperCase()} Logic Practice`}
        description="Solve short reasoning prompts, validate expected output, and improve interview thinking speed."
        action={
          <PremiumButton onClick={() => router.push("/interactiveLearningHub")} startIcon={<ArrowLeft size={16} />}>
            Hub
          </PremiumButton>
        }
      />

      {!finalSubmitted && currentQ && (
        <Grid container spacing={2.4}>
          <Grid item size={{ xs: 12, lg: 8 }}>
            <PremiumCard sx={{ p: { xs: 2.4, md: 3.2 } }} glow="rgba(6,182,212,0.22)">
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
                <Chip
                  label={`Q${currentIndex + 1} of ${questions.length}`}
                  sx={{
                    color: "#fff",
                    border: "1px solid rgba(6,182,212,0.35)",
                    bgcolor: "rgba(6,182,212,0.10)",
                    fontWeight: 800,
                  }}
                />
                <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                  {Math.round(progress)}% complete
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 9,
                  borderRadius: 999,
                  mb: 3,
                  bgcolor: "rgba(255,255,255,0.08)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
                  },
                }}
              />

              <Typography variant="h5" sx={{ color: "#fff", fontWeight: 950, mb: 1.4 }}>
                {currentQ.question}
              </Typography>
              {currentQ.input && (
                <Typography sx={{ color: "text.secondary", mb: 2 }}>
                  <strong>Input:</strong> {currentQ.input}
                </Typography>
              )}

              {String(tech).toLowerCase() === "javascript" ? (
                <LiveProvider
                  code={answers[currentQ.id] || ""}
                  noInline
                  transformCode={(code) => `(()=>{ try { return ${code} } catch(e) { return e.message }})()`}
                >
                  <Box
                    sx={{
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderRadius: "18px",
                      overflow: "hidden",
                      bgcolor: "rgba(2,6,23,0.74)",
                    }}
                  >
                    <LiveEditor
                      onChange={handleAnswerChange}
                      style={{
                        minHeight: 170,
                        padding: 18,
                        fontSize: 14,
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        background: "transparent",
                      }}
                    />
                  </Box>
                  <PremiumCard hover={false} sx={{ p: 2, mt: 2, borderRadius: "18px" }}>
                    <Typography sx={{ color: "#fff", fontWeight: 800, mb: 1 }}>
                      Live Output
                    </Typography>
                    <LiveError style={{ color: "#EF4444" }} />
                    <LivePreview
                      style={{
                        color: "#94A3B8",
                        minHeight: 34,
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                      }}
                    />
                  </PremiumCard>
                </LiveProvider>
              ) : (
                <TextareaAutosize
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  minRows={7}
                  placeholder="Write your answer here..."
                  style={{
                    width: "100%",
                    resize: "vertical",
                    padding: "18px",
                    borderRadius: "18px",
                    border: "1px solid rgba(255,255,255,0.10)",
                    outline: "none",
                    color: "#fff",
                    background: "rgba(2,6,23,0.74)",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    fontSize: 14,
                  }}
                />
              )}

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.4} mt={2.4}>
                <PremiumButton
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  startIcon={<ArrowLeft size={16} />}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.06)",
                    boxShadow: "none",
                  }}
                >
                  Previous
                </PremiumButton>
                <PremiumButton onClick={handleNext} endIcon={<ArrowRight size={16} />}>
                  {currentIndex < questions.length - 1 ? "Next Question" : "Submit Quiz"}
                </PremiumButton>
              </Stack>
            </PremiumCard>
          </Grid>

          <Grid item size={{ xs: 12, lg: 4 }}>
            <PremiumCard sx={{ p: 2.6, height: "100%" }} glow="rgba(124,58,237,0.18)">
              <Stack spacing={2}>
                <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
                  <Code2 size={22} color="#06B6D4" />
                  <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900 }}>
                    Practice Focus
                  </Typography>
                </Box>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Type the exact expected output or keyword. Answers are checked case-insensitively,
                  so focus on the concept first.
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "18px",
                    border: "1px solid rgba(245,158,11,0.18)",
                    bgcolor: "rgba(245,158,11,0.08)",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
                    <Lightbulb size={18} color="#F59E0B" />
                    <Typography sx={{ color: "#fff", fontWeight: 800 }}>Hint</Typography>
                  </Box>
                  <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                    Read the question once, predict the output mentally, then answer. This builds interview speed.
                  </Typography>
                </Box>
              </Stack>
            </PremiumCard>
          </Grid>
        </Grid>
      )}

      {finalSubmitted && (
        <Box>
          <PremiumCard sx={{ p: 3, mb: 2.4 }} glow="rgba(34,197,94,0.20)">
            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} justifyContent="space-between" spacing={2}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "20px",
                    display: "grid",
                    placeItems: "center",
                    background: "linear-gradient(135deg, #22C55E, #06B6D4)",
                  }}
                >
                  <Trophy size={27} color="#fff" />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ color: "#fff", fontWeight: 950 }}>
                    Results
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {correctCount} correct out of {questions.length}
                  </Typography>
                </Box>
              </Box>
              <PremiumButton onClick={() => {
                setCurrentIndex(0);
                setAnswers({});
                setSubmitted({});
                setFinalSubmitted(false);
              }}>
                Retake
              </PremiumButton>
            </Stack>
          </PremiumCard>

          {questions.map((q) => {
            const r = submitted[q.id];
            const isCorrect = r?.feedback?.toLowerCase().includes("correct");
            return (
              <PremiumCard
                key={q.id}
                hover={false}
                sx={{ p: 2.6, mb: 2 }}
                glow={isCorrect ? "rgba(34,197,94,0.14)" : "rgba(239,68,68,0.14)"}
              >
                <Stack direction="row" spacing={1.2} alignItems="flex-start" mb={1}>
                  {isCorrect ? <CheckCircle2 size={20} color="#22C55E" /> : <XCircle size={20} color="#EF4444" />}
                  <Typography sx={{ color: "#fff", fontWeight: 900 }}>{q.question}</Typography>
                </Stack>
                {q.input && <Typography sx={{ color: "text.secondary" }}>Input: {q.input}</Typography>}
                <Typography sx={{ color: "text.secondary", fontWeight: 800, mt: 1.4, mb: 0.8 }}>
                  Your Answer
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    m: 0,
                    p: 1.5,
                    borderRadius: "14px",
                    color: "#fff",
                    bgcolor: "rgba(2,6,23,0.72)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {r?.userAnswer || "Not answered"}
                </Box>
                <Typography sx={{ color: "text.secondary", mt: 1.2 }}>
                  Expected Output: <Box component="span" sx={{ color: "#fff", fontWeight: 800 }}>{q.expectedOutput}</Box>
                </Typography>
                <Typography sx={{ color: isCorrect ? "#22C55E" : "#EF4444", fontWeight: 900 }}>
                  {r?.feedback || ""}
                </Typography>
              </PremiumCard>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default TechQuizPage;
