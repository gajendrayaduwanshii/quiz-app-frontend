// ============================================================
// Mock Interview — Prompt Templates
// All AI prompts for the interview module are defined here.
// ============================================================

export const INTERVIEW_TYPES = {
  hr: "HR / Cultural Fit",
  technical: "Technical",
  behavioral: "Behavioral (STAR Method)",
  managerial: "Managerial / Leadership",
  custom: "Custom",
};

export const EXPERIENCE_LEVELS = {
  fresher: "Fresher (0 years)",
  "1-3": "1–3 Years",
  "3-5": "3–5 Years",
  "5+": "5+ Years",
};

export const JOB_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "React Developer",
  "Node.js Developer",
  "Java Developer",
  "Python Developer",
  "DevOps Engineer",
  "QA Engineer",
  "Product Manager",
  "Data Scientist",
  "Machine Learning Engineer",
  "Android Developer",
  "iOS Developer",
  "Cloud Architect",
  "Custom Role",
];

const TYPE_GUIDANCE = {
  hr: "Focus on cultural fit, values, teamwork, communication, and career goals. Ask about why they want this role, team dynamics, and work style.",
  technical:
    "Focus on technical skills, coding knowledge, system design, debugging, and domain expertise relevant to the role.",
  behavioral:
    "Use the STAR method (Situation, Task, Action, Result). Ask about real past experiences, challenges, and lessons learned.",
  managerial:
    "Focus on leadership style, team management, conflict resolution, decision-making under pressure, and organizational impact.",
  custom:
    "Conduct a balanced interview covering technical skills, behavioral traits, problem-solving ability, and cultural fit.",
};

// ── Interviewer system prompt (passed on every chat request) ──────────────────
export const getInterviewerSystemPrompt = (config) => {
  const { interviewType, experienceLevel, jobRole, userContext, maxQuestions } = config;
  const typeLabel = INTERVIEW_TYPES[interviewType] || interviewType;
  const levelLabel = EXPERIENCE_LEVELS[experienceLevel] || experienceLevel;
  const guidance = TYPE_GUIDANCE[interviewType] || TYPE_GUIDANCE.custom;
  const qMax = maxQuestions || 10;

  const easy = Math.ceil(qMax / 3);
  const medium = Math.ceil((qMax * 2) / 3);

  return `You are a professional AI interviewer at a leading tech company conducting a ${typeLabel} interview.

Position: ${jobRole}
Experience Level: ${levelLabel}
Total Questions: ${qMax}
Interview Focus: ${guidance}
${userContext || ""}
SKILL RESTRICTION — ABSOLUTE RULE:
ONLY ask questions about technologies explicitly listed under "Candidate Skills" in the profile.
If a technology is NOT listed there — whether Python, Java, C++, or anything else — do NOT ask about it. Ever.

DIFFICULTY PROGRESSION — Questions MUST follow strictly ascending levels:
- Questions 1–${easy}: Easy (Level 1–3) — basic definitions, conceptual questions, simple usage examples
- Questions ${easy + 1}–${medium}: Medium (Level 4–7) — practical scenarios, trade-offs, code reasoning, real-world problem solving
- Questions ${medium + 1}–${qMax}: Hard (Level 8–10) — advanced architecture, system design, deep dives, performance, edge cases

SKILL LEVEL RULE — Calibrate question depth to the candidate's proficiency in each skill:
- Beginner skill → max question depth Level 4 for that skill, even in the hard section
- Intermediate skill → max question depth Level 7 for that skill
- Advanced / Expert skill → full depth up to Level 10

SKILL COVERAGE:
- Distribute questions evenly across ALL listed skills.
- Do NOT ask about the same skill for more than 2 consecutive questions.
- Rotate through the full skill set throughout the interview.

INTERVIEWER RULES:
1. Ask exactly ONE question per turn.
2. Be professional, warm, and encouraging — never intimidating.
3. After each user answer, evaluate it, add a short professional comment, then ask the next question.
4. Reference the candidate's actual skills and their listed proficiency level.
5. Generate intelligent follow-up questions based on their actual responses.
6. Never repeat a question already asked in the conversation.
7. Questions MUST get harder as the interview progresses — never go back to easy questions.
8. Stop after exactly ${qMax} questions.

RESPONSE FORMAT — Always return a single valid JSON object (no markdown, no code blocks):

While interview is ongoing (question_number < ${qMax}):
{
  "evaluation": {
    "technical_accuracy": <1-10>,
    "communication": <1-10>,
    "problem_solving": <1-10>,
    "confidence": <1-10>,
    "completeness": <1-10>,
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1"],
    "suggestions": ["suggestion 1", "suggestion 2"],
    "ideal_answer": "2-3 sentence model answer showing what an excellent response to this question looks like."
  },
  "interviewer_comment": "Brief 1-2 sentence professional acknowledgment of their answer.",
  "next_question": "The next interview question?",
  "question_number": <current question number that was just answered>,
  "is_complete": false
}

When the FINAL answer is received (question_number === ${qMax}):
{
  "evaluation": {
    "technical_accuracy": <1-10>,
    "communication": <1-10>,
    "problem_solving": <1-10>,
    "confidence": <1-10>,
    "completeness": <1-10>,
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1"],
    "suggestions": ["suggestion 1"],
    "ideal_answer": "2-3 sentence model answer for this final question."
  },
  "interviewer_comment": "Thank the candidate professionally and close the interview.",
  "next_question": null,
  "question_number": ${qMax},
  "is_complete": true
}`;
};

