import { getStrapiAuthHeaders, getStrapiUrl } from "@/lib/strapiConfig";
import { extractApiError, readJsonResponse } from "@/utils/readJsonResponse";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const response = await fetch(
      `${getStrapiUrl()}/api/userlists?filters[email][$eq]=${encodeURIComponent(email)}`,
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
        .json({ error: extractApiError(result, `Failed to login: ${response.status}`) });
    }

    const user = result?.data?.[0];

    if (!user) {
      return res.status(401).json({ error: "Email not registered" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    return res.status(200).json({
      user: {
        email: user.email,
        documentId: user.documentId,
      },
    });
  } catch (error) {
    console.error("Error in /api/auth/login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
