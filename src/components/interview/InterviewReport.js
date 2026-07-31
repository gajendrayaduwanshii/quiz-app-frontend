"use client";

import {
  Box,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  MessageSquare,
  RefreshCw,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import PremiumButton from "@/components/premium/PremiumButton";
import PremiumCard from "@/components/premium/PremiumCard";
import SectionHeader from "@/components/premium/SectionHeader";

const MotionBox = motion(Box);

// ── Circular score ring ───────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 90, label, color }) => {
  const r = (size - 10) / 2;
  const circumference = 2 * Math.PI * r;
  const strokeDash = (score / 10) * circumference;

  return (
    <Box sx={{ textAlign: "center" }}>
      <Box sx={{ position: "relative", display: "inline-block", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={8} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color || "#7C3AED"}
            strokeWidth={8}
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
          />
        </svg>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontWeight: 900, fontSize: size > 80 ? "1.4rem" : "1rem", color: color || "#E2E8F0", lineHeight: 1 }}>
            {score}
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: "0.62rem", lineHeight: 1 }}>/10</Typography>
        </Box>
      </Box>
      {label && (
        <Typography sx={{ color: "#94A3B8", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", mt: 0.6 }}>
          {label}
        </Typography>
      )}
    </Box>
  );
};

// ── Hiring recommendation badge ───────────────────────────────────────────────
const HIRING_COLORS = {
  "Strong Hire": { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.4)", text: "#22C55E" },
  Hire: { bg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.4)", text: "#06B6D4" },
  Borderline: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.4)", text: "#F59E0B" },
  "No Hire": { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.4)", text: "#EF4444" },
};

const HiringBadge = ({ recommendation }) => {
  const colors = HIRING_COLORS[recommendation] || HIRING_COLORS["Borderline"];
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 2.5,
        py: 1,
        borderRadius: "14px",
        border: `1.5px solid ${colors.border}`,
        bgcolor: colors.bg,
      }}
    >
      <Award size={18} color={colors.text} />
      <Typography sx={{ fontWeight: 900, fontSize: "1rem", color: colors.text }}>
        {recommendation}
      </Typography>
    </Box>
  );
};

// ── List section ──────────────────────────────────────────────────────────────
const ListSection = ({ icon, title, items, color = "#E2E8F0" }) => {
  if (!Array.isArray(items) || !items.length) return null;
  return (
    <Box>
      <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 1 }}>
        {icon}
        <Typography sx={{ fontWeight: 800, fontSize: "0.82rem", color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {title}
        </Typography>
      </Stack>
      {items.map((item, i) => (
        <Typography key={i} sx={{ color: "#CBD5E1", fontSize: "0.85rem", lineHeight: 1.65, pl: 1.6, mb: 0.4 }}>
          • {item}
        </Typography>
      ))}
    </Box>
  );
};

