import { generateAIText } from "@/lib/aiClient";

const recommendationCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;

const normalizeText = (value = "") => String(value || "").trim();

const makeSearchUrl = (base, query) => `${base}${encodeURIComponent(query)}`;

const stripCodeFence = (text = "") =>
  String(text || "")
    .replace(/```(?:markdown|md|text)?/gi, "")
    .replace(/```/g, "")
    .trim();

const getLiveAIRecommendationText = async (profile) => {
  const prompt = `
You are a live AI career resource advisor inside SkillSync AI.
Create real-time, profile-specific recommendations for this user.

User profile JSON:
${JSON.stringify(profile, null, 2)}

Return plain text only. Do not return JSON. Do not use tables.

Use these exact section titles:
Recommended focus from your profile
Course Suggestions
YouTube Channels
Certification Suggestions

Rules:
- Make recommendations specific to saved skills, current role, desired job type, years of experience, education, work experience, and quiz signals if available.
- Under Recommended focus from your profile, write 3 to 4 detailed sentences.
- Under Course Suggestions, include exactly 4 numbered resources.
- Under YouTube Channels, include exactly 3 numbered resources.
- Under Certification Suggestions, include exactly 3 numbered resources.
- Every numbered resource must use this single-line format:
  Name - provider/focus. Why it fits: profile-specific reason. What to do: concrete task. Outcome: practical result. Priority: High/Medium/Low. Time: realistic duration. URL: link
- Prefer well-known real providers. If you do not know an exact page URL, use a real search URL from Coursera, Udemy, YouTube, freeCodeCamp, LinkedIn Learning, or Google.
- Do not invent prices, ratings, enrollment counts, completion status, or guaranteed jobs.
`;

  const output = await generateAIText(prompt, {
    temperature: 0.35,
    maxTokens: 4200,
  });

  const responseText = stripCodeFence(output);

  if (!responseText) {
    throw new Error("Live AI returned an empty response.");
  }

  return responseText;
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
  const primarySkill = skillNames[0] || normalizeText(latestQuiz?.technology) || "Software Development";
  const secondarySkill =
    skillNames.find((skill) => skill !== primarySkill) ||
    quizTechnologies.find((technology) => technology !== primarySkill) ||
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
  const roleText = profile?.role ? `target/current role is ${profile.role}` : "target role is not specified";
  const quizText = hasQuizData
    ? `Quiz support signal: ${weakArea} accuracy is ${weakAccuracy}% with ${wrongQuestionCount} recent wrong answers`
    : "Quiz support signal: quiz data is not available yet";

  return {
    summary: `Based on ${experienceText}, saved skills, and ${roleText}, prioritize ${primarySkill}. ${quizText}.`,
    focusSkills,
    courses: [
      {
        title: `${primarySkill} Career Foundation Path`,
        provider: "Coursera",
        description: `Why it fits: ${primarySkill} is the strongest available profile signal. What to do: complete one structured beginner-to-intermediate path and document notes. Outcome: stronger foundation for job matching and interviews. Priority: High. Time: 2-3 weeks.`,
        tags: tags.slice(0, 3),
        url: makeSearchUrl("https://www.coursera.org/search?query=", `${primarySkill} course`),
      },
      {
        title: `${secondarySkill} Practice Project Bootcamp`,
        provider: "Udemy",
        description: `Why it fits: adds practical project depth around ${secondarySkill}. What to do: complete one end-to-end project and add it to the resume. Outcome: better portfolio proof. Priority: Medium. Time: 2 weeks.`,
        tags: [normalizeText(secondarySkill).toLowerCase(), "projects"],
        url: makeSearchUrl("https://www.udemy.com/courses/search/?q=", `${secondarySkill} project bootcamp`),
      },
    ],
    youtubeChannels: [
      {
        title: `${primarySkill} tutorial channel or playlist`,
        focus: `${primarySkill} quiz revision`,
        description: `Why it fits: fast revision for ${primarySkill}. What to watch: fundamentals, interview questions, and one project playlist. Outcome: daily practice without heavy course load. Priority: High. Time: 30 minutes/day.`,
        tags: tags.slice(0, 3),
        url: makeSearchUrl("https://www.youtube.com/results?search_query=", `${primarySkill} tutorial playlist`),
      },
      {
        title: `${weakArea} interview preparation videos`,
        focus: `${weakArea} quiz and interview gaps`,
        description: `Why it fits: supports weak area preparation. What to watch: common mistakes and interview-style examples. Outcome: stronger confidence before mock interviews. Priority: Medium. Time: 3 sessions.`,
        tags: [normalizeText(weakArea).toLowerCase(), "interview"],
        url: makeSearchUrl("https://www.youtube.com/results?search_query=", `${weakArea} interview preparation`),
      },
    ],
    certifications: [
      {
        title: `${primarySkill} Professional Certificate`,
        issuer: `${primarySkill} ecosystem`,
        description: `Why it fits: validates the profile's main skill direction. When to take: after completing one project and scoring better in quizzes. Outcome: useful credential signal for applications. Priority: Medium.`,
        tags: tags.slice(0, 2),
        url: makeSearchUrl("https://www.google.com/search?q=", `${primarySkill} professional certification`),
      },
      {
        title: `${secondarySkill} Skill Certification`,
        issuer: `${secondarySkill} ecosystem`,
        description: `Why it fits: supports the secondary skill path. When to take: after building a portfolio example. Outcome: adds proof for the target role. Priority: Low.`,
        tags: [normalizeText(secondarySkill).toLowerCase()],
        url: makeSearchUrl("https://www.google.com/search?q=", `${secondarySkill} certification`),
      },
    ],
  };
};

