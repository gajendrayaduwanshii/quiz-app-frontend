import { useState, useCallback } from "react";

export const useLearningPath = () => {
  const [learningData, setLearningData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateLearningPath = useCallback(async (user, goal, timeCommitment = "Part-time (5-10 hours/week)") => {
    if (!user || !goal) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/learning/path", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, goal, timeCommitment }),
      });

      const data = await response.json();

      if (response.ok) {
        setLearningData(data);
      } else {
        setError(data.error || "Failed to generate learning path");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    learningData,
    loading,
    error,
    generateLearningPath,
  };
};
