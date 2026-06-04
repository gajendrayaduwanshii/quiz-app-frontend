import { useEffect, useMemo, useState } from "react";

export const useCourseRecommendations = (user) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const latestQuizQuestions = useMemo(() => {
    const quizzes = Array.isArray(user?.quizResult) ? user.quizResult : [];
    const latestQuiz = quizzes.length ? quizzes[quizzes.length - 1] : null;
    return Array.isArray(latestQuiz?.quizQuestion)
      ? latestQuiz.quizQuestion.slice(0, 10)
      : [];
  }, [user]);

  useEffect(() => {
    if (!user) {
      setRecommendations(null);
      setError("");
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();

    const loadRecommendations = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/ai/course-recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, latestQuestions: latestQuizQuestions }),
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          setRecommendations(null);
          setError(data?.error || "AI course recommendations are unavailable.");
          return;
        }

        if (!data?.recommendations?.responseText) {
          setRecommendations(null);
          setError("AI did not return recommendation data. Please try again.");
          return;
        }

        setRecommendations(data.recommendations);
      } catch (fetchError) {
        if (!controller.signal.aborted) {
          console.warn("useCourseRecommendations:", fetchError?.message || fetchError);
          setRecommendations(null);
          setError(fetchError?.message || "Unable to load AI recommendations.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadRecommendations();
    return () => controller.abort();
  }, [latestQuizQuestions, user]);

  return {
    recommendations,
    loading,
    error,
    isAIGenerated: Boolean(recommendations?.source === "ai" && !error),
  };
};
