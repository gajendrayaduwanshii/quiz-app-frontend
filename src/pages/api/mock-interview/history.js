import { getStrapiAuthHeaders, getStrapiUrl } from "@/lib/strapiConfig";
import { extractApiError, readJsonResponse } from "@/utils/readJsonResponse";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { documentId } = req.query;
    if (!documentId) {
      return res.status(400).json({ error: "documentId is required" });
    }

    const strapiUrl = getStrapiUrl();
    const fetchRes = await fetch(
      `${strapiUrl}/api/userlists?filters[documentId][$eq]=${encodeURIComponent(documentId)}&fields[0]=mockInterviews`,
      { headers: { ...getStrapiAuthHeaders() } }
    );
    const result = await readJsonResponse(fetchRes);
    if (!fetchRes.ok) throw new Error(extractApiError(result, "Failed to fetch history"));

    const user = result?.data?.[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    const interviews = Array.isArray(user.mockInterviews) ? user.mockInterviews : [];
    return res.status(200).json({ interviews });
  } catch (err) {
    console.error("Error in /api/mock-interview/history:", err);
    return res.status(500).json({ error: err.message || "Failed to fetch history" });
  }
}
