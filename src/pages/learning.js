"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/customHooks/useUser";
import LoaderTwo from "@/components/LoaderTwo";
import { useLearningSuggestions } from "@/customHooks/useLearningSuggestions"; 
import { Box, Grid, Typography } from "@mui/material";
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
  const { suggestions, loadingSuggestions } = useLearningSuggestions(user, questions);

  // Redirect if no user and not loading
  if (!user && !userLoading) {
    router.push("/login");
    return null; // prevent rendering anything else before redirect
  }

  // Show loader while user data or AI suggestions are loading
  if (userLoading || loadingSuggestions) {
    return <LoaderTwo text="Prepare Personalized Learning Suggestions..." />;
  }

  // Show message if no suggestions available
  if (!suggestions.length) {
    return (
      <PremiumCard hover={false} sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900, mb: 1 }}>
          Learning plan is ready to personalize
        </Typography>
        <Typography sx={{ color: "text.secondary", maxWidth: 560, mx: "auto" }}>
          Add skills in your profile or complete one quiz to unlock stronger recommendations.
        </Typography>
      </PremiumCard>
    );
  }

  return (
    <PremiumPage className="learning-container" sx={{ pb: 4 }}>
      <SectionHeader
        eyebrow="Learning Intelligence"
        title="Personalized Learning Suggestions"
        description="Local recommendations based on your saved skills and latest quiz performance. No AI API call required."
        action={<Sparkles size={24} color="#06B6D4" />}
      />

      <Grid container spacing={2.2}>
        {suggestions.map(({ title, detail }, index) => {
          const icons = [GraduationCap, BookOpenCheck, CalendarCheck, Sparkles];
          const accents = ["#7C3AED", "#06B6D4", "#22C55E", "#F59E0B"];
          const Icon = icons[index % icons.length];
          const accent = accents[index % accents.length];

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
                    <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                      Recommended next action
                    </Typography>
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
