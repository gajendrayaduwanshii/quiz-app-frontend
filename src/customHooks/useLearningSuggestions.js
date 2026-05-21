import { useEffect, useState } from "react";

const buildAISuggestionCards = (recommendations) => {
  if (!recommendations) return [];

  const recommendationCards = Array.isArray(recommendations.recommendationCards)
    ? recommendations.recommendationCards
    : [];

  if (recommendationCards.length) {
    return recommendationCards.slice(0, 7).map((card) => {
      const steps = Array.isArray(card.steps) ? card.steps.filter(Boolean) : [];
      const resources = Array.isArray(card.resources) ? card.resources.filter(Boolean) : [];
      const detailParts = [
        card.detail,
        steps.length
          ? `\nAction steps:\n${steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`
          : "",
        resources.length
          ? `\nResources to use:\n${resources.map((item) => `- ${item}`).join("\n")}`
          : "",
        card.successMetric ? `\nSuccess metric: ${card.successMetric}` : "",
      ];

      return {
        title: card.title || "AI Learning Recommendation",
        category: card.category || "Roadmap",
        priority: card.priority || "Medium",
        timeCommitment: card.timeCommitment || "",
        detail: detailParts.filter(Boolean).join("\n"),
      };
    });
  }

  const cards = [];
  const path = recommendations.personalizedPath;
  if (path?.title) {
    cards.push({
      title: path.title,
      category: "Roadmap",
      priority: "High",
      timeCommitment: path.duration || "",
      detail: [
        path.description,
        path.duration ? `Duration: ${path.duration}` : "",
        path.difficulty ? `Difficulty: ${path.difficulty}` : "",
        Array.isArray(path.skills) && path.skills.length
          ? `Focus skills: ${path.skills.join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }

  const skillGaps = Array.isArray(recommendations.skillGaps)
    ? recommendations.skillGaps.slice(0, 3)
    : [];
  if (skillGaps.length) {
    cards.push({
      title: "AI Skill Gap Priorities",
      category: "Weak Topics",
      priority: "High",
      detail: skillGaps
        .map((gap, index) => {
          const courses = Array.isArray(gap.courses) ? gap.courses.join(", ") : "";
          return `${index + 1}. ${gap.skill}: current ${gap.currentLevel || 0}% -> target ${gap.targetLevel || 0}%${courses ? `\n   Resources: ${courses}` : ""}`;
        })
        .join("\n\n"),
    });
  }

  const courses = Array.isArray(recommendations.courses)
    ? recommendations.courses.slice(0, 3)
    : [];
  if (courses.length) {
    cards.push({
      title: "Recommended Courses",
      category: "Resources",
      priority: "Medium",
      detail: courses
        .map((course, index) => {
          const meta = [course.provider, course.duration, course.difficulty]
            .filter(Boolean)
            .join(" • ");
          return `${index + 1}. ${course.title}${meta ? ` (${meta})` : ""}\n   ${course.description || "Recommended for your learning path."}`;
        })
        .join("\n\n"),
    });
  }

  return cards;
};

export const useLearningSuggestions = (user, questions) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");

  useEffect(() => {
    if (!user) {
      setSuggestions([]);
      setSuggestionError("");
      return;
    }

    let cancelled = false;

    const generateSuggestions = async () => {
      setLoadingSuggestions(true);
      setSuggestionError("");

      try {
        const response = await fetch("/api/ai/learning-recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, latestQuestions: questions || [] }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (!cancelled) {
            setSuggestions([]);
            setSuggestionError(
              data?.error || "AI learning suggestions could not be generated."
            );
          }
          return;
        }

        const aiCards = buildAISuggestionCards(data.recommendations);
        if (!cancelled) {
          setSuggestions(aiCards);
          setSuggestionError(
            aiCards.length ? "" : "AI response did not include learning suggestions."
          );
        }
      } catch (error) {
        if (!cancelled) {
          setSuggestions([]);
          setSuggestionError(
            error?.message || "AI learning suggestions could not be generated."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingSuggestions(false);
        }
      }
    };

    generateSuggestions();

    return () => {
      cancelled = true;
    };
  }, [questions, user]);

  return {
    suggestions,
    loadingSuggestions,
    isAIGenerated: suggestions.length > 0 && !suggestionError,
    suggestionError,
  };
};
