import { extractApiError, readJsonResponse } from "@/utils/readJsonResponse";
import { assertConfiguredStrapiUrl, getStrapiAuthHeaders } from "@/lib/strapiConfig";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const response = await fetch(assertConfiguredStrapiUrl(url), {
      headers: {
        ...getStrapiAuthHeaders(),
      },
    });

    const data = await readJsonResponse(response);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: extractApiError(data, `Failed to fetch data: ${response.status}`) });
    }

    res.status(200).json({ data: data.data });
  } catch (error) {
    console.error("Error in /api/data/fetch:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
