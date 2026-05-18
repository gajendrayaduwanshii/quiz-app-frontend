import { generateAIText } from "@/lib/aiClient";

const logicalQuizCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000;

const extractJsonArray = (text) => {
  if (!text) return null;

  const codeBlockMatch = text.match(/```(?:json)?\s*(\[.*?\])\s*```/s);
  const directMatch = text.match(/\[[\s\S]*\]/);
  const jsonString = (codeBlockMatch?.[1] || directMatch?.[0] || "")
    .trim()
    .replace(/,(\s*[}\]])/g, "$1");

  if (!jsonString) return null;

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Logical quiz JSON parse failed:", error);
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user, tech } = req.body;

    if (!user || !tech) {
      return res.status(400).json({ error: "Missing user or tech" });
    }

    const matchedSkill = Array.isArray(user.skills)
      ? user.skills.find(
          (skill) => skill.skillName?.toLowerCase() === String(tech).toLowerCase()
        )
      : null;

    const experience = matchedSkill?.yearsExperience || user.yearsExperience || "N/A";
    const level = matchedSkill?.level || "Intermediate";
    const cacheKey = `logical_${String(tech).toLowerCase()}_${level}_${experience}`;
    const cachedData = logicalQuizCache.get(cacheKey);

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return res.status(200).json({ questions: cachedData.questions, cached: true });
    }

    const prompt = `
You are a senior technical interviewer. Generate logical and practical coding reasoning questions for ${tech}.

Developer context:
- Skill: ${tech}
- Level: ${level}
- Years of experience: ${experience}
- Other skills: ${user.skills?.map((skill) => skill.skillName).join(", ") || "Not specified"}

Return exactly 8 questions as a valid JSON array.
Each item must use this exact shape:
{
  "id": 1,
  "question": "Short logical/coding reasoning question",
  "input": "Optional input or scenario. Use empty string if not needed.",
  "expectedOutput": "Exact expected answer/output as a short string",
  "explanation": "One sentence explaining why the expected output is correct."
}

Rules:
- Make questions job-relevant and interview-style.
- Mix output prediction, semantics, debugging, and reasoning.
- Keep expectedOutput short so it can be checked exactly.
- Use ${tech} concepts when possible.
- Respond ONLY with valid JSON. No markdown, no commentary.
`;

    const output = await generateAIText(prompt, {
      temperature: 0.35,
      responseMimeType: "application/json",
    });

    let questions = extractJsonArray(output);

    if (!Array.isArray(questions)) {
      return res.status(200).json({
        questions: [],
        error: "Could not parse AI logical questions.",
      });
    }

    questions = questions
      .filter((question) => question?.question && question?.expectedOutput)
      .slice(0, 8)
      .map((question, index) => ({
        id: question.id || index + 1,
        question: String(question.question),
        input: question.input ? String(question.input) : "",
        expectedOutput: String(question.expectedOutput),
        explanation: question.explanation ? String(question.explanation) : "",
      }));

    if (!questions.length) {
      return res.status(200).json({
        questions: [],
        error: "AI did not return valid logical questions.",
      });
    }

    logicalQuizCache.set(cacheKey, {
      questions,
      timestamp: Date.now(),
    });

    return res.status(200).json({ questions });
  } catch (error) {
    console.error("Error in /api/logical/quiz:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
