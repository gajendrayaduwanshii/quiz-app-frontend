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

    // Single prompt for both profile summary and learning suggestions
    const prompt = `
You are an expert AI mentor for web developers. 
Analyze the resume text below and return ONLY one JSON object in this exact format:

{
  "profileSummary": "Exactly 5 lines of professional summary text. Each line must be a separate sentence describing role, responsibilities, strengths, and skills from the resume.",
  "learningSuggestions": [
    {
      "area": "Key competency, responsibility, or capability to enhance",
      "recommendation": "Detailed, actionable guidance for improvement, including strategies, exercises, projects, and reasoning. Each recommendation must be at least 5 sentences long."
    }
  ]
}

Strict Rules:
1. "profileSummary" must contain exactly 5 lines (5 sentences).
2. "learningSuggestions" must be an array of at least 5 objects.
3. Each "recommendation" must be at least 5 full sentences long.
4. Do NOT include any text outside the JSON object.
5. Do NOT use markdown.

Resume Text:
${trimmedText}
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
