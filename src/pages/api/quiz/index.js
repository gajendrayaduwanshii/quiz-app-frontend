// Cache for quiz questions
const quizCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user, tech } = req.body;
    console.log("Quiz API: Received request", { tech, hasUser: !!user });

    if (!user || !tech) {
      return res.status(400).json({ error: "Missing user or tech" });
    }

    // Create cache key
    const cacheKey = `quiz_${tech}_${user.skills?.length || 0}_${user.yearsExperience || 0}`;
    const cachedData = quizCache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return res.status(200).json({ questions: cachedData.questions });
    }

    const matchedSkill = Array.isArray(user.skills)
      ? user.skills.find(
          (skill) => skill.skillName?.toLowerCase() === tech.toLowerCase()
        )
      : null;

    const experience = matchedSkill?.yearsExperience || "N/A";
    const level = matchedSkill?.level || "N/A";

    const prompt = `
You are a senior technical interviewer and assessment expert with deep expertise in ${tech}. Create a comprehensive quiz to evaluate a developer's knowledge and skills.

**Developer Profile:**
- Technology: ${tech}
- Experience Level: ${level}
- Years of Experience: ${experience} years
- Skills: ${user.skills?.map(s => s.skillName).join(', ') || 'Not specified'}

**Quiz Requirements:**
Generate 20 high-quality multiple-choice questions in JSON format. Each question must be an object with this exact structure:
{
  "id": "unique_question_id",
  "question": "Clear, specific question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "Correct option text"
}

**Question Distribution:**
- 40% Fundamentals & Basics (${experience < 2 ? 'Beginner' : experience < 5 ? 'Intermediate' : 'Advanced'})
- 30% Practical Application & Best Practices
- 20% Advanced Concepts & Architecture
- 10% Current Trends & Latest Features

**Quality Standards:**
- Questions should be realistic and job-relevant
- Avoid trick questions or overly complex scenarios
- Include real-world scenarios and practical problems
- Ensure options are plausible but only one is correct
- Use industry-standard terminology
- Consider the developer's experience level appropriately

**Important:** Respond ONLY with valid JSON array. No explanations, no markdown, no additional text.
`;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    console.log("Quiz API: API Key present", !!apiKey);
    
    if (!apiKey) {
      return res.status(500).json({ error: "Google API Key not configured" });
    }
    
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    console.log("Quiz API: Calling Gemini API for", tech);
    const geminiRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await geminiRes.json();
    console.log("Quiz API: Gemini response status", geminiRes.status);
    
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Quiz API: Raw output length", output.length);
    
    const jsonMatch = output.match(/\[.*\]/s);
    console.log("Quiz API: JSON match found", !!jsonMatch);

    if (!jsonMatch) {
      console.log("Quiz API: No JSON match found, returning empty questions");
      return res.status(200).json({ questions: [] });
    }

    try {
      const questions = JSON.parse(jsonMatch[0]);
      console.log("Quiz API: Parsed questions count", questions.length);

      // Cache the result
      quizCache.set(cacheKey, {
        questions,
        timestamp: Date.now()
      });

      res.status(200).json({ questions });
    } catch (parseError) {
      console.error("Quiz API: JSON parse error", parseError);
      console.log("Quiz API: Raw output that failed to parse:", output);
      res.status(200).json({ questions: [] });
    }
  } catch (error) {
    console.error("Error in /api/quiz:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
