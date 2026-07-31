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

    const prompt = `
You are an AI-powered market analyst. Analyze the current tech job market and provide comprehensive market insights for the following developer profile:

**Developer Profile:**
- Years of Experience: ${experience}
- Skills: ${skills.map(s => `${s.skillName} (${s.yearsExperience || 0} years, ${s.level || 'Intermediate'})`).join(', ')}
- Work Experience: ${workExperiences.length} positions
- Location: India (assuming based on context)

**Generate comprehensive market insights including:**

1. **Market Overview:**
   - Overall demand growth percentage
   - Salary growth trends
   - Total job openings in market
   - Competition level

2. **Skill Demand Analysis:**
   - Market demand for each skill (0-100%)
   - Growth rate for each skill
   - Average salary for each skill
   - Future prospects

3. **Salary Data:**
   - Salary ranges by experience level
   - Market average salaries
   - Growth projections
   - Location-based variations

4. **Location Analysis:**
   - Top cities for tech jobs
   - Job availability by city
   - Average salaries by location
   - Growth rates by city

5. **Company Trends:**
   - Top hiring companies
   - Job openings by company
   - Average salaries by company
   - Company ratings

6. **Emerging Skills:**
   - New trending skills
   - Growth rates for emerging skills
   - Future demand predictions
   - Learning recommendations

7. **Market Predictions:**
   - 6-month market forecast
   - 1-year market predictions
   - Industry trends
   - Technology shifts

**Respond with valid JSON only:**
{
  "marketTrends": {
    "demandGrowth": number,
    "salaryGrowth": number,
    "jobOpenings": number,
    "competition": number
  },
  "skillDemand": [
    {
      "skill": "string",
      "demand": number,
      "growth": number,
      "salary": number
    }
  ],
  "salaryData": [
    {
      "level": "string",
      "min": number,
      "max": number,
      "avg": number
    }
  ],
  "locationData": [
    {
      "city": "string",
      "jobs": number,
      "avgSalary": number,
      "growth": number
    }
  ],
  "companyTrends": [
    {
      "company": "string",
      "openings": number,
      "avgSalary": number,
      "rating": number
    }
  ],
  "emergingSkills": [
    {
      "skill": "string",
      "growth": number,
      "demand": number,
      "future": "string"
    }
  ],
  "marketPredictions": {
    "next6Months": {
      "demand": "string",
      "salary": "string",
      "opportunities": "string",
      "competition": "string"
    },
    "nextYear": {
      "demand": "string",
      "salary": "string",
      "opportunities": "string",
      "competition": "string"
    }
  }
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
    console.error('Error in /api/ai/market-insights:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
