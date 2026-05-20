import { generateAIText } from "@/lib/aiClient";

const MAX_CONTEXT_LENGTH = 18000;

const redactSensitiveFields = (value) => {
  if (Array.isArray(value)) {
    return value.map(redactSensitiveFields);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.entries(value).reduce((acc, [key, nestedValue]) => {
    const normalizedKey = key.toLowerCase();
    const isSensitive =
      normalizedKey.includes("password") ||
      normalizedKey.includes("token") ||
      normalizedKey.includes("otp") ||
      normalizedKey.includes("secret");

    acc[key] = isSensitive ? "[redacted]" : redactSensitiveFields(nestedValue);
    return acc;
  }, {});
};

const compactUserContext = (user) => {
  const safeUser = redactSensitiveFields(user || {});
  const serialized = JSON.stringify(safeUser, null, 2);

  if (serialized.length <= MAX_CONTEXT_LENGTH) {
    return serialized;
  }

  return `${serialized.slice(0, MAX_CONTEXT_LENGTH)}

[Context truncated because the profile is very large. Prioritize the available profile, resume, skills, education, work experience, and quiz result data.]`;
};

const buildSystemPrompt = ({ user, pageUrl }) => `
You are SkillSync Chatbot, an AI learning, quiz, resume, and interview preparation assistant inside the SkillSync AI app.

Use the user's available end-to-end SkillSync data as the source of truth:
- Profile and contact data
- Skills
- Education
- Work experience
- Resume analysis and uploaded resume metadata
- Quiz history, including every quiz question, user selected answers, correct answers, and performance

Behavior rules:
- Answer the user's exact question using the provided data.
- If data is missing, say what is missing and give the best next step.
- Keep answers practical, specific, and easy to act on.
- Always respond in polished, professional English.
- Use a clear mentoring tone suitable for a career and learning platform.
- Avoid casual Hinglish, slang, overly familiar phrasing, and unnecessary filler.
- Do not use Markdown bold markers, decorative asterisks, or raw formatting symbols.
- Use clean plain text with short headings and line breaks when the answer has multiple parts.
- For quiz report requests, generate a complete learning report with these sections:
  1. Quiz performance summary
  2. All questions and answers
  3. User selected answers
  4. Correct answers
  5. AI explanations
  6. Weak topic analysis
  7. Recommended learning path
  8. Interview preparation suggestions
- Do not invent quiz answers, scores, experience, or user details that are not in the data.

Current page: ${pageUrl || "Unknown"}

User data:
\`\`\`json
${compactUserContext(user)}
\`\`\`
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, user, history = [], pageUrl } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!user) {
      return res.status(400).json({ error: "User data is required" });
    }

    const recentHistory = Array.isArray(history) ? history.slice(-8) : [];
    const messages = [
      {
        role: "system",
        content: buildSystemPrompt({ user, pageUrl }),
      },
      ...recentHistory
        .filter((item) => item?.role && item?.content)
        .map((item) => ({
          role: item.role === "assistant" ? "assistant" : "user",
          content: String(item.content).slice(0, 2500),
        })),
      { role: "user", content: message },
    ];

    const answer = await generateAIText(message, {
      messages,
      temperature: 0.35,
      maxTokens: 1600,
    });

    return res.status(200).json({ answer });
  } catch (error) {
    console.error("Error in /api/ai/chatbot:", error);
    return res.status(500).json({
      error: "AI chatbot failed to answer right now. Please try again.",
    });
  }
}
