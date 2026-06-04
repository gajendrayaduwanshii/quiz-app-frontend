import { generateAIText } from "@/lib/aiClient";

const recommendationCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;
const RETRY_DELAYS_MS = [900, 1800, 3200];
const AI_REQUEST_TIMEOUT_MS = 12000;

const normalizeText = (value = "") => String(value || "").trim();

const makeSearchUrl = (base, query) => `${base}${encodeURIComponent(query)}`;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isTemporaryAIError = (error) => {
  const message = String(error?.message || "").toLowerCase();
  return (
    message.includes("503") ||
    message.includes("429") ||
    message.includes("unavailable") ||
    message.includes("high demand") ||
    message.includes("temporarily") ||
    message.includes("rate limit")
  );
};

const getAIRecommendationsText = async (prompt) => {
  let lastError;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return await Promise.race([
        generateAIText(prompt, {
          temperature: 0.45,
          maxTokens: 2800,
        }),
        wait(AI_REQUEST_TIMEOUT_MS).then(() => {
          throw new Error("AI request timed out.");
        }),
      ]);
    } catch (error) {
      lastError = error;

      if (!isTemporaryAIError(error) || attempt === RETRY_DELAYS_MS.length) {
        throw error;
      }

      await wait(RETRY_DELAYS_MS[attempt]);
    }
  }

  throw lastError;
};

const getProfileSignals = (profile = {}) => {
  const skillNames = (Array.isArray(profile.skills) ? profile.skills : [])
    .map((skill) => normalizeText(skill?.name))
    .filter(Boolean);
  const quizPerformance = Array.isArray(profile.quizPerformance)
    ? profile.quizPerformance
    : [];
  const quizTechnologies = quizPerformance
    .map((quiz) => normalizeText(quiz?.technology))
    .filter(Boolean);
  const weakQuiz = [...quizPerformance]
    .filter((quiz) => Number.isFinite(Number(quiz?.accuracy)))
    .sort((a, b) => Number(a?.accuracy || 0) - Number(b?.accuracy || 0))[0];
  const latestQuiz = quizPerformance[quizPerformance.length - 1];
  const wrongQuestions = (Array.isArray(profile.latestQuizMistakes)
    ? profile.latestQuizMistakes
    : []
  ).filter((question) => question && question.isCorrect === false);
  const primarySkill =
    normalizeText(weakQuiz?.technology) ||
    normalizeText(latestQuiz?.technology) ||
    skillNames[0] ||
    "Software Development";
  const secondarySkill =
    quizTechnologies.find((technology) => technology !== primarySkill) ||
    skillNames.find((skill) => skill !== primarySkill) ||
    "Interview Prep";
  const focusSkills = [
    ...new Set([primarySkill, secondarySkill, ...quizTechnologies, ...skillNames].filter(Boolean)),
  ]
    .slice(0, 4);
  const tags = focusSkills.map((skill) => normalizeText(skill).toLowerCase());

  return {
    primarySkill,
    secondarySkill,
    focusSkills,
    tags: tags.length ? tags : ["software development"],
    weakArea: normalizeText(weakQuiz?.technology) || primarySkill,
    weakAccuracy: Number(weakQuiz?.accuracy || 0),
    wrongQuestionCount: wrongQuestions.length,
    hasQuizData: quizPerformance.length > 0,
  };
};

