"use client";

import { Box, Chip, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/customHooks/useUser";
import NextLink from "next/link";
import LoaderTwo from "@/components/LoaderTwo";
import { ArrowRight, BrainCircuit, Code2, Gauge, Sparkles } from "lucide-react";
import PremiumCard from "@/components/premium/PremiumCard";
import PremiumButton from "@/components/premium/PremiumButton";
import SectionHeader from "@/components/premium/SectionHeader";

const Technologies = () => {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <LoaderTwo text="Loading Technologies..." />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <LoaderTwo text="Redirecting to login... ..." />
      </Box>
    );
  }

  const skills = user.skills || [];

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 180px)",
        padding: { xs: 1, md: 2 },
        boxSizing: "border-box",
      }}
    >
      <SectionHeader
        eyebrow="AI Skill Assessment"
        title="Choose a Skill Quiz"
        description="Start an adaptive quiz based on your saved skills and experience level."
        action={<Sparkles size={24} color="#06B6D4" />}
      />
      <Grid
        container
        spacing={2.4}
        justifyContent="start"
        alignItems="stretch"
        sx={{ width: "100%" }}
      >
        {skills.length > 0 ? (
          skills.map((skill, index) => {
            const accents = ["#7C3AED", "#06B6D4", "#22C55E", "#F59E0B"];
            const accent = accents[index % accents.length];

            return (
              <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={skill.id || skill.skillName} sx={{ textAlign: "left" }}>
                <PremiumCard
                  glow={`${accent}30`}
                  sx={{
                    height: "100%",
                    p: { xs: 2.4, md: 2.8 },
                    minHeight: 220,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 2,
                        mb: 2.4,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "18px",
                            display: "grid",
                            placeItems: "center",
                            background: `linear-gradient(135deg, ${accent}, #06B6D4)`,
                            boxShadow: `0 18px 38px ${accent}42`,
                          }}
                        >
                          <Code2 size={23} color="#fff" />
                        </Box>
                        <Box>
                          <Typography
                            variant="h5"
                            sx={{
                              color: "#FFFFFF",
                              fontWeight: 900,
                              lineHeight: 1.15,
                              textTransform: "uppercase",
                            }}
                          >
                            {skill.skillName}
                          </Typography>
                          <Typography sx={{ color: "text.secondary", fontSize: 13, mt: 0.4 }}>
                            AI-generated MCQ assessment
                          </Typography>
                        </Box>
                      </Box>
                      <BrainCircuit size={22} color={accent} />
                    </Box>

                    <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={1.2} mb={2.4}>
                      <Chip
                        icon={<Gauge size={15} />}
                        label={`Level: ${skill.level || "N/A"}`}
                        sx={{ justifyContent: "flex-start", color: "#fff" }}
                      />
                      <Chip
                        label={`${skill.yearsExperience || 0} years`}
                        sx={{ justifyContent: "flex-start", color: "#fff" }}
                      />
                    </Box>
                  </Box>

                  <PremiumButton
                    component={NextLink}
                    href={`/quiz/${encodeURIComponent(skill.skillName.toLowerCase())}`}
                    endIcon={<ArrowRight size={17} />}
                    sx={{ alignSelf: "flex-start", minWidth: 150 }}
                  >
                    Start Quiz
                  </PremiumButton>
                </PremiumCard>
              </Grid>
            );
          })
        ) : (
          <Grid item size={{ xs: 12 }}>
            <PremiumCard hover={false} sx={{ p: 3 }}>
              <Typography align="center" sx={{ color: "text.secondary" }}>
                No skills available. Add skills in your profile to start quizzes.
              </Typography>
            </PremiumCard>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Technologies;
