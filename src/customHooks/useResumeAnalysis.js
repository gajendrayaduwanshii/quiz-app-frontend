import { useState, useEffect, useCallback } from "react";
import { resolveStrapiMediaUrl } from "@/lib/strapiConfig";

export const useResumeAnalysis = (user) => {
  const [analysisData, setAnalysisData] = useState({
    atsScore: 0,
    roleMatch: 0,
    profileSummary: "",
    strongestSkills: [],
    missingKeywords: [],
    formattingAnalysis: "",
    grammarAnalysis: "",
    skillGapAnalysis: "",
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
          uploadResume: resolveStrapiMediaUrl(user.uploadResume.url)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAnalysisData({
          atsScore: Number(data.atsScore) || 0,
          roleMatch: Number(data.roleMatch) || 0,
          profileSummary: typeof data.profileSummary === "string" ? data.profileSummary : "",
          strongestSkills: Array.isArray(data.strongestSkills) ? data.strongestSkills : [],
          missingKeywords: Array.isArray(data.missingKeywords) ? data.missingKeywords : [],
          formattingAnalysis:
            typeof data.formattingAnalysis === "string" ? data.formattingAnalysis : "",
          grammarAnalysis: typeof data.grammarAnalysis === "string" ? data.grammarAnalysis : "",
          skillGapAnalysis: typeof data.skillGapAnalysis === "string" ? data.skillGapAnalysis : "",
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
    atsScore: analysisData.atsScore,
    roleMatch: analysisData.roleMatch,
    profileSummary: analysisData.profileSummary,
    strongestSkills: analysisData.strongestSkills,
    missingKeywords: analysisData.missingKeywords,
    formattingAnalysis: analysisData.formattingAnalysis,
    grammarAnalysis: analysisData.grammarAnalysis,
    skillGapAnalysis: analysisData.skillGapAnalysis,
    learningSuggestions: analysisData.learningSuggestions,
    loadingResume, 
    error, 
    refetch: fetchResumeAnalysis
  };
};