const buildDynamicExample = (profile) => {
  const {
    primarySkill,
    secondarySkill,
    focusSkills,
    tags,
    weakArea,
    weakAccuracy,
    wrongQuestionCount,
    hasQuizData,
  } =
    getProfileSignals(profile);
  const experienceText = Number(profile?.yearsExperience || 0)
    ? `${profile.yearsExperience} years of experience`
    : "your current experience level";
  const quizText = hasQuizData
    ? `${weakArea} quiz accuracy is ${weakAccuracy}% with ${wrongQuestionCount} recent wrong answers`
    : "quiz data is not available yet";

  return {
    summary: `Based on ${experienceText} and quiz results, prioritize ${primarySkill}. ${quizText}.`,
    focusSkills,
    courses: [
      {
        title: `${primarySkill} Quiz Gap Recovery Path`,
        provider: "Coursera",
        description: `Targets ${primarySkill} quiz gaps with structured practice.`,
        tags: tags.slice(0, 3),
        url: makeSearchUrl("https://www.coursera.org/search?query=", `${primarySkill} course`),
      },
      {
        title: `${secondarySkill} Practice Project Bootcamp`,
        provider: "Udemy",
        description: `Applies quiz concepts through ${secondarySkill} projects.`,
        tags: [normalizeText(secondarySkill).toLowerCase(), "projects"],
        url: makeSearchUrl("https://www.udemy.com/courses/search/?q=", `${secondarySkill} project bootcamp`),
      },
    ],
    youtubeChannels: [
      {
        title: `${primarySkill} tutorial channel or playlist`,
        focus: `${primarySkill} quiz revision`,
        description: `Review concepts missed in ${primarySkill} quiz attempts.`,
        tags: tags.slice(0, 3),
        url: makeSearchUrl("https://www.youtube.com/results?search_query=", `${primarySkill} tutorial playlist`),
      },
      {
        title: `${weakArea} interview preparation videos`,
        focus: `${weakArea} quiz and interview gaps`,
        description: `Review weak quiz areas with focused explanations.`,
        tags: [normalizeText(weakArea).toLowerCase(), "interview"],
        url: makeSearchUrl("https://www.youtube.com/results?search_query=", `${weakArea} interview preparation`),
      },
    ],
    certifications: [
      {
        title: `${primarySkill} Professional Certificate`,
        issuer: `${primarySkill} ecosystem`,
        description: `Validate improved ${primarySkill} quiz readiness.`,
        tags: tags.slice(0, 2),
        url: makeSearchUrl("https://www.google.com/search?q=", `${primarySkill} professional certification`),
      },
      {
        title: `${secondarySkill} Skill Certification`,
        issuer: `${secondarySkill} ecosystem`,
        description: `Validates practical ${secondarySkill} learning progress.`,
        tags: [normalizeText(secondarySkill).toLowerCase()],
        url: makeSearchUrl("https://www.google.com/search?q=", `${secondarySkill} certification`),
      },
    ],
  };
};

const stripCodeFence = (text = "") =>
  String(text || "")
    .replace(/```(?:markdown|md|text)?/gi, "")
    .replace(/```/g, "")
    .trim();

const buildFallbackRecommendationText = (profile) => {
  const example = buildDynamicExample(profile);
  const formatItems = (items, getMeta) =>
    items.map((item, index) => {
      const meta = getMeta(item);
      return `${index + 1}. ${item.title} - ${meta}\n   ${item.description}\n   ${item.url}`;
    });

  return [
    "Recommended focus from your profile",
    "",
    example.summary,
    "",
    `Focus skills: ${example.focusSkills.join(", ")}`,
    "",
    "Course Suggestions",
    ...formatItems(example.courses, (item) => item.provider),
    "",
    "YouTube Channels",
    ...formatItems(example.youtubeChannels, (item) => item.focus),
    "",
    "Certification Suggestions",
    ...formatItems(example.certifications, (item) => item.issuer),
  ].join("\n");
};

const summarizeQuizResults = (quizResults) =>
  (Array.isArray(quizResults) ? quizResults : []).slice(-5).map((quiz) => {
    const questions = Array.isArray(quiz?.quizQuestion) ? quiz.quizQuestion : [];
    const correct = questions.filter(
      (question) =>
        normalizeText(question?.answer).toLowerCase() ===
        normalizeText(question?.correctAnswer).toLowerCase()
    ).length;

    return {
      technology: quiz?.technology || "Unknown",
      totalQuestions: questions.length,
      correct,
      accuracy: questions.length ? Math.round((correct / questions.length) * 100) : 0,
    };
  });

