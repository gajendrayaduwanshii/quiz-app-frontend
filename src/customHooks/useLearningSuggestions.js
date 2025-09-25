import { useState, useEffect } from "react";

export const useLearningSuggestions = (user, questions) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    // Don't run if user or questions are missing/empty
    if (!user || !questions || questions.length === 0) {
      setSuggestions([]);
      return;
    }

    const callAIForSuggestions = async () => {
      setLoadingSuggestions(true);

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) {
        console.error("API key for learning suggestions is missing.");
        setLoadingSuggestions(false);
        return;
      }

      const url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

      const skillsText = Array.isArray(user.skills)
        ? user.skills
            .map(
              (s) => `- ${s.skillName}: ${s.level} (${s.yearsExperience} years)`
            )
            .join("\n")
        : "No skills available";

      // Build the prompt for the AI model with detailed quiz info and format instructions
      const prompt = `
You are a helpful personalized learning assistant.
User skills and experience:
${skillsText}
The user took a quiz on technology: [Technology Placeholder].
Quiz result: [Result Placeholder].

Here are the quiz questions, user's answers, and the correct answers:

${questions
  .map(
    (q, i) =>
      `${i + 1}. Question: ${q.question}\nUser's answer: ${
        q.answer || "No answer"
      }\nCorrect answer: ${q.correctAnswer}\n`
  )
  .join("\n")}

Based on this information, generate a detailed personalized learning plan for the user.
- Clearly highlight where the user made mistakes or lacked knowledge.
- Suggest specific topics or resources the user should study next.
- The response should be comprehensive, with at least 1000 words.
- Format the output strictly as a JSON array of objects, each with "title" and "detail" fields.
- Do not give me my questions answers you can give only right path and learning and give me proper guidance to learning according to my all tech

Example response format:
[
  {
    "title": "Understanding State Management",
    "detail": "Focus on learning useState and useReducer hooks in React to manage component state effectively..."
  },
  ...
]
`;

      // Optional: You can dynamically replace [Technology Placeholder] and [Result Placeholder]
      // If user.quizResult and technology/result data available, do that here.
      // For example:
      // let technology = user.latestQuiz?.technology || "N/A";
      // let result = user.latestQuiz?.result || "N/A";
      // Then replace those placeholders with template literals.

      // Prepare final prompt (if needed dynamic values)
      // For now, let's replace placeholders here dynamically if possible:

      const technology = user.latestQuiz?.technology || "N/A";
      const result = user.latestQuiz?.result?.toUpperCase() || "N/A";

      const finalPrompt = prompt
        .replace("[Technology Placeholder]", technology)
        .replace("[Result Placeholder]", result);

      const body = JSON.stringify({
        contents: [{ parts: [{ text: finalPrompt }] }],
      });

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": apiKey,
          },
          body,
        });

        if (!res.ok) {
          throw new Error(`AI API returned status ${res.status}`);
        }

        const data = await res.json();

        // AI response expected in this path, parse JSON array from text
        const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const jsonMatch = output.match(/\[.*\]/s);

        if (jsonMatch) {
          try {
            const parsedSuggestions = JSON.parse(jsonMatch[0]);
            setSuggestions(parsedSuggestions);
          } catch (jsonError) {
            console.error("Failed to parse suggestions JSON:", jsonError);
            setSuggestions([]);
          }
        } else {
          console.warn("Suggestions JSON not found in AI response.");
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching learning suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    callAIForSuggestions();

    // Optional: you can add cleanup / abort controller to cancel fetch on unmount
  }, [user, questions]);

  return { suggestions, loadingSuggestions };
};
