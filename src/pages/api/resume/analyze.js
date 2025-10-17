import pdfParse from "pdf-parse";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { uploadResume } = req.body;
  if (!uploadResume) return res.status(400).json({ error: "No resume uploaded" });

  try {
    // Fetch PDF from Strapi URL
    const pdfRes = await fetch(uploadResume);
    if (!pdfRes.ok) throw new Error("Failed to fetch resume PDF");

    const arrayBuffer = await pdfRes.arrayBuffer();
    const pdfData = await pdfParse(arrayBuffer);
    const trimmedText = pdfData.text.slice(0, 5000);

    if (!trimmedText.trim()) {
      return res.status(400).json({ error: "PDF is empty or unreadable" });
    }

    // Enhanced prompt for comprehensive resume analysis
    const prompt = `
You are a senior career counselor and technical mentor with 20+ years of experience in the tech industry. Analyze this developer's resume and provide comprehensive career guidance.

**Your Task:**
Analyze the resume text and return a JSON object with this exact structure:

{
  "profileSummary": "Write a compelling 3-4 sentence professional summary that highlights their key strengths, technical expertise, years of experience, and unique value proposition. Make it sound like a professional LinkedIn summary.",
  "learningSuggestions": [
    {
      "area": "Specific skill or technology area to improve",
      "recommendation": "Detailed, actionable learning path with specific technologies, frameworks, or concepts to master. Include practical projects, resources, and timeline. Make it specific to their current level and career goals."
    }
  ]
}

**Analysis Guidelines:**
- Identify their current skill level (Junior/Mid/Senior) based on experience
- Highlight their strongest technical competencies
- Identify skill gaps and growth opportunities
- Suggest 4-6 specific learning areas with actionable recommendations
- Consider current market trends and in-demand technologies
- Provide realistic timelines and practical next steps
- Focus on career advancement and skill development

**Resume Content:**
${trimmedText}

**Important:** Respond ONLY with valid JSON. No explanations, no markdown formatting, no additional text.
`;

    // Helper to call Gemini API
    const callGemini = async (prompt) => {
      const aiRes = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
          },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const aiData = await aiRes.json();
      return aiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    };

    // Safe JSON parsing helper
    const safeJsonParse = (text) => {
      try {
        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}") + 1;
        if (firstBrace === -1 || lastBrace === -1) return null;
        return JSON.parse(text.slice(firstBrace, lastBrace));
      } catch (err) {
        console.error("Failed to parse JSON:", err, text);
        return null;
      }
    };

    const aiText = await callGemini(prompt);

    const parsedData = safeJsonParse(aiText);

    if (!parsedData) {
      return res.status(500).json({ error: "Failed to parse AI response." });
    }

    // Return parsed object
    res.status(200).json({
      profileSummary: parsedData.profileSummary || null,
      learningSuggestions: parsedData.learningSuggestions || [],
    });

  } catch (err) {
    console.error("PDF parsing / AI request error:", err);
    res.status(500).json({ error: "Failed to parse/analyze PDF" });
  }
}
