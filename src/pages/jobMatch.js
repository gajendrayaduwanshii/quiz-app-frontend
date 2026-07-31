"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowRight,
  BarChart2,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/customHooks/useUser";
import LoaderTwo from "@/components/LoaderTwo";
import PremiumCard from "@/components/premium/PremiumCard";
import PremiumPage from "@/components/premium/PremiumPage";
import SectionHeader from "@/components/premium/SectionHeader";
import { analyzeJobMatch, getProfileSkillNames } from "@/utils/careerGrowth";

// ─── Score Ring ────────────────────────────────────────────────────────────────
const getScoreColor = (s) => {
  if (s >= 80) return "#22C55E";
  if (s >= 60) return "#F59E0B";
  if (s >= 40) return "#06B6D4";
  return "#EF4444";
};

const getScoreLabel = (s) => {
  if (s >= 80) return "Excellent Fit";
  if (s >= 60) return "Good Match";
  if (s >= 40) return "Fair Match";
  if (s > 0) return "Needs Work";
  return "Not Analyzed";
};

const ScoreRing = ({ score, size = 164, thickness = 14 }) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.2,
        flexShrink: 0,
      }}
    >
      <Box sx={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)", overflow: "visible" }}
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={thickness}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1), stroke 0.4s ease",
              filter: `drop-shadow(0 0 8px ${color}88)`,
            }}
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
          <Typography
            sx={{ fontSize: "2.4rem", fontWeight: 950, color, lineHeight: 1 }}
          >
            {score}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.65rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
            }}
          >
            OUT OF 100
          </Typography>
        </Box>
      </Box>
      <Chip
        label={getScoreLabel(score)}
        size="small"
        sx={{
          bgcolor: `${color}18`,
          color,
          fontWeight: 900,
          border: `1px solid ${color}40`,
          fontSize: "0.78rem",
        }}
      />
    </Box>
  );
};

// ─── Dimension Bar ─────────────────────────────────────────────────────────────
const DimensionBar = ({ label, value, max, color, icon }) => {
  const pct = max ? Math.round((value / max) * 100) : value;
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 0.5 }}
      >
        <Stack direction="row" spacing={0.7} alignItems="center">
          <Box sx={{ color, lineHeight: 0 }}>{icon}</Box>
          <Typography sx={{ fontSize: "0.8rem", fontWeight: 800 }}>
            {label}
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: "0.8rem", fontWeight: 950, color }}>
          {max ? `${value}/${max}` : `${value}%`}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={Math.min(100, pct)}
        sx={{
          height: 6,
          borderRadius: 999,
          bgcolor: "rgba(255,255,255,0.07)",
          "& .MuiLinearProgress-bar": { borderRadius: 999, bgcolor: color },
        }}
      />
    </Box>
  );
};

// ─── Keyword Pill ──────────────────────────────────────────────────────────────
const KeywordPill = ({ label, matched }) => (
  <Chip
    size="small"
    icon={
      matched ? (
        <CheckCircle2 size={12} />
      ) : (
        <XCircle size={12} />
      )
    }
    label={label}
    sx={{
      bgcolor: matched ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.08)",
      color: matched ? "#86EFAC" : "#FCA5A5",
      border: `1px solid ${matched ? "rgba(34,197,94,0.22)" : "rgba(239,68,68,0.18)"}`,
      fontWeight: 800,
      fontSize: "0.74rem",
      "& .MuiChip-icon": { color: "inherit" },
    }}
  />
);

// ─── Sample JD ────────────────────────────────────────────────────────────────
const SAMPLE_JD = `Senior React Developer

We are looking for an experienced React Developer to join our remote-first team.

Requirements:
• 3+ years of experience with React.js and modern JavaScript (ES6+)
• Strong knowledge of TypeScript and Node.js
• Experience with state management (Redux, Zustand, or Context API)
• Proficiency with REST APIs and GraphQL
• Familiarity with testing frameworks (Jest, React Testing Library)
• Experience with Git and CI/CD workflows
• Strong CSS/HTML5 and responsive design skills

Nice to have:
• AWS or cloud platform experience
• Docker and containerization knowledge
• Agile/Scrum methodology experience
• Performance optimization techniques

Employment type: Full-time, Remote
Experience: 3+ years
Notice period: 30 days`;

