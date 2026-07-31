import { getStrapiAuthHeaders, getStrapiUrl } from "@/lib/strapiConfig";
import { extractApiError, readJsonResponse } from "@/utils/readJsonResponse";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { documentId, report, config } = req.body || {};
    if (!documentId || !report || !config) {
      return res.status(400).json({ error: "documentId, report, and config are required" });
    }

    const strapiUrl = getStrapiUrl();
    const headers = { "Content-Type": "application/json", ...getStrapiAuthHeaders() };

    // 1. Fetch existing mockInterviews from Strapi
    const fetchRes = await fetch(
      `${strapiUrl}/api/userlists?filters[documentId][$eq]=${encodeURIComponent(documentId)}&fields[0]=mockInterviews`,
      { headers }
    );
    const fetchResult = await readJsonResponse(fetchRes);
    if (!fetchRes.ok) throw new Error(extractApiError(fetchResult, "Failed to fetch user"));

    const user = fetchResult?.data?.[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    const existing = Array.isArray(user.mockInterviews) ? user.mockInterviews : [];

    // 2. Build new interview entry
    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      config: {
        jobRole: config.jobRole || "Interview",
        interviewType: config.interviewType || "technical",
        experienceLevel: config.experienceLevel || "",
        maxQuestions: config.maxQuestions || 30,
      },
      report: {
        overall_score: report.overall_score,
        technical_score: report.technical_score,
        communication_score: report.communication_score,
        problem_solving_score: report.problem_solving_score,
        confidence_score: report.confidence_score,
        hiring_recommendation: report.hiring_recommendation,
        strengths: report.strengths || [],
        weak_areas: report.weak_areas || [],
        topics_to_improve: report.topics_to_improve || [],
        suggested_learning_resources: report.suggested_learning_resources || [],
        example_answers: report.example_answers || [],
        final_summary: report.final_summary || "",
      },
    };

    // 3. PUT back to Strapi with new entry prepended (newest first)
    const putRes = await fetch(`${strapiUrl}/api/userlists/${documentId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ data: { mockInterviews: [entry, ...existing] } }),
    });
    const putResult = await readJsonResponse(putRes);
    if (!putRes.ok) throw new Error(extractApiError(putResult, "Failed to save interview"));

    return res.status(200).json({ success: true, entry });
  } catch (err) {
    console.error("Error in /api/mock-interview/save:", err);
    return res.status(500).json({ error: err.message || "Failed to save interview" });
  }
}
