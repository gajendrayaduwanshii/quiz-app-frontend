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
      <div style={{ 
        padding: "2rem", 
        textAlign: "center",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
      }}>
        <h2>No quiz questions available for "{tech}"</h2>
        {error && (
          <div style={{ 
            padding: "1rem", 
            background: "rgba(255, 0, 0, 0.1)", 
            borderRadius: "8px",
            maxWidth: "600px"
          }}>
            <p style={{ margin: 0, color: "#ff6b6b" }}>Error: {error}</p>
          </div>
        )}
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: "0.75rem 1.5rem",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          Retry
        </button>
        <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
          Please check the server console for detailed error logs.
        </p>
      </div>
    );
  }, [isLoading, user, questions, tech, router, error]);

  return (
    <Box sx={{height: "calc(100vh - 180px)"}}>
      {quizContent}
    </Box>
  );
});

Quiz.displayName = 'Quiz';

export default Quiz;
