// app/api/quiz/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { user, tech } = await req.json();

    if (!user || !tech) {
      return NextResponse.json({ error: "Missing user or tech" }, { status: 400 });
    }

    const matchedSkill = Array.isArray(user.skills)
      ? user.skills.find(
          (skill) => skill.skillName?.toLowerCase() === tech.toLowerCase()
        )
      : null;

    const experience = matchedSkill?.yearsExperience || "N/A";
    const level = matchedSkill?.level || "N/A";

    const prompt = `
Generate 20 multiple-choice quiz questions in JSON format based on user's ${experience} years experience in ${tech} at ${level} level.
Each question should be an object: { id, question, options[], answer }.
Make sure questions match the experience level.
`;

    const apiKey = process.env.GOOGLE_API_KEY; // 👈 use server-side only env var
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await res.json();
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonMatch = output.match(/\[.*\]/s);

    if (!jsonMatch) {
      return NextResponse.json({ questions: [] });
    }

    return NextResponse.json({ questions: JSON.parse(jsonMatch[0]) });
  } catch (error) {
    console.error("Error in /api/quiz:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
