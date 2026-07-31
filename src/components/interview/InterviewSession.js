"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flag,
  Lightbulb,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Volume2,
  VolumeX,
} from "lucide-react";
import PremiumButton from "@/components/premium/PremiumButton";
import PremiumCard from "@/components/premium/PremiumCard";
import VoiceInput from "./VoiceInput";

const MotionBox = motion(Box);

// ── Compute difficulty band from question number ──────────────────────────────
const getDifficulty = (qNum, maxQ) => {
  const easy = Math.ceil(maxQ / 3);
  const medium = Math.ceil((maxQ * 2) / 3);
  if (qNum <= easy) {
    const level = Math.max(1, Math.round((qNum / easy) * 3));
    return { label: "Easy", level, color: "#22C55E", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.35)" };
  }
  if (qNum <= medium) {
    const level = Math.round(3 + ((qNum - easy) / (medium - easy)) * 4);
    return { label: "Medium", level, color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)" };
  }
  const level = Math.round(7 + ((qNum - medium) / (maxQ - medium)) * 3);
  return { label: "Hard", level, color: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.35)" };
};

// ── Score badge ──────────────────────────────────────────────────────────────
const ScoreBadge = ({ label, score }) => {
  const color = score >= 8 ? "#22C55E" : score >= 6 ? "#F59E0B" : "#EF4444";
  return (
    <Box sx={{ textAlign: "center" }}>
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 0.4,
          color,
          fontWeight: 900,
          fontSize: "0.9rem",
        }}
      >
        {score}
      </Box>
      <Typography sx={{ color: "#64748B", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </Typography>
    </Box>
  );
};

// ── Elapsed timer ─────────────────────────────────────────────────────────────
const useTimer = (running) => {
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else {
      clearInterval(ref.current);
    }
    return () => clearInterval(ref.current);
  }, [running]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

