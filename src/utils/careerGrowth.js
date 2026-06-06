const normalizeText = (value = "") =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getSkillName = (skill) =>
  skill?.skillName || skill?.skill || skill?.name || "";

const getLatestQuizScore = (user) => {
  const quizzes = Array.isArray(user?.quizResult) ? user.quizResult : [];
  const latestQuiz = quizzes[quizzes.length - 1];
  const questions = Array.isArray(latestQuiz?.quizQuestion) ? latestQuiz.quizQuestion : [];

  if (!questions.length) return 0;

  const correct = questions.filter(
    (question) =>
      String(question?.answer || "").trim().toLowerCase() ===
      String(question?.correctAnswer || "").trim().toLowerCase()
  ).length;

  return Math.round((correct / questions.length) * 100);
};

export const getProfileSkillNames = (user) =>
  (Array.isArray(user?.skills) ? user.skills : [])
    .map(getSkillName)
    .filter(Boolean);

export const calculateCareerReadiness = (user) => {
  const skillCount = getProfileSkillNames(user).length;
  const workCount = Array.isArray(user?.workExperiences) ? user.workExperiences.length : 0;
  const educationCount = Array.isArray(user?.educations) ? user.educations.length : 0;
  const quizCount = Array.isArray(user?.quizResult) ? user.quizResult.length : 0;
  const latestQuizScore = getLatestQuizScore(user);

  const profileSignal = [
    user?.name,
    user?.email,
    user?.phoneNumber,
    user?.currentJobTitle,
    user?.desiredJobType,
    user?.yearsExperience,
  ].filter(Boolean).length * 5;

  return Math.min(
    100,
    Math.round(
      profileSignal +
        Math.min(skillCount * 6, 30) +
        Math.min(workCount * 8, 16) +
        Math.min(educationCount * 6, 12) +
        (user?.uploadResume ? 14 : 0) +
        Math.min(quizCount * 4, 12) +
        Math.min(latestQuizScore * 0.12, 12)
    )
  );
};

export const buildDailyCareerActions = (user) => {
  const actions = [];
  const skills = getProfileSkillNames(user);
  const latestQuizScore = getLatestQuizScore(user);

  if (!user?.uploadResume) {
    actions.push({
      title: "Upload resume",
      detail: "Unlock ATS analysis and role-focused improvement suggestions.",
      href: "/profile",
      priority: "High",
    });
  }

  if (skills.length < 5) {
    actions.push({
      title: "Add more skills",
      detail: "A richer skill profile improves recommendations and job match scoring.",
      href: "/profile",
      priority: "High",
    });
  }

  if (!Array.isArray(user?.quizResult) || !user.quizResult.length) {
    actions.push({
      title: "Take one skill quiz",
      detail: "Create a measurable baseline for your learning and interview readiness.",
      href: "/technologies",
      priority: "Medium",
    });
  } else if (latestQuizScore < 70) {
    actions.push({
      title: "Review weak quiz topics",
      detail: `Latest score is ${latestQuizScore}%. Practice missed concepts before moving ahead.`,
      href: "/learning",
      priority: "Medium",
    });
  }

  actions.push({
    title: "Check a job description",
    detail: "Paste one target job and see your match score plus missing keywords.",
    href: "/jobMatch",
    priority: "Growth",
  });

  return actions.slice(0, 4);
};

export const analyzeJobMatch = (user, jobDescription) => {
  const text = normalizeText(jobDescription);
  const userSkills = getProfileSkillNames(user);
  const normalizedUserSkills = userSkills.map((skill) => ({
    original: skill,
    normalized: normalizeText(skill),
  }));

  const matchedSkills = normalizedUserSkills
    .filter((skill) => skill.normalized && text.includes(skill.normalized))
    .map((skill) => skill.original);

  const commonRoleKeywords = [
    "javascript",
    "typescript",
    "react",
    "next.js",
    "node.js",
    "express",
    "mongodb",
    "postgresql",
    "mysql",
    "html",
    "css",
    "tailwind",
    "mui",
    "redux",
    "api",
    "rest",
    "graphql",
    "git",
    "docker",
    "aws",
    "azure",
    "ci/cd",
    "testing",
    "jest",
    "performance",
    "accessibility",
    "figma",
    "agile",
  ];

  const jobKeywords = commonRoleKeywords.filter((keyword) => text.includes(normalizeText(keyword)));
  const normalizedMatched = matchedSkills.map(normalizeText);
  const missingKeywords = jobKeywords.filter(
    (keyword) => !normalizedMatched.some((skill) => skill === normalizeText(keyword))
  );
  const roleText = normalizeText(
    `${user?.currentJobTitle || ""} ${user?.desiredJobType || ""} ${user?.yearsExperience || ""}`
  );
  const roleSignal = roleText && text.includes(roleText.split(" ")[0]) ? 10 : 0;
  const resumeSignal = user?.uploadResume ? 10 : 0;
  const skillScore = jobKeywords.length
    ? Math.round((matchedSkills.length / jobKeywords.length) * 70)
    : Math.min(matchedSkills.length * 10, 55);
  const score = Math.min(100, Math.round(skillScore + roleSignal + resumeSignal + Math.min(Number(user?.yearsExperience || 0) * 2, 10)));

  return {
    score,
    matchedSkills,
    missingKeywords: missingKeywords.slice(0, 8),
    jobKeywords: jobKeywords.slice(0, 12),
    summary:
      score >= 75
        ? "Strong match. Polish resume keywords and prepare role-specific examples."
        : score >= 50
          ? "Moderate match. Close the missing keyword gaps before applying."
          : "Early match. Build the missing core skills before targeting this role.",
  };
};
