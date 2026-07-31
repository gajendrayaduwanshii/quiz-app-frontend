"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  BookOpen,
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Mic,
  Sparkles,
  TrendingDown,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import PremiumButton from "@/components/premium/PremiumButton";
import PremiumCard from "@/components/premium/PremiumCard";
import SectionHeader from "@/components/premium/SectionHeader";

const MotionBox = motion(Box);

// ── Derive experience level label from years ──────────────────────────────────
const getExperienceLabel = (years) => {
  if (!years || years === 0) return "Fresher";
  if (years <= 3) return "1–3 Years";
  if (years <= 5) return "3–5 Years";
  return "5+ Years";
};

// ── Extract quiz weak areas (questions answered incorrectly) ──────────────────
const extractWeakAreas = (quizResults = []) => {
  const weakTopics = new Set();
  const wrongQuestions = [];

  quizResults.forEach((quiz) => {
    const tech = quiz.technology || quiz.tech || quiz.name || "";
    const questions = quiz.quizQuestion || [];

    let correct = 0;
    questions.forEach((q) => {
      if (q.answer?.trim() !== q.correctAnswer?.trim()) {
        wrongQuestions.push({ tech, question: q.question });
      } else {
        correct++;
      }
    });

    const total = questions.length;
    const score = total ? Math.round((correct / total) * 100) : 0;
    if (score < 60 && tech) weakTopics.add(tech);
  });

  return { weakTopics: [...weakTopics], wrongQuestions: wrongQuestions.slice(0, 10) };
};

// ── Extract skills with level from Strapi skill objects ───────────────────────
const extractSkills = (skills = []) =>
  skills
    .map((s) => {
      if (!s) return null;
      if (typeof s === "string") return { name: s, level: "" };
      const name = (s.skillName || s.name || s.skill || s.title || "").trim();
      if (!name) return null;
      const level = (s.level || s.proficiency || "").trim();
      return { name, level };
    })
    .filter(Boolean)
    .slice(0, 12);

// ── Detect job role from user profile ────────────────────────────────────────
const detectRole = (user) => {
  if (user?.workExperiences?.length) {
    const latest = user.workExperiences[0];
    return latest?.role || latest?.position || latest?.title || "";
  }
  return user?.currentRole || user?.role || "";
};

