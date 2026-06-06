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

const sampleJob =
  "We are hiring a React developer with JavaScript, Next.js, REST API, Git, CSS, testing, performance optimization, and strong communication skills.";

const JobMatch = () => {
  const router = useRouter();
  const { user, loading } = useUser();
  const [jobDescription, setJobDescription] = useState("");

  const analysis = useMemo(
    () => analyzeJobMatch(user, jobDescription),
    [jobDescription, user]
  );
  const profileSkills = getProfileSkillNames(user);
  const hasDescription = jobDescription.trim().length > 20;

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
            placeholder="Paste target job description here..."
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ mt: 1.5 }}>
            <Button variant="outlined" onClick={() => setJobDescription(sampleJob)} sx={{ color: "#fff", borderColor: "rgba(6,182,212,0.45)" }}>
              Use Sample
            </Button>
            <Button variant="text" onClick={() => setJobDescription("")} sx={{ color: "text.secondary" }}>
              Clear
            </Button>
          </Stack>
        </PremiumCard>

        <PremiumCard hover={false} sx={{ p: { xs: 2.2, md: 2.8 }, borderRadius: "22px" }}>
          {!hasDescription ? (
            <Alert severity="info">
              Paste at least 20 characters of a job description to calculate your profile match.
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
            </>
          )}

          <Box sx={{ mt: 2.4 }}>
            <Typography sx={{ fontWeight: 900, mb: 1 }}>Matched Skills</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {(analysis.matchedSkills.length ? analysis.matchedSkills : profileSkills.slice(0, 6)).map((skill) => (
                <Chip key={skill} label={skill} sx={{ bgcolor: "rgba(34,197,94,0.12)", color: "#BBF7D0", fontWeight: 850 }} />
              ))}
            </Stack>
          </Box>

          <Box sx={{ mt: 2.4 }}>
            <Typography sx={{ fontWeight: 900, mb: 1 }}>Missing Keywords</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {(analysis.missingKeywords.length ? analysis.missingKeywords : ["Paste a job description"]).map((skill) => (
                <Chip key={skill} label={skill} sx={{ bgcolor: "rgba(245,158,11,0.12)", color: "#FDE68A", fontWeight: 850 }} />
              ))}
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
        </PremiumCard>
      </Box>
    </PremiumPage>
  );
};

export default JobMatch;
