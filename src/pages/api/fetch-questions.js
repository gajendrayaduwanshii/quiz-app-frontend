import { generateAIText } from "@/lib/aiClient";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { user, tech } = req.body;

  if (!user || !tech) {
    return res.status(400).json({ questions: [] });
  }

  const prompt = `
Generate 5 interview questions for a candidate with skills: ${tech} 
and experience level: ${user.level || "N/A"}. 
Return strictly as a JSON array like:
[{ "id": 1, "question": "..." }]
`;

  try {
    const text = await generateAIText(prompt, { temperature: 0.7 });
    let questions = [];

    try {
      questions = JSON.parse(text);
    } catch {
      console.warn("Failed to parse AI response:", text);
      questions = [
        { id: 1, question: "Fallback: Describe React components." },
        { id: 2, question: "Fallback: What is state in React?" },
      ];
    }

    res.status(200).json({ questions });
  } catch (err) {
    console.error("Error in /api/fetch-questions:", err);
    res.status(500).json({ questions: [] });
  }
}
