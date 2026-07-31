import { useRouter } from "next/router";
import { memo, useMemo, useEffect } from "react";
import { useUser } from "@/customHooks/useUser";
import { useQuiz } from "@/customHooks/useQuiz";
import LoaderTwo from "@/components/LoaderTwo";
import QuizMainComponent from "@/components/QuizMainComponent";
import { Box, Typography } from "@mui/material";
import PremiumPage from "@/components/premium/PremiumPage";
import PremiumCard from "@/components/premium/PremiumCard";
import PremiumButton from "@/components/premium/PremiumButton";

const Quiz = memo(() => {
  const router = useRouter();
  const { tech } = router.query;
  const { user, loading } = useUser();

  const { questions, loadingQuiz, error } = useQuiz(user, tech);

  // Memoize the loading state
  const isLoading = useMemo(() => loading || loadingQuiz, [loading, loadingQuiz]);

  // Memoize the quiz content
  const quizContent = useMemo(() => {
    if (isLoading) {
      return <LoaderTwo text="Preparing quiz..." />;
    }

    if (!user) {
      router.push("/login");
      return null;
    }

    if (questions.length > 0) {
      return (
        <QuizMainComponent 
          tech={tech} 
          questions={questions} 
          documentId={user.documentId} 
        />
      );
    }

    return (
      <PremiumCard hover={false} sx={{ p: 4, textAlign: "center", maxWidth: 680, mx: "auto" }}>
        <Typography variant="h4" className="gradient-text" sx={{ fontWeight: 950, mb: 1 }}>
          No quiz questions available for "{tech}"
        </Typography>
        {error && (
          <Box sx={{ p: 1.5, bgcolor: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.22)", borderRadius: "16px", mb: 2 }}>
            <Typography sx={{ color: "#FCA5A5" }}>Error: {error}</Typography>
          </Box>
        )}
        <PremiumButton onClick={() => window.location.reload()}>
          Retry
        </PremiumButton>
        <Typography sx={{ color: "text.secondary", mt: 2 }}>
          Please check the server console for detailed error logs.
        </Typography>
      </PremiumCard>
    );
  }, [isLoading, user, questions, tech, router, error]);

  return (
    <PremiumPage dense sx={{ minHeight: "calc(100vh - 180px)" }}>
      {quizContent}
    </PremiumPage>
  );
});

Quiz.displayName = 'Quiz';

export default Quiz;
