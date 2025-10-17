// NO CACHE - Always fetch fresh data

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
      `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/userlists?filters[documentId][$eq]=${documentId}&populate[uploadResume][populate]=*&populate[skills]=*&populate[workExperiences]=*&populate[educations]=*&populate[quizResult][populate]=*`,
      {
        headers: {
          "Authorization": `Bearer ${process.env.STRAPI_API_TOKEN || ""}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const result = await response.json();

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
