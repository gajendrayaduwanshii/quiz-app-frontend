import { useState, useEffect } from "react";

export const useResumeAnalysis = (user) => {
  const [profileSummary, setProfileSummary] = useState("");
  const [learningSuggestions, setLearningSuggestions] = useState([]);
  const [loadingResume, setLoadingResume] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.uploadResume?.url) return;

    const analyzeResume = async () => {
      setLoadingResume(true);
      setError(null);

      try {
        const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
        const resumeUrl = `${baseUrl}${user.uploadResume.url}`;

        const res = await fetch("/api/resume/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uploadResume: resumeUrl }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("API error response:", data);
          throw new Error(data.error || "Server error");
        }

        // Safely extract profileSummary and learningSuggestions
        setProfileSummary(typeof data.profileSummary === "string" ? data.profileSummary : "");
        setLearningSuggestions(Array.isArray(data.learningSuggestions) ? data.learningSuggestions : []);

      } catch (err) {
        console.error("Hook error analyzing resume:", err);
        setProfileSummary("");
        setLearningSuggestions([]);
        setError(err.message || "Failed to analyze resume");
      } finally {
        setLoadingResume(false);
      }
    };

    analyzeResume();
  }, [user]);

  return { profileSummary, learningSuggestions, loadingResume, error };
};
