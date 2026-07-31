import { generateAIText } from "@/lib/aiClient";

// Advanced AI-powered skill assessment
const skillCache = new Map();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user, skillName } = req.body;

    if (!user || !skillName) {
      return res.status(400).json({ error: "User data and skill name are required" });
    }

    // Create cache key
    const cacheKey = `skill_assess_${skillName}_${user.skills?.length || 0}_${user.yearsExperience || 0}`;
    const cachedData = skillCache.get(cacheKey);

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return res.status(200).json(cachedData.data);
    }

    const matchedSkill = user.skills?.find(skill => 
      skill.skillName?.toLowerCase() === skillName.toLowerCase()
    );

    const prompt = `
You are a senior technical architect and skill assessment expert with 20+ years of experience. Analyze this developer's ${skillName} proficiency and provide a comprehensive skill assessment.

**Developer Profile:**
- Skill: ${skillName}
- Experience Level: ${matchedSkill?.level || 'Not specified'}
- Years of Experience: ${matchedSkill?.yearsExperience || 0} years
- Overall Experience: ${user.yearsExperience || 0} years
- Other Skills: ${user.skills?.map(s => s.skillName).join(', ') || 'Not specified'}

**Assessment Requirements:**
Return a JSON object with this exact structure:

{
  "currentLevel": "Assess their current proficiency level (Beginner/Intermediate/Advanced/Expert) with specific reasoning",
  "strengths": "List 3-4 key strengths and competencies they demonstrate in this skill area",
  "weaknesses": "Identify 3-4 specific areas where they need improvement or have knowledge gaps",
  "skillScore": "Provide a numerical score from 1-10 with detailed justification",
  "learningPath": "Create a structured 6-month learning plan with specific milestones, resources, and projects",
  "certifications": "Suggest 2-3 relevant certifications or credentials that would validate their skills",
  "projectSuggestions": "Recommend 3-4 practical projects they should build to improve this skill",
  "marketValue": "Assess the current market demand and salary potential for this skill level",
  "nextSteps": "Provide 3-4 immediate actionable steps they should take to improve"
}

**Analysis Guidelines:**
- Be brutally honest about their current level
- Consider their experience relative to industry standards
- Focus on practical, actionable recommendations
- Include specific technologies, frameworks, and tools
- Consider current market trends and demands
- Provide realistic timelines and expectations

**Important:** Respond ONLY with valid JSON. No explanations, no markdown formatting.
    `;

    const output = await generateAIText(prompt, { temperature: 0.4 });
    
    // Parse JSON response
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      
      // Cache the result
      skillCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Failed to parse AI response" });
    }
  } catch (error) {
    console.error("Error in /api/skills/assess:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
