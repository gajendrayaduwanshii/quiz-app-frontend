"use client";

import { useRouter } from "next/navigation";
import { Alert, Box, Chip, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import {
  ArrowRight,
  BrainCircuit,
  FileSearch,
  ListChecks,
  RefreshCw,
  Sparkles,
  Target,
  UploadCloud,
} from "lucide-react";
import { useUser } from "@/customHooks/useUser";
import LoaderTwo from "@/components/LoaderTwo";
import { useResumeAnalysis } from "@/customHooks/useResumeAnalysis";
import PremiumCard from "@/components/premium/PremiumCard";
import PremiumButton from "@/components/premium/PremiumButton";
import SectionHeader from "@/components/premium/SectionHeader";

const ResumeAnalysis = () => {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const {
    atsScore,
    roleMatch,
    profileSummary,
    strongestSkills,
    missingKeywords,
    formattingAnalysis,
    grammarAnalysis,
    skillGapAnalysis,
    learningSuggestions,
    loadingResume,
    error,
    refetch,
  } = useResumeAnalysis(user);
  const suggestionCount = learningSuggestions?.length || 0;
  const score = Math.max(0, Math.min(100, atsScore || 0));
  const aiInsights = [
    { title: "Role Match", value: `${Math.max(0, Math.min(100, roleMatch || 0))}%` },
    { title: "Strong Skills", value: strongestSkills?.length || 0 },
    { title: "Missing Keywords", value: missingKeywords?.length || 0 },
  ];

  // Redirect if no user
  if (!user && !userLoading) {
    router.push("/login");
    return null;
  }

  // Show loader while fetching user or analyzing resume
  if (userLoading || loadingResume) {
    return <LoaderTwo text="Analyzing Your Resume..." />;
  }

  // Show message if no resume uploaded
  if (!user?.uploadResume) {
    return (
      <Box sx={{ pb: 4 }}>
        <SectionHeader
          eyebrow="Resume Intelligence"
          title="Resume AI Analyzer"
          description="Upload your resume from profile to unlock ATS score, skill gaps, and AI learning suggestions."
          action={<FileSearch size={26} color="#06B6D4" />}
        />
        <PremiumCard hover={false} sx={{ p: { xs: 2.5, md: 4 }, textAlign: "center" }}>
          <Box
            sx={{
              width: 74,
              height: 74,
              mx: "auto",
              mb: 2,
              borderRadius: "24px",
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(6,182,212,0.95))",
              boxShadow: "0 24px 55px rgba(6,182,212,0.25)",
            }}
          >
            <UploadCloud size={34} color="#fff" />
          </Box>
          <Typography variant="h5" sx={{ color: "#fff", fontWeight: 900, mb: 1 }}>
            No Resume Found
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 3 }}>
            Please upload your resume from profile to see AI-generated analysis.
          </Typography>
          <PremiumButton onClick={() => router.push("/profile")} endIcon={<ArrowRight size={17} />}>
            Go to Profile
          </PremiumButton>
        </PremiumCard>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <SectionHeader
        eyebrow="Resume Intelligence"
        title="AI Resume Analyzer"
        description="Premium ATS-style analysis with profile summary, improvement areas, and career learning signals."
        action={
          <PremiumButton onClick={refetch} startIcon={<RefreshCw size={16} />} sx={{ py: 1 }}>
            Re-analyze
          </PremiumButton>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2.4}>
        <Grid item size={{ xs: 12, md: 4 }}>
          <PremiumCard sx={{ p: 3, height: "100%" }} glow="rgba(6,182,212,0.24)">
            <Stack spacing={2.2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.4 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "18px",
                    display: "grid",
                    placeItems: "center",
                    background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                  }}
                >
                  <Target size={23} color="#fff" />
                </Box>
                <Box>
                  <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                    Resume Readiness
                  </Typography>
                  <Typography variant="h4" sx={{ color: "#fff", fontWeight: 950 }}>
                    {score}%
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={score}
                sx={{
                  height: 10,
                  borderRadius: 999,
                  bgcolor: "rgba(255,255,255,0.08)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
                  },
                }}
              />
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={`${suggestionCount} AI Suggestions`} size="small" />
                <Chip label={`${roleMatch || 0}% Role Match`} size="small" />
                <Chip label="AI Generated" size="small" />
              </Stack>
            </Stack>
          </PremiumCard>
        </Grid>

        <Grid item size={{ xs: 12, md: 8 }}>
          <PremiumCard sx={{ p: 3, height: "100%" }} glow="rgba(124,58,237,0.24)">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.3, mb: 2 }}>
              <BrainCircuit size={22} color="#06B6D4" />
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900 }}>
                Profile Summary
              </Typography>
            </Box>
            {profileSummary ? (
              <Box sx={{ color: "text.secondary", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                {profileSummary.split("\n").map((line, idx) => (
                  <Typography key={idx} sx={{ color: "text.secondary", mb: 0.6 }}>
                    {line}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography sx={{ color: "text.secondary" }}>
                Profile summary is not available yet.
              </Typography>
            )}
          </PremiumCard>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2.2}>
            {aiInsights.map((item) => (
              <Grid item size={{ xs: 12, md: 4 }} key={item.title}>
                <PremiumCard sx={{ p: 2.4 }} glow="rgba(124,58,237,0.14)">
                  <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h4" sx={{ color: "#fff", fontWeight: 950 }}>
                    {item.value}
                  </Typography>
                </PremiumCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <PremiumCard sx={{ p: 2.6, height: "100%" }} glow="rgba(34,197,94,0.14)">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1.6 }}>
              <Sparkles size={20} color="#22C55E" />
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900 }}>
                AI Strongest Skills
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {(strongestSkills?.length ? strongestSkills : ["No AI skill data yet"]).map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  sx={{ color: "#fff", bgcolor: "rgba(34,197,94,0.12)" }}
                />
              ))}
            </Stack>
          </PremiumCard>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <PremiumCard sx={{ p: 2.6, height: "100%" }} glow="rgba(245,158,11,0.14)">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1.6 }}>
              <ListChecks size={20} color="#F59E0B" />
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900 }}>
                AI Missing Keywords
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {(missingKeywords?.length ? missingKeywords : ["No missing keywords returned"]).map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  sx={{ color: "#fff", bgcolor: "rgba(245,158,11,0.12)" }}
                />
              ))}
            </Stack>
          </PremiumCard>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2.2}>
            {[
              ["Formatting Analysis", formattingAnalysis],
              ["Grammar Analysis", grammarAnalysis],
              ["Skill Gap Analysis", skillGapAnalysis],
            ].map(([title, detail]) => (
              <Grid item size={{ xs: 12, md: 4 }} key={title}>
                <PremiumCard sx={{ p: 2.6, height: "100%" }} glow="rgba(6,182,212,0.12)">
                  <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900, mb: 1 }}>
                    {title}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                    {detail || "AI did not return this insight yet. Re-analyze after updating the resume."}
                  </Typography>
                </PremiumCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <SectionHeader
            eyebrow="Improvement Roadmap"
            title="Learning Suggestions"
            description="Focused skill areas generated from resume signals."
            action={<Sparkles size={24} color="#7C3AED" />}
          />
          {learningSuggestions?.length > 0 ? (
            <Grid container spacing={2.2}>
              {learningSuggestions.map(({ area, recommendation }, idx) => (
                <Grid item size={{ xs: 12, md: 6 }} key={`${area}-${idx}`}>
                  <PremiumCard sx={{ p: 2.6, height: "100%" }} glow="rgba(6,182,212,0.16)">
                    <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900, mb: 1 }}>
                      {area || `Focus Area ${idx + 1}`}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                      {recommendation}
                    </Typography>
                  </PremiumCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <PremiumCard hover={false} sx={{ p: 3 }}>
              <Typography sx={{ color: "text.secondary" }}>
                No learning suggestions available yet. Try re-analyzing after updating your resume.
              </Typography>
            </PremiumCard>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResumeAnalysis;
