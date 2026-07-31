import { extractApiError, readJsonResponse } from "@/utils/readJsonResponse";
import { getStrapiAuthHeaders, getStrapiUrl } from "@/lib/strapiConfig";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { documentId, data } = req.body;

    if (!documentId || !data) {
      return res.status(400).json({ error: "Document ID and data are required" });
    }

    const strapiUrl = getStrapiUrl();

    const response = await fetch(
      `${strapiUrl}/api/userlists/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getStrapiAuthHeaders(),
        },
        body: JSON.stringify({ data }),
      }
    );

    const result = await readJsonResponse(response);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: extractApiError(result, `Failed to update user data: ${response.status}`) });
    }

    res.status(200).json({ user: result.data });
  } catch (error) {
    console.error("Error in /api/user/update:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