const buildProfileRecommendationText = (profile) => {
  const example = buildDynamicExample(profile);
  const { primarySkill, secondarySkill, focusSkills, weakArea, weakAccuracy, hasQuizData } =
    getProfileSignals(profile);
  const role = profile.role || profile.desiredJobType || "your target role";
  const experience = Number(profile.yearsExperience || 0);
  const courseResources = [
    ...example.courses,
    {
      title: `${primarySkill} Project-Based Learning`,
      provider: "Udemy",
      description: `Why it fits: projects make your ${primarySkill} skill visible to recruiters. What to do: build one portfolio project and write 3 resume bullets about it. Outcome: stronger proof for applications. Priority: High. Time: 2 weeks.`,
      url: makeSearchUrl("https://www.udemy.com/courses/search/?q=", `${primarySkill} project course`),
    },
    {
      title: `${primarySkill} Official Documentation Track`,
      provider: "Official docs",
      description: `Why it fits: official docs help you learn current syntax and best practices. What to do: read fundamentals, complete examples, and save useful patterns. Outcome: cleaner interview explanations. Priority: Medium. Time: 1 week.`,
      url: makeSearchUrl("https://www.google.com/search?q=", `${primarySkill} official documentation tutorial`),
    },
    {
      title: `${secondarySkill} Hands-on Practice`,
      provider: "freeCodeCamp / guided practice",
      description: `Why it fits: ${secondarySkill} supports your main profile direction. What to do: finish a guided module and connect it with ${primarySkill}. Outcome: broader job readiness. Priority: Medium. Time: 7-10 days.`,
      url: makeSearchUrl("https://www.freecodecamp.org/news/search/?query=", `${secondarySkill}`),
    },
    {
      title: `${role} Interview Preparation`,
      provider: "LinkedIn Learning / search",
      description: `Why it fits: your resources should connect directly to ${role}. What to do: practice common role questions and prepare examples from your projects. Outcome: better interview confidence. Priority: Medium. Time: 1 week.`,
      url: makeSearchUrl("https://www.linkedin.com/learning/search?keywords=", `${role} interview preparation`),
    },
  ];
  const youtubeResources = [
    ...example.youtubeChannels,
    {
      title: `${primarySkill} Crash Course`,
      focus: "Fast concept revision",
      description: `Why it fits: quick revision keeps learning momentum high. What to do: watch one crash course and pause to code every example. Outcome: faster recall during quizzes and interviews. Priority: High. Time: 2-3 sessions.`,
      url: makeSearchUrl("https://www.youtube.com/results?search_query=", `${primarySkill} crash course`),
    },
    {
      title: `${primarySkill} Project Tutorial`,
      focus: "Portfolio building",
      description: `Why it fits: project videos convert skills into visible proof. What to do: build along, then customize the UI/features. Outcome: one portfolio-ready project. Priority: High. Time: 1 week.`,
      url: makeSearchUrl("https://www.youtube.com/results?search_query=", `${primarySkill} project tutorial`),
    },
    {
      title: `${role} Mock Interview`,
      focus: "Interview readiness",
      description: `Why it fits: role-specific mock interviews show expected question depth. What to do: answer out loud and note weak answers. Outcome: better interview communication. Priority: Medium. Time: 3 sessions.`,
      url: makeSearchUrl("https://www.youtube.com/results?search_query=", `${role} mock interview`),
    },
  ];
  const certificationResources = [
    ...example.certifications,
    {
      title: `${primarySkill} Certification Roadmap`,
      issuer: "Certification search",
      description: `Why it fits: certification is useful after skills and projects are visible. When to take: after completing one project and revising fundamentals. Outcome: an extra trust signal for profile screening. Priority: Medium. Time: after 30 days.`,
      url: makeSearchUrl("https://www.google.com/search?q=", `${primarySkill} certification roadmap`),
    },
    {
      title: `${role} Professional Certificate`,
      issuer: "Coursera / Google search",
      description: `Why it fits: role-aligned certificates look more relevant than random badges. When to take: after your profile has projects and resume keywords. Outcome: targeted credential for applications. Priority: Low. Time: 1-2 months.`,
      url: makeSearchUrl("https://www.coursera.org/search?query=", `${role} professional certificate`),
    },
  ];
  const formatItems = (items, getMeta) =>
    items.map((item, index) => {
      const meta = getMeta(item);
      return `${index + 1}. ${item.title} - ${meta}. ${item.description} URL: ${item.url}`;
    });

  return [
    "Recommended focus from your profile",
    "",
    `Your current resource plan is generated from saved profile signals, not a fragile AI fallback. The strongest focus area is ${primarySkill}, with ${secondarySkill} as the support skill for ${role}. ${experience ? `Your ${experience} years of experience means resources should be practical and portfolio-driven.` : "Because experience is not strongly defined yet, start with foundation plus project proof."} ${hasQuizData ? `Quiz support signal shows ${weakArea} around ${weakAccuracy}% accuracy, so revision should support the resource order.` : "Quiz data is optional here; the plan still works from your profile skills and target role."} For the next 30 days, finish one structured course, one YouTube project, and one resume-ready portfolio improvement.`,
    "",
    `Focus skills: ${focusSkills.join(", ")}`,
    "",
    "Course Suggestions",
    ...formatItems(courseResources, (item) => item.provider),
    "",
    "YouTube Channels",
    ...formatItems(youtubeResources, (item) => item.focus),
    "",
    "Certification Suggestions",
    ...formatItems(certificationResources, (item) => item.issuer),
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
  const workExperiences = Array.isArray(user?.workExperiences) ? user.workExperiences : [];
  const educations = Array.isArray(user?.educations) ? user.educations : [];

  return {
    yearsExperience: Number(user?.yearsExperience || 0),
    role: user?.currentJobTitle || user?.currentRole || user?.jobTitle || user?.designation || "",
    company: user?.currentCompany || "",
    desiredJobType: user?.desiredJobType || "",
    education: educations.slice(0, 4).map((education) => ({
      degree: education?.degree || "",
      institution: education?.institution || "",
      passingYear: education?.passingYear || education?.year || "",
      grade: education?.grade || "",
    })),
    workExperience: workExperiences.slice(0, 4).map((work) => ({
      jobTitle: work?.jobTitle || work?.title || "",
      company: work?.company || "",
      description: work?.jobDescription || work?.description || "",
      current: Boolean(work?.current),
    })),
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
    "live-ai-only-v1",
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
    const recommendations = {
      source: "live-ai",
      responseText: await getLiveAIRecommendationText(profile),
    };

    recommendationCache.set(cacheKey, {
      createdAt: Date.now(),
      recommendations,
    });

    return res.status(200).json({ recommendations });
  } catch (error) {
    console.error("Error in /api/ai/course-recommendations:", error);
    return res.status(500).json({
      error: error?.message || "Unable to generate course recommendations right now.",
    });
  }
}
