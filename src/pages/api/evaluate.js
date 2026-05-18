import { generateAIText } from "@/lib/aiClient";

export const config = {
  api: {
    bodyParser: true, // we can parse JSON normally here
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ feedback: "Question or answer missing." });
    }

    const feedback = await generateAIText(null, {
      messages: [
        { role: "system", content: "You are an AI interview evaluator." },
        {
          role: "user",
          content: `Q: ${question}\nA: ${answer}\nProvide short, constructive, and friendly feedback.`,
        },
      ],
      temperature: 0.5,
    });

    res.status(200).json({ feedback: feedback || "No feedback generated." });
  } catch (err) {
    console.error("Error in /api/evaluate:", err);
    res.status(500).json({ feedback: "Error evaluating answer." });
  }
}
