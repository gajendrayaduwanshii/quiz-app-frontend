import { generateAIText } from "@/lib/aiClient";

// AI-powered personalized learning path generator
const learningCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user, goal, timeCommitment } = req.body;

    if (!user || !goal) {
      return res.status(400).json({ error: "User data and learning goal are required" });
    }

    // Create cache key
    const cacheKey = `learning_${goal}_${user.skills?.length || 0}_${timeCommitment || 'part-time'}`;
    const cachedData = learningCache.get(cacheKey);

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return res.status(200).json(cachedData.data);
    }

    const prompt = `
You are a senior learning and development specialist with expertise in tech education and career advancement. Create a personalized learning path for this developer.

**Developer Profile:**
- Current Skills: ${user.skills?.map(s => s.skillName).join(', ') || 'Not specified'}
- Experience: ${user.yearsExperience || 0} years
- Learning Goal: ${goal}
- Time Commitment: ${timeCommitment || 'Part-time (5-10 hours/week)'}

**Learning Path Requirements:**
Return a JSON object with this exact structure:

{
  "overview": "Brief summary of the learning journey and expected outcomes",
  "timeline": "Realistic timeline with milestones and checkpoints",
  "phases": [
    {
      "phase": "Phase name (e.g., Foundation, Intermediate, Advanced)",
      "duration": "Estimated time (weeks/months)",
      "objectives": "Specific learning objectives for this phase",
      "topics": "Key topics and concepts to cover",
      "resources": "Recommended courses, books, tutorials, and tools",
      "projects": "Hands-on projects to build during this phase",
      "assessments": "How to measure progress and validate learning"
    }
  ],
  "resources": {
    "courses": "Specific online courses and platforms to use",
    "books": "Recommended books and documentation",
    "tools": "Development tools and software to install",
    "communities": "Online communities and forums to join",
    "mentors": "How to find mentors and networking opportunities"
  },
  "projects": [
    {
      "name": "Project name",
      "description": "Detailed project description and goals",
      "technologies": "Technologies and frameworks to use",
      "timeline": "Estimated completion time",
      "difficulty": "Beginner/Intermediate/Advanced",
      "portfolio": "How this project showcases their skills"
    }
  ],
  "milestones": [
    {
      "milestone": "Specific achievement or skill level",
      "timeline": "When to expect this milestone",
      "validation": "How to prove they've reached this milestone",
      "nextSteps": "What to focus on after achieving this milestone"
    }
  ],
  "careerImpact": "How this learning path will advance their career and open new opportunities"
}

**Guidelines:**
- Create a realistic, achievable timeline based on their time commitment
- Include both theoretical knowledge and practical application
- Consider their current skill level and experience
- Focus on in-demand technologies and market trends
- Include hands-on projects and real-world applications
- Provide specific, actionable resources and next steps
- Consider different learning styles and preferences

**Important:** Respond ONLY with valid JSON. No explanations, no markdown formatting.
    `;

    const output = await generateAIText(prompt, { temperature: 0.4 });
    
    // Parse JSON response
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      
      // Cache the result
      learningCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Failed to parse AI response" });
    }
  } catch (error) {
    console.error("Error in /api/learning/path:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