export default function InterviewSetup({ onStart, user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const skills = extractSkills(user?.skills);
  const quizResults = user?.quizResult || [];
  const { weakTopics, wrongQuestions } = extractWeakAreas(quizResults);
  const years = Number(user?.yearsExperience) || 0;
  const experienceLabel = getExperienceLabel(years);
  const detectedRole = detectRole(user);
  const hasResume = !!user?.uploadResume;
  const name = user?.Name || user?.name || user?.username || "You";

  // Quiz topic performance summary
  const quizTopics = quizResults.map((q) => {
    const questions = q.quizQuestion || [];
    const correct = questions.filter((qq) => qq.answer?.trim() === qq.correctAnswer?.trim()).length;
    const total = questions.length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    return { tech: q.technology || q.tech || q.name || "Unknown", pct };
  }).filter((t) => t.tech !== "Unknown");

  const handleStart = async () => {
    setLoading(true);
    setError("");

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s max

      const res = await fetch("/api/mock-interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData: user }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");

      onStart({
        config: data.config,
        opening: {
          opening_message: data.opening_message,
          first_question: data.first_question,
          question_number: 1,
        },
      });
    } catch (err) {
      const msg = err.name === "AbortError"
        ? "Request timed out. Please try again."
        : err.message || "Failed to start the interview. Please try again.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <SectionHeader
        eyebrow="Mock Interview"
        title={`Ready, ${name}?`}
        description={`30 questions · 45 minutes · Easy → Medium → Hard. Questions cover all your skills in ascending difficulty.`}
        action={
          <Chip
            icon={<Sparkles size={14} />}
            label="AI Powered"
            sx={{ color: "#CFFAFE", bgcolor: "rgba(6,182,212,0.12)", border: "1px solid rgba(103,232,249,0.22)", fontWeight: 800 }}
          />
        }
      />

      <Grid container spacing={2.4}>
        {/* ── Profile snapshot card ── */}
        <Grid item xs={12} md={6}>
          <PremiumCard
            hover={false}
            sx={{ p: 2.4, background: "linear-gradient(135deg, rgba(15,23,42,0.90), rgba(3,7,18,0.82))", height: "100%" }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <User size={16} color="#7C3AED" />
              <Typography sx={{ fontWeight: 900, fontSize: "0.82rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Your Profile
              </Typography>
            </Stack>

            <Stack spacing={1.4}>
              {/* Name */}
              <Box>
                <Typography sx={{ color: "#475569", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", mb: 0.3 }}>Name</Typography>
                <Typography sx={{ color: "#E2E8F0", fontWeight: 700 }}>{name}</Typography>
              </Box>

              {/* Role */}
              {detectedRole && (
                <Box>
                  <Typography sx={{ color: "#475569", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", mb: 0.3 }}>Current Role</Typography>
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <Briefcase size={13} color="#7C3AED" />
                    <Typography sx={{ color: "#E2E8F0", fontWeight: 600 }}>{detectedRole}</Typography>
                  </Stack>
                </Box>
              )}

              {/* Experience */}
              <Box>
                <Typography sx={{ color: "#475569", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", mb: 0.3 }}>Experience</Typography>
                <Stack direction="row" spacing={0.8} alignItems="center">
                  <Briefcase size={13} color="#06B6D4" />
                  <Typography sx={{ color: "#E2E8F0", fontWeight: 600 }}>{experienceLabel}</Typography>
                </Stack>
              </Box>

              {/* Skills */}
              {skills.length > 0 && (
                <Box>
                  <Typography sx={{ color: "#475569", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", mb: 0.6 }}>Skills</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.6}>
                    {skills.map(({ name: sn, level }) => (
                      <Chip
                        key={sn}
                        label={level ? `${sn} · ${level}` : sn}
                        size="small"
                        sx={{ bgcolor: "rgba(124,58,237,0.14)", color: "#C4B5FD", fontSize: "0.72rem", border: "1px solid rgba(124,58,237,0.22)" }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Resume */}
              <Box>
                <Typography sx={{ color: "#475569", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", mb: 0.3 }}>Resume</Typography>
                <Stack direction="row" spacing={0.8} alignItems="center">
                  {hasResume ? (
                    <>
                      <CheckCircle2 size={13} color="#22C55E" />
                      <Typography sx={{ color: "#22C55E", fontWeight: 600, fontSize: "0.85rem" }}>Uploaded — will be used for personalization</Typography>
                    </>
                  ) : (
                    <>
                      <BookOpen size={13} color="#475569" />
                      <Typography sx={{ color: "#475569", fontSize: "0.85rem" }}>No resume — questions based on your profile & skills</Typography>
                    </>
                  )}
                </Stack>
              </Box>

              {/* Education */}
              {user?.educations?.length > 0 && (
                <Box>
                  <Typography sx={{ color: "#475569", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", mb: 0.3 }}>Education</Typography>
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <GraduationCap size={13} color="#F59E0B" />
                    <Typography sx={{ color: "#E2E8F0", fontSize: "0.85rem" }}>
                      {user.educations[0]?.degree || ""} {user.educations[0]?.fieldOfStudy || user.educations[0]?.field || ""} — {user.educations[0]?.institution || user.educations[0]?.school || ""}
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Stack>
          </PremiumCard>
        </Grid>

        {/* ── Quiz performance card ── */}
        <Grid item xs={12} md={6}>
          <PremiumCard
            hover={false}
            sx={{ p: 2.4, background: "linear-gradient(135deg, rgba(15,23,42,0.90), rgba(3,7,18,0.82))", height: "100%" }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <BrainCircuit size={16} color="#06B6D4" />
              <Typography sx={{ fontWeight: 900, fontSize: "0.82rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Quiz Performance
              </Typography>
            </Stack>

            {quizTopics.length > 0 ? (
              <Stack spacing={1.2}>
                {quizTopics.slice(0, 6).map(({ tech, pct }) => {
                  const color = pct >= 80 ? "#22C55E" : pct >= 60 ? "#F59E0B" : "#EF4444";
                  return (
                    <Box key={tech}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.3 }}>
                        <Typography sx={{ color: "#CBD5E1", fontSize: "0.82rem", fontWeight: 600 }}>{tech}</Typography>
                        <Typography sx={{ color, fontSize: "0.82rem", fontWeight: 800 }}>{pct}%</Typography>
                      </Stack>
                      <Box sx={{ height: 5, borderRadius: 999, bgcolor: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        <Box sx={{ height: "100%", width: `${pct}%`, borderRadius: 999, bgcolor: color, transition: "width 0.6s ease" }} />
                      </Box>
                    </Box>
                  );
                })}

                {weakTopics.length > 0 && (
                  <>
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", my: 0.5 }} />
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <TrendingDown size={14} color="#EF4444" />
                      <Typography sx={{ color: "#EF4444", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Weak Areas — AI will focus here
                      </Typography>
                    </Stack>
                    <Stack direction="row" flexWrap="wrap" gap={0.6}>
                      {weakTopics.map((t) => (
                        <Chip key={t} label={t} size="small" sx={{ bgcolor: "rgba(239,68,68,0.1)", color: "#FCA5A5", fontSize: "0.72rem", border: "1px solid rgba(239,68,68,0.2)" }} />
                      ))}
                    </Stack>
                  </>
                )}
              </Stack>
            ) : (
              <Typography sx={{ color: "#475569", fontSize: "0.84rem", lineHeight: 1.7 }}>
                No quiz history found. The AI will generate questions based on your profile, skills, and role.
              </Typography>
            )}
          </PremiumCard>
        </Grid>

        {/* ── What the AI will do ── */}
        <Grid item xs={12}>
          <PremiumCard
            hover={false}
            sx={{
              p: 2.4,
              background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05))",
              border: "1px solid rgba(124,58,237,0.18)",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <Sparkles size={16} color="#7C3AED" />
              <Typography sx={{ fontWeight: 900, fontSize: "0.85rem", color: "#C4B5FD" }}>How AI Will Personalize Your Interview</Typography>
            </Stack>
            <Grid container spacing={1.5}>
              {[
                {
                  point: `30 Questions · 45 Minutes`,
                  detail: "Full-length interview covering your entire skill set",
                },
                {
                  point: "Easy → Medium → Hard",
                  detail: "Q1–10 easy (Lv 1–3), Q11–20 medium (Lv 4–7), Q21–30 hard (Lv 8–10)",
                },
                skills.length > 0 && {
                  point: `Skills: ${skills.slice(0, 3).map((s) => s.name).join(", ")}${skills.length > 3 ? ` +${skills.length - 3} more` : ""}`,
                  detail: "Questions distributed evenly across all your technologies based on your skill level",
                },
                {
                  point: `Level: ${experienceLabel}`,
                  detail: "Question depth calibrated to your experience",
                },
                hasResume && {
                  point: "Resume: Project-specific questions",
                  detail: "AI will ask about your actual projects, tech stack, and achievements",
                },
              ]
                .filter(Boolean)
                .map(({ point, detail }) => (
                  <Grid item xs={12} sm={6} key={point}>
                    <Stack direction="row" spacing={1}>
                      <CheckCircle2 size={15} color="#22C55E" style={{ marginTop: 2, flexShrink: 0 }} />
                      <Box>
                        <Typography sx={{ color: "#E2E8F0", fontSize: "0.84rem", fontWeight: 700 }}>{point}</Typography>
                        <Typography sx={{ color: "#64748B", fontSize: "0.78rem", mt: 0.2 }}>{detail}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                ))}
            </Grid>
          </PremiumCard>
        </Grid>

        {/* ── Error ── */}
        {error && (
          <Grid item xs={12}>
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ borderRadius: "14px" }}
            >
              {error}
            </Alert>
          </Grid>
        )}

        {/* ── Start Button ── */}
        <Grid item xs={12}>
          <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <PremiumButton
              onClick={handleStart}
              disabled={loading}
              startIcon={
                loading
                  ? <CircularProgress size={17} sx={{ color: "#fff" }} />
                  : <Mic size={19} />
              }
              sx={{ minWidth: 280, py: 1.6, fontSize: "1.05rem", fontWeight: 800 }}
            >
              {loading ? "Preparing Your Interview..." : "Start My Interview"}
            </PremiumButton>
          </MotionBox>
        </Grid>
      </Grid>
    </Box>
  );
}
