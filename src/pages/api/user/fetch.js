// NO CACHE - Always fetch fresh data
import { extractApiError, readJsonResponse } from "@/utils/readJsonResponse";
import { getStrapiAuthHeaders, getStrapiUrl } from "@/lib/strapiConfig";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { documentId } = req.query;

    if (!documentId) {
      return res.status(400).json({ error: "Document ID is required" });
    }

    // NO CACHE - Always fetch fresh data from Strapi

    const response = await fetch(
      `${getStrapiUrl()}/api/userlists?filters[documentId][$eq]=${encodeURIComponent(
        documentId
      )}&populate[uploadResume][populate]=*&populate[skills]=*&populate[workExperiences]=*&populate[educations]=*&populate[quizResult][populate]=*`,
      {
        headers: {
          ...getStrapiAuthHeaders(),
        },
      }
    );

    const result = await readJsonResponse(response);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: extractApiError(result, `Failed to fetch user data: ${response.status}`) });
    }

    if (result?.data?.length > 0) {
      const user = result.data[0];
      
      // NO CACHE - Return fresh data directly
      res.status(200).json({ user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error in /api/user/fetch:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
