import { generateAIText } from "@/lib/aiClient";
import { getInterviewReportPrompt } from "@/lib/interview/promptTemplates";

const safeJsonParse = (text) => {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;
    if (start === -1 || end === 0) return null;
    return JSON.parse(text.slice(start, end));
  } catch {
    return null;
  }
};

const FALLBACK_REPORT = {
  overall_score: 6,
  technical_score: 6,
  communication_score: 7,
  problem_solving_score: 6,
  confidence_score: 7,
  hiring_recommendation: "Borderline",
  strengths: ["Completed the full interview", "Demonstrated willingness to engage"],
  weak_areas: ["Answers could be more specific with concrete examples"],
  topics_to_improve: ["Structured answer frameworks (STAR method)", "Technical depth in core domain"],
  suggested_learning_resources: ["LeetCode for coding practice", "System Design Primer on GitHub"],
  example_answers: [],
  final_summary: "The candidate completed the interview and showed engagement. For a more accurate assessment, review the conversation transcript and practice providing structured answers with specific examples and measurable outcomes.",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { config, conversationHistory = [] } = req.body || {};

    if (!config) {
      return res.status(400).json({ error: "config is required." });
    }

    const systemPrompt = getInterviewReportPrompt(config);

    const historyText = conversationHistory
      .filter((m) => m.content)
      .slice(-40)
      .map((m) => `${m.role === "user" ? "Candidate" : "Interviewer"}: ${String(m.content).slice(0, 1500)}`)
      .join("\n\n");

    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Interview Transcript:\n\n${historyText}\n\nGenerate the comprehensive performance report JSON now.`,
      },
    ];

    const aiText = await generateAIText("generate report", {
      messages,
      temperature: 0.3,
      maxTokens: 1600,
    });

    const parsed = safeJsonParse(aiText);
    return res.status(200).json(parsed || FALLBACK_REPORT);
  } catch (err) {
    console.error("Error in /api/mock-interview/report:", err);
    return res.status(200).json(FALLBACK_REPORT);
  }
}
