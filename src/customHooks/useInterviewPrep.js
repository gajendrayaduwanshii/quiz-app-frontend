import { useState, useCallback } from "react";

export const useInterviewPrep = () => {
  const [prepData, setPrepData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const prepareInterview = useCallback(async (user, jobRole, companyType = "Tech Startup") => {
    if (!user || !jobRole) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/interview/prepare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, jobRole, companyType }),
      });

      const data = await response.json();

      if (response.ok) {
        setPrepData(data);
      } else {
        setError(data.error || "Failed to prepare interview");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    prepData,
    loading,
    error,
    prepareInterview,
  };
};
