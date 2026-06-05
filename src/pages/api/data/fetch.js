import { extractApiError, readJsonResponse } from "@/utils/readJsonResponse";
import { assertConfiguredStrapiUrl, getStrapiAuthHeaders } from "@/lib/strapiConfig";

const stripPrivateUserFields = (items) =>
  Array.isArray(items)
    ? items.map(({ password, ...item }) => item)
    : items;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    let strapiUrl;
    try {
      strapiUrl = assertConfiguredStrapiUrl(url);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const response = await fetch(strapiUrl, {
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

    const path = new URL(strapiUrl).pathname;
    const responseData =
      path === "/api/userlists" ? stripPrivateUserFields(data.data) : data.data;

    res.status(200).json({ data: responseData });
  } catch (error) {
    console.error("Error in /api/data/fetch:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
