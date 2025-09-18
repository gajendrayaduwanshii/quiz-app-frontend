import { useState, useEffect } from "react";

export const useUserSummary = (user) => {
  const [dashboardInsights, setDashboardInsights] = useState({
    summary: "",
    rolesAndResponsibilities: "",
    studyPlan: "",
  });
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  useEffect(() => {
    if (!user) return;

    const callGeminiAPI = async () => {
      setLoadingDashboard(true);
      const apiKey = "AIzaSyBmbAFhkkfrVBSIGGWOZ_Kp2P0GH_WuJu8";
      const url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

      const headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      };

      const fullUserData = JSON.stringify(user, null, 2);

      const prompt = `
You're an intelligent career assistant. Based on the following user profile (in JSON), return a structured JSON with:

{
  "summary": "1 paragraph summary of user's current state",
  "rolesAndResponsibilities": "1-2 paragraphs suggesting what roles best fit their skills and experience",
  "studyPlan": "Topics, technologies, or concepts they should study to level up"
}

Only respond with valid JSON. No explanation, no markdown, no comments.

User Profile:
\`\`\`json
${fullUserData}
\`\`\`
      `;

      const body = JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      });

      try {
        const res = await fetch(url, {
          method: "POST",
          headers,
          body,
        });

        const data = await res.json();

        const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const jsonMatch = output.match(/\{.*\}/s);

        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setDashboardInsights({
            summary: parsed.summary || "",
            rolesAndResponsibilities: parsed.rolesAndResponsibilities || "",
            studyPlan: parsed.studyPlan || "",
          });
        } else {
          setDashboardInsights({
            summary: "",
            rolesAndResponsibilities: "",
            studyPlan: "",
          });
          console.warn("No valid JSON found in Gemini response.");
        }
      } catch (err) {
        console.error("Gemini API failed", err);
        setDashboardInsights({
          summary: "",
          rolesAndResponsibilities: "",
          studyPlan: "",
        });
      } finally {
        setLoadingDashboard(false);
      }
    };

    callGeminiAPI();
  }, [user]);

  return { dashboardInsights, loadingDashboard };
};
