import { generateAIText } from "@/lib/aiClient";
import { normalizeQuizQuestions } from "@/utils/quizQuestions";

const quizCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// ── Extract every complete question object from raw AI text ───────────────────
// Works even when the outer JSON array is truncated mid-response.
const extractCompleteQuestions = (text) => {
  const questions = [];
  let pos = 0;

  while (pos < text.length) {
    const start = text.indexOf("{", pos);
    if (start === -1) break;

    // Walk forward matching braces to find the closing }
    let depth = 0;
    let end = -1;
    for (let j = start; j < text.length; j++) {
      if (text[j] === "{") depth++;
      else if (text[j] === "}") {
        depth--;
        if (depth === 0) { end = j; break; }
      }
    }

    if (end === -1) break; // No complete object — rest is truncated

    try {
      const q = JSON.parse(text.slice(start, end + 1));
      if (
        q.question &&
        Array.isArray(q.options) &&
        q.options.length >= 2 &&
        q.answer
      ) {
        if (!q.id) q.id = String(questions.length + 1);
        questions.push(q);
      }
    } catch { /* incomplete or malformed object — skip */ }

    pos = end + 1;
  }

  return questions;
};

// ── Try standard JSON.parse then fall back to object-by-object extraction ─────
const parseQuestions = (raw) => {
  if (!raw || !raw.trim()) return [];

  // Step 1: standard parse after stripping markdown fences
  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  // Find the outermost [...]
  const arrayStart = cleaned.indexOf("[");
  const arrayEnd = cleaned.lastIndexOf("]");

  if (arrayStart !== -1 && arrayEnd > arrayStart) {
    try {
      const slice = cleaned.slice(arrayStart, arrayEnd + 1);
      const parsed = JSON.parse(slice);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch { /* truncated or malformed — fall through */ }
  }

  // Step 2: extract individual complete question objects (handles truncation)
  return extractCompleteQuestions(cleaned);
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

    const cacheKey = `quiz_${tech}_${user.documentId || "anon"}`;
    const cached = quizCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return res.status(200).json({
        questions: normalizeQuizQuestions(cached.questions),
      });
    }

    const matchedSkill = Array.isArray(user.skills)
      ? user.skills.find(
          (s) => (s.skillName || "").toLowerCase() === tech.toLowerCase()
        )
      : null;

    const experience = matchedSkill?.yearsExperience || "N/A";
    const level = matchedSkill?.level || "N/A";

    const prompt = `You are a technical quiz generator. Generate exactly 10 multiple-choice questions for ${tech}.

Developer: level=${level}, experience=${experience} years

Rules:
- Return ONLY a valid JSON array — no markdown, no text outside the array
- Start with [ and end with ]
- Each question: {"id":"1","question":"...","options":["A","B","C","D"],"answer":"correct option text"}
- Option strings must contain only the option text; do not prefix them with A, B, C, or D
- Keep each option under 12 words
- Only one option is correct
- Mix difficulty: 4 easy, 4 medium, 2 hard

JSON array:`;

    const output = await generateAIText(prompt, {
      temperature: 0.3,
      maxTokens: 3000,
    });

    if (!output || !output.trim()) {
      console.error("Quiz API: empty AI response");
      return res.status(500).json({ error: "Empty response from AI", questions: [] });
    }

    console.log("Quiz API: raw output length", output.length);

    let questions = parseQuestions(output);

    // Normalize inconsistent AI shapes and remove incomplete questions.
    questions = normalizeQuizQuestions(questions);

    console.log("Quiz API: valid questions parsed", questions.length);

    if (questions.length === 0) {
      console.error("Quiz API: no valid questions. Raw output:", output.slice(0, 600));
      return res.status(500).json({
        error: "Failed to parse questions from AI response",
        questions: [],
        debug: output.slice(0, 300),
      });
    }

    quizCache.set(cacheKey, { questions, timestamp: Date.now() });
    return res.status(200).json({ questions });

  } catch (err) {
    console.error("Quiz API error:", err);
    return res.status(500).json({ error: "Internal Server Error", questions: [] });
  }
}
