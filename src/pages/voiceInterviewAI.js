"use client";

import { useState, useRef, useEffect } from "react";

const VoiceInterviewAI = ({ user, tech }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [allResponses, setAllResponses] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Fetch dynamic questions or fallback to mock
  useEffect(() => {
    async function fetchQuestions() {
      if (!user || !tech) {
        // fallback questions if user/tech not provided
        setQuestions([
          { id: 1, question: "What is React?" },
          { id: 2, question: "Explain the virtual DOM." },
          { id: 3, question: "What are React hooks?" },
        ]);
        return;
      }

      try {
        const res = await fetch("/api/fetch-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, tech }),
        });

        const data = await res.json();
        setQuestions(data.questions?.length ? data.questions : [
          { id: 1, question: "Fallback: Describe React components." },
          { id: 2, question: "Fallback: What is state in React?" },
        ]);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setQuestions([
          { id: 1, question: "Fallback: Describe React components." },
          { id: 2, question: "Fallback: What is state in React?" },
        ]);
      }
    }

    fetchQuestions();
  }, [user, tech]);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Cannot access microphone");
    }
  };

  // Stop recording
  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      setAudioURL(URL.createObjectURL(blob));
      const arrayBuffer = await blob.arrayBuffer();

      try {
        // Transcribe
        const res = await fetch("/api/transcribe", { method: "POST", body: arrayBuffer });
        const data = await res.json();
        setTranscript(data.text || "");

        // Evaluate
        const feedbackRes = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: questions[currentIndex].question,
            answer: data.text,
          }),
        });
        const feedbackData = await feedbackRes.json();
        setFeedback(feedbackData.feedback || "");

        // Save response
        setAllResponses(prev => [
          ...prev,
          {
            question: questions[currentIndex].question,
            transcript: data.text || "",
            feedback: feedbackData.feedback || "",
            audioURL: URL.createObjectURL(blob),
          },
        ]);
      } catch (err) {
        console.error("Error processing audio:", err);
        alert("Error processing audio");
      }
    };

    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTranscript("");
      setFeedback("");
      setAudioURL("");
    }
  };

  if (!questions.length) return <p>Loading interview questions...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>AI Voice Interview</h1>

      {currentIndex < questions.length ? (
        <div>
          <h2>
            Q{questions[currentIndex].id}: {questions[currentIndex].question}
          </h2>

          <button onClick={recording ? stopRecording : startRecording}>
            {recording ? "Stop Recording" : "Start Recording"}
          </button>

          {transcript && (
            <div style={{ marginTop: "1rem" }}>
              <strong>Your Answer (Transcribed):</strong>
              <p>{transcript}</p>
            </div>
          )}

          {feedback && (
            <div style={{ marginTop: "1rem" }}>
              <strong>AI Feedback:</strong>
              <p>{feedback}</p>
              {currentIndex < questions.length - 1 && (
                <button onClick={handleNext}>Next Question</button>
              )}
            </div>
          )}

          {audioURL && (
            <div style={{ marginTop: "1rem" }}>
              <strong>Playback:</strong>
              <audio src={audioURL} controls />
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2>Interview Completed!</h2>
          {allResponses.map((r, idx) => (
            <div key={idx} style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
              <p><strong>Q:</strong> {r.question}</p>
              <p><strong>Your Answer:</strong> {r.transcript}</p>
              <p><strong>Feedback:</strong> {r.feedback}</p>
              <audio src={r.audioURL} controls />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceInterviewAI;
