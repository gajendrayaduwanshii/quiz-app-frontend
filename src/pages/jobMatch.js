"use client";

import { useMemo, useState } from "react";
import { Alert, Box, Button, Chip, LinearProgress, Stack, TextField, Typography } from "@mui/material";
import { BriefcaseBusiness, ClipboardCheck, Sparkles, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/customHooks/useUser";
import LoaderTwo from "@/components/LoaderTwo";
import PremiumCard from "@/components/premium/PremiumCard";
import PremiumPage from "@/components/premium/PremiumPage";
import SectionHeader from "@/components/premium/SectionHeader";
import { analyzeJobMatch, getProfileSkillNames } from "@/utils/careerGrowth";

const JobMatch = () => {
  const router = useRouter();
  const { user, loading } = useUser();
  const [jobDescription, setJobDescription] = useState("");

  const profileSkills = getProfileSkillNames(user);
  const hasDescription = jobDescription.trim().length > 20;

  const defaultAnalysis = {
    score: 0,
    matchedSkills: [],
    missingKeywords: [],
    jobKeywords: [],
    summary: "Paste a job description to get a profile-based fit analysis.",
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
  };

  const analysis = useMemo(
    () => (hasDescription ? analyzeJobMatch(user, jobDescription) : defaultAnalysis),
    [jobDescription, user, hasDescription]
  );

  if (!user && !loading) {
    router.push("/login");
    return null;
  }

  if (loading || !user) {
    return <LoaderTwo text="Loading profile for job match..." />;
  }

  return (
    <PremiumPage sx={{ pb: 4 }}>
      <SectionHeader
        eyebrow="Job Fit"
        title="Profile-Based Job Match"
        description="Paste a job description to see match score, matching skills, missing keywords, and next actions from the saved profile."
        action={<Chip icon={<Sparkles size={15} />} label="No AI credits needed" sx={{ fontWeight: 900 }} />}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.15fr) minmax(320px, 0.85fr)" },
          gap: 2.4,
        }}
      >
        <PremiumCard hover={false} sx={{ p: { xs: 2.2, md: 2.8 }, borderRadius: "22px" }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <BriefcaseBusiness size={20} color="#67E8F9" />
            <Typography sx={{ fontWeight: 950, fontSize: "1.12rem" }}>Job Description</Typography>
          </Stack>
          <TextField
            fullWidth
            multiline
            minRows={12}
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste a real job description here and get instant profile fit feedback."
          />
          <Typography sx={{ color: "text.secondary", mt: 1, fontSize: "0.95rem" }}>
            Live job match scoring updates as you type. Paste a real job description to get instant profile fit feedback.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ mt: 1.5 }}>
            <Button variant="text" onClick={() => setJobDescription("")} sx={{ color: "text.secondary" }}>
              Clear
            </Button>
          </Stack>
        </PremiumCard>

        <PremiumCard hover={false} sx={{ p: { xs: 2.2, md: 2.8 }, borderRadius: "22px" }}>
          {!hasDescription ? (
            <Alert severity="info">
              Paste a real job description to see instant profile fit recommendations.
            </Alert>
          ) : (
            <>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "#86EFAC", mb: 1 }}>
                <ClipboardCheck size={20} />
                <Typography sx={{ fontWeight: 950 }}>Match Score</Typography>
              </Stack>
              <Typography sx={{ fontSize: "3rem", lineHeight: 1, fontWeight: 950 }}>
                {analysis.score}
                <Typography component="span" sx={{ color: "text.secondary", fontWeight: 900, fontSize: "1.2rem" }}>
                  /100
                </Typography>
              </Typography>
              <LinearProgress
                variant="determinate"
                value={analysis.score}
                sx={{
                  my: 1.6,
                  height: 10,
                  borderRadius: 99,
                  bgcolor: "rgba(255,255,255,0.08)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 99,
                    background: "linear-gradient(90deg, #7C3AED, #06B6D4, #22C55E)",
                  },
                }}
              />
              <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                {analysis.summary}
              </Typography>

              <Box sx={{ mt: 2.2, p: 1.8, borderRadius: "16px", bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Typography sx={{ fontWeight: 900, mb: 1 }}>Fit Breakdown</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    label={`Skill coverage: ${analysis.details.skillCoverage}%`}
                    sx={{ bgcolor: "rgba(59,130,246,0.12)", color: "#BFDBFE", fontWeight: 800 }}
                  />
                  <Chip
                    label={`Experience fit: ${analysis.details.experienceFit}/10`}
                    sx={{ bgcolor: "rgba(16,185,129,0.12)", color: "#A7F3D0", fontWeight: 800 }}
                  />
                  <Chip
                    label={`Role title: ${analysis.details.titleMatch ? "Matches" : "Review"}`}
                    sx={{ bgcolor: "rgba(234,179,8,0.12)", color: "#FDE68A", fontWeight: 800 }}
                  />
                  <Chip
                    label={`Resume: ${analysis.details.resumeUploaded ? "Uploaded" : "Not uploaded"}`}
                    sx={{ bgcolor: "rgba(236,72,153,0.12)", color: "#F9A8D4", fontWeight: 800 }}
                  />
                  {analysis.details.location && (
                    <Chip
                      label={`Location: ${analysis.details.location}`}
                      sx={{ bgcolor: "rgba(168,85,247,0.12)", color: "#D8B4FE", fontWeight: 800 }}
                    />
                  )}
                  {analysis.details.employmentType && (
                    <Chip
                      label={`Type: ${analysis.details.employmentType}`}
                      sx={{ bgcolor: "rgba(107,114,128,0.12)", color: "#D1D5DB", fontWeight: 800 }}
                    />
                  )}
                  {analysis.details.noticePeriod && (
                    <Chip
                      label={`Notice: ${analysis.details.noticePeriod}`}
                      sx={{ bgcolor: "rgba(34,197,94,0.12)", color: "#BBF7D0", fontWeight: 800 }}
                    />
                  )}
                </Stack>
                {(analysis.details.roleTitle || analysis.details.requiredExperience !== null || analysis.details.location || analysis.details.employmentType || analysis.details.noticePeriod) && (
                  <Stack direction="column" spacing={0.5} sx={{ mt: 1.5 }}>
                    {analysis.details.roleTitle && (
                      <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                        Role detected: <strong>{analysis.details.roleTitle}</strong>
                      </Typography>
                    )}
                    {analysis.details.requiredExperience !== null && (
                      <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                        Target experience: <strong>{analysis.details.requiredExperience}+ years</strong>
                      </Typography>
                    )}
                    {analysis.details.location && (
                      <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                        Location: <strong>{analysis.details.location}</strong>
                      </Typography>
                    )}
                    {analysis.details.employmentType && (
                      <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                        Employment type: <strong>{analysis.details.employmentType}</strong>
                      </Typography>
                    )}
                    {analysis.details.noticePeriod && (
                      <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                        Notice period: <strong>{analysis.details.noticePeriod}</strong>
                      </Typography>
                    )}
                  </Stack>
                )}
              </Box>

              <Box sx={{ mt: 2.4, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
                <Box sx={{ p: 1.8, borderRadius: "16px", bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Typography sx={{ fontWeight: 900, mb: 1 }}>Why this score?</Typography>
                  <Stack spacing={0.8}>
                    {analysis.details.rationale.length ? (
                      analysis.details.rationale.map((point, index) => (
                        <Typography key={point + index} sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                          • {point}
                        </Typography>
                      ))
                    ) : (
                      <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                        The analysis breaks down how your skills, experience, and resume signals align with the job requirements.
                      </Typography>
                    )}
                  </Stack>
                </Box>
                <Box sx={{ p: 1.8, borderRadius: "16px", bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Typography sx={{ fontWeight: 900, mb: 1 }}>Job details</Typography>
                  <Stack spacing={0.75}>
                    <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                      Total role keywords detected: <strong>{analysis.details.totalKeywords}</strong>
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                      Matched keywords: <strong>{analysis.matchedSkills.length}</strong>
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                      Missing focus areas: <strong>{analysis.details.gaps.length}</strong>
                    </Typography>
                    {analysis.details.matchedSoftSkills.length > 0 && (
                      <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                        Soft skills detected: <strong>{analysis.details.matchedSoftSkills.join(", ")}</strong>
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Box>

              <Box sx={{ mt: 2.4, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
                <Box sx={{ p: 1.8, borderRadius: "16px", bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Typography sx={{ fontWeight: 900, mb: 1 }}>Profile readiness</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: "0.95rem", mb: 1 }}>
                    Your profile score is <strong>{analysis.details.profileScore}%</strong> and status is <strong>{analysis.details.readinessStatus}</strong>.
                  </Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                    {analysis.details.readinessLabel || "Complete more profile fields to get a better readiness signal."}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.8, borderRadius: "16px", bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Typography sx={{ fontWeight: 900, mb: 1 }}>Quiz readiness</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: "0.95rem", mb: 1 }}>
                    Latest quiz score: <strong>{analysis.details.quizCount ? `${analysis.details.quizScore}%` : "Not available"}</strong>
                  </Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                    {analysis.details.quizMessage || "Take a quiz to strengthen your job fit signal."}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 2.4, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
                <Box sx={{ p: 1.8, borderRadius: "16px", bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Typography sx={{ fontWeight: 900, mb: 1 }}>Keyword clusters</Typography>
                  <Stack spacing={1}>
                    {Object.entries(analysis.details.jobKeywordGroups).map(([group, values]) =>
                      values.length ? (
                        <Box key={group}>
                          <Typography sx={{ color: "text.secondary", fontSize: "0.95rem", mb: 0.75, textTransform: "capitalize" }}>
                            {group} keywords
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {values.slice(0, 6).map((keyword) => (
                              <Chip key={`${group}-${keyword}`} label={keyword} sx={{ bgcolor: "rgba(59,130,246,0.12)", color: "#BFDBFE", fontWeight: 800 }} />
                            ))}
                          </Stack>
                        </Box>
                      ) : null
                    )}
                    {!analysis.details.jobKeywordGroups.technical.length && !analysis.details.jobKeywordGroups.tools.length && !analysis.details.jobKeywordGroups.soft.length && !analysis.details.jobKeywordGroups.domain.length && (
                      <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                        Job keywords will appear here once you paste a description.
                      </Typography>
                    )}
                  </Stack>
                </Box>
                <Box sx={{ p: 1.8, borderRadius: "16px", bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Typography sx={{ fontWeight: 900, mb: 1 }}>Resume recommendations</Typography>
                  <Stack spacing={1}>
                    {analysis.details.recommendedResumeEdits.length ? (
                      analysis.details.recommendedResumeEdits.map((note, index) => (
                        <Typography key={note + index} sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                          • {note}
                        </Typography>
                      ))
                    ) : (
                      <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                        Use your profile to highlight the most relevant skills and project results for this role.
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Box>

              <Box sx={{ mt: 2.4, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
                <Box>
                  <Typography sx={{ fontWeight: 900, mb: 1 }}>Matched Skills</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {(analysis.matchedSkills.length ? analysis.matchedSkills : profileSkills.slice(0, 6)).map((skill) => (
                      <Chip key={skill} label={skill} sx={{ bgcolor: "rgba(34,197,94,0.12)", color: "#BBF7D0", fontWeight: 850 }} />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 900, mb: 1 }}>Missing Keywords</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {(analysis.missingKeywords.length ? analysis.missingKeywords : ["Paste a job description"]).map((skill) => (
                      <Chip key={skill} label={skill} sx={{ bgcolor: "rgba(245,158,11,0.12)", color: "#FDE68A", fontWeight: 850 }} />
                    ))}
                  </Stack>
                </Box>
              </Box>

              <Box sx={{ mt: 2.4, p: 1.8, borderRadius: "16px", bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Typography sx={{ fontWeight: 900, mb: 1 }}>Suggested Actions</Typography>
                <Stack spacing={1}>
                  {analysis.details.suggestedActions.length > 0 ? (
                    analysis.details.suggestedActions.map((action, index) => (
                      <Typography key={action + index} sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                        • {action}
                      </Typography>
                    ))
                  ) : (
                    <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                      Use this score to prioritize the highest-impact gaps in skills, experience, and resume keywords.
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Box sx={{ mt: 2.4, p: 1.8, borderRadius: "16px", bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Typography sx={{ fontWeight: 900, mb: 1 }}>Learning roadmap</Typography>
                <Stack spacing={1}>
                  {analysis.details.recommendedLearningPath.length ? (
                    analysis.details.recommendedLearningPath.map((note, index) => (
                      <Typography key={note + index} sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                        • {note}
                      </Typography>
                    ))
                  ) : (
                    <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                      Build a learning plan around the top missing keywords and the role expectations above.
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Box sx={{ mt: 2.4, p: 1.7, borderRadius: "16px", bgcolor: "rgba(6,182,212,0.08)", border: "1px solid rgba(103,232,249,0.18)" }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.8 }}>
                  <Target size={18} color="#67E8F9" />
                  <Typography sx={{ fontWeight: 900 }}>Next Action</Typography>
                </Stack>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  Add missing keywords to your learning plan, then update resume bullets with proof of projects or work experience before applying.
                </Typography>
              </Box>
            </>
          )}
        </PremiumCard>
      </Box>
    </PremiumPage>
  );
};

export default JobMatch;
