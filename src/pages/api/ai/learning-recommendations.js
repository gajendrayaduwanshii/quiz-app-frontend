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
    const educations = user.educations || [];

    const prompt = `
You are an AI-powered learning advisor. Analyze the following developer profile and generate personalized learning recommendations:

**Developer Profile:**
- Years of Experience: ${experience}
- Skills: ${skills.map(s => `${s.skillName} (${s.yearsExperience || 0} years, ${s.level || 'Intermediate'})`).join(', ')}
- Education: ${educations.length} degrees/certifications
- Quiz Performance: ${quizResults.length} completed quizzes
- Learning History: Active on platform

**Generate comprehensive learning recommendations including:**

1. **Personalized Learning Path:**
   - Custom learning journey title
   - Detailed description
   - Estimated duration
   - Difficulty level
   - Progress tracking
   - Key skills to develop

2. **Recommended Courses:**
   - Top 4 courses with details
   - Course provider, rating, duration
   - Difficulty and price information
   - Skills covered in each course
   - Recommendation priority

3. **Skill Gap Analysis:**
   - Critical skills missing
   - Importance percentage for each gap
   - Current vs target skill levels
   - Recommended learning resources

4. **Learning Streak & Achievements:**
   - Current learning streak
   - Longest streak achieved
   - Total learning hours
   - Weekly learning goals
   - Achievement badges earned

5. **Achievement System:**
   - Completed achievements
   - Pending achievements
   - Achievement descriptions
   - Progress tracking

**Respond with valid JSON only:**
{
  "personalizedPath": {
    "title": "string",
    "description": "string",
    "duration": "string",
    "difficulty": "string",
    "progress": number,
    "skills": ["string"]
  },
  "courses": [
    {
      "id": number,
      "title": "string",
      "provider": "string",
      "rating": number,
      "duration": "string",
      "difficulty": "string",
      "type": "string",
      "price": "string",
      "skills": ["string"],
      "description": "string",
      "progress": number,
      "recommended": boolean
    }
  ],
  "skillGaps": [
    {
      "skill": "string",
      "importance": number,
      "currentLevel": number,
      "targetLevel": number,
      "courses": ["string"]
    }
  ],
  "learningStreak": {
    "current": number,
    "longest": number,
    "totalHours": number,
    "weeklyGoal": number
  },
  "achievements": [
    {
      "title": "string",
      "description": "string",
      "earned": boolean,
      "date": "string|null"
    }
  ]
}
`;

    const output = await generateAIText(prompt, { temperature: 0.4 });
    
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const recommendations = JSON.parse(jsonMatch[0]);
    
    res.status(200).json({ recommendations });
  } catch (error) {
    console.error('Error in /api/ai/learning-recommendations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