const buildProfileForAI = (user, latestQuestions) => {
  const skills = Array.isArray(user?.skills) ? user.skills : [];
  const quizResults = Array.isArray(user?.quizResult) ? user.quizResult : [];

  return {
    yearsExperience: Number(user?.yearsExperience || 0),
    role: user?.currentRole || user?.jobTitle || user?.designation || "",
    skills: skills.slice(0, 15).map((skill) => ({
      name: skill?.skillName || skill?.skill || skill?.name || "Skill",
      level: skill?.level || "Intermediate",
      yearsExperience: Number(skill?.yearsExperience || skill?.experienceYears || 0),
    })),
    quizPerformance: summarizeQuizResults(quizResults),
    latestQuizMistakes: (Array.isArray(latestQuestions) ? latestQuestions : [])
      .slice(0, 10)
      .map((question) => ({
        question: question?.question || "",
        userAnswer: question?.answer || "",
        correctAnswer: question?.correctAnswer || "",
        isCorrect:
          normalizeText(question?.answer).toLowerCase() ===
          normalizeText(question?.correctAnswer).toLowerCase(),
      })),
  };
};

const getCacheKey = (user) => {
  const skills = Array.isArray(user?.skills) ? user.skills : [];
  const quizResults = Array.isArray(user?.quizResult) ? user.quizResult : [];
  const skillKey = skills
    .map((skill) => `${skill?.skillName || skill?.skill || skill?.name}:${skill?.level || ""}`)
    .join("|");

  return [
    user?.documentId || user?.email || "anonymous",
    user?.yearsExperience || 0,
    skillKey,
    quizResults.length,
  ].join("::");
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user, latestQuestions = [] } = req.body || {};

    if (!user) {
      return res.status(400).json({ error: "User data is required" });
    }

    const cacheKey = getCacheKey(user);
    const cached = recommendationCache.get(cacheKey);

    if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
      return res.status(200).json({ recommendations: cached.recommendations });
    }

    const profile = buildProfileForAI(user, latestQuestions);
    const prompt = `
You are an AI learning advisor for a software developer learning platform.
Read this user profile and write a Gemini-style recommendation response based primarily on quiz results.
The response will be rendered as formatted text, not cards and not JSON.
Keep it personalized according to quiz performance, weak quiz technologies, wrong answers, and accuracy.
Use saved skills and years of experience only as supporting context.

User profile JSON:
${JSON.stringify(profile, null, 2)}

Rules:
- Use these exact section titles: Recommended focus from your profile, Course Suggestions, YouTube Channels, Certification Suggestions.
- Start with a short paragraph that mentions quiz result signals such as technology, accuracy, weak area, or recent wrong answers.
- Include 6 to 9 courses, 4 to 6 YouTube channels, and 4 to 6 certifications.
- For every resource include the name, provider/issuer/channel focus, why it fits, and a URL.
- Prefer real, well-known providers and official resource URLs when you know them.
- If you are unsure of an exact deep link, use a provider search URL.
- Match weak quiz areas before advanced topics.
- If quizPerformance is empty, say quiz data is missing in the summary and base all three sections on saved skills until the user completes a quiz.
- Do not invent prices, completion status, ratings, or guaranteed outcomes.
- Do not return JSON.
- Do not use tables.
- Keep the tone concise, useful, and similar to a direct Gemini answer.
`;
    const output = await getAIRecommendationsText(prompt);
    const responseText = stripCodeFence(output);

    if (!responseText) {
      throw new Error("AI returned an empty recommendation response.");
    }

    const recommendations = {
      source: "ai",
      responseText,
    };

    recommendationCache.set(cacheKey, {
      createdAt: Date.now(),
      recommendations,
    });

    return res.status(200).json({ recommendations });
  } catch (error) {
    console.error("Error in /api/ai/course-recommendations:", error);
    const temporaryAIError = isTemporaryAIError(error);

    if (req.body?.user) {
      const profile = buildProfileForAI(req.body.user, req.body.latestQuestions || []);

      return res.status(200).json({
        recommendations: {
          source: "profile-fallback",
          responseText: buildFallbackRecommendationText(profile),
          notice:
            temporaryAIError
              ? "AI model is busy right now, so these resources were generated from your saved profile and quiz signals."
              : "AI recommendations could not be generated right now, so these resources were created from your saved profile and quiz signals.",
        },
      });
    }

    return res.status(temporaryAIError ? 503 : 500).json({
      error: temporaryAIError
        ? "AI recommendations are temporarily unavailable because the AI model is busy. Please try again in a few minutes."
        : error?.message || "Unable to generate AI course recommendations right now.",
    });
  }
}
