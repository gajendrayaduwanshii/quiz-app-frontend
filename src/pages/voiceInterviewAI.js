"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Chip, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, CheckCircle2, Mic, MicOff, Play, Sparkles, Waves } from "lucide-react";
import PremiumButton from "@/components/premium/PremiumButton";
import PremiumCard from "@/components/premium/PremiumCard";
import PremiumPage from "@/components/premium/PremiumPage";
import SectionHeader from "@/components/premium/SectionHeader";

const fallbackQuestions = [
  { id: 1, question: "Tell me about a technical challenge you solved recently." },
  { id: 2, question: "How do you debug a performance issue in a React application?" },
  { id: 3, question: "Explain how you would prioritize work in a fast-moving product team." },
];

const VoiceInterviewAI = ({ user, tech }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [allResponses, setAllResponses] = useState([]);
  const [processing, setProcessing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    async function fetchQuestions() {
      if (!user || !tech) {
        setQuestions(fallbackQuestions);
        return;
      }

      try {
        const res = await fetch("/api/fetch-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, tech }),
        });

        const data = await res.json();
        setQuestions(data.questions?.length ? data.questions : fallbackQuestions);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setQuestions(fallbackQuestions);
      }
    }

    fetchQuestions();
  }, [user, tech]);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.start();
      setRecording(true);
      setTranscript("");
      setFeedback("");
      setAudioURL("");
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Cannot access microphone");
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const playbackUrl = URL.createObjectURL(blob);
      setAudioURL(playbackUrl);
      setProcessing(true);

      try {
        const arrayBuffer = await blob.arrayBuffer();
        const res = await fetch("/api/transcribe", { method: "POST", body: arrayBuffer });
        const data = await res.json();
        const answerText = data.text || "";
        setTranscript(answerText);

        const feedbackRes = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: currentQuestion.question,
            answer: answerText,
          }),
        });
        const feedbackData = await feedbackRes.json();
        const aiFeedback = feedbackData.feedback || "";
        setFeedback(aiFeedback);

        setAllResponses((prev) => [
          ...prev,
          {
            question: currentQuestion.question,
            transcript: answerText,
            feedback: aiFeedback,
            audioURL: playbackUrl,
          },
        ]);
      } catch (err) {
        console.error("Error processing audio:", err);
        alert("Error processing audio");
      } finally {
        setProcessing(false);
      }
    };

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream?.getTracks?.().forEach((track) => track.stop());
    setRecording(false);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTranscript("");
      setFeedback("");
      setAudioURL("");
    }
  };

  const waveformBars = useMemo(() => Array.from({ length: 42 }, (_, index) => index), []);

  if (!questions.length) {
    return <PremiumPage><PremiumCard sx={{ p: 3 }}>Loading interview questions...</PremiumCard></PremiumPage>;
  }

  return (
    <PremiumPage>
      <SectionHeader
        eyebrow="Voice Interview AI"
        title="Realtime Interview Studio"
        description="Practice spoken answers with transcription, AI evaluation, and polished response history."
        action={<Chip icon={<Sparkles size={15} />} label="AI interviewer online" sx={{ color: "#CFFAFE", bgcolor: "rgba(6,182,212,0.12)", border: "1px solid rgba(103,232,249,0.22)", fontWeight: 900 }} />}
      />

      <Grid container spacing={2.4}>
        <Grid item size={{ xs: 12, lg: 7 }}>
          <PremiumCard
            hover={false}
            glow={recording ? "rgba(34,197,94,0.24)" : "rgba(124,58,237,0.18)"}
            sx={{
              p: { xs: 2.4, md: 3.2 },
              minHeight: 520,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.88), rgba(3,7,18,0.80)), radial-gradient(circle at 86% 8%, rgba(6,182,212,0.18), transparent 32%)",
            }}
          >
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Chip label={`Question ${currentIndex + 1}/${questions.length}`} />
                <Chip label={`${progress}% complete`} sx={{ color: "#CFFAFE", bgcolor: "rgba(6,182,212,0.12)" }} />
              </Stack>
              <Typography variant="h3" className="gradient-text" sx={{ fontWeight: 950, lineHeight: 1.08, mb: 2 }}>
                {currentQuestion.question}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 9,
                  borderRadius: 999,
                  bgcolor: "rgba(255,255,255,0.08)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
                  },
                }}
              />
            </Box>

            <Box sx={{ my: 4, p: 2.2, borderRadius: "24px", border: "1px solid rgba(255,255,255,0.10)", bgcolor: "rgba(255,255,255,0.035)" }}>
              <Stack direction="row" spacing={0.6} alignItems="center" justifyContent="center" sx={{ height: 120 }}>
                {waveformBars.map((bar) => (
                  <Box
                    component={motion.div}
                    key={bar}
                    animate={{
                      height: recording ? [18, 76 - (bar % 7) * 5, 28 + (bar % 5) * 8] : 18 + (bar % 6) * 4,
                      opacity: recording ? [0.45, 1, 0.6] : 0.32,
                    }}
                    transition={{ repeat: Infinity, duration: 1.2 + (bar % 5) * 0.12, ease: "easeInOut" }}
                    sx={{
                      width: 5,
                      borderRadius: 999,
                      background: recording
                        ? "linear-gradient(180deg, #22C55E, #06B6D4)"
                        : "linear-gradient(180deg, rgba(124,58,237,0.7), rgba(6,182,212,0.35))",
                    }}
                  />
                ))}
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} alignItems="center" justifyContent="center">
                <PremiumButton
                  onClick={recording ? stopRecording : startRecording}
                  startIcon={recording ? <MicOff size={18} /> : <Mic size={18} />}
                  sx={{
                    minWidth: 190,
                    background: recording
                      ? "linear-gradient(135deg, #EF4444, #F59E0B)"
                      : "linear-gradient(135deg, #7C3AED, #06B6D4)",
                  }}
                >
                  {recording ? "Stop Recording" : "Start Recording"}
                </PremiumButton>
                {audioURL && (
                  <Box component="audio" src={audioURL} controls sx={{ maxWidth: { xs: "100%", sm: 260 } }} />
                )}
              </Stack>
            </Box>

            <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap>
              <Chip icon={<Waves size={15} />} label={recording ? "Listening" : processing ? "Processing" : "Ready"} />
              <Chip icon={<BrainCircuit size={15} />} label="AI evaluation" />
              {feedback && currentIndex < questions.length - 1 && (
                <PremiumButton onClick={handleNext} endIcon={<Play size={16} />} sx={{ py: 0.7 }}>
                  Next Question
                </PremiumButton>
              )}
            </Stack>
          </PremiumCard>
        </Grid>

        <Grid item size={{ xs: 12, lg: 5 }}>
          <Stack spacing={2.4}>
            <PremiumCard hover={false} sx={{ p: 2.4, minHeight: 220 }}>
              <Typography sx={{ fontWeight: 950, mb: 1 }}>Realtime Transcript</Typography>
              <AnimatePresence mode="wait">
                <Typography
                  component={motion.p}
                  key={transcript || processing || "empty"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  sx={{ color: "text.secondary", lineHeight: 1.75, whiteSpace: "pre-wrap" }}
                >
                  {processing ? "Transcribing and evaluating your answer..." : transcript || "Your spoken answer will appear here after recording."}
                </Typography>
              </AnimatePresence>
            </PremiumCard>

            <PremiumCard hover={false} glow="rgba(34,197,94,0.14)" sx={{ p: 2.4, minHeight: 260 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <CheckCircle2 size={19} color="#22C55E" />
                <Typography sx={{ fontWeight: 950 }}>AI Evaluation</Typography>
              </Stack>
              <Typography sx={{ color: "text.secondary", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                {feedback || "Feedback will include clarity, structure, technical depth, and improvement suggestions."}
              </Typography>
            </PremiumCard>
          </Stack>
        </Grid>

        <Grid item size={{ xs: 12 }}>
          <PremiumCard hover={false} sx={{ p: 2.4 }}>
            <Typography sx={{ fontWeight: 950, mb: 1.4 }}>Response History</Typography>
            <Grid container spacing={1.4}>
              {allResponses.length ? allResponses.map((response, index) => (
                <Grid item size={{ xs: 12, md: 6 }} key={`${response.question}-${index}`}>
                  <Box sx={{ p: 1.6, borderRadius: "18px", border: "1px solid rgba(255,255,255,0.08)", bgcolor: "rgba(255,255,255,0.035)" }}>
                    <Typography sx={{ fontWeight: 900, mb: 0.6 }}>Q{index + 1}: {response.question}</Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: 13, mb: 1 }}>{response.transcript}</Typography>
                    <Typography sx={{ color: "#CFFAFE", fontSize: 13 }}>{response.feedback}</Typography>
                  </Box>
                </Grid>
              )) : (
                <Grid item size={{ xs: 12 }}>
                  <Typography sx={{ color: "text.secondary" }}>Complete a recording to build your interview history.</Typography>
                </Grid>
              )}
            </Grid>
          </PremiumCard>
        </Grid>
      </Grid>
    </PremiumPage>
  );
};

export default VoiceInterviewAI;
