import pdfParse from "pdf-parse";
import { generateAIText } from "@/lib/aiClient";

const safeJsonParse = (text) => {
  try {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}") + 1;
    if (firstBrace === -1 || lastBrace <= firstBrace) return null;
    return JSON.parse(text.slice(firstBrace, lastBrace));
  } catch (err) {
    console.error("Failed to parse resume profile JSON:", err, text);
    return null;
  }
};

const asString = (value) => (typeof value === "string" ? value.trim() : "");
const asArray = (value) => (Array.isArray(value) ? value : []);
const cleanResumeText = (value) => asString(value).replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
const hasInResume = (resumeText, value) => {
  const text = normalizeText(resumeText);
  const normalizedValue = normalizeText(value);
  return Boolean(normalizedValue) && text.includes(normalizedValue);
};

const exactResumeString = (resumeText, value) => (hasInResume(resumeText, value) ? asString(value) : "");

const normalizeSkills = (items, resumeText) =>
  asArray(items)
    .map((item) => ({
      skill: exactResumeString(resumeText, item?.skill),
      level: exactResumeString(resumeText, item?.level),
      experienceYears: exactResumeString(resumeText, item?.experienceYears),
    }))
    .filter((item) => item.skill);

const normalizeEducation = (items, resumeText) =>
  asArray(items)
    .map((item) => ({
      degree: exactResumeString(resumeText, item?.degree),
      institution: exactResumeString(resumeText, item?.institution),
      year: exactResumeString(resumeText, item?.year),
      grade: exactResumeString(resumeText, item?.grade),
    }))
    .filter((item) => item.degree || item.institution || item.year || item.grade);

const normalizeText = (value) =>
  asString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const getProjectNames = (resumeText) => {
  const names = [];
  const projectPattern = /project\s*\d+\s*:\s*([^\n\r]+)/gi;
  let match = projectPattern.exec(resumeText);

  while (match) {
    const name = asString(match[1]).replace(/\s+/g, " ");
    if (name) names.push(name);
    match = projectPattern.exec(resumeText);
  }

  return names;
};

const hasEmploymentSection = (resumeText) =>
  /\b(work|professional|employment|career)\s+experience\b/i.test(resumeText) ||
  /\bemployment\s+history\b/i.test(resumeText) ||
  /\bexperience\s+history\b/i.test(resumeText);

const filterWorkExperience = (items, resumeText) => {
  const workItems = asArray(items);
  const projectNames = getProjectNames(resumeText).map(normalizeText);

  if (!hasEmploymentSection(resumeText) && /\bproject\s+experience\b/i.test(resumeText)) {
    return [];
  }

  return workItems.map((item) => {
    const cleanedItem = {
      company: exactResumeString(resumeText, item?.company),
      title: exactResumeString(resumeText, item?.title),
      startDate: exactResumeString(resumeText, item?.startDate),
      endDate: exactResumeString(resumeText, item?.endDate),
      current: Boolean(item?.current) && /\b(present|current|currently)\b/i.test(resumeText),
      description: exactResumeString(resumeText, item?.description),
    };

    return cleanedItem;
  }).filter((item) => {
    const company = normalizeText(item?.company);
    const title = normalizeText(item?.title);
    const description = normalizeText(item?.description);

    if (!company && !title && !description) return false;

    return !projectNames.some((projectName) => {
      if (!projectName) return false;
      return company === projectName || title === projectName || description.includes(projectName);
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { uploadResume } = req.body || {};
  if (!uploadResume) {
    return res.status(400).json({ error: "No resume uploaded" });
  }

  try {
    const pdfRes = await fetch(uploadResume);
    if (!pdfRes.ok) throw new Error("Failed to fetch resume PDF");

    const arrayBuffer = await pdfRes.arrayBuffer();
    const pdfData = await pdfParse(arrayBuffer);
    const resumeText = cleanResumeText(pdfData.text);

    if (!resumeText.trim()) {
      return res.status(400).json({ error: "PDF is empty or unreadable" });
    }

    const prompt = `
Read the complete resume text first, then extract candidate registration fields from the resume data.

Return ONLY valid JSON with this exact shape:
{
  "name": "",
  "email": "",
  "phone": "",
  "dob": "",
  "gender": "",
  "jobTitle": "",
  "company": "",
  "experienceYears": "",
  "jobType": "",
  "certifications": "",
  "education": [
    { "degree": "", "institution": "", "year": "", "grade": "" }
  ],
  "workExperience": [
    { "company": "", "title": "", "startDate": "", "endDate": "", "current": false, "description": "" }
  ],
  "skills": [
    { "skill": "", "level": "", "experienceYears": "" }
  ]
}

Rules:
- Use only information clearly present in the resume.
- Do not infer, assume, guess, summarize from outside knowledge, or create any field value.
- Every non-empty value must be copied from text that appears in the resume.
- If a value does not appear in the resume text, return an empty string for that field.
- Do not generate default values such as Beginner, 0, Full-Time, Remote, current company, or current title unless those exact details appear in the resume.
- Put ONLY actual employment, company job history, internships, or current/previous employer roles in "workExperience".
- Do NOT put "Project Experience", portfolio projects, academic projects, freelance-style project descriptions, or project names in "workExperience".
- If the resume has Project Experience but no real employment/company history section, return "workExperience": [].
- Do NOT use a project Role as current jobTitle unless it is clearly also an employment role.
- Do NOT use project names as company.
- Leave unknown fields as empty strings, empty arrays, or false.
- Dates must be YYYY-MM-DD when a full date is available. If only month/year or year is available, leave the date empty.
- gender and dob are often not present in resumes; do not guess them.
- jobType must be one of "Full-Time", "Part-Time", or "Remote"; leave blank if not explicit.
- skill level must be one of "Beginner", "Intermediate", or "Expert" only if that exact level appears in the resume; otherwise leave it blank.
- For current jobs, set current true and endDate empty when the resume says Present, Current, or similar.
- Keep work descriptions short, plain text, and under 400 characters each.

Complete resume text:
${resumeText}
`;

    const aiText = await generateAIText(prompt, {
      temperature: 0.1,
      responseMimeType: "application/json",
    });

    const parsedData = safeJsonParse(aiText);
    if (!parsedData) {
      return res.status(500).json({ error: "Failed to parse AI response." });
    }

    res.status(200).json({
      name: exactResumeString(resumeText, parsedData.name),
      email: exactResumeString(resumeText, parsedData.email),
      phone: exactResumeString(resumeText, parsedData.phone),
      dob: exactResumeString(resumeText, parsedData.dob),
      gender: exactResumeString(resumeText, parsedData.gender).toLowerCase(),
      jobTitle: exactResumeString(resumeText, parsedData.jobTitle),
      company: exactResumeString(resumeText, parsedData.company),
      experienceYears: exactResumeString(resumeText, parsedData.experienceYears),
      jobType: exactResumeString(resumeText, parsedData.jobType),
      certifications: exactResumeString(resumeText, parsedData.certifications),
      education: normalizeEducation(parsedData.education, resumeText),
      workExperience: filterWorkExperience(parsedData.workExperience, resumeText),
      skills: normalizeSkills(parsedData.skills, resumeText),
    });
  } catch (err) {
    console.error("Resume profile extraction error:", err);
    res.status(500).json({ error: "Failed to extract profile from resume" });
  }
}
