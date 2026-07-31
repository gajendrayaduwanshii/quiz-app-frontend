import { useEffect, useState } from "react";

export const useLogicalQuiz = (user, tech) => {
  const [questions, setQuestions] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchLogicalQuiz = async () => {
      setLoadingQuiz(true);
      setError(null);

      try {
        const response = await fetch("/api/logical/quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user, tech }),
        });

        const data = await response.json();

        if (ignore) return;

        if (!response.ok) {
          throw new Error(data.error || "Failed to generate logical quiz");
        }

        setQuestions(Array.isArray(data.questions) ? data.questions : []);
        setError(data.error || null);
      } catch (err) {
        if (!ignore) {
          setQuestions([]);
          setError(err.message || "Failed to generate logical quiz");
        }
      } finally {
        if (!ignore) setLoadingQuiz(false);
      }
    };

    if (!user || !tech) {
      setQuestions([]);
      setLoadingQuiz(false);
      setError(null);
      return;
    }

    fetchLogicalQuiz();

    return () => {
      ignore = true;
    };
  }, [user, tech]);

  return { questions, loadingQuiz, error };
};
