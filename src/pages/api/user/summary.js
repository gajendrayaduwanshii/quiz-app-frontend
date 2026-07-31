import { generateAIText } from "@/lib/aiClient";

// Cache for user summaries
const summaryCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user } = req.body;

    if (!user) {
      return res.status(400).json({ error: "User data is required" });
    }

    // Create cache key based on user data
    const cacheKey = `summary_${JSON.stringify(user)}`;
    const cachedData = summaryCache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return res.status(200).json(cachedData.data);
    }

    const fullUserData = JSON.stringify(user, null, 2);

    const prompt = `
You are an expert career counselor and technical mentor with 15+ years of experience in the tech industry. Analyze the following developer profile and provide personalized career guidance.

**Your Task:**
Create a comprehensive career analysis in JSON format with these exact fields:

{
  "summary": "Write a compelling 2-3 sentence professional summary highlighting their key strengths, experience level, and unique value proposition. Make it sound like a LinkedIn headline.",
  "rolesAndResponsibilities": "Suggest 3-4 specific job roles that match their skills and experience level. For each role, mention 2-3 key responsibilities and why they're a good fit. Include salary expectations if possible.",
  "studyPlan": "Create a structured learning roadmap with 4-5 specific technologies, frameworks, or concepts they should master next. Prioritize by career impact and include learning resources.",
  "skillGaps": "Identify 3-4 critical skill gaps that could limit their career growth. Be specific about technologies, methodologies, or soft skills they need to develop.",
  "marketInsights": "Provide current market insights relevant to their tech stack and experience level. Include trending technologies, job market conditions, and industry demands.",
  "careerPath": "Suggest a realistic 2-3 year career progression path with specific milestones, certifications, and role transitions they should target."
}

**Analysis Guidelines:**
- Consider their years of experience, current skills, and career trajectory
- Identify skill gaps and growth opportunities
- Suggest roles that match their experience level (Junior/Mid/Senior)
- Focus on in-demand technologies and market trends
- Be specific and actionable in recommendations
- Consider their location and industry context

**User Profile Data:**
\`\`\`json
${fullUserData}
\`\`\`

**Important:** Respond ONLY with valid JSON. No explanations, no markdown formatting, no additional text.
    `;

    const output = await generateAIText(prompt, { temperature: 0.4 });
    
    // Try multiple parsing strategies
    let parsed = null;
    let jsonMatch = null;
    
    // Strategy 1: Look for JSON object
    jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (e) {
        parsed = null;
      }
    }
    
    // Strategy 2: If no JSON found, try to extract content manually
    if (!parsed) {
      const summaryMatch = output.match(/summary[:\s]*["']?([^"'\n]+)["']?/i);
      const rolesMatch = output.match(/rolesAndResponsibilities[:\s]*["']?([^"'\n]+)["']?/i);
      const studyMatch = output.match(/studyPlan[:\s]*["']?([^"'\n]+)["']?/i);
      
      parsed = {
        summary: summaryMatch ? summaryMatch[1].trim() : "",
        rolesAndResponsibilities: rolesMatch ? rolesMatch[1].trim() : "",
        studyPlan: studyMatch ? studyMatch[1].trim() : ""
      };
    }
    
    // Strategy 3: If still no data, create fallback
    if (!parsed || (!parsed.summary && !parsed.rolesAndResponsibilities && !parsed.studyPlan)) {
      parsed = {
        summary: "Based on your profile, you have valuable skills and experience that can be leveraged in various roles.",
        rolesAndResponsibilities: "Consider roles that match your current skill set and provide opportunities for growth.",
        studyPlan: "Focus on areas where you want to improve and stay updated with industry trends."
      };
    }

    const result = {
      summary: typeof parsed.summary === "string" ? parsed.summary : JSON.stringify(parsed.summary || ""),
      rolesAndResponsibilities: typeof parsed.rolesAndResponsibilities === "string" ? parsed.rolesAndResponsibilities : JSON.stringify(parsed.rolesAndResponsibilities || ""),
      studyPlan: typeof parsed.studyPlan === "string" ? parsed.studyPlan : JSON.stringify(parsed.studyPlan || ""),
      skillGaps: typeof parsed.skillGaps === "string" ? parsed.skillGaps : JSON.stringify(parsed.skillGaps || ""),
      marketInsights: typeof parsed.marketInsights === "string" ? parsed.marketInsights : JSON.stringify(parsed.marketInsights || ""),
      careerPath: typeof parsed.careerPath === "string" ? parsed.careerPath : JSON.stringify(parsed.careerPath || ""),
    };
    
    // Cache the result
    summaryCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in /api/user/summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
