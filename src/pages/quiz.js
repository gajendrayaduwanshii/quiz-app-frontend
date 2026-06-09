"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useUser } from "@/customHooks/useUser";
import { useQuiz } from "@/customHooks/useQuiz";
import { Box } from "@mui/material";
import LoaderTwo from "@/components/LoaderTwo";
import QuizMainComponent from "@/components/QuizMainComponent";

const Quiz = () => {
  const router = useRouter();
  const { user, loading } = useUser();
  const { questions, loadingQuiz } = useQuiz(user);

  const [isUserValid, setIsUserValid] = useState(true);
  const [storedUser, setStoredUser] = useState(null);

 
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setStoredUser(storedUser);
    if (!storedUser) {
      router.push("/login");
      return;
    }

    if (!loading && !user) {
      setIsUserValid(false);
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !isUserValid) return <LoaderTwo text="Loading user data..." />;
  if (loadingQuiz) return <LoaderTwo text="Generating quiz questions..." />;

  return (
    <>
      <Head>
        <title>Quiz</title>
      </Head>

      {questions.length > 0 ? (
          <QuizMainComponent questions={questions} documentId={storedUser.documentId}/>
      ) : (
        <Box sx={{ p: { xs: 2, md: 3 }, color: "#fff" }}>
          No quiz questions available.
        </Box>
      )}
    </>
  );
};

export default Quiz;
