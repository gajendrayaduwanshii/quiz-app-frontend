import { extractApiError, readJsonResponse } from "@/utils/readJsonResponse";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Forward the multipart form data to Strapi
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/upload`,
      {
        method: "POST",
        body: req,
        headers: {
          "Authorization": `Bearer ${process.env.STRAPI_API_TOKEN || ""}`,
          ...req.headers,
        },
      }
    );

    const result = await readJsonResponse(response);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: extractApiError(result, `Failed to upload file: ${response.status}`) });
    }

    res.status(200).json({ file: result[0] });
  } catch (error) {
    console.error("Error in /api/upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
