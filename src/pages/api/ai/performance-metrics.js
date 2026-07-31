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
    const quizResults = user.quizResult || [];
    const workExperiences = user.workExperiences || [];

    const prompt = `
You are an AI-powered performance analyst. Analyze the following developer profile and generate comprehensive performance metrics:

**Developer Profile:**
- Years of Experience: ${experience}
- Skills: ${skills.map(s => `${s.skillName} (${s.yearsExperience || 0} years, ${s.level || 'Intermediate'})`).join(', ')}
- Work Experience: ${workExperiences.length} positions
- Quiz Results: ${quizResults.length} completed quizzes
- Recent Performance: Active learner

**Generate comprehensive performance metrics including:**

1. **Overall Performance Score:**
   - Technical skills rating (0-100)
   - Problem-solving ability (0-100)
   - Communication skills (0-100)
   - Leadership potential (0-100)
   - Innovation capacity (0-100)
   - Total performance score

2. **Performance History:**
   - Monthly performance trends
   - Skill progression over time
   - Learning velocity tracking
   - Consistency metrics

3. **Quiz Performance Analysis:**
   - Total quizzes completed
   - Average quiz score
   - Improvement rate
   - Consistency score
   - Performance trends

4. **Strengths and Weaknesses:**
   - Top performing skills
   - Areas needing improvement
   - Skill gap analysis
   - Priority levels for improvement

5. **Learning Velocity:**
   - Current learning pace
   - Target learning goals
   - Learning efficiency
   - Trend analysis

6. **Achievements System:**
   - Completed achievements
   - Pending achievements
   - Achievement descriptions
   - Progress tracking

7. **Performance Recommendations:**
   - Skill development priorities
   - Learning recommendations
   - Career advancement tips
   - Performance improvement strategies

**Respond with valid JSON only:**
{
  "overallScore": {
    "technical": number,
    "problemSolving": number,
    "communication": number,
    "leadership": number,
    "innovation": number,
    "total": number
  },
  "skillProgression": [
    {
      "month": "string",
      "score": number
    }
  ],
  "quizPerformance": {
    "totalQuizzes": number,
    "averageScore": number,
    "improvement": number,
    "consistency": number
  },
  "strengths": [
    {
      "skill": "string",
      "score": number,
      "trend": "string"
    }
  ],
  "weaknesses": [
    {
      "skill": "string",
      "score": number,
      "trend": "string",
      "priority": "string"
    }
  ],
  "learningVelocity": {
    "current": number,
    "target": number,
    "trend": "string",
    "efficiency": number
  },
  "achievements": [
    {
      "title": "string",
      "description": "string",
      "earned": boolean,
      "date": "string|null"
    }
  ],
  "recommendations": [
    {
      "type": "string",
      "title": "string",
      "priority": "string",
      "impact": "string",
      "effort": "string",
      "timeline": "string"
    }
  ],
  "performanceHistory": [
    {
      "week": "string",
      "score": number,
      "quizzes": number,
      "learning": number
    }
  ]
}
`;

    const output = await generateAIText(prompt, { temperature: 0.4 });
    
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const metrics = JSON.parse(jsonMatch[0]);
    
    res.status(200).json({ metrics });
  } catch (error) {
    console.error('Error in /api/ai/performance-metrics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
