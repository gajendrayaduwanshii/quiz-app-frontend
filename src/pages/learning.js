"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/customHooks/useUser";
import LoaderTwo from "@/components/LoaderTwo";
import { useLearningSuggestions } from "@/customHooks/useLearningSuggestions"; 

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
      <div style={{ padding: "2rem", textAlign: "center" }}>
        No personalized learning suggestions available at this time.
      </div>
    );
  }

  return (
    <div className="learning-container">
      <h3 className="page-title">Personalized Learning Suggestions for You</h3>

      {suggestions.map(({ title, detail }, index) => (
        <div className="learning-suggestion" key={index}>
          <h2>{title}</h2>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.6",
              margin: 0,
              whiteSpace: "pre-wrap",
            }}
          >
            {detail}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Learning;
