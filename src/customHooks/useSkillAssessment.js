import { useState, useCallback } from "react";

export const useSkillAssessment = () => {
  const [assessmentData, setAssessmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const assessSkill = useCallback(async (user, skillName) => {
    if (!user || !skillName) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/skills/assess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, skillName }),
      });

      const data = await response.json();

      if (response.ok) {
        setAssessmentData(data);
      } else {
        setError(data.error || "Failed to assess skill");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    assessmentData,
    loading,
    error,
    assessSkill,
  };
};
