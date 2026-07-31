import { generateAIText } from "@/lib/aiClient";
import { getInterviewerSystemPrompt } from "@/lib/interview/promptTemplates";
import { EXPERIENCE_LEVELS } from "@/lib/interview/promptTemplates";

// Uses the default model from .env (meta/llama-3.1-8b-instruct via NVIDIA)
// google/gemma-3n-e4b-it times out — not accessible on this API key tier

const safeJsonParse = (text) => {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;
    if (start === -1 || end === 0) return null;
    return JSON.parse(text.slice(start, end));
  } catch {
    return null;
  }
};

// ── Extract skill name + level + experience from Strapi skill object ──────────
const parseSkill = (s) => {
  if (!s) return null;
  if (typeof s === "string") return { name: s, level: "", years: "" };
  const name = (s.skillName || s.name || s.skill || s.title || "").trim();
  if (!name) return null;
  const level = (s.level || s.proficiency || s.skillLevel || "").trim();
  const years = (s.yearsExperience || s.experienceYears || s.years || "").trim();
  return { name, level, years };
};

// ── Build user context focused only on skills ─────────────────────────────────
const buildUserContext = (user) => {
  if (!user) return "";

  const lines = [];

  const name = user?.Name || user?.name || "";
  if (name) lines.push(`Candidate Name: ${name}`);

  // All skills with level and years — ONLY topics the AI may ask about
  const skills = Array.isArray(user?.skills)
    ? user.skills.map(parseSkill).filter(Boolean)
    : [];

  if (skills.length) {
    const skillLines = skills.map(({ name: sn, level, years }) => {
      const parts = [level, years ? `${years} yr${years === "1" ? "" : "s"}` : ""].filter(Boolean);
      return parts.length ? `${sn} (${parts.join(", ")})` : sn;
    });
    lines.push(`Candidate Skills (ONLY ask about these):\n${skillLines.map((l) => `  - ${l}`).join("\n")}`);
    lines.push(`STRICT RULE: Do NOT ask about any technology NOT in the list above — not Python, not Java, not anything else unless it is explicitly listed.`);
    lines.push(`Distribute questions evenly across all listed skills — do not repeat the same skill consecutively.`);
  }

  // Work experiences
  if (Array.isArray(user?.workExperiences) && user.workExperiences.length) {
    const workLines = user.workExperiences
      .slice(0, 3)
      .map((w) => {
        const role = w.role || w.position || w.title || "";
        const company = w.company || w.employer || "";
        const duration = w.duration || w.years || "";
        return [role, company, duration].filter(Boolean).join(" at ");
      })
      .filter(Boolean);
    if (workLines.length) lines.push(`Work History: ${workLines.join("; ")}`);
  }

  // Education
  if (Array.isArray(user?.educations) && user.educations.length) {
    const edu = user.educations[0];
    const eduStr = `${edu.degree || ""} ${edu.fieldOfStudy || edu.field || ""} from ${edu.institution || edu.school || ""}`.trim();
    if (eduStr) lines.push(`Education: ${eduStr}`);
  }

  const hasResume = !!(user?.uploadResume?.url || user?.uploadResume);
  if (hasResume) lines.push("Resume: Uploaded — ask about specific projects and achievements from their experience.");

  return lines.length ? `\nCandidate Profile:\n${lines.join("\n")}\n` : "";
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      config,
      conversationHistory = [],
      answer,
      questionNumber,
      userData,
    } = req.body || {};

    if (!config || !answer || !questionNumber) {
      return res.status(400).json({ error: "config, answer, and questionNumber are required." });
    }

    const userContext = buildUserContext(userData);
    const experienceLevelLabel = EXPERIENCE_LEVELS[config.experienceLevel] || config.experienceLevel;

    const systemPrompt = getInterviewerSystemPrompt({
      ...config,
      experienceLevel: experienceLevelLabel,
      userContext,
    });

    const messages = [
      { role: "system", content: systemPrompt },
      // Recent conversation history (last 20 turns max)
      ...conversationHistory.slice(-20).map((msg) => ({
        role: msg.role,
        content: String(msg.content).slice(0, 2000),
      })),
      // Current answer being evaluated
      { role: "user", content: `My answer to question ${questionNumber}: ${answer}` },
    ];

    const aiText = await generateAIText(answer, {
      messages,
      temperature: 0.4,
      maxTokens: 1800,
    });

    const parsed = safeJsonParse(aiText);

    if (!parsed) {
      const isLast = questionNumber >= (config.maxQuestions || 10);
      return res.status(200).json({
        evaluation: {
          technical_accuracy: 6,
          communication: 7,
          problem_solving: 6,
          confidence: 7,
          completeness: 6,
          strengths: ["Answer received and processed"],
          weaknesses: [],
          suggestions: ["Provide more specific examples in your answers"],
          ideal_answer: "A strong answer would include specific examples with measurable outcomes, demonstrate clear problem-solving thinking, and show awareness of trade-offs.",
        },
        interviewer_comment: isLast
          ? "Thank you for completing the interview. Your report is being generated."
          : "Thank you for your answer. Let's move on.",
        next_question: isLast ? null : "Can you describe a challenging technical problem you solved and the approach you took?",
        question_number: questionNumber,
        is_complete: isLast,
      });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Error in /api/mock-interview/chat:", err);
    return res.status(500).json({ error: "Failed to process your answer. Please try again." });
  }
}
