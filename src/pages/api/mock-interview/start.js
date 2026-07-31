import { generateAIText } from "@/lib/aiClient";
import { getInterviewOpeningPrompt } from "@/lib/interview/promptTemplates";

// Uses the default model from .env: meta/llama-3.1-8b-instruct (NVIDIA)
// Note: google/gemma-3n-e4b-it times out on this API key — not enabled

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

const detectExperienceLevel = (user) => {
  const years = Number(user?.yearsExperience) || 0;
  if (years === 0) return { key: "fresher", label: "Fresher" };
  if (years <= 3) return { key: "1-3", label: "1–3 Years" };
  if (years <= 5) return { key: "3-5", label: "3–5 Years" };
  return { key: "5+", label: "5+ Years" };
};

const detectJobRole = (user) => {
  if (user?.workExperiences?.length) {
    const latest = user.workExperiences[0];
    const role = latest?.role || latest?.position || latest?.title || "";
    if (role) return role;
  }
  return user?.currentRole || user?.role || "Software Developer";
};

const detectInterviewType = (user, role) => {
  const techKw = ["developer", "engineer", "devops", "architect", "scientist", "analyst", "qa", "tester", "programmer"];
  const roleLower = (role || "").toLowerCase();
  if (techKw.some((kw) => roleLower.includes(kw))) return "technical";
  if (Array.isArray(user?.skills) && user.skills.length > 0) return "technical";
  if (Array.isArray(user?.quizResult) && user.quizResult.length > 0) return "technical";
  return "hr";
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

const buildUserContext = (user) => {
  const lines = [];

  const name = user?.Name || user?.name || "";
  if (name) lines.push(`Candidate Name: ${name}`);

  // All skills with level and experience — these are the ONLY topics allowed
  const skills = Array.isArray(user?.skills)
    ? user.skills.map(parseSkill).filter(Boolean)
    : [];

  if (skills.length) {
    const skillLines = skills.map(({ name: sn, level, years }) => {
      const parts = [level, years ? `${years} yr${years === "1" ? "" : "s"}` : ""].filter(Boolean);
      return parts.length ? `${sn} (${parts.join(", ")})` : sn;
    });
    lines.push(`Candidate Skills (ONLY ask about these):\n${skillLines.map((l) => `  - ${l}`).join("\n")}`);
    lines.push(`STRICT RULE: Do NOT ask about any technology NOT in the list above. If a skill is not listed, do not ask about it under any circumstances.`);
    lines.push(`Distribute questions evenly across all listed skills — do not focus on just one or two.`);
  }

  // Work experience
  if (Array.isArray(user?.workExperiences) && user.workExperiences.length) {
    const workLines = user.workExperiences.slice(0, 3).map((w) => {
      const r = w.role || w.position || w.title || "";
      const c = w.company || w.employer || "";
      const d = w.duration || w.years || "";
      return [r, c, d].filter(Boolean).join(" at ");
    }).filter(Boolean);
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

  return lines.join("\n");
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userData: user } = req.body || {};
    if (!user) return res.status(400).json({ error: "userData is required." });

    const jobRole = detectJobRole(user);
    const { key: experienceLevelKey, label: experienceLevelLabel } = detectExperienceLevel(user);
    const interviewType = detectInterviewType(user, jobRole);
    const maxQuestions = 30;
    const maxTimeMinutes = 45;

    const userContext = buildUserContext(user);

    const config = { interviewType, experienceLevel: experienceLevelKey, jobRole, maxQuestions, maxTimeMinutes };

    const prompt = getInterviewOpeningPrompt({
      interviewType,
      experienceLevel: experienceLevelLabel,
      jobRole,
      userContext,
      maxQuestions,
    });

    const aiText = await generateAIText(prompt, {
      temperature: 0.5,
      maxTokens: 512,
    });

    const parsed = safeJsonParse(aiText);

    if (parsed?.opening_message && parsed?.first_question) {
      return res.status(200).json({
        config,
        opening_message: parsed.opening_message,
        first_question: parsed.first_question,
        question_number: 1,
      });
    }

    // Fallback if AI returns non-JSON or unexpected format
    return res.status(200).json({
      config,
      opening_message: `Hello! Welcome to your ${jobRole} interview. I'll ask you ${maxQuestions} questions over ${maxTimeMinutes} minutes, starting easy and getting progressively harder. Let's begin!`,
      first_question: `Tell me about yourself and your experience as a ${jobRole}.`,
      question_number: 1,
    });
  } catch (err) {
    console.error("Error in /api/mock-interview/start:", err);
    return res.status(500).json({ error: err.message || "Failed to start the interview." });
  }
}
