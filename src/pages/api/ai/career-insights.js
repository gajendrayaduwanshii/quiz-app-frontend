import { generateAIText } from "@/lib/aiClient";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user } = req.body;
    
    if (!user) {
      return res.status(400).json({ error: 'User data is required' });
    }

    const skills = user.skills || [];
    const experience = user.yearsExperience || 0;
    const workExperiences = user.workExperiences || [];
    const educations = user.educations || [];

    const prompt = `
You are an AI-powered career advisor. Analyze the following developer profile and generate comprehensive career insights:

**Developer Profile:**
- Years of Experience: ${experience}
- Skills: ${skills.map(s => `${s.skillName} (${s.yearsExperience || 0} years, ${s.level || 'Intermediate'})`).join(', ')}
- Work Experience: ${workExperiences.length} positions
- Education: ${educations.length} degrees/certifications
- Recent Performance: Active learner with ${user.quizResult?.length || 0} completed quizzes

**Generate comprehensive career insights including:**

1. **Career Path Analysis:**
   - Current position assessment
   - Next logical career step
   - Long-term career trajectory
   - Timeline for progression

2. **Salary Projections:**
   - Current market value
   - Projected salary growth
   - Market comparison
   - Growth percentage

3. **Skill Matrix:**
   - Technical skills rating
   - Leadership potential
   - Communication skills
   - Problem-solving ability
   - Innovation capacity

4. **Job Opportunities:**
   - Top 3 recommended positions
   - Match percentage for each
   - Salary ranges
   - Required skills

5. **Market Trends:**
   - 6-month demand forecast
   - Salary trends
   - Skill demand changes
   - Market predictions

6. **Recommendations:**
   - Skill development priorities
   - Certification suggestions
   - Career advancement tips
   - Learning paths

**Respond with valid JSON only:**
{
  "careerPath": {
    "current": "string",
    "next": "string",
    "future": "string",
    "timeline": "string",
    "confidence": number
  },
  "salaryProjection": {
    "current": number,
    "projected": number,
    "market": number,
    "growth": number
  },
  "skillMatrix": {
    "technical": number,
    "leadership": number,
    "communication": number,
    "problemSolving": number,
    "innovation": number
  },
  "opportunities": [
    {
      "title": "string",
      "company": "string",
      "match": number,
      "salary": "string",
      "skills": ["string"]
    }
  ],
  "marketTrends": [
    {
      "month": "string",
      "demand": number,
      "salary": number
    }
  ],
  "recommendations": [
    {
      "type": "string",
      "title": "string",
      "priority": "string",
      "impact": "string",
      "timeline": "string"
    }
  ]
}
`;

    const output = await generateAIText(prompt, { temperature: 0.4 });
    
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const insights = JSON.parse(jsonMatch[0]);
    
    res.status(200).json({ insights });
  } catch (error) {
    console.error('Error in /api/ai/career-insights:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