export default function InterviewSession({ opening, config, userData, onComplete, onEnd }) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(opening.first_question);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [lastEvaluation, setLastEvaluation] = useState(null);
  const [idealAnswer, setIdealAnswer] = useState("");
  const [interviewerComment, setInterviewerComment] = useState("");
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([
    { role: "assistant", content: opening.opening_message },
    { role: "assistant", content: opening.first_question },
  ]);

  const timerDisplay = useTimer(true);
  const answerRef = useRef(null);
  const maxQ = config.maxQuestions || 10;
  const progress = Math.round((questionNumber / maxQ) * 100);

  // Speak each new question via Web Speech Synthesis
  useEffect(() => {
    if (!ttsEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(currentQuestion);
    utt.lang = "en-US";
    utt.rate = 0.92;
    window.speechSynthesis.speak(utt);
    return () => window.speechSynthesis.cancel();
  }, [currentQuestion, ttsEnabled]);

  // Voice appends to textarea
  const handleVoiceTranscript = useCallback((text) => {
    setAnswer((prev) => (prev ? `${prev} ${text}` : text));
  }, []);

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    setError("");

    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: answer },
    ];

    try {
      const res = await fetch("/api/mock-interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          conversationHistory: updatedHistory,
          answer,
          questionNumber,
          userData,  // full raw Strapi user — includes quizResult, skills, workExperiences, resume
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to evaluate answer");

      if (data.is_complete || !data.next_question) {
        setLastEvaluation(data.evaluation);
        setIdealAnswer(data.evaluation?.ideal_answer || "");
        // Pass conversation history to parent — report generated separately
        onComplete({ conversationHistory: updatedHistory });
        return;
      }

      // Update state for next question
      setLastEvaluation(data.evaluation);
      setIdealAnswer(data.evaluation?.ideal_answer || "");
      setInterviewerComment(data.interviewer_comment || "");
      setCurrentQuestion(data.next_question);
      setQuestionNumber(data.question_number + 1);
      setAnswer("");
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant", content: data.interviewer_comment || "" },
        { role: "assistant", content: data.next_question },
      ]);

      // Scroll answer box into view
      setTimeout(() => answerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* ── Header bar ── */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            icon={<BrainCircuit size={14} />}
            label={`Q ${questionNumber} / ${maxQ}`}
            sx={{ bgcolor: "rgba(124,58,237,0.15)", color: "#C4B5FD", fontWeight: 800 }}
          />
          {(() => {
            const diff = getDifficulty(questionNumber, maxQ);
            return (
              <Chip
                label={`Lv ${diff.level} · ${diff.label}`}
                sx={{
                  bgcolor: diff.bg,
                  color: diff.color,
                  border: `1px solid ${diff.border}`,
                  fontWeight: 800,
                  fontSize: "0.75rem",
                }}
              />
            );
          })()}
          <Chip
            icon={<Clock size={14} />}
            label={timerDisplay}
            sx={{ bgcolor: "rgba(6,182,212,0.10)", color: "#67E8F9", fontWeight: 800 }}
          />
          <Chip
            label={config.jobRole}
            sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "#94A3B8", fontWeight: 600 }}
          />
        </Stack>

        <PremiumButton
          onClick={() => {
            window.speechSynthesis?.cancel();
            onEnd({ conversationHistory });
          }}
          startIcon={<Flag size={15} />}
          sx={{
            background: "linear-gradient(135deg, rgba(239,68,68,0.8), rgba(220,38,38,0.7))",
            py: 0.7,
            fontSize: "0.8rem",
            minWidth: 140,
          }}
        >
          End Interview
        </PremiumButton>
      </Stack>

      {/* ── Progress bar ── */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          mb: 2.5,
          height: 6,
          borderRadius: 999,
          bgcolor: "rgba(255,255,255,0.06)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
          },
        }}
      />

      <Grid container spacing={2.4}>
        {/* ── Main: Question + Answer ── */}
        <Grid item xs={12} lg={7}>
          <Stack spacing={2.4}>
            {/* Interviewer comment after previous answer */}
            <AnimatePresence mode="wait">
              {interviewerComment && (
                <MotionBox
                  key={interviewerComment}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PremiumCard
                    hover={false}
                    sx={{
                      p: 2,
                      background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(15,23,42,0.85))",
                      border: "1px solid rgba(6,182,212,0.2)",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <MessageSquare size={16} color="#67E8F9" style={{ marginTop: 2, flexShrink: 0 }} />
                      <Typography sx={{ color: "#CBD5E1", fontSize: "0.88rem", lineHeight: 1.65, fontStyle: "italic" }}>
                        {interviewerComment}
                      </Typography>
                    </Stack>
                  </PremiumCard>
                </MotionBox>
              )}
            </AnimatePresence>

            {/* Current Question Card */}
            <AnimatePresence mode="wait">
              <MotionBox
                key={currentQuestion}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.38 }}
              >
                <PremiumCard
                  hover={false}
                  glow="rgba(124,58,237,0.2)"
                  sx={{
                    p: { xs: 2.4, md: 3 },
                    background:
                      "linear-gradient(135deg, rgba(15,23,42,0.90), rgba(3,7,18,0.82)), radial-gradient(circle at 90% 10%, rgba(124,58,237,0.20), transparent 40%)",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 900,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        Q{questionNumber}
                      </Box>
                      <Typography sx={{ color: "#7C3AED", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Interviewer
                      </Typography>
                    </Stack>
                    {/* TTS toggle */}
                    <Box
                      onClick={() => {
                        setTtsEnabled((v) => {
                          if (v) window.speechSynthesis?.cancel();
                          return !v;
                        });
                      }}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.6,
                        px: 1.2,
                        py: 0.5,
                        borderRadius: "8px",
                        border: ttsEnabled ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.08)",
                        cursor: "pointer",
                        opacity: 0.8,
                        "&:hover": { opacity: 1 },
                        transition: "all 0.2s",
                      }}
                    >
                      {ttsEnabled
                        ? <Volume2 size={13} color="#A78BFA" />
                        : <VolumeX size={13} color="#475569" />}
                      <Typography sx={{ fontSize: "0.7rem", color: ttsEnabled ? "#A78BFA" : "#475569", fontWeight: 700 }}>
                        {ttsEnabled ? "Voice On" : "Voice Off"}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: { xs: "1.05rem", md: "1.2rem" },
                      fontWeight: 700,
                      lineHeight: 1.55,
                      color: "#E2E8F0",
                    }}
                  >
                    {currentQuestion}
                  </Typography>
                </PremiumCard>
              </MotionBox>
            </AnimatePresence>

            {/* Answer input */}
            <PremiumCard hover={false} sx={{ p: { xs: 2, md: 2.4 } }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.2 }}>
                <Typography sx={{ color: "#94A3B8", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  Your Answer
                </Typography>
                <VoiceInput onTranscript={handleVoiceTranscript} disabled={loading} />
              </Stack>

              <TextField
                ref={answerRef}
                multiline
                minRows={5}
                maxRows={12}
                fullWidth
                placeholder="Type your answer here, or use voice input above..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(255,255,255,0.03)",
                    color: "#E2E8F0",
                    borderRadius: "14px",
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                    "& fieldset": { borderColor: "rgba(255,255,255,0.10)" },
                    "&:hover fieldset": { borderColor: "rgba(124,58,237,0.4)" },
                    "&.Mui-focused fieldset": { borderColor: "#7C3AED" },
                  },
                  "& textarea::placeholder": { color: "#475569" },
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 1.5, borderRadius: "12px" }}>{error}</Alert>
              )}

              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1.5 }}>
                <Typography sx={{ color: "#475569", fontSize: "0.75rem" }}>
                  {answer.length} characters
                </Typography>
                <PremiumButton
                  onClick={submitAnswer}
                  disabled={loading || !answer.trim()}
                  endIcon={
                    loading
                      ? <CircularProgress size={15} sx={{ color: "#fff" }} />
                      : <ChevronRight size={17} />
                  }
                  sx={{ minWidth: 180 }}
                >
                  {loading ? "Evaluating..." : questionNumber < maxQ ? "Submit & Next" : "Submit & Finish"}
                </PremiumButton>
              </Stack>
            </PremiumCard>
          </Stack>
        </Grid>

        {/* ── Sidebar: Live Evaluation ── */}
        <Grid item xs={12} lg={5}>
          <Stack spacing={2.4}>
            <PremiumCard hover={false} sx={{ p: 2.4 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <TrendingUp size={17} color="#7C3AED" />
                <Typography sx={{ fontWeight: 900, fontSize: "0.9rem" }}>Live Evaluation</Typography>
              </Stack>

              <AnimatePresence mode="wait">
                {lastEvaluation ? (
                  <MotionBox
                    key="eval"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Score grid */}
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      {[
                        { label: "Technical", score: lastEvaluation.technical_accuracy },
                        { label: "Comm.", score: lastEvaluation.communication },
                        { label: "Problem\nSolving", score: lastEvaluation.problem_solving },
                        { label: "Confidence", score: lastEvaluation.confidence },
                        { label: "Complete.", score: lastEvaluation.completeness },
                      ].map(({ label, score }) => (
                        <Grid item xs={4} key={label}>
                          <ScoreBadge label={label} score={score} />
                        </Grid>
                      ))}
                    </Grid>

                    <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", mb: 1.5 }} />

                    {/* Strengths */}
                    {Array.isArray(lastEvaluation.strengths) && lastEvaluation.strengths.length > 0 && (
                      <Box sx={{ mb: 1.5 }}>
                        <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.6 }}>
                          <CheckCircle2 size={14} color="#22C55E" />
                          <Typography sx={{ color: "#22C55E", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase" }}>
                            Strengths
                          </Typography>
                        </Stack>
                        {lastEvaluation.strengths.map((s, i) => (
                          <Typography key={i} sx={{ color: "#CBD5E1", fontSize: "0.82rem", lineHeight: 1.5, pl: 1.8, mb: 0.3 }}>
                            • {s}
                          </Typography>
                        ))}
                      </Box>
                    )}

                    {/* Weaknesses */}
                    {Array.isArray(lastEvaluation.weaknesses) && lastEvaluation.weaknesses.length > 0 && (
                      <Box sx={{ mb: 1.5 }}>
                        <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.6 }}>
                          <AlertTriangle size={14} color="#F59E0B" />
                          <Typography sx={{ color: "#F59E0B", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase" }}>
                            Areas to Improve
                          </Typography>
                        </Stack>
                        {lastEvaluation.weaknesses.map((w, i) => (
                          <Typography key={i} sx={{ color: "#CBD5E1", fontSize: "0.82rem", lineHeight: 1.5, pl: 1.8, mb: 0.3 }}>
                            • {w}
                          </Typography>
                        ))}
                      </Box>
                    )}

                    {/* Suggestions */}
                    {Array.isArray(lastEvaluation.suggestions) && lastEvaluation.suggestions.length > 0 && (
                      <Box>
                        <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.6 }}>
                          <Lightbulb size={14} color="#7C3AED" />
                          <Typography sx={{ color: "#A78BFA", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase" }}>
                            Suggestions
                          </Typography>
                        </Stack>
                        {lastEvaluation.suggestions.map((s, i) => (
                          <Typography key={i} sx={{ color: "#CBD5E1", fontSize: "0.82rem", lineHeight: 1.5, pl: 1.8, mb: 0.3 }}>
                            • {s}
                          </Typography>
                        ))}
                      </Box>
                    )}

                    {/* Ideal answer hint */}
                    {idealAnswer && (
                      <Box
                        sx={{
                          mt: 1.5,
                          p: 1.6,
                          borderRadius: "12px",
                          border: "1px solid rgba(245,158,11,0.25)",
                          bgcolor: "rgba(245,158,11,0.06)",
                        }}
                      >
                        <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.7 }}>
                          <Sparkles size={13} color="#F59E0B" />
                          <Typography sx={{ color: "#F59E0B", fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            Model Answer
                          </Typography>
                        </Stack>
                        <Typography sx={{ color: "#CBD5E1", fontSize: "0.81rem", lineHeight: 1.65 }}>
                          {idealAnswer}
                        </Typography>
                      </Box>
                    )}
                  </MotionBox>
                ) : (
                  <MotionBox key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Typography sx={{ color: "#475569", fontSize: "0.84rem", lineHeight: 1.7 }}>
                      Your answer evaluation will appear here after you submit each response. Scores cover technical accuracy, communication, problem solving, confidence, and completeness.
                    </Typography>
                  </MotionBox>
                )}
              </AnimatePresence>
            </PremiumCard>

            {/* Opening message card */}
            <PremiumCard hover={false} sx={{ p: 2 }}>
              <Typography sx={{ color: "#475569", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", mb: 0.8 }}>
                Interview Introduction
              </Typography>
              <Typography sx={{ color: "#64748B", fontSize: "0.8rem", lineHeight: 1.65 }}>
                {opening.opening_message}
              </Typography>
            </PremiumCard>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
