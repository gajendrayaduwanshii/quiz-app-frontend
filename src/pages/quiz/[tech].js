import { useRouter } from "next/router";
import { memo, useMemo, useEffect } from "react";
import { useUser } from "@/customHooks/useUser";
import { useQuiz } from "@/customHooks/useQuiz";
import LoaderTwo from "@/components/LoaderTwo";
import QuizMainComponent from "@/components/QuizMainComponent";
import { Box } from "@mui/material";

const Quiz = memo(() => {
  const router = useRouter();
  const { tech } = router.query;
  const { user, loading } = useUser();

  const { questions, loadingQuiz } = useQuiz(user, tech);

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

    return <div>No quiz questions available for "{tech}".</div>;
  }, [isLoading, user, questions, tech, router]);

  return (
    <Box sx={{height: "calc(100vh - 180px)"}}>
      {quizContent}
    </Box>
  );
});

Quiz.displayName = 'Quiz';

export default Quiz;
