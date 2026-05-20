import { generateAIText } from "@/lib/aiClient";

// Cache for quiz questions
const quizCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user, tech } = req.body;
    console.log("Quiz API: Received request", { 
      tech, 
      hasUser: !!user,
      userSkills: user?.skills?.length || 0,
      userId: user?.documentId || 'N/A'
    });

    if (!user || !tech) {
      console.error("Quiz API: Missing required fields", { hasUser: !!user, tech });
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
Generate 10 high-quality multiple-choice questions in JSON format. Each question must be an object with this exact structure:
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

**CRITICAL FORMATTING REQUIREMENTS:**
- You MUST respond with ONLY a valid JSON array
- Do NOT include any markdown code blocks (no code fences)
- Do NOT include any explanations, comments, or additional text
- Start directly with [ and end with ]
- Ensure all JSON is properly formatted and valid
- Example format: [{"id": "1", "question": "...", "options": [...], "answer": "..."}]
`;

    const output = await generateAIText(prompt, {
      temperature: 0.4,
      responseMimeType: "application/json",
    });
    console.log("Quiz API: Raw output length", output.length);
    
    if (!output || output.trim().length === 0) {
      console.error("Quiz API: Empty response from AI provider");
      return res.status(500).json({ 
        error: "Empty response from AI",
        questions: [] 
      });
    }

    // Try multiple JSON extraction methods
    let questions = null;
    let jsonString = null;

    // Method 1: Look for JSON array in markdown code blocks
    const codeBlockMatch = output.match(/```(?:json)?\s*(\[.*?\])\s*```/s);
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1];
      console.log("Quiz API: Found JSON in code block");
    }

    // Method 2: Look for JSON array directly
    if (!jsonString) {
      const jsonArrayMatch = output.match(/\[[\s\S]*\]/);
      if (jsonArrayMatch) {
        jsonString = jsonArrayMatch[0];
        console.log("Quiz API: Found JSON array directly");
      }
    }

    // Method 3: Try to find JSON between curly braces or brackets
    if (!jsonString) {
      const bracketMatch = output.match(/(\[[\s\S]{100,}\])/);
      if (bracketMatch) {
        jsonString = bracketMatch[1];
        console.log("Quiz API: Found JSON with bracket matching");
      }
    }

    // Method 4: Try to extract everything that looks like JSON
    if (!jsonString) {
      // Remove markdown formatting and extract JSON
      const cleaned = output
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/^[^{[]*/, '') // Remove text before first [ or {
        .replace(/[^}\]]*$/, ''); // Remove text after last } or ]
      
      if (cleaned.trim().startsWith('[') && cleaned.trim().endsWith(']')) {
        jsonString = cleaned.trim();
        console.log("Quiz API: Extracted JSON after cleaning");
      }
    }

    if (!jsonString) {
      console.error("Quiz API: No JSON found in response");
      console.log("Quiz API: Full output (first 1000 chars):", output.substring(0, 1000));
      console.log("Quiz API: Output length:", output.length);
      return res.status(200).json({ 
        questions: [],
        error: "Could not extract valid JSON from AI response. The AI may have returned text instead of JSON.",
        debug: output.substring(0, 500),
        outputLength: output.length
      });
    }

    try {
      // Clean up the JSON string
      jsonString = jsonString.trim();
      
      // Remove any trailing commas before closing brackets
      jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
      
      questions = JSON.parse(jsonString);
      
      // Validate questions structure
      if (!Array.isArray(questions)) {
        console.error("Quiz API: Parsed JSON is not an array");
        return res.status(200).json({ questions: [] });
      }

      // Filter out invalid questions
      questions = questions.filter(q => 
        q && 
        q.id && 
        q.question && 
        Array.isArray(q.options) && 
        q.options.length >= 2 &&
        q.answer
      );

      console.log("Quiz API: Parsed questions count", questions.length);

      if (questions.length === 0) {
        console.error("Quiz API: No valid questions after filtering");
        return res.status(200).json({ 
          questions: [],
          error: "No valid questions generated"
        });
      }

      // Cache the result
      quizCache.set(cacheKey, {
        questions,
        timestamp: Date.now()
      });

      res.status(200).json({ questions });
    } catch (parseError) {
      console.error("Quiz API: JSON parse error", parseError);
      console.log("Quiz API: JSON string that failed to parse:", jsonString?.substring(0, 500));
      console.log("Quiz API: Full output:", output.substring(0, 1000));
      return res.status(200).json({ 
        questions: [],
        error: "Failed to parse JSON response",
        debug: jsonString?.substring(0, 200)
      });
    }
  } catch (error) {
    console.error("Error in /api/quiz:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
