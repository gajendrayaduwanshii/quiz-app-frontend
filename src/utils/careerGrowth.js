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

const extractYearsExperience = (text) => {
  const yearsMatch = text.match(/(\d+)\s*\+?\s*(?:years?|yrs?)\b/i);
  if (yearsMatch) return Number(yearsMatch[1]);

  const headingYears = text.match(/experience\s*[:\-]\s*(\d+)\s*\+?/i);
  if (headingYears) return Number(headingYears[1]);

  if (/\b(entry|junior)\b/i.test(text)) return 1;
  if (/\b(mid|associate|intermediate)\b/i.test(text)) return 3;
  if (/\b(senior|lead|principal|staff)\b/i.test(text)) return 6;
  return null;
};

const extractJobTitle = (text) => {
  const headerMatch = text.match(/##\s*job description\s*(?:[–:-]|\s+)\s*([a-z0-9 .&()+-]{3,80})/i);
  if (headerMatch) return normalizeText(headerMatch[1]);

  const positionMatch = text.match(/(?:position|role|job title)\s*[:\-]\s*([a-z0-9 .&()+-]{3,80})/i);
  if (positionMatch) return normalizeText(positionMatch[1]);

  const titleMatch = text.match(/(?:hiring|looking for|seeking|need an?|opening for|open position for)\s+([a-z0-9 .&()+-]{3,80})(?:\s+with|\.|\n|,|$)/i);
  if (titleMatch) return normalizeText(titleMatch[1]);

  const lineMaybeTitle = text
    .split("\n")
    .map((line) => line.trim())
    .find((line) => /(?:developer|engineer|manager|specialist|analyst|consultant|architect)/i.test(line));
  return lineMaybeTitle ? normalizeText(lineMaybeTitle) : "";
};

const extractLocation = (text) => {
  const locationMatch = text.match(/(?:location)\s*[:\-]\s*([^\n]+)/i);
  return locationMatch ? normalizeText(locationMatch[1]) : "";
};

const extractEmploymentType = (text) => {
  const typeMatch = text.match(/(?:employment type|job type|type)\s*[:\-]\s*([^\n]+)/i);
  return typeMatch ? normalizeText(typeMatch[1]) : "";
};

const extractNoticePeriod = (text) => {
  const noticeMatch = text.match(/(?:notice period)\s*[:\-]\s*([^\n]+)/i);
  return noticeMatch ? normalizeText(noticeMatch[1]) : "";
};

const uniqueNormalized = (items = []) => Array.from(new Set(items.filter(Boolean).map(normalizeText)));

const softSkillKeywords = [
  "communication",
  "team player",
  "collaboration",
  "problem solving",
  "ownership",
  "leadership",
  "adaptability",
  "mentoring",
  "stakeholder",
  "time management",
  "presentation",
  "customer-facing",
];

const extractJobTerms = (text) => {
  const rawTerms = Array.from(text.matchAll(/\b[a-z0-9+#./-]{2,}\b/gi), (match) => normalizeText(match[0]));
  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "without",
    "from",
    "are",
    "is",
    "on",
    "of",
    "to",
    "a",
    "in",
    "by",
    "as",
    "or",
    "an",
    "at",
    "it",
    "its",
    "be",
    "work",
    "team",
    "job",
    "role",
    "skills",
    "experience",
    "years",
    "will",
    "use",
    "using",
    "able",
    "ability",
    "strong",
    "good",
  ]);

  return uniqueNormalized(rawTerms).filter((term) => term.length > 2 && !stopWords.has(term));
};

const classifyJobKeyword = (keyword) => {
  const toolTerms = [
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "jenkins",
    "git",
    "ci/cd",
    "figma",
    "postman",
    "jira",
    "notion",
    "slack",
    "webpack",
    "babel",
    "terraform",
    "redis",
    "elasticsearch",
    "graphql",
  ];

  if (softSkillKeywords.includes(keyword)) return "soft";
  if (toolTerms.includes(keyword) || /k8s|docker|terraform|jenkins|ci\/cd|git|figma|postman|jira|slack|notion/.test(keyword)) {
    return "tools";
  }
  if (/^(?:js|ts|sql|api|rest|html|css|sass|scss|docker|kubernetes|node|react|vue|angular|next|tailwind|graphql|mongodb|postgresql|mysql|java|python|c#|go|rust|spring|django|flask)$/.test(keyword)) {
    return "technical";
  }
  return "domain";
};

export const analyzeJobMatch = (user, jobDescription) => {
  const text = normalizeText(jobDescription);
  const profileSkills = getProfileSkillNames(user);
  const normalizedUserSkills = profileSkills.map((skill) => ({
    original: skill,
    normalized: normalizeText(skill),
  }));

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
    "python",
    "java",
    "spring",
    "django",
    "flask",
    "kubernetes",
    "redis",
  ];

  const softSkillKeywords = [
    "communication",
    "team player",
    "collaboration",
    "problem solving",
    "ownership",
    "leadership",
    "adaptability",
    "mentoring",
    "stakeholder",
    "time management",
    "presentation",
    "customer-facing",
  ];

  const profileSkillsList = normalizedUserSkills.map((skill) => skill.normalized);
  const jobSkillCandidates = uniqueNormalized([
    ...commonRoleKeywords,
    ...profileSkillsList,
  ]);

  const requiredSkills = jobSkillCandidates.filter((keyword) => keyword && text.includes(keyword));
  const matchedSkills = normalizedUserSkills
    .filter((skill) => skill.normalized && text.includes(skill.normalized))
    .map((skill) => skill.original);
  const normalizedMatchedSkills = matchedSkills.map((skill) => normalizeText(skill));
  const missingKeywords = requiredSkills.filter((keyword) => !normalizedMatchedSkills.includes(keyword));

  const extractedTerms = extractJobTerms(text).filter((term) => !jobSkillCandidates.includes(term));
  const jobKeywords = uniqueNormalized([...requiredSkills, ...extractedTerms]).slice(0, 14);

  const matchedSoftSkills = softSkillKeywords.filter((softSkill) => text.includes(softSkill));
  const missingSoftSkills = softSkillKeywords.filter(
    (softSkill) => text.includes(softSkill) && !profileSkillsList.includes(softSkill)
  );

  const jobKeywordGroups = {
    technical: requiredSkills.filter((keyword) => classifyJobKeyword(keyword) === "technical"),
    tools: requiredSkills.filter((keyword) => classifyJobKeyword(keyword) === "tools"),
    soft: requiredSkills.filter((keyword) => classifyJobKeyword(keyword) === "soft"),
    domain: requiredSkills.filter((keyword) => classifyJobKeyword(keyword) === "domain"),
  };

  const jobTitle = extractJobTitle(jobDescription);
  const jobLocation = extractLocation(jobDescription);
  const employmentType = extractEmploymentType(jobDescription);
  const noticePeriod = extractNoticePeriod(jobDescription);
  const requiredYears = extractYearsExperience(jobDescription);
  const userYears = Number(user?.yearsExperience || 0);

  const titleMatch = Boolean(
    jobTitle && profileSkillsList.some((skill) => jobTitle.includes(skill))
  );
  const experienceFit = requiredYears !== null ? Math.max(0, Math.min(12, Math.round((userYears / requiredYears) * 12))) : 0;
  const resumeSignal = user?.uploadResume ? 8 : 0;
  const latestQuizScore = getLatestQuizScore(user);
  const quizCount = Array.isArray(user?.quizResult) ? user.quizResult.length : 0;

  const skillCoverage = requiredSkills.length ? matchedSkills.length / requiredSkills.length : 0;
  const skillScore = Math.round(skillCoverage * 50);
  const titleScore = titleMatch ? 10 : 0;
  const quizScore = Math.round(Math.min(10, latestQuizScore / 10));
  const polishScore = Math.round((matchedSoftSkills.length ? 4 : 0) + (profileSkillsList.length ? 6 : 0));
  const score = Math.min(100, skillScore + experienceFit + titleScore + resumeSignal + quizScore + polishScore);

  const profileScore = calculateCareerReadiness(user);
  const readinessStatus =
    profileScore >= 75 ? "Ready" : profileScore >= 50 ? "Developing" : "Building";
  const readinessLabel =
    profileScore >= 75
      ? "Your profile is in strong shape for competitive roles."
      : profileScore >= 50
        ? "Your profile has good signals; focus on the remaining skill and resume gaps."
        : "Build your profile with more skills, quiz practice, and experience before applying to senior roles.";

  const summary =
    score >= 75
      ? "Strong match. Use your profile strengths and tailor your resume for the exact role."
      : score >= 50
        ? "Moderate match. Close the missing skill and experience gaps before applying."
        : "Early match. Focus on core skills first and target roles closer to your profile.";

  const rationale = [];
  if (requiredSkills.length) {
    rationale.push(`${matchedSkills.length} of ${requiredSkills.length} role keywords found`);
  }
  if (titleMatch) {
    rationale.push("Role title appears aligned with your profile.");
  } else if (jobTitle) {
    rationale.push("Role title in the JD may not match your current or desired title.");
  }
  if (requiredYears !== null) {
    if (userYears >= requiredYears) {
      rationale.push("Experience level is within the expected range.");
    } else {
      rationale.push(`Experience is ${requiredYears - userYears} year(s) below the target.`);
    }
  }
  if (matchedSoftSkills.length) {
    rationale.push("Soft skills listed in the JD are detected.");
  }
  if (!resumeSignal) {
    rationale.push("Resume upload is missing, which can reduce ATS and keyword-match confidence.");
  }
  if (jobLocation) {
    rationale.push(`Location preference detected: ${jobLocation}.`);
  }

  const suggestedActions = [];
  const recommendedResumeEdits = [];
  const recommendedLearningPath = [];

  if (!user?.uploadResume) {
    suggestedActions.push("Upload your resume to improve keyword-based fit and ATS matching.");
    recommendedResumeEdits.push("Upload a resume so your profile can be matched against job keywords more reliably.");
  }

  if (missingSoftSkills.length) {
    suggestedActions.push(
      `Highlight soft skills like ${missingSoftSkills.slice(0, 3).join(", ")} in your resume or cover note.`
    );
    recommendedResumeEdits.push(
      `Include soft skill examples for ${missingSoftSkills.slice(0, 3).join(", ")}.`
    );
  }

  if (missingKeywords.length) {
    suggestedActions.push(`Add or practice: ${missingKeywords.slice(0, 5).join(", ")}.`);
    recommendedLearningPath.push(`Learn ${missingKeywords.slice(0, 4).join(", ")} through targeted exercises or projects.`);
    if (user?.uploadResume) {
      recommendedResumeEdits.push(
        `Add ${missingKeywords.slice(0, 3).join(", ")} to relevant bullets in your resume.`
      );
    }
  }

  if (requiredYears !== null && userYears < requiredYears) {
    suggestedActions.push(`Gain ${requiredYears - userYears} more year(s) of experience or target a junior-level role.`);
    recommendedLearningPath.push(`Focus on projects or contributions that show ${jobTitle || "relevant"} ownership.`);
  }

  if (!profileSkills.length) {
    suggestedActions.push("Add your top technical skills so the match analysis is more accurate.");
    recommendedLearningPath.push("Define your core technical skills in your profile first.");
  }

  if (!quizCount) {
    suggestedActions.push("Take a skill quiz to add measurable readiness signal.");
    recommendedLearningPath.push("Complete a quiz so the platform can recommend better learning pathways.");
  } else if (latestQuizScore < 70) {
    suggestedActions.push(`Review quiz topics. Latest score is ${latestQuizScore}%.`);
    recommendedLearningPath.push("Practice the concepts you missed in the latest quiz.");
  }

  if (requiredSkills.length && !matchedSkills.length) {
    recommendedResumeEdits.push("Add a project or experience bullet that demonstrates the key skills from the job description.");
  }

  const quizMessage = !quizCount
    ? "No quiz results yet. Take a quiz to validate technical readiness."
    : latestQuizScore >= 80
      ? "Strong quiz signal for this role."
      : latestQuizScore >= 60
        ? "Good quiz baseline; review the missed concepts before applying."
        : "Quiz signal is weak; strengthen the role-relevant concepts before applying.";

  return {
    score,
    matchedSkills,
    missingKeywords: missingKeywords.slice(0, 8),
    jobKeywords: jobKeywords.slice(0, 12),
    summary,
    details: {
      roleTitle: jobTitle,
      requiredExperience: requiredYears,
      experienceFit,
      titleMatch,
      resumeUploaded: !!user?.uploadResume,
      matchedSoftSkills,
      skillCoverage: Math.round(skillCoverage * 100),
      suggestedActions,
      location: jobLocation,
      employmentType,
      noticePeriod,
      rationale,
      totalKeywords: requiredSkills.length,
      gaps: missingKeywords.slice(0, 5),
      quizScore: latestQuizScore,
      quizCount,
      quizMessage,
      profileScore,
      readinessStatus,
      readinessLabel,
      recommendedResumeEdits: recommendedResumeEdits.slice(0, 5),
      recommendedLearningPath: recommendedLearningPath.slice(0, 5),
      jobKeywordGroups,
    },
  };
};
