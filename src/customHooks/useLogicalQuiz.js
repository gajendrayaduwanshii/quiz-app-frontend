import { useState, useEffect } from "react";

export const useLogicalQuiz = (user, tech) => {
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

      // Match skill from user profile
      const matchedSkill = Array.isArray(user.skills)
        ? user.skills.find(
            (skill) =>
              skill.skillName?.toLowerCase() === tech.toLowerCase()
          )
        : null;

      const experience = matchedSkill?.yearsExperience || "N/A";
      const level = matchedSkill?.level || "N/A";

      // 🧠 Updated prompt for logical coding questions with input/output
      const prompt = `
Generate at least 5 logical coding questions for a user learning ${tech}.
The user has ${experience} years of experience at level: ${level}.
Each question should be an object in JSON format with:
{
  "id": number,
  "question": string,
  "input": string,            // sample input for the question
  "expectedOutput": string    // correct output/result
}

Return all questions as a JSON array.
Focus on coding/logical problems, not MCQs.
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

        // Try to extract JSON array from response
        const jsonMatch = output.match(/\[.*\]/s);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          // Optional: ensure each question has id, question, input, expectedOutput
          const validated = parsed.map((q, idx) => ({
            id: q.id || idx + 1,
            question: q.question || "No question provided",
            input: q.input || "",
            expectedOutput: q.expectedOutput || "",
          }));
          setQuestions(validated);
        } else {
          setQuestions([]);
          console.warn("Logical quiz JSON not found in Gemini response.");
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