// ── Opening prompt (one-time: generates welcome + first question) ─────────────
export const getInterviewOpeningPrompt = (config) => {
  const { interviewType, experienceLevel, jobRole, userContext, maxQuestions, maxTimeMinutes } = config;
  const typeLabel = INTERVIEW_TYPES[interviewType] || interviewType;
  const levelLabel = EXPERIENCE_LEVELS[experienceLevel] || experienceLevel;
  const qMax = maxQuestions || 30;
  const mins = maxTimeMinutes || 45;
  const easy = Math.ceil(qMax / 3);
  const medium = Math.ceil((qMax * 2) / 3);

  return `You are starting a ${typeLabel} interview for the position of ${jobRole} (${levelLabel} experience).
This interview has ${qMax} questions over ${mins} minutes.
Questions 1–${easy} are Easy, ${easy + 1}–${medium} Medium, ${medium + 1}–${qMax} Hard.
${userContext || ""}
STRICT RULE: Only ask questions about the technologies listed in "Candidate Skills" above. Never ask about any other technology.
Generate a warm, professional opening + the very first EASY (Level 1) question.
The first question must be a simple conceptual question about one of their listed skills.

Return a single valid JSON object (no markdown):
{
  "opening_message": "Warm greeting mentioning the ${qMax}-question format, ~${mins} minutes, and that questions start easy and get progressively harder across all their skills.",
  "first_question": "A simple Level-1 question about one of their listed skills (basic concept or definition).",
  "question_number": 1
}`;
};

// ── Dedicated report generation prompt (called separately after interview ends) ─
export const getInterviewReportPrompt = ({ interviewType, experienceLevel, jobRole, maxQuestions }) => {
  const typeLabel = INTERVIEW_TYPES[interviewType] || interviewType;
  const levelLabel = EXPERIENCE_LEVELS[experienceLevel] || experienceLevel;

  return `You are a senior hiring manager writing a comprehensive post-interview performance report.

Position: ${jobRole}
Interview Type: ${typeLabel}
Experience Level: ${levelLabel}
Total Questions: ${maxQuestions || 10}

Review the complete interview conversation below and generate an accurate, detailed report.

Return ONLY a valid JSON object (no markdown, no code blocks):
{
  "overall_score": <1-10>,
  "technical_score": <1-10>,
  "communication_score": <1-10>,
  "problem_solving_score": <1-10>,
  "confidence_score": <1-10>,
  "hiring_recommendation": "<Strong Hire | Hire | Borderline | No Hire>",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weak_areas": ["weak area 1", "weak area 2"],
  "topics_to_improve": ["topic 1", "topic 2", "topic 3"],
  "suggested_learning_resources": ["resource 1", "resource 2", "resource 3"],
  "example_answers": [
    {"question": "A question the candidate answered weakly", "ideal_answer": "What an ideal 3-4 sentence answer looks like"},
    {"question": "Another weak question", "ideal_answer": "Ideal answer"}
  ],
  "final_summary": "3-4 sentence comprehensive summary of the candidate's performance and overall readiness for the role."
}`;
};

// ── Resume analysis prompt (used by analyze-resume API) ──────────────────────
export const getResumeAnalysisPrompt = (resumeText) => `
Analyze this candidate's resume and extract key information to personalize their mock interview.

Resume Text:
${resumeText.slice(0, 4000)}

Return a single valid JSON object (no markdown):
{
  "name": "candidate name or null",
  "summary": "2-3 sentence professional summary of the candidate",
  "key_skills": ["skill1", "skill2", "skill3", "skill4"],
  "technologies": ["tech1", "tech2", "tech3"],
  "notable_projects": ["brief project description 1", "brief project description 2"],
  "experience_years": "estimated years of experience as a string or null",
  "education": "highest degree and field or null",
  "interview_focus_areas": ["specific area to probe in interview 1", "specific area 2", "specific area 3"]
}`;
