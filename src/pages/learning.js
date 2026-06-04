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
  const { suggestions, detailedPlan, loadingSuggestions, isAIGenerated, suggestionError } =
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

  if (!detailedPlan && !suggestions.length) {
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
            ? "A personalized learning plan built from your saved skills, experience level, quiz performance, weak topics, practice needs, and next portfolio-ready milestones."
            : "Building a personalized learning plan from your saved skills, experience level, quiz performance, weak topics, practice needs, and next portfolio-ready milestones."
        }
        action={<Sparkles size={24} color={isAIGenerated ? "#06B6D4" : "#F59E0B"} />}
      />

      {detailedPlan ? (
        <Stack spacing={2.2}>
          {detailedPlan.aiGeneratedContent ? (
            <PremiumCard glow="rgba(6,182,212,0.25)" sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ color: "#fff", fontWeight: 950, mb: 1.6 }}>
                {detailedPlan.title}
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.85,
                  whiteSpace: "pre-wrap",
                }}
              >
                {detailedPlan.aiGeneratedContent}
              </Typography>
            </PremiumCard>
          ) : (
          <>
          <PremiumCard glow="rgba(6,182,212,0.25)" sx={{ p: 3 }}>
            <Stack spacing={1.4}>
              <Typography variant="h5" sx={{ color: "#fff", fontWeight: 950 }}>
                {detailedPlan.title}
              </Typography>
              <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                {detailedPlan.summary}
              </Typography>
              {!!detailedPlan.profileSignals.length && (
                <Stack direction="row" spacing={0.9} sx={{ flexWrap: "wrap", rowGap: 0.9 }}>
                  {detailedPlan.profileSignals.map((signal) => (
                    <Chip
                      key={signal}
                      label={signal}
                      sx={{
                        color: "#CFFAFE",
                        bgcolor: "rgba(6,182,212,0.12)",
                        border: "1px solid rgba(103,232,249,0.22)",
                        fontWeight: 800,
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Stack>
          </PremiumCard>

          {!!detailedPlan.priorityFocus.length && (
            <PremiumCard sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 950, mb: 2 }}>
                Priority Focus Areas
              </Typography>
              <Grid container spacing={1.6}>
                {detailedPlan.priorityFocus.map((focus, index) => (
                  <Grid item size={{ xs: 12, md: 6 }} key={`${focus.skill || "focus"}-${index}`}>
                    <Box sx={{ p: 2, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2 }}>
                      <Typography sx={{ color: "#fff", fontWeight: 900, mb: 0.8 }}>
                        {focus.skill || "Focus Area"}
                      </Typography>
                      <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                        {focus.whyItMatters}
                      </Typography>
                      <Typography sx={{ color: "#FDE68A", mt: 1, lineHeight: 1.7 }}>
                        Gap: {focus.currentGap}
                      </Typography>
                      <Typography sx={{ color: "#BBF7D0", mt: 0.7, lineHeight: 1.7 }}>
                        Target: {focus.targetOutcome}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </PremiumCard>
          )}

          {!!detailedPlan.roadmap.length && (
            <PremiumCard sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 950, mb: 2 }}>
                Detailed Roadmap
              </Typography>
              <Stack spacing={1.6}>
                {detailedPlan.roadmap.map((phase, index) => (
                  <Box key={`${phase.phase || "phase"}-${index}`} sx={{ p: 2, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2 }}>
                    <Typography sx={{ color: "#67E8F9", fontWeight: 900 }}>
                      {phase.phase || `Phase ${index + 1}`}
                    </Typography>
                    <Typography sx={{ color: "#fff", fontWeight: 850, mt: 0.7 }}>
                      {phase.goal}
                    </Typography>
                    {!!phase.topics?.length && (
                      <Typography sx={{ color: "text.secondary", mt: 1, lineHeight: 1.7 }}>
                        Topics: {phase.topics.join(", ")}
                      </Typography>
                    )}
                    {!!phase.practiceTasks?.length && (
                      <Typography sx={{ color: "text.secondary", mt: 1, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                        {phase.practiceTasks.map((task, taskIndex) => `${taskIndex + 1}. ${task}`).join("\n")}
                      </Typography>
                    )}
                    {phase.deliverable && (
                      <Typography sx={{ color: "#BBF7D0", mt: 1, lineHeight: 1.7 }}>
                        Deliverable: {phase.deliverable}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </PremiumCard>
          )}

          <Grid container spacing={2.2}>
            {detailedPlan.projectPlan && (
              <Grid item size={{ xs: 12, md: 6 }}>
                <PremiumCard sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" sx={{ color: "#fff", fontWeight: 950, mb: 1 }}>
                    {detailedPlan.projectPlan.name || "Project Plan"}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", lineHeight: 1.75 }}>
                    {detailedPlan.projectPlan.description}
                  </Typography>
                  {!!detailedPlan.projectPlan.features?.length && (
                    <Typography sx={{ color: "text.secondary", mt: 1.4, whiteSpace: "pre-wrap", lineHeight: 1.75 }}>
                      {detailedPlan.projectPlan.features.map((feature, index) => `${index + 1}. ${feature}`).join("\n")}
                    </Typography>
                  )}
                  {!!detailedPlan.projectPlan.acceptanceCriteria?.length && (
                    <Typography sx={{ color: "#BBF7D0", mt: 1.4, whiteSpace: "pre-wrap", lineHeight: 1.75 }}>
                      {detailedPlan.projectPlan.acceptanceCriteria.map((item, index) => `${index + 1}. ${item}`).join("\n")}
                    </Typography>
                  )}
                </PremiumCard>
              </Grid>
            )}

            {detailedPlan.quizImprovementPlan && (
              <Grid item size={{ xs: 12, md: 6 }}>
                <PremiumCard sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" sx={{ color: "#fff", fontWeight: 950, mb: 1 }}>
                    Quiz Improvement Plan
                  </Typography>
                  <Typography sx={{ color: "text.secondary", lineHeight: 1.75 }}>
                    {detailedPlan.quizImprovementPlan.reviewStrategy}
                  </Typography>
                  {!!detailedPlan.quizImprovementPlan.drills?.length && (
                    <Typography sx={{ color: "text.secondary", mt: 1.4, whiteSpace: "pre-wrap", lineHeight: 1.75 }}>
                      {detailedPlan.quizImprovementPlan.drills.map((drill, index) => `${index + 1}. ${drill}`).join("\n")}
                    </Typography>
                  )}
                  {detailedPlan.quizImprovementPlan.nextQuizTarget && (
                    <Typography sx={{ color: "#BBF7D0", mt: 1.4, lineHeight: 1.75 }}>
                      Target: {detailedPlan.quizImprovementPlan.nextQuizTarget}
                    </Typography>
                  )}
                </PremiumCard>
              </Grid>
            )}
          </Grid>

          <Grid container spacing={2.2}>
            {!!detailedPlan.resources.length && (
              <Grid item size={{ xs: 12, md: 6 }}>
                <PremiumCard sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" sx={{ color: "#fff", fontWeight: 950, mb: 2 }}>
                    Resources
                  </Typography>
                  <Stack spacing={1.2}>
                    {detailedPlan.resources.map((resource, index) => (
                      <Box key={`${resource.searchTerm || "resource"}-${index}`}>
                        <Typography sx={{ color: "#67E8F9", fontWeight: 900 }}>
                          {resource.type}: {resource.searchTerm}
                        </Typography>
                        <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                          {resource.howToUse}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </PremiumCard>
              </Grid>
            )}

            <Grid item size={{ xs: 12, md: 6 }}>
              <PremiumCard sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: 950, mb: 2 }}>
                  Weekly Schedule & Metrics
                </Typography>
                {!!detailedPlan.weeklySchedule.length && (
                  <Typography sx={{ color: "text.secondary", whiteSpace: "pre-wrap", lineHeight: 1.75 }}>
                    {detailedPlan.weeklySchedule.map((item, index) => `${index + 1}. ${item}`).join("\n")}
                  </Typography>
                )}
                {!!detailedPlan.successMetrics.length && (
                  <Typography sx={{ color: "#BBF7D0", mt: 1.6, whiteSpace: "pre-wrap", lineHeight: 1.75 }}>
                    {detailedPlan.successMetrics.map((metric, index) => `${index + 1}. ${metric}`).join("\n")}
                  </Typography>
                )}
              </PremiumCard>
            </Grid>
          </Grid>
          </>
          )}
        </Stack>
      ) : (
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
      )}
    </PremiumPage>
  );
};

export default Learning;
