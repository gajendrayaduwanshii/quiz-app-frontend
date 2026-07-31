import { useState, useEffect, useMemo, useCallback } from "react";
import { normalizeQuizQuestions } from "@/utils/quizQuestions";

export const useQuiz = (user, tech) => {
  const [questions, setQuestions] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [error, setError] = useState(null);

  // Memoize the fetch function
  const fetchQuizQuestions = useCallback(async () => {
    if (!user || !tech) return;

    setLoadingQuiz(true);
    setError(null);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, tech }),
      });

      // Check if response is HTML (error page)
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Quiz API returned non-JSON response:", contentType);
        setQuestions([]);
        setError("Quiz API returned invalid response");
        return;
      }

      const data = await res.json();

      if (res.ok) {
        const questionsArray = normalizeQuizQuestions(data.questions);
        console.log("Quiz API: Received questions", questionsArray.length);
        
        if (questionsArray.length === 0) {
          console.warn("Quiz API: Empty questions array", data);
          setError(data.error || "No questions generated. Please try again.");
        }
        
        setQuestions(questionsArray);
      } else {
        console.error("Error fetching quiz questions:", data.error, data);
        setQuestions([]);
        setError(data.error || "Failed to fetch quiz questions");
      }
    } catch (err) {
      console.error("Error calling quiz API:", err);
      setQuestions([]);
      setError(err.message);
    } finally {
      setLoadingQuiz(false);
    }
  }, [user, tech]);

  // Fetch questions when user or tech changes
  useEffect(() => {
    fetchQuizQuestions();
  }, [fetchQuizQuestions]);

  // Memoize refetch function
  const refetch = useCallback(() => {
    fetchQuizQuestions();
  }, [fetchQuizQuestions]);

  // Memoize return value
  return useMemo(() => ({ 
    questions, 
    loadingQuiz, 
    error, 
    refetch 
  }), [questions, loadingQuiz, error, refetch]);
};
