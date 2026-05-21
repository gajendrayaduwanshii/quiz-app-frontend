"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/customHooks/useUser";
import LoaderTwo from "@/components/LoaderTwo";
import { useLearningSuggestions } from "@/customHooks/useLearningSuggestions"; 
import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import { BookOpenCheck, CalendarCheck, GraduationCap, Sparkles } from "lucide-react";
import PremiumCard from "@/components/premium/PremiumCard";
import SectionHeader from "@/components/premium/SectionHeader";
import PremiumPage from "@/components/premium/PremiumPage";

const Learning = () => {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  // Extract last quiz result from user's quizzes (for prompt input)
  // Ensure user.quizResult is an array with quiz objects having quizQuestion array
  const lastQuiz = user?.quizResult?.length
    ? user.quizResult[user.quizResult.length - 1]
    : null;

  const questions = lastQuiz?.quizQuestion || [];

  // Use the hook - pass user and questions for AI prompt
  const { suggestions, loadingSuggestions, isAIGenerated, suggestionError } =
    useLearningSuggestions(user, questions);

  // Redirect if no user and not loading
  if (!user && !userLoading) {
    router.push("/login");
    return null; // prevent rendering anything else before redirect
  }

  // Show loader while user data or AI suggestions are loading
  if (userLoading || loadingSuggestions) {
    return <LoaderTwo text="Generating AI learning suggestions..." />;
  }

  // Show message if AI suggestions are unavailable
  if (suggestionError) {
    return (
      <PremiumPage className="learning-container" sx={{ pb: 4 }}>
        <SectionHeader
          eyebrow="AI Learning Planner"
          title="AI-Based Learning Suggestions"
          description="AI recommendations could not be generated right now."
          action={<Sparkles size={24} color="#EF4444" />}
        />
        <PremiumCard hover={false} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900, mb: 1 }}>
            AI setup needs attention
          </Typography>
          <Typography sx={{ color: "text.secondary", maxWidth: 680, mx: "auto" }}>
            {suggestionError}
          </Typography>
          <Typography sx={{ color: "text.secondary", maxWidth: 680, mx: "auto", mt: 1 }}>
            Check your AI provider, model, API key, quota, and restart the dev server after changing environment variables.
          </Typography>
        </PremiumCard>
      </PremiumPage>
    );
  }

  if (!suggestions.length) {
    return (
      <PremiumCard hover={false} sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900, mb: 1 }}>
          AI learning suggestions are empty
        </Typography>
        <Typography sx={{ color: "text.secondary", maxWidth: 560, mx: "auto" }}>
          The AI request completed, but no suggestion cards were returned.
        </Typography>
      </PremiumCard>
    );
  }

  return (
    <PremiumPage className="learning-container" sx={{ pb: 4 }}>
      <SectionHeader
        eyebrow="AI Learning Planner"
        title="AI-Based Learning Suggestions"
        description={
          isAIGenerated
            ? "AI-generated recommendations from your saved skills, experience, and latest quiz answers."
            : "Generating recommendations from your saved skills, experience, and latest quiz answers."
        }
        action={<Sparkles size={24} color={isAIGenerated ? "#06B6D4" : "#F59E0B"} />}
      />

      <Grid container spacing={2.2}>
        {suggestions.map(({ title, detail, category, priority, timeCommitment }, index) => {
          const icons = [GraduationCap, BookOpenCheck, CalendarCheck, Sparkles];
          const accents = ["#7C3AED", "#06B6D4", "#22C55E", "#F59E0B"];
          const Icon = icons[index % icons.length];
          const accent = accents[index % accents.length];
          const priorityColor =
            priority === "High" ? "#EF4444" : priority === "Low" ? "#22C55E" : "#F59E0B";

          return (
            <Grid item size={{ xs: 12, md: 6 }} key={title}>
              <PremiumCard glow={`${accent}30`} sx={{ p: 2.8, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.6, mb: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "18px",
                      display: "grid",
                      placeItems: "center",
                      background: `linear-gradient(135deg, ${accent}, #06B6D4)`,
                      boxShadow: `0 18px 38px ${accent}42`,
                      flex: "0 0 auto",
                    }}
                  >
                    <Icon size={23} color="#fff" />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900 }}>
                      {title}
                    </Typography>
                    <Stack direction="row" spacing={0.8} sx={{ mt: 0.8, flexWrap: "wrap", rowGap: 0.8 }}>
                      {category && (
                        <Chip
                          size="small"
                          label={category}
                          sx={{
                            color: "#CFFAFE",
                            bgcolor: "rgba(6,182,212,0.12)",
                            border: "1px solid rgba(103,232,249,0.22)",
                            fontWeight: 800,
                          }}
                        />
                      )}
                      {priority && (
                        <Chip
                          size="small"
                          label={`${priority} priority`}
                          sx={{
                            color: priorityColor,
                            bgcolor: `${priorityColor}18`,
                            border: `1px solid ${priorityColor}40`,
                            fontWeight: 850,
                          }}
                        />
                      )}
                      {timeCommitment && (
                        <Chip
                          size="small"
                          label={timeCommitment}
                          sx={{
                            color: "#E5E7EB",
                            bgcolor: "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            fontWeight: 800,
                          }}
                        />
                      )}
                    </Stack>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.75,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {detail}
                </Typography>
              </PremiumCard>
            </Grid>
          );
        })}
      </Grid>
    </PremiumPage>
  );
};

export default Learning;
