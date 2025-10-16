import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const config = {
  api: { bodyParser: false }, // we read raw audio bytes
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ message: "POST audio to transcribe" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Collect raw audio chunks
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const audioBuffer = Buffer.concat(buffers);

    if (!audioBuffer || !audioBuffer.length) {
      return res.status(400).json({ error: "No audio received" });
    }

    // Send to OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioBuffer,
      model: "whisper-1",
    });

    // Return transcription text
    res.status(200).json({ text: transcription?.text || "" });
  } catch (err) {
    console.error("Error in /api/transcribe:", err);
    res.status(500).json({ error: "Error transcribing audio" });
  }
}
