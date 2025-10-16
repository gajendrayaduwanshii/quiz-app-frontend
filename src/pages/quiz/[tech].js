import { useRouter } from "next/router";
import { useUser } from "@/customHooks/useUser";
import { useQuiz } from "@/customHooks/useQuiz";
import LoaderTwo from "@/components/LoaderTwo";
import QuizMainComponent from "@/components/QuizMainComponent";
import { Box } from "@mui/material";

const Quiz = () => {
  const router = useRouter();
  const { tech } = router.query;
  const { user, loading } = useUser();

  const { questions, loadingQuiz } = useQuiz(user, tech);

  if (loading || loadingQuiz) return <LoaderTwo text="Preparing quiz..." />;

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <Box sx={{height: "calc(100vh - 180px)"}}>
      {questions.length > 0 ? (
        <QuizMainComponent tech={tech} questions={questions} documentId={user.documentId} />
      ) : (
        <div>No quiz questions available for "{tech}".</div>
      )}
    </Box>
  );
};

export default Quiz;
