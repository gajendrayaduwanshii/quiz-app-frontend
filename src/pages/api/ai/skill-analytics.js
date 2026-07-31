import { generateAIText } from "@/lib/aiClient";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Skill Analytics API: Request received');
    const { user } = req.body;
    
    if (!user) {
      console.log('Skill Analytics API: No user data provided');
      return res.status(400).json({ error: 'User data is required' });
    }

    console.log('Skill Analytics API: User data received:', user.documentId);

    const skills = user.skills || [];
    const experience = user.yearsExperience || 0;
    const quizResults = user.quizResult || [];

    const prompt = `
You are an AI-powered career analytics expert. Analyze the following developer profile and generate comprehensive skill analytics:

**Developer Profile:**
- Years of Experience: ${experience}
- Skills: ${skills.map(s => `${s.skillName} (${s.yearsExperience || 0} years, ${s.level || 'Intermediate'})`).join(', ')}
- Quiz Results: ${quizResults.length} completed quizzes
- Recent Performance: ${quizResults.length > 0 ? 'Active learner' : 'New to platform'}

**Generate detailed analytics including:**

1. **Skill Distribution Analysis:**
   - Categorize skills by experience level (Beginner: <2 years, Intermediate: 2-5 years, Advanced: 5+ years)
   - Identify top 5 strongest skills
   - Calculate skill diversity score

2. **Market Demand Analysis:**
   - Rate each skill's market demand (0-100%)
   - Identify high-demand skills the user should focus on
   - Provide salary projections for each skill

3. **Career Trajectory:**
   - Predict next career step based on current skills
   - Timeline for career progression
   - Confidence level in predictions

4. **Skill Gaps:**
   - Identify critical missing skills
   - Priority level for each gap
   - Learning recommendations

**Respond with valid JSON only:**
{
  "skillDistribution": {
    "beginner": number,
    "intermediate": number,
    "advanced": number
  },
  "topSkills": [
    {
      "name": "string",
      "experience": number,
      "level": "string",
      "trend": "up|down|stable"
    }
  ],
  "marketDemand": [
    {
      "skill": "string",
      "demand": number,
      "salary": number
    }
  ],
  "skillGaps": [
    {
      "skill": "string",
      "importance": number,
      "currentLevel": number
    }
  ],
  "careerTrajectory": {
    "current": "string",
    "next": "string",
    "timeline": "string",
    "confidence": number
  }
}
`;

    const output = await generateAIText(prompt, { temperature: 0.4 });
    
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const analytics = JSON.parse(jsonMatch[0]);
    console.log('Skill Analytics API: Successfully generated analytics:', analytics);
    
    res.status(200).json({ analytics });
  } catch (error) {
    console.error('Skill Analytics API: Error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
