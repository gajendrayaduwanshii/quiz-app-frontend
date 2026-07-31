"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Lightbulb,
  MessageSquare,
  MonitorPlay,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import PremiumPage from "@/components/premium/PremiumPage";
import PremiumCard from "@/components/premium/PremiumCard";
import PremiumButton from "@/components/premium/PremiumButton";
import SectionHeader from "@/components/premium/SectionHeader";
import LoaderTwo from "@/components/LoaderTwo";
import { authService } from "@/services/authService";

const MotionBox = motion(Box);

// ── Constants ─────────────────────────────────────────────────────────────────
const TYPE_LABEL = {
  hr: "HR / Cultural Fit",
  technical: "Technical",
  behavioral: "Behavioral",
  managerial: "Managerial",
  custom: "Custom",
};

const LEVEL_LABEL = {
  fresher: "Fresher",
  "1-3": "1–3 Yrs",
  "3-5": "3–5 Yrs",
  "5+": "5+ Yrs",
};

const HIRING_COLORS = {
  "Strong Hire": { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.4)", text: "#22C55E" },
  Hire: { bg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.4)", text: "#06B6D4" },
  Borderline: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.4)", text: "#F59E0B" },
  "No Hire": { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.4)", text: "#EF4444" },
};

// ── Score ring SVG ─────────────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 72, label, color = "#7C3AED" }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = ((score || 0) / 10) * circ;
  return (
    <Box sx={{ textAlign: "center" }}>
      <Box sx={{ position: "relative", display: "inline-block", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={7} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={7}
            strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
        </svg>
        <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Typography sx={{ fontWeight: 900, fontSize: size > 65 ? "1.15rem" : "0.88rem", color, lineHeight: 1 }}>
            {score ?? "—"}
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: "0.55rem", lineHeight: 1 }}>/10</Typography>
        </Box>
      </Box>
      {label && (
        <Typography sx={{ color: "#94A3B8", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", mt: 0.5 }}>
          {label}
        </Typography>
      )}
    </Box>
  );
};

// ── Hiring badge ──────────────────────────────────────────────────────────────
const HiringBadge = ({ rec, small }) => {
  const c = HIRING_COLORS[rec] || HIRING_COLORS["Borderline"];
  return (
    <Box sx={{
      display: "inline-flex", alignItems: "center", gap: 0.6,
      px: small ? 1.2 : 1.8, py: small ? 0.4 : 0.7, borderRadius: "10px",
      border: `1px solid ${c.border}`, bgcolor: c.bg,
    }}>
      <Award size={small ? 12 : 15} color={c.text} />
      <Typography sx={{ fontWeight: 800, fontSize: small ? "0.72rem" : "0.85rem", color: c.text }}>
        {rec || "—"}
      </Typography>
    </Box>
  );
};

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color = "#7C3AED" }) => (
  <PremiumCard hover={false} sx={{ p: 2.4, height: "100%" }}>
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box sx={{
        width: 44, height: 44, borderRadius: "14px", flexShrink: 0,
        background: `linear-gradient(135deg, ${color}30, ${color}10)`,
        border: `1px solid ${color}40`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ color: "#64748B", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
        </Typography>
        <Typography sx={{ color: "#E2E8F0", fontWeight: 900, fontSize: "1.5rem", lineHeight: 1.1 }}>
          {value}
        </Typography>
        {sub && (
          <Typography sx={{ color: "#475569", fontSize: "0.72rem", mt: 0.2 }}>{sub}</Typography>
        )}
      </Box>
    </Stack>
  </PremiumCard>
);

// ── Custom recharts tooltip ───────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: "rgba(15,23,42,0.95)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "10px", px: 1.8, py: 1.2 }}>
      <Typography sx={{ color: "#94A3B8", fontSize: "0.72rem", mb: 0.3 }}>{label}</Typography>
      <Typography sx={{ color: "#C4B5FD", fontWeight: 800, fontSize: "1rem" }}>
        {payload[0].value} / 10
      </Typography>
    </Box>
  );
};

