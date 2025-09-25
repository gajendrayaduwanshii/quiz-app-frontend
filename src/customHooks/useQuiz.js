import { useState, useEffect } from "react";

export const useQuiz = (user, tech) => {
  const [questions, setQuestions] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  useEffect(() => {
    if (!user || !tech) return;

    const callGeminiAPI = async () => {
      setLoadingQuiz(true);

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      const url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

      const headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      };
      // Find the matching skill from user's skills
      const matchedSkill = Array.isArray(user.skills)
        ? user.skills.find(
            (skill) =>
              skill.skillName?.toLowerCase() === tech.toLowerCase()
          )
        : null;

      const experience = matchedSkill?.yearsExperience || "N/A";
      const level = matchedSkill?.level || "N/A"
      const prompt = `
Generate 20 multiple-choice quiz questions in JSON format based on user's ${experience} years experience in ${tech} at an expert level ${level}".
Each question should be an object: { id, question, options[], answer }.
Make sure questions match the experience level.
`;

      const body = JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
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
        const jsonMatch = output.match(/\[.*\]/s);

        if (jsonMatch) {
          setQuestions(JSON.parse(jsonMatch[0]));
        } else {
          setQuestions([]);
          console.warn("Quiz data JSON not found in Gemini response.");
        }
      } catch (error) {
        console.error("Error calling Gemini API:", error);
        setQuestions([]);
      } finally {
        setLoadingQuiz(false);
      }
    };

    callGeminiAPI();
  }, [user, tech]);

  return { questions, loadingQuiz };
};