export default function InterviewReport({ report, config, onRestart }) {
  if (!report) {
    return (
      <PremiumCard sx={{ p: 4, textAlign: "center" }}>
        <Typography sx={{ color: "#64748B" }}>Report is being generated...</Typography>
      </PremiumCard>
    );
  }

  const overallColor =
    report.overall_score >= 8 ? "#22C55E" : report.overall_score >= 6 ? "#F59E0B" : "#EF4444";

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionHeader
        eyebrow="Interview Complete"
        title="Your Performance Report"
        description={`${config.jobRole} · ${config.interviewType} Interview · ${config.experienceLevel} Level`}
        action={
          <PremiumButton onClick={onRestart} startIcon={<RefreshCw size={16} />} sx={{ py: 0.8 }}>
            New Interview
          </PremiumButton>
        }
      />

      <Grid container spacing={2.4}>
        {/* ── Overall Score + Hiring Recommendation ── */}
        <Grid item xs={12}>
          <PremiumCard
            hover={false}
            glow={`${overallColor}30`}
            sx={{
              p: { xs: 2.4, md: 3.2 },
              background: "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(3,7,18,0.85))",
              textAlign: "center",
            }}
          >
            <Stack alignItems="center" spacing={2}>
              <ScoreRing score={report.overall_score} size={110} label="Overall Score" color={overallColor} />
              <HiringBadge recommendation={report.hiring_recommendation} />
              {report.final_summary && (
                <Typography
                  sx={{
                    color: "#94A3B8",
                    maxWidth: 640,
                    lineHeight: 1.75,
                    fontSize: "0.92rem",
                  }}
                >
                  {report.final_summary}
                </Typography>
              )}
            </Stack>
          </PremiumCard>
        </Grid>

        {/* ── Category Scores ── */}
        <Grid item xs={12}>
          <PremiumCard hover={false} sx={{ p: 2.4 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
              <TrendingUp size={17} color="#7C3AED" />
              <Typography sx={{ fontWeight: 900 }}>Detailed Scores</Typography>
            </Stack>
            <Grid container spacing={2} justifyContent="center">
              {[
                { label: "Technical", score: report.technical_score, color: "#7C3AED" },
                { label: "Communication", score: report.communication_score, color: "#06B6D4" },
                { label: "Problem Solving", score: report.problem_solving_score, color: "#F59E0B" },
                { label: "Confidence", score: report.confidence_score, color: "#22C55E" },
              ].map(({ label, score, color }) => (
                <Grid item key={label}>
                  <ScoreRing score={score} size={82} label={label} color={color} />
                </Grid>
              ))}
            </Grid>
          </PremiumCard>
        </Grid>

        {/* ── Strengths & Weak Areas ── */}
        <Grid item xs={12} md={6}>
          <PremiumCard hover={false} sx={{ p: 2.4, height: "100%" }}>
            <ListSection
              icon={<CheckCircle2 size={16} color="#22C55E" />}
              title="Strengths"
              items={report.strengths}
              color="#22C55E"
            />
            {Array.isArray(report.strengths) && report.strengths.length > 0 &&
              Array.isArray(report.weak_areas) && report.weak_areas.length > 0 && (
                <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.07)" }} />
              )}
            <ListSection
              icon={<XCircle size={16} color="#EF4444" />}
              title="Weak Areas"
              items={report.weak_areas}
              color="#EF4444"
            />
          </PremiumCard>
        </Grid>

        {/* ── Topics to Improve + Learning Resources ── */}
        <Grid item xs={12} md={6}>
          <PremiumCard hover={false} sx={{ p: 2.4, height: "100%" }}>
            <ListSection
              icon={<Target size={16} color="#F59E0B" />}
              title="Topics to Improve"
              items={report.topics_to_improve}
              color="#F59E0B"
            />
            {Array.isArray(report.topics_to_improve) && report.topics_to_improve.length > 0 &&
              Array.isArray(report.suggested_learning_resources) && report.suggested_learning_resources.length > 0 && (
                <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.07)" }} />
              )}
            {Array.isArray(report.suggested_learning_resources) && report.suggested_learning_resources.length > 0 && (
              <Box>
                <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 1 }}>
                  <BookOpen size={16} color="#A78BFA" />
                  <Typography sx={{ fontWeight: 800, fontSize: "0.82rem", color: "#A78BFA", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Suggested Resources
                  </Typography>
                </Stack>
                <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mt: 0.5 }}>
                  {report.suggested_learning_resources.map((r, i) => (
                    <Chip
                      key={i}
                      label={r}
                      size="small"
                      icon={<ExternalLink size={12} />}
                      sx={{
                        bgcolor: "rgba(124,58,237,0.12)",
                        color: "#C4B5FD",
                        border: "1px solid rgba(124,58,237,0.25)",
                        fontSize: "0.74rem",
                        "& .MuiChip-icon": { color: "#C4B5FD" },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </PremiumCard>
        </Grid>

        {/* ── Example Ideal Answers ── */}
        {Array.isArray(report.example_answers) && report.example_answers.length > 0 && (
          <Grid item xs={12}>
            <PremiumCard hover={false} sx={{ p: 2.4 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Lightbulb size={17} color="#F59E0B" />
                <Typography sx={{ fontWeight: 900 }}>Example Ideal Answers</Typography>
              </Stack>
              <Stack spacing={2}>
                {report.example_answers.map((ex, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 2,
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,0.07)",
                      bgcolor: "rgba(255,255,255,0.025)",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
                      <MessageSquare size={14} color="#7C3AED" style={{ marginTop: 2, flexShrink: 0 }} />
                      <Typography sx={{ fontWeight: 700, color: "#E2E8F0", fontSize: "0.88rem" }}>
                        {ex.question}
                      </Typography>
                    </Stack>
                    <Typography sx={{ color: "#94A3B8", fontSize: "0.84rem", lineHeight: 1.7, pl: 2.5 }}>
                      {ex.ideal_answer}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </PremiumCard>
          </Grid>
        )}

        {/* ── Action buttons ── */}
        <Grid item xs={12}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center">
            <PremiumButton onClick={onRestart} startIcon={<RefreshCw size={16} />}>
              Start New Interview
            </PremiumButton>
          </Stack>
        </Grid>
      </Grid>
    </MotionBox>
  );
}
