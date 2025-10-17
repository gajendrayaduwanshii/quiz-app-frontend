export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { documentId, data } = req.body;

    if (!documentId || !data) {
      return res.status(400).json({ error: "Document ID and data are required" });
    }

    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

    const response = await fetch(
      `${strapiUrl}/api/userlists/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.STRAPI_API_TOKEN || ""}`,
        },
        body: JSON.stringify({ data }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("User Update API: Strapi error", errorText);
      throw new Error(`Failed to update user data: ${response.status}`);
    }

    const result = await response.json();
    res.status(200).json({ user: result.data });
  } catch (error) {
    console.error("Error in /api/user/update:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
