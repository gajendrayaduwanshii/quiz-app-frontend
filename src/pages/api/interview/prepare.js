import { generateAIText } from "@/lib/aiClient";

// AI-powered interview preparation
const interviewCache = new Map();
const CACHE_DURATION = 20 * 60 * 1000; // 20 minutes

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user, jobRole, companyType } = req.body;

    if (!user || !jobRole) {
      return res.status(400).json({ error: "User data and job role are required" });
    }

    // Create cache key
    const cacheKey = `interview_${jobRole}_${user.skills?.length || 0}_${user.yearsExperience || 0}`;
    const cachedData = interviewCache.get(cacheKey);

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return res.status(200).json(cachedData.data);
    }

    const prompt = `
You are a senior technical recruiter and interview coach with 15+ years of experience at top tech companies. Prepare this developer for a ${jobRole} interview.

**Developer Profile:**
- Target Role: ${jobRole}
- Experience Level: ${user.yearsExperience || 0} years
- Skills: ${user.skills?.map(s => s.skillName).join(', ') || 'Not specified'}
- Company Type: ${companyType || 'Tech Startup'}

**Interview Preparation Requirements:**
Return a JSON object with this exact structure:

{
  "technicalQuestions": [
    {
      "question": "Specific technical question they're likely to be asked",
      "answer": "Detailed answer with code examples and best practices",
      "difficulty": "Easy/Medium/Hard",
      "category": "Specific technology or concept area"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Common behavioral question for this role",
      "answer": "STAR method response with specific examples",
      "category": "Leadership/Problem-solving/Teamwork/etc"
    }
  ],
  "codingChallenges": [
    {
      "problem": "Realistic coding challenge description",
      "solution": "Step-by-step solution approach with time complexity",
      "difficulty": "Easy/Medium/Hard",
      "technologies": "Specific languages/frameworks to use"
    }
  ],
  "systemDesign": {
    "scenario": "System design problem relevant to their experience level",
    "approach": "Step-by-step design process and considerations",
    "components": "Key system components and their interactions"
  },
  "salaryNegotiation": {
    "marketRange": "Current salary range for this role and experience",
    "negotiationTips": "Specific strategies for salary negotiation",
    "benefits": "Additional benefits to consider beyond salary"
  },
  "companyResearch": {
    "keyPoints": "Important company information to research",
    "questions": "Questions to ask the interviewer about the role/company",
    "culture": "How to assess company culture during the interview"
  }
}

**Guidelines:**
- Tailor questions to their experience level and target role
- Include practical, real-world scenarios
- Provide detailed answers with examples
- Consider current industry trends and technologies
- Focus on skills they actually have or should develop
- Include both technical and soft skills assessment

**Important:** Respond ONLY with valid JSON. No explanations, no markdown formatting.
    `;

    const output = await generateAIText(prompt, { temperature: 0.4 });
    
    // Parse JSON response
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      
      // Cache the result
      interviewCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Failed to parse AI response" });
    }
  } catch (error) {
    console.error("Error in /api/interview/prepare:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