// ─── Default analysis shape ────────────────────────────────────────────────────
const buildDefaultAnalysis = (user) => ({
  score: 0,
  matchedSkills: [],
  missingKeywords: [],
  jobKeywords: [],
  summary: "Paste a job description above to get an instant profile fit analysis.",
  details: {
    roleTitle: "",
    requiredExperience: null,
    experienceFit: 0,
    titleMatch: 0,
    resumeUploaded: !!user?.uploadResume,
    matchedSoftSkills: [],
    skillCoverage: 0,
    suggestedActions: [],
    rationale: [],
    totalKeywords: 0,
    gaps: [],
    location: "",
    employmentType: "",
    noticePeriod: "",
    quizScore: 0,
    quizCount: 0,
    quizMessage: "",
    profileScore: 0,
    readinessStatus: "",
    readinessLabel: "",
    recommendedResumeEdits: [],
    recommendedLearningPath: [],
    jobKeywordGroups: { technical: [], tools: [], soft: [], domain: [] },
  },
});

// ─── Main Component ────────────────────────────────────────────────────────────
const JobMatch = () => {
  const router = useRouter();
  const { user, loading } = useUser();
  const [jobDescription, setJobDescription] = useState("");

  const profileSkills = getProfileSkillNames(user);
  const hasDescription = jobDescription.trim().length > 20;
  const wordCount = jobDescription.trim()
    ? jobDescription.trim().split(/\s+/).length
    : 0;

  const analysis = useMemo(
    () =>
      hasDescription
        ? analyzeJobMatch(user, jobDescription)
        : buildDefaultAnalysis(user),
    [jobDescription, user, hasDescription]
  );

  if (!user && !loading) {
    router.push("/login");
    return null;
  }
  if (loading || !user) {
    return <LoaderTwo text="Loading profile for job match..." />;
  }

  const CLUSTER_CONFIG = [
    { key: "technical", label: "Technical", color: "#3B82F6", bg: "rgba(59,130,246,0.10)" },
    { key: "tools", label: "Tools & Platforms", color: "#8B5CF6", bg: "rgba(139,92,246,0.10)" },
    { key: "soft", label: "Soft Skills", color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
    { key: "domain", label: "Domain Knowledge", color: "#10B981", bg: "rgba(16,185,129,0.10)" },
  ];

  return (
    <PremiumPage sx={{ pb: 4 }}>
      {/* ── Page header ── */}
      <SectionHeader
        eyebrow="Job Fit Engine"
        title="Profile-Based Job Match"
        description="Paste any job description for instant match scoring — skills, experience, keyword gaps, and your next best actions."
        action={
          <Chip
            icon={<Sparkles size={14} />}
            label="Instant · No AI credits needed"
            sx={{
              fontWeight: 800,
              bgcolor: "rgba(6,182,212,0.10)",
              border: "1px solid rgba(6,182,212,0.28)",
              color: "#67E8F9",
            }}
          />
        }
      />

      {/* ── JD Input card ── */}
      <PremiumCard
        hover={false}
        sx={{ p: { xs: 2.2, md: 2.8 }, borderRadius: "22px", mb: 2.4 }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 1.5 }}
        >
          <BriefcaseBusiness size={20} color="#67E8F9" />
          <Typography sx={{ fontWeight: 950, fontSize: "1.05rem" }}>
            Job Description
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Button
            size="small"
            onClick={() => setJobDescription(SAMPLE_JD)}
            sx={{
              color: "#94A3B8",
              fontSize: "0.76rem",
              px: 1.2,
              borderRadius: "10px",
              "&:hover": { color: "#67E8F9", bgcolor: "rgba(6,182,212,0.08)" },
            }}
          >
            Try sample JD
          </Button>
          {jobDescription && (
            <Button
              size="small"
              onClick={() => setJobDescription("")}
              sx={{
                color: "#94A3B8",
                fontSize: "0.76rem",
                px: 1.2,
                borderRadius: "10px",
                "&:hover": { color: "#FCA5A5", bgcolor: "rgba(239,68,68,0.08)" },
              }}
            >
              Clear
            </Button>
          )}
        </Stack>

        <TextField
          fullWidth
          multiline
          minRows={8}
          maxRows={16}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder={`Paste a job description here...\n\nExample: "We are looking for a React developer with 3+ years of experience in TypeScript, Node.js, and REST APIs..."`}
          sx={{
            "& .MuiOutlinedInput-root.Mui-focused": {
              boxShadow:
                "0 0 0 3px rgba(6,182,212,0.14), 0 0 32px rgba(6,182,212,0.06)",
            },
          }}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 1 }}
        >
          <Typography sx={{ color: "text.secondary", fontSize: "0.82rem" }}>
            {wordCount > 0
              ? `${wordCount} words · live analysis active`
              : "Live match scoring updates as you type"}
          </Typography>
          {hasDescription && (
            <Chip
              size="small"
              label="Analyzing"
              icon={<Zap size={11} />}
              sx={{
                bgcolor: "rgba(124,58,237,0.12)",
                color: "#C4B5FD",
                border: "1px solid rgba(124,58,237,0.22)",
                fontWeight: 800,
                fontSize: "0.72rem",
              }}
            />
          )}
        </Stack>
      </PremiumCard>

      {/* ── Empty state ── */}
      {!hasDescription ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
            border: "1px dashed rgba(255,255,255,0.09)",
            borderRadius: "24px",
            bgcolor: "rgba(255,255,255,0.015)",
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "20px",
              mx: "auto",
              mb: 2,
              display: "grid",
              placeItems: "center",
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.20), rgba(6,182,212,0.12))",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <Target size={32} color="#A78BFA" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
            Ready to Match
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              maxWidth: 500,
              mx: "auto",
              mb: 3,
              fontSize: "0.95rem",
            }}
          >
            Paste a real job description above to get instant profile-based match
            analysis — skill alignment, keyword gaps, fit score, and exactly what
            to do next.
          </Typography>
          <Stack
            direction="row"
            spacing={1.2}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
          >
            {[
              "Fit Score",
              "Skill Analysis",
              "Keyword Gaps",
              "Next Actions",
              "Learning Roadmap",
            ].map((f) => (
              <Chip
                key={f}
                label={f}
                icon={<CheckCircle2 size={13} />}
                sx={{
                  bgcolor: "rgba(34,197,94,0.08)",
                  color: "#86EFAC",
                  fontWeight: 800,
                  border: "1px solid rgba(34,197,94,0.18)",
                  "& .MuiChip-icon": { color: "#86EFAC" },
                }}
              />
            ))}
          </Stack>
        </Box>
      ) : (
        /* ── Results grid ── */
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 2.4,
          }}
        >
          {/* ────── LEFT COLUMN ────── */}
          <Stack spacing={2.4}>
            {/* Score hero */}
            <PremiumCard
              hover={false}
              sx={{
                p: { xs: 2.2, md: 3 },
                borderRadius: "22px",
                background:
                  "linear-gradient(145deg, rgba(15,23,42,0.90), rgba(3,7,18,0.80)), radial-gradient(circle at 88% 8%, rgba(124,58,237,0.18), transparent 36%)",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                alignItems={{ xs: "center", sm: "center" }}
              >
                <ScoreRing score={analysis.score} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <ClipboardCheck size={17} color="#86EFAC" />
                    <Typography
                      sx={{ fontWeight: 900, color: "#86EFAC", fontSize: "0.9rem" }}
                    >
                      Match Score
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.7,
                      mb: 2,
                      fontSize: "0.9rem",
                    }}
                  >
                    {analysis.summary}
                  </Typography>
                  <Stack spacing={1.4}>
                    <DimensionBar
                      label="Skill Coverage"
                      value={analysis.details.skillCoverage}
                      color="#3B82F6"
                      icon={<Brain size={13} />}
                    />
                    <DimensionBar
                      label="Experience Fit"
                      value={analysis.details.experienceFit}
                      max={10}
                      color="#10B981"
                      icon={<TrendingUp size={13} />}
                    />
                    <DimensionBar
                      label="Profile Readiness"
                      value={analysis.details.profileScore}
                      color="#A78BFA"
                      icon={<BarChart2 size={13} />}
                    />
                  </Stack>
                </Box>
              </Stack>
            </PremiumCard>

            {/* Keyword match */}
            <PremiumCard
              hover={false}
              sx={{ p: { xs: 2.2, md: 2.8 }, borderRadius: "22px" }}
            >
              <Typography sx={{ fontWeight: 900, mb: 0.4 }}>
                Keyword Match
              </Typography>
              <Typography
                sx={{ color: "text.secondary", fontSize: "0.82rem", mb: 2 }}
              >
                {analysis.matchedSkills.length} matched ·{" "}
                {analysis.missingKeywords.length} missing from your profile
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >
                <Box>
                  <Stack
                    direction="row"
                    spacing={0.7}
                    alignItems="center"
                    sx={{ mb: 1.2 }}
                  >
                    <CheckCircle2 size={14} color="#22C55E" />
                    <Typography
                      sx={{ fontWeight: 900, fontSize: "0.8rem", color: "#86EFAC" }}
                    >
                      Matched ({analysis.matchedSkills.length})
                    </Typography>
                  </Stack>
                  <Stack direction="row" flexWrap="wrap" gap={0.8}>
                    {(
                      analysis.matchedSkills.length
                        ? analysis.matchedSkills
                        : profileSkills.slice(0, 6)
                    ).map((s) => (
                      <KeywordPill key={s} label={s} matched />
                    ))}
                    {!analysis.matchedSkills.length && (
                      <Typography
                        sx={{ color: "text.secondary", fontSize: "0.80rem" }}
                      >
                        No matches detected yet
                      </Typography>
                    )}
                  </Stack>
                </Box>
                <Box>
                  <Stack
                    direction="row"
                    spacing={0.7}
                    alignItems="center"
                    sx={{ mb: 1.2 }}
                  >
                    <XCircle size={14} color="#EF4444" />
                    <Typography
                      sx={{ fontWeight: 900, fontSize: "0.8rem", color: "#FCA5A5" }}
                    >
                      Missing ({analysis.missingKeywords.length})
                    </Typography>
                  </Stack>
                  <Stack direction="row" flexWrap="wrap" gap={0.8}>
                    {analysis.missingKeywords.slice(0, 10).map((s) => (
                      <KeywordPill key={s} label={s} matched={false} />
                    ))}
                    {!analysis.missingKeywords.length && (
                      <Typography
                        sx={{ color: "text.secondary", fontSize: "0.80rem" }}
                      >
                        No critical gaps detected
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Box>
            </PremiumCard>

            {/* Job details grid */}
            <PremiumCard
              hover={false}
              sx={{ p: { xs: 2.2, md: 2.8 }, borderRadius: "22px" }}
            >
              <Typography sx={{ fontWeight: 900, mb: 1.6 }}>
                Job Details Detected
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1.2,
                }}
              >
                {[
                  {
                    label: "Role",
                    value: analysis.details.roleTitle || "Not detected",
                  },
                  {
                    label: "Experience",
                    value:
                      analysis.details.requiredExperience !== null
                        ? `${analysis.details.requiredExperience}+ years`
                        : "Not specified",
                  },
                  {
                    label: "Location",
                    value: analysis.details.location || "Not specified",
                  },
                  {
                    label: "Employment",
                    value: analysis.details.employmentType || "Not specified",
                  },
                  {
                    label: "Notice Period",
                    value: analysis.details.noticePeriod || "Not specified",
                  },
                  {
                    label: "Total Keywords",
                    value: analysis.details.totalKeywords,
                  },
                ].map(({ label, value }) => (
                  <Box
                    key={label}
                    sx={{
                      p: 1.4,
                      borderRadius: "14px",
                      bgcolor: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        mb: 0.3,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: "0.86rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </PremiumCard>
          </Stack>

          {/* ────── RIGHT COLUMN ────── */}
          <Stack spacing={2.4}>
            {/* Keyword clusters */}
            <PremiumCard
              hover={false}
              sx={{ p: { xs: 2.2, md: 2.8 }, borderRadius: "22px" }}
            >
              <Typography sx={{ fontWeight: 900, mb: 0.4 }}>
                Keyword Clusters
              </Typography>
              <Typography
                sx={{ color: "text.secondary", fontSize: "0.82rem", mb: 2 }}
              >
                Job requirements grouped by category
              </Typography>
              <Stack spacing={1.8}>
                {CLUSTER_CONFIG.map(({ key, label, color, bg }) => {
                  const kws = analysis.details.jobKeywordGroups[key] || [];
                  if (!kws.length) return null;
                  return (
                    <Box key={key}>
                      <Typography
                        sx={{
                          fontSize: "0.72rem",
                          fontWeight: 900,
                          color,
                          mb: 0.8,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {label}
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={0.8}>
                        {kws.slice(0, 8).map((kw) => (
                          <Chip
                            key={`${key}-${kw}`}
                            size="small"
                            label={kw}
                            sx={{
                              bgcolor: bg,
                              color,
                              border: `1px solid ${color}33`,
                              fontWeight: 800,
                              fontSize: "0.74rem",
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  );
                })}
                {!CLUSTER_CONFIG.some(
                  (c) =>
                    (analysis.details.jobKeywordGroups[c.key] || []).length
                ) && (
                  <Typography
                    sx={{ color: "text.secondary", fontSize: "0.85rem" }}
                  >
                    Keyword groups appear here after pasting a job description.
                  </Typography>
                )}
              </Stack>
            </PremiumCard>

            {/* Readiness signals */}
            <PremiumCard
              hover={false}
              sx={{ p: { xs: 2.2, md: 2.8 }, borderRadius: "22px" }}
            >
              <Typography sx={{ fontWeight: 900, mb: 1.6 }}>
                Readiness Signals
              </Typography>
              <Stack spacing={1.2}>
                {[
                  {
                    label: "Profile Completeness",
                    value: `${analysis.details.profileScore}%`,
                    status: analysis.details.readinessStatus,
                    note:
                      analysis.details.readinessLabel ||
                      "Complete more profile fields for a stronger signal.",
                    color: "#8B5CF6",
                  },
                  {
                    label: "Quiz Performance",
                    value: analysis.details.quizCount
                      ? `${analysis.details.quizScore}%`
                      : "No data",
                    status: analysis.details.quizCount
                      ? "Tracked"
                      : "No quizzes taken",
                    note:
                      analysis.details.quizMessage ||
                      "Take a quiz to strengthen your job fit signal.",
                    color: "#F59E0B",
                  },
                  {
                    label: "Resume Upload",
                    value: analysis.details.resumeUploaded
                      ? "Uploaded"
                      : "Missing",
                    status: analysis.details.resumeUploaded
                      ? "Ready"
                      : "Action needed",
                    note: analysis.details.resumeUploaded
                      ? "Resume is attached and ready for recruiter review."
                      : "Upload a resume to activate ATS intelligence.",
                    color: analysis.details.resumeUploaded
                      ? "#22C55E"
                      : "#EF4444",
                  },
                ].map(({ label, value, status, note, color }) => (
                  <Box
                    key={label}
                    sx={{
                      p: 1.6,
                      borderRadius: "14px",
                      bgcolor: "rgba(255,255,255,0.025)",
                      border: `1px solid ${color}20`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 1.2,
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 900, fontSize: "0.86rem" }}>
                        {label}
                      </Typography>
                      <Typography
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.78rem",
                          mt: 0.3,
                          lineHeight: 1.5,
                        }}
                      >
                        {note}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right", flex: "0 0 auto" }}>
                      <Typography
                        sx={{
                          fontWeight: 950,
                          color,
                          fontSize: "0.94rem",
                          lineHeight: 1,
                        }}
                      >
                        {value}
                      </Typography>
                      <Typography
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.68rem",
                          mt: 0.3,
                        }}
                      >
                        {status}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </PremiumCard>

            {/* Score rationale */}
            <PremiumCard
              hover={false}
              sx={{ p: { xs: 2.2, md: 2.8 }, borderRadius: "22px" }}
            >
              <Typography sx={{ fontWeight: 900, mb: 1.4 }}>
                Score Rationale
              </Typography>
              <Stack spacing={0.9}>
                {analysis.details.rationale.length ? (
                  analysis.details.rationale.map((point, idx) => (
                    <Stack
                      key={point + idx}
                      direction="row"
                      spacing={1}
                      alignItems="flex-start"
                    >
                      <Box
                        sx={{ color: "#67E8F9", mt: 0.25, flex: "0 0 auto" }}
                      >
                        <ArrowRight size={13} />
                      </Box>
                      <Typography
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.86rem",
                          lineHeight: 1.65,
                        }}
                      >
                        {point}
                      </Typography>
                    </Stack>
                  ))
                ) : (
                  <Typography
                    sx={{ color: "text.secondary", fontSize: "0.86rem" }}
                  >
                    The score reflects how your skills, experience, and resume
                    signals align with this role's requirements.
                  </Typography>
                )}
              </Stack>
            </PremiumCard>

            {/* Next actions + learning roadmap */}
            <PremiumCard
              hover={false}
              sx={{
                p: { xs: 2.2, md: 2.8 },
                borderRadius: "22px",
                background:
                  "linear-gradient(135deg, rgba(6,182,212,0.06), rgba(124,58,237,0.08))",
                border: "1px solid rgba(103,232,249,0.16)",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1.4 }}
              >
                <Target size={17} color="#67E8F9" />
                <Typography sx={{ fontWeight: 900 }}>Next Actions</Typography>
              </Stack>
              <Stack spacing={0.9}>
                {analysis.details.suggestedActions.length ? (
                  analysis.details.suggestedActions.map((action, idx) => (
                    <Stack
                      key={action + idx}
                      direction="row"
                      spacing={1.2}
                      alignItems="flex-start"
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: "rgba(6,182,212,0.18)",
                          color: "#67E8F9",
                          fontSize: "0.65rem",
                          fontWeight: 950,
                          flex: "0 0 auto",
                          mt: 0.2,
                        }}
                      >
                        {idx + 1}
                      </Box>
                      <Typography
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.86rem",
                          lineHeight: 1.65,
                        }}
                      >
                        {action}
                      </Typography>
                    </Stack>
                  ))
                ) : (
                  <Typography
                    sx={{ color: "text.secondary", fontSize: "0.86rem" }}
                  >
                    Use this score to prioritize the highest-impact gaps in
                    skills, experience, and resume keywords.
                  </Typography>
                )}
              </Stack>

              {analysis.details.recommendedLearningPath.length > 0 && (
                <>
                  <Divider
                    sx={{ my: 2, borderColor: "rgba(255,255,255,0.07)" }}
                  />
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <BookOpen size={15} color="#A78BFA" />
                    <Typography
                      sx={{ fontWeight: 900, fontSize: "0.88rem" }}
                    >
                      Learning Roadmap
                    </Typography>
                  </Stack>
                  <Stack spacing={0.8}>
                    {analysis.details.recommendedLearningPath.map(
                      (note, idx) => (
                        <Stack
                          key={note + idx}
                          direction="row"
                          spacing={1}
                          alignItems="flex-start"
                        >
                          <Box
                            sx={{
                              color: "#A78BFA",
                              mt: 0.25,
                              flex: "0 0 auto",
                            }}
                          >
                            <ArrowRight size={13} />
                          </Box>
                          <Typography
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.83rem",
                              lineHeight: 1.6,
                            }}
                          >
                            {note}
                          </Typography>
                        </Stack>
                      )
                    )}
                  </Stack>
                </>
              )}

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.2}
                sx={{ mt: 2 }}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => router.push("/resumeAnalysis")}
                  sx={{
                    background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                    borderRadius: "12px",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                  }}
                >
                  Analyze Resume
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => router.push("/learning")}
                  sx={{
                    borderColor: "rgba(255,255,255,0.14)",
                    borderRadius: "12px",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    "&:hover": {
                      borderColor: "#A78BFA",
                      bgcolor: "rgba(124,58,237,0.08)",
                    },
                  }}
                >
                  View Learning Plan
                </Button>
              </Stack>
            </PremiumCard>
          </Stack>
        </Box>
      )}
    </PremiumPage>
  );
};

export default JobMatch;
