import { extractApiError, readJsonResponse } from "@/utils/readJsonResponse";
import { getStrapiAuthHeaders, getStrapiUrl } from "@/lib/strapiConfig";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { endpoint, data, config = {} } = req.body;

    if (!endpoint || !data) {
      return res.status(400).json({ error: "Endpoint and data are required" });
    }

    const baseUrl = getStrapiUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getStrapiAuthHeaders(),
        ...config.headers,
      },
      body: JSON.stringify(data),
    });

    const result = await readJsonResponse(response);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: extractApiError(result, `Failed to post data: ${response.status}`) });
    }

    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error in /api/data/post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
