"use client";

import { useState } from "react";
import Head from "next/head";
import { Box, CircularProgress, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import PremiumPage from "@/components/premium/PremiumPage";
import PremiumCard from "@/components/premium/PremiumCard";
import LoaderTwo from "@/components/LoaderTwo";
import InterviewSetup from "@/components/interview/InterviewSetup";
import InterviewSession from "@/components/interview/InterviewSession";
import InterviewReport from "@/components/interview/InterviewReport";
import { useUser } from "@/customHooks/useUser";
import { authService } from "@/services/authService";

const PHASE = { SETUP: "setup", INTERVIEW: "interview", GENERATING: "generating", REPORT: "report" };

const saveInterview = (report, config) => {
  try {
    const stored = authService.getStoredUser();
    if (!stored?.documentId) return;
    fetch("/api/mock-interview/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: stored.documentId, report, config }),
    }).catch(() => {});
  } catch {}
};

export default function MockInterviewPage() {
  const { user, loading } = useUser();

  const [phase, setPhase] = useState(PHASE.SETUP);
  const [interviewConfig, setInterviewConfig] = useState(null);
  const [opening, setOpening] = useState(null);
  const [finalReport, setFinalReport] = useState(null);

  // Called by InterviewSetup — config is now auto-detected by the start API
  const handleStart = ({ config, opening: openingData }) => {
    setInterviewConfig(config);
    setOpening(openingData);
    setPhase(PHASE.INTERVIEW);
  };

  // Shared: generate AI report from conversation, save to Strapi, show REPORT phase
  const generateAndSaveReport = async (conversationHistory) => {
    setPhase(PHASE.GENERATING);
    let report;
    try {
      const res = await fetch("/api/mock-interview/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: interviewConfig, conversationHistory }),
      });
      report = await res.json();
    } catch {
      report = {
        overall_score: 6,
        technical_score: 6,
        communication_score: 7,
        problem_solving_score: 6,
        confidence_score: 7,
        hiring_recommendation: "Borderline",
        strengths: ["Completed the interview"],
        weak_areas: ["Report could not be generated — try again"],
        topics_to_improve: [],
        suggested_learning_resources: [],
        example_answers: [],
        final_summary: "The interview was completed. A detailed report could not be generated at this time.",
      };
    }
    setFinalReport(report);
    saveInterview(report, interviewConfig);
    setPhase(PHASE.REPORT);
  };

  // Called when all questions answered
  const handleComplete = ({ conversationHistory }) => {
    generateAndSaveReport(conversationHistory);
  };

  // Called when user clicks "End Interview" early — same flow, partial history
  const handleEndEarly = ({ conversationHistory }) => {
    generateAndSaveReport(conversationHistory);
  };

  // Reset everything and go back to setup
  const handleRestart = () => {
    setPhase(PHASE.SETUP);
    setInterviewConfig(null);
    setOpening(null);
    setFinalReport(null);
  };

  if (loading) return <LoaderTwo />;

  return (
    <>
      <Head>
        <title>Mock Interview | SkillSync AI</title>
      </Head>
      <PremiumPage>
        <Box sx={{ px: { xs: 1.5, md: 3 }, pt: { xs: 1.5, md: 2 } }}>
          <AnimatePresence mode="wait">
            {phase === PHASE.SETUP && (
              <Box key="setup">
                {/* Pass raw user from Strapi — setup reads it to show profile preview */}
                <InterviewSetup onStart={handleStart} user={user} />
              </Box>
            )}

            {phase === PHASE.INTERVIEW && opening && interviewConfig && (
              <Box key="interview">
                <InterviewSession
                  opening={opening}
                  config={interviewConfig}
                  userData={user}
                  onComplete={handleComplete}
                  onEnd={handleEndEarly}
                />
              </Box>
            )}

            {phase === PHASE.GENERATING && (
              <Box key="generating" sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <PremiumCard hover={false} sx={{ p: 5, textAlign: "center", maxWidth: 420 }}>
                    <CircularProgress size={52} thickness={3} sx={{ mb: 3, color: "#7C3AED" }} />
                    <Typography sx={{ fontWeight: 900, fontSize: "1.15rem", mb: 1 }}>
                      Generating Your Report
                    </Typography>
                    <Typography sx={{ color: "#64748B", fontSize: "0.88rem", lineHeight: 1.7 }}>
                      Our AI is analysing your complete interview performance and compiling a detailed assessment. This takes a few seconds…
                    </Typography>
                  </PremiumCard>
                </motion.div>
              </Box>
            )}

            {phase === PHASE.REPORT && (
              <Box key="report">
                <InterviewReport
                  report={finalReport}
                  config={interviewConfig || { jobRole: "Interview", interviewType: "technical", experienceLevel: "" }}
                  onRestart={handleRestart}
                />
              </Box>
            )}
          </AnimatePresence>
        </Box>
      </PremiumPage>
    </>
  );
}
