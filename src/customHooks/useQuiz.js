import { useState, useEffect } from "react";

export const useQuiz = (user) => {
  const [questions, setQuestions] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  useEffect(() => {
    if (!user) return;

    const callGeminiAPI = async () => {
      setLoadingQuiz(true);

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      const url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

      const headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      };

      // ✅ Safely access skills
      const userSkills = Array.isArray(user.skills)
        ? user.skills.map((skill) => skill.skillName).join(", ")
        : "N/A";

      const prompt = `
        Generate 20 quiz questions and answers in JSON format based on this user's skills and experience.
        Format each question as {id, question, answer, options[]}.

        User Skills: ${userSkills}
        Experience Years: ${user.yearsExperience || "N/A"}
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
  }, [user]);

  return { questions, loadingQuiz };
};
