import pdfParse from "pdf-parse";
import { generateAIText } from "@/lib/aiClient";
import { resolveStrapiMediaUrl } from "@/lib/strapiConfig";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { uploadResume } = req.body;
  if (!uploadResume) return res.status(400).json({ error: "No resume uploaded" });

  try {
    const resumeUrl = resolveStrapiMediaUrl(uploadResume);

    // Fetch PDF from Strapi URL
    const pdfRes = await fetch(resumeUrl);
    if (!pdfRes.ok) {
      const error =
        pdfRes.status === 404
          ? "Resume PDF not found on the server. Please re-upload your resume."
          : `Failed to fetch resume PDF: ${pdfRes.status}`;

      return res.status(pdfRes.status === 404 ? 404 : 502).json({ error });
    }

    const arrayBuffer = await pdfRes.arrayBuffer();
    const pdfData = await pdfParse(arrayBuffer);
    const trimmedText = pdfData.text.slice(0, 5000);

    if (!trimmedText.trim()) {
      return res.status(400).json({ error: "PDF is empty or unreadable" });
    }

    // Enhanced prompt for comprehensive resume analysis
    const prompt = `
You are a senior career counselor and technical mentor with 20+ years of experience in the tech industry. Analyze this developer's resume and provide comprehensive career guidance.

**Your Task:**
Analyze the resume text and return a JSON object with this exact structure:

{
  "atsScore": 0-100,
  "roleMatch": 0-100,
  "profileSummary": "Write a compelling 3-4 sentence professional summary that highlights their key strengths, technical expertise, years of experience, and unique value proposition. Make it sound like a professional LinkedIn summary.",
  "strongestSkills": ["Skill 1", "Skill 2", "Skill 3"],
  "missingKeywords": ["Keyword 1", "Keyword 2", "Keyword 3"],
  "formattingAnalysis": "Short ATS formatting analysis with specific improvement notes.",
  "grammarAnalysis": "Short grammar and clarity analysis with specific improvement notes.",
  "skillGapAnalysis": "Short skill gap analysis based on the resume and market expectations.",
  "learningSuggestions": [
    {
      "area": "Specific skill or technology area to improve",
      "recommendation": "Detailed, actionable learning path with specific technologies, frameworks, or concepts to master. Include practical projects, resources, and timeline. Make it specific to their current level and career goals."
    }
  ]
}

**Analysis Guidelines:**
- Identify their current skill level (Junior/Mid/Senior) based on experience
- Highlight their strongest technical competencies
- Identify skill gaps and growth opportunities
- Score ATS readiness and role match using only the resume evidence
- Extract missing keywords that would improve ATS performance
- Analyze formatting, grammar, clarity, and keyword density
- Suggest 4-6 specific learning areas with actionable recommendations
- Consider current market trends and in-demand technologies
- Provide realistic timelines and practical next steps
- Focus on career advancement and skill development

**Resume Content:**
${trimmedText}

**Important:** Respond ONLY with valid JSON. No explanations, no markdown formatting, no additional text.
`;

    // Safe JSON parsing helper
    const safeJsonParse = (text) => {
      try {
        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}") + 1;
        if (firstBrace === -1 || lastBrace === -1) return null;
        return JSON.parse(text.slice(firstBrace, lastBrace));
      } catch (err) {
        console.error("Failed to parse JSON:", err, text);
        return null;
      }
    };

    const aiText = await generateAIText(prompt, {
      temperature: 0.4,
      responseMimeType: "application/json",
    });

    const parsedData = safeJsonParse(aiText);

    if (!parsedData) {
      return res.status(500).json({ error: "Failed to parse AI response." });
    }

    // Return parsed object
    res.status(200).json({
      atsScore: Number(parsedData.atsScore) || 0,
      roleMatch: Number(parsedData.roleMatch) || 0,
      profileSummary: parsedData.profileSummary || null,
      strongestSkills: Array.isArray(parsedData.strongestSkills)
        ? parsedData.strongestSkills
        : [],
      missingKeywords: Array.isArray(parsedData.missingKeywords)
        ? parsedData.missingKeywords
        : [],
      formattingAnalysis: parsedData.formattingAnalysis || "",
      grammarAnalysis: parsedData.grammarAnalysis || "",
      skillGapAnalysis: parsedData.skillGapAnalysis || "",
      learningSuggestions: parsedData.learningSuggestions || [],
    });

  } catch (err) {
    console.error("PDF parsing / AI request error:", err);
    res.status(500).json({ error: "Failed to parse/analyze PDF" });
  }
}
