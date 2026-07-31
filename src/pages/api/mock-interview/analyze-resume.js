import formidable from "formidable";
import { readFile } from "fs/promises";
import pdfParse from "pdf-parse";
import { generateAIText } from "@/lib/aiClient";
import { getResumeAnalysisPrompt } from "@/lib/interview/promptTemplates";

export const config = {
  api: { bodyParser: false },
};

const safeJsonParse = (text) => {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;
    if (start === -1 || end === 0) return null;
    return JSON.parse(text.slice(start, end));
  } catch {
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable({ maxFileSize: 5 * 1024 * 1024 });
    const [, files] = await new Promise((resolve, reject) =>
      form.parse(req, (err, fields, uploadedFiles) =>
        err ? reject(err) : resolve([fields, uploadedFiles])
      )
    );

    const file = Array.isArray(files.resume) ? files.resume[0] : files.resume;
    if (!file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    const buffer = await readFile(file.filepath);
    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text?.trim();

    if (!resumeText) {
      return res.status(400).json({ error: "Could not extract text from the PDF. Please try a different file." });
    }

    const prompt = getResumeAnalysisPrompt(resumeText);
    const aiText = await generateAIText(prompt, { temperature: 0.3, maxTokens: 1024 });
    const parsed = safeJsonParse(aiText);

    if (!parsed) {
      // Return a minimal fallback if parsing fails
      return res.status(200).json({
        summary: "Resume uploaded successfully. Interview will be tailored based on your experience.",
        key_skills: [],
        technologies: [],
        notable_projects: [],
        interview_focus_areas: [],
        raw_text_preview: resumeText.slice(0, 300),
      });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Error in /api/mock-interview/analyze-resume:", err);
    return res.status(500).json({ error: "Failed to analyze resume. Please try again." });
  }
}