// ── Interview accordion item ──────────────────────────────────────────────────
const InterviewItem = ({ interview, index, total }) => {
  const { config, report, date } = interview;
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";
  const time = date
    ? new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "";

  const overallColor =
    (report?.overall_score || 0) >= 8 ? "#22C55E"
    : (report?.overall_score || 0) >= 6 ? "#F59E0B"
    : "#EF4444";

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        bgcolor: "transparent",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px !important",
        mb: 1.5,
        overflow: "hidden",
        "&:before": { display: "none" },
        "&.Mui-expanded": { border: "1px solid rgba(124,58,237,0.3)" },
      }}
    >
      {/* ── Summary (collapsed) ── */}
      <AccordionSummary
        expandIcon={<ChevronDown size={18} color="#64748B" />}
        sx={{
          px: 2.4, py: 1.2, minHeight: 72,
          background: "linear-gradient(135deg, rgba(15,23,42,0.90), rgba(3,7,18,0.80))",
          "&.Mui-expanded": { background: "linear-gradient(135deg, rgba(124,58,237,0.10), rgba(15,23,42,0.92))" },
          "& .MuiAccordionSummary-content": { alignItems: "center", gap: 2, my: 0 },
        }}
      >
        {/* Interview number */}
        <Box sx={{
          width: 36, height: 36, borderRadius: "10px", flexShrink: 0,
          background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.78rem", fontWeight: 900, color: "#fff",
        }}>
          #{total - index}
        </Box>

        {/* Role + type + date */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ color: "#E2E8F0", fontWeight: 800, fontSize: "0.92rem", lineHeight: 1.2 }} noWrap>
            {config?.jobRole || "Interview"}
          </Typography>
          <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 0.4 }} flexWrap="wrap" useFlexGap>
            <Chip label={TYPE_LABEL[config?.interviewType] || config?.interviewType || "Technical"} size="small"
              sx={{ bgcolor: "rgba(124,58,237,0.12)", color: "#C4B5FD", fontSize: "0.68rem", height: 20 }} />
            {config?.experienceLevel && (
              <Chip label={LEVEL_LABEL[config.experienceLevel] || config.experienceLevel} size="small"
                sx={{ bgcolor: "rgba(6,182,212,0.10)", color: "#67E8F9", fontSize: "0.68rem", height: 20 }} />
            )}
            <Stack direction="row" spacing={0.4} alignItems="center">
              <CalendarDays size={11} color="#475569" />
              <Typography sx={{ color: "#475569", fontSize: "0.7rem" }}>{formattedDate} {time}</Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Score + recommendation */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexShrink: 0 }}>
          <Box sx={{ textAlign: "center", display: { xs: "none", sm: "block" } }}>
            <Typography sx={{ fontWeight: 900, fontSize: "1.4rem", color: overallColor, lineHeight: 1 }}>
              {report?.overall_score ?? "—"}
            </Typography>
            <Typography sx={{ color: "#475569", fontSize: "0.6rem", fontWeight: 700 }}>/ 10</Typography>
          </Box>
          <HiringBadge rec={report?.hiring_recommendation} small />
        </Stack>
      </AccordionSummary>

      {/* ── Details (expanded) ── */}
      <AccordionDetails sx={{ p: 0, bgcolor: "rgba(3,7,18,0.60)" }}>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {/* Score rings */}
          <PremiumCard hover={false} sx={{ p: 2.4, mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <TrendingUp size={15} color="#7C3AED" />
              <Typography sx={{ fontWeight: 900, fontSize: "0.85rem" }}>Scores</Typography>
            </Stack>
            <Grid container spacing={1.5} justifyContent="center">
              {[
                { label: "Overall", score: report?.overall_score, color: overallColor },
                { label: "Technical", score: report?.technical_score, color: "#7C3AED" },
                { label: "Comm.", score: report?.communication_score, color: "#06B6D4" },
                { label: "Problem", score: report?.problem_solving_score, color: "#F59E0B" },
                { label: "Confidence", score: report?.confidence_score, color: "#22C55E" },
              ].map(({ label, score, color }) => (
                <Grid item key={label}>
                  <ScoreRing score={score} size={72} label={label} color={color} />
                </Grid>
              ))}
            </Grid>
          </PremiumCard>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            {/* Strengths */}
            {Array.isArray(report?.strengths) && report.strengths.length > 0 && (
              <Grid item xs={12} md={6}>
                <PremiumCard hover={false} sx={{ p: 2, height: "100%" }}>
                  <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 1 }}>
                    <CheckCircle2 size={14} color="#22C55E" />
                    <Typography sx={{ color: "#22C55E", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase" }}>Strengths</Typography>
                  </Stack>
                  {report.strengths.map((s, i) => (
                    <Typography key={i} sx={{ color: "#CBD5E1", fontSize: "0.82rem", lineHeight: 1.6, pl: 1.4, mb: 0.3 }}>• {s}</Typography>
                  ))}
                </PremiumCard>
              </Grid>
            )}

            {/* Weak Areas */}
            {Array.isArray(report?.weak_areas) && report.weak_areas.length > 0 && (
              <Grid item xs={12} md={6}>
                <PremiumCard hover={false} sx={{ p: 2, height: "100%" }}>
                  <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 1 }}>
                    <XCircle size={14} color="#EF4444" />
                    <Typography sx={{ color: "#EF4444", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase" }}>Weak Areas</Typography>
                  </Stack>
                  {report.weak_areas.map((w, i) => (
                    <Typography key={i} sx={{ color: "#CBD5E1", fontSize: "0.82rem", lineHeight: 1.6, pl: 1.4, mb: 0.3 }}>• {w}</Typography>
                  ))}
                </PremiumCard>
              </Grid>
            )}
          </Grid>

          {/* Topics to improve */}
          {Array.isArray(report?.topics_to_improve) && report.topics_to_improve.length > 0 && (
            <PremiumCard hover={false} sx={{ p: 2, mb: 2 }}>
              <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 1 }}>
                <Target size={14} color="#F59E0B" />
                <Typography sx={{ color: "#F59E0B", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase" }}>Topics to Improve</Typography>
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={0.8}>
                {report.topics_to_improve.map((t, i) => (
                  <Chip key={i} label={t} size="small"
                    sx={{ bgcolor: "rgba(245,158,11,0.10)", color: "#FCD34D", border: "1px solid rgba(245,158,11,0.25)", fontSize: "0.74rem" }} />
                ))}
              </Stack>
            </PremiumCard>
          )}

          {/* Suggested resources */}
          {Array.isArray(report?.suggested_learning_resources) && report.suggested_learning_resources.length > 0 && (
            <PremiumCard hover={false} sx={{ p: 2, mb: 2 }}>
              <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 1 }}>
                <BookOpen size={14} color="#A78BFA" />
                <Typography sx={{ color: "#A78BFA", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase" }}>Suggested Resources</Typography>
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={0.8}>
                {report.suggested_learning_resources.map((r, i) => (
                  <Chip key={i} label={r} size="small"
                    sx={{ bgcolor: "rgba(124,58,237,0.12)", color: "#C4B5FD", border: "1px solid rgba(124,58,237,0.25)", fontSize: "0.74rem" }} />
                ))}
              </Stack>
            </PremiumCard>
          )}

          {/* Final summary */}
          {report?.final_summary && (
            <PremiumCard hover={false} sx={{ p: 2, mb: 2 }}>
              <Typography sx={{ color: "#475569", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", mb: 0.8 }}>
                Final Summary
              </Typography>
              <Typography sx={{ color: "#94A3B8", fontSize: "0.84rem", lineHeight: 1.75 }}>
                {report.final_summary}
              </Typography>
            </PremiumCard>
          )}

          {/* Example answers */}
          {Array.isArray(report?.example_answers) && report.example_answers.length > 0 && (
            <PremiumCard hover={false} sx={{ p: 2 }}>
              <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 1.5 }}>
                <Lightbulb size={14} color="#F59E0B" />
                <Typography sx={{ fontWeight: 900, fontSize: "0.85rem" }}>Example Ideal Answers</Typography>
              </Stack>
              <Stack spacing={1.5}>
                {report.example_answers.map((ex, i) => (
                  <Box key={i} sx={{ p: 1.8, borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)", bgcolor: "rgba(255,255,255,0.02)" }}>
                    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 0.8 }}>
                      <MessageSquare size={13} color="#7C3AED" style={{ marginTop: 2, flexShrink: 0 }} />
                      <Typography sx={{ fontWeight: 700, color: "#E2E8F0", fontSize: "0.84rem" }}>{ex.question}</Typography>
                    </Stack>
                    <Typography sx={{ color: "#94A3B8", fontSize: "0.81rem", lineHeight: 1.7, pl: 2.2 }}>{ex.ideal_answer}</Typography>
                  </Box>
                ))}
              </Stack>
            </PremiumCard>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

// ── Recommendation distribution ───────────────────────────────────────────────
const RecDistribution = ({ interviews }) => {
  const counts = { "Strong Hire": 0, Hire: 0, Borderline: 0, "No Hire": 0 };
  interviews.forEach((iv) => {
    const r = iv.report?.hiring_recommendation;
    if (r && counts[r] !== undefined) counts[r]++;
  });
  const total = interviews.length;

  return (
    <PremiumCard hover={false} sx={{ p: 2.4 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Award size={16} color="#7C3AED" />
        <Typography sx={{ fontWeight: 900, fontSize: "0.88rem" }}>Hiring Recommendations</Typography>
      </Stack>
      <Stack spacing={1.2}>
        {Object.entries(counts).map(([rec, count]) => {
          const c = HIRING_COLORS[rec];
          const pct = total ? Math.round((count / total) * 100) : 0;
          return (
            <Box key={rec}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.4 }}>
                <Typography sx={{ color: c.text, fontSize: "0.8rem", fontWeight: 700 }}>{rec}</Typography>
                <Typography sx={{ color: "#64748B", fontSize: "0.78rem" }}>{count} ({pct}%)</Typography>
              </Stack>
              <Box sx={{ height: 6, borderRadius: 999, bgcolor: "rgba(255,255,255,0.06)" }}>
                <Box sx={{
                  height: "100%", borderRadius: 999, width: `${pct}%`,
                  bgcolor: c.text, transition: "width 0.7s ease",
                }} />
              </Box>
            </Box>
          );
        })}
      </Stack>
    </PremiumCard>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
export default function InterviewHistoryPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = authService.getStoredUser();
    if (!stored?.documentId) { router.push("/login"); return; }

    fetch(`/api/mock-interview/history?documentId=${stored.documentId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.interviews) setInterviews(data.interviews);
        else setError(data.error || "Failed to load history");
      })
      .catch(() => setError("Network error. Please try again."))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <LoaderTwo />;

  // Analytics
  const total = interviews.length;
  const avgScore = total
    ? (interviews.reduce((s, iv) => s + (iv.report?.overall_score || 0), 0) / total).toFixed(1)
    : "—";
  const bestScore = total
    ? Math.max(...interviews.map((iv) => iv.report?.overall_score || 0))
    : "—";
  const latestRec = interviews[0]?.report?.hiring_recommendation || "—";

  // Chart data — reverse so oldest is left
  const chartData = [...interviews].reverse().map((iv, i) => ({
    name: `#${i + 1}`,
    score: iv.report?.overall_score || 0,
    date: iv.date ? new Date(iv.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "",
  }));

  return (
    <>
      <Head><title>Interview History | SkillSync AI</title></Head>
      <PremiumPage>
        <Box sx={{ px: { xs: 1.5, md: 3 }, pt: { xs: 1.5, md: 2 } }}>
          <SectionHeader
            eyebrow="Mock Interview"
            title="Interview History"
            description={total > 0
              ? `${total} interview${total > 1 ? "s" : ""} completed — track your growth and performance over time`
              : "Your past mock interviews will appear here after you complete one"}
            action={
              <PremiumButton
                onClick={() => router.push("/mockInterview")}
                startIcon={<MonitorPlay size={16} />}
                sx={{ py: 0.8 }}
              >
                New Interview
              </PremiumButton>
            }
          />

          {error && (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography sx={{ color: "#EF4444" }}>{error}</Typography>
            </Box>
          )}

          {/* ── Empty state ── */}
          {!error && total === 0 && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{ display: "flex", justifyContent: "center", pt: 6 }}
            >
              <PremiumCard hover={false} sx={{ p: 5, textAlign: "center", maxWidth: 420 }}>
                <ClipboardList size={48} color="#475569" style={{ marginBottom: 16 }} />
                <Typography sx={{ fontWeight: 900, fontSize: "1.1rem", mb: 1 }}>No Interviews Yet</Typography>
                <Typography sx={{ color: "#64748B", fontSize: "0.88rem", lineHeight: 1.7, mb: 3 }}>
                  Complete your first mock interview to start tracking your progress and see detailed analytics here.
                </Typography>
                <PremiumButton onClick={() => router.push("/mockInterview")} startIcon={<MonitorPlay size={16} />}>
                  Start My First Interview
                </PremiumButton>
              </PremiumCard>
            </MotionBox>
          )}

          {/* ── Analytics + content ── */}
          {!error && total > 0 && (
            <AnimatePresence>
              <MotionBox
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Stat cards */}
                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                  <Grid item xs={6} md={3}>
                    <StatCard
                      icon={<BrainCircuit size={20} color="#7C3AED" />}
                      label="Total Interviews"
                      value={total}
                      sub="completed sessions"
                      color="#7C3AED"
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <StatCard
                      icon={<TrendingUp size={20} color="#06B6D4" />}
                      label="Avg Score"
                      value={avgScore}
                      sub="out of 10"
                      color="#06B6D4"
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <StatCard
                      icon={<Trophy size={20} color="#F59E0B" />}
                      label="Best Score"
                      value={bestScore}
                      sub="personal best"
                      color="#F59E0B"
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <StatCard
                      icon={<Award size={20} color="#22C55E" />}
                      label="Latest Result"
                      value={<HiringBadge rec={latestRec} small />}
                      sub="most recent interview"
                      color="#22C55E"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
                  {/* Score trend chart */}
                  {total > 1 && (
                    <Grid item xs={12} md={8}>
                      <PremiumCard hover={false} sx={{ p: 2.4, height: "100%" }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                          <TrendingUp size={16} color="#7C3AED" />
                          <Typography sx={{ fontWeight: 900, fontSize: "0.88rem" }}>Score Trend</Typography>
                          <Chip
                            label={`${total} sessions`}
                            size="small"
                            sx={{ bgcolor: "rgba(124,58,237,0.12)", color: "#C4B5FD", fontSize: "0.7rem", ml: "auto !important" }}
                          />
                        </Stack>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                            <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <RechartsTooltip content={<ChartTooltip />} />
                            <ReferenceLine y={6} stroke="rgba(245,158,11,0.3)" strokeDasharray="4 4" />
                            <ReferenceLine y={8} stroke="rgba(34,197,94,0.3)" strokeDasharray="4 4" />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="#7C3AED"
                              strokeWidth={2.5}
                              dot={{ r: 5, fill: "#7C3AED", stroke: "#fff", strokeWidth: 1.5 }}
                              activeDot={{ r: 7, fill: "#C4B5FD" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        <Stack direction="row" spacing={2} sx={{ mt: 1, justifyContent: "flex-end" }}>
                          {[{ color: "rgba(34,197,94,0.5)", label: "≥ 8 (Strong)" }, { color: "rgba(245,158,11,0.5)", label: "≥ 6 (Good)" }].map(({ color, label }) => (
                            <Stack key={label} direction="row" spacing={0.6} alignItems="center">
                              <Box sx={{ width: 20, height: 2, bgcolor: color, borderRadius: 1 }} />
                              <Typography sx={{ color: "#475569", fontSize: "0.68rem" }}>{label}</Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </PremiumCard>
                    </Grid>
                  )}

                  {/* Recommendation distribution */}
                  <Grid item xs={12} md={total > 1 ? 4 : 12}>
                    <RecDistribution interviews={interviews} />
                  </Grid>
                </Grid>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", mb: 2.5 }} />

                {/* Interview list */}
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.8 }}>
                  <ClipboardList size={17} color="#7C3AED" />
                  <Typography sx={{ fontWeight: 900, fontSize: "1rem" }}>All Interviews</Typography>
                  <Typography sx={{ color: "#475569", fontSize: "0.8rem" }}>— newest first</Typography>
                </Stack>

                <Box>
                  {interviews.map((iv, i) => (
                    <InterviewItem key={iv.id || i} interview={iv} index={i} total={total} />
                  ))}
                </Box>
              </MotionBox>
            </AnimatePresence>
          )}
        </Box>
      </PremiumPage>
    </>
  );
}
