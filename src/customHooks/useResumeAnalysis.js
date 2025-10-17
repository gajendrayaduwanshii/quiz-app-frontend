import { useState, useEffect, useCallback } from "react";

export const useResumeAnalysis = (user) => {
  const [analysisData, setAnalysisData] = useState({
    profileSummary: "",
    learningSuggestions: [],
  });
  const [loadingResume, setLoadingResume] = useState(false);
  const [error, setError] = useState(null);

  const fetchResumeAnalysis = useCallback(async () => {
    if (!user?.uploadResume?.url) return;

    setLoadingResume(true);
    setError(null);

    try {
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          uploadResume: `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${user.uploadResume.url}` 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAnalysisData({
          profileSummary: typeof data.profileSummary === "string" ? data.profileSummary : "",
          learningSuggestions: Array.isArray(data.learningSuggestions) ? data.learningSuggestions : [],
        });
      } else {
        setError(data.error || "Failed to analyze resume");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingResume(false);
    }
  }, [user?.uploadResume?.url]);

  useEffect(() => {
    fetchResumeAnalysis();
  }, [fetchResumeAnalysis]);

  return { 
    profileSummary: analysisData.profileSummary,
    learningSuggestions: analysisData.learningSuggestions,
    loadingResume, 
    error, 
    refetch: fetchResumeAnalysis
  };
};
