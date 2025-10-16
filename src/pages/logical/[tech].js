"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useUser } from "@/customHooks/useUser";
import { useLogicalQuiz } from "@/customHooks/useLogicalQuiz";
import LoaderTwo from "@/components/LoaderTwo";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

const TechQuizPage = () => {
  const router = useRouter();
  const { tech } = router.query; // ✅ dynamic route
  const { user, loading } = useUser();
  const { questions, loadingQuiz } = useLogicalQuiz(user, tech);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [finalSubmitted, setFinalSubmitted] = useState(false);

  if (loading || loadingQuiz || !tech) return <LoaderTwo text="Preparing logical quiz..." />;
  if (!user) return null;

  const currentQ = questions[currentIndex];

  const handleAnswerChange = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
  };

  const handleNext = () => {
    const userAnswer = answers[currentQ.id]?.trim() || "";
    let feedback = "❌ No answer provided.";

    if (userAnswer && currentQ.expectedOutput && userAnswer === currentQ.expectedOutput.trim()) {
      feedback = "✅ Correct!";
    } else if (userAnswer && currentQ.expectedOutput) {
      feedback = `❌ Wrong. Expected: ${currentQ.expectedOutput}`;
    }

    setSubmitted((prev) => ({
      ...prev,
      [currentQ.id]: { ...currentQ, userAnswer, feedback },
    }));

    if (currentIndex < questions.length - 1) setCurrentIndex((prev) => prev + 1);
    else setFinalSubmitted(true);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Logical Questions for {tech}</h1>

      {!finalSubmitted && currentQ && (
        <>
          <h3>Q{currentQ.id}: {currentQ.question}</h3>
          {currentQ.input && <p><strong>Input:</strong> {currentQ.input}</p>}

          {tech.toLowerCase() === "javascript" ? (
            <LiveProvider
              code={answers[currentQ.id] || ""}
              noInline
              transformCode={(code) => `(()=>{ try { return ${code} } catch(e) { return e.message }})()`} // safe evaluation
            >
              <LiveEditor
                onChange={handleAnswerChange}
                style={{ border: "1px solid #ccc", borderRadius: 5, minHeight: 150 }}
              />
              <div style={{ marginTop: "1rem" }}>
                <strong>Live Output:</strong>
                <LiveError style={{ color: "red" }} />
                <LivePreview
                  style={{
                    padding: "1rem",
                    border: "1px solid #eee",
                    background: "#fafafa",
                    minHeight: "50px",
                    borderRadius: "5px",
                  }}
                />
              </div>
            </LiveProvider>
          ) : (
            <textarea
              value={answers[currentQ.id] || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              style={{
                width: "100%",
                minHeight: 150,
                padding: "0.5rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontFamily: "monospace",
              }}
              placeholder="Write your code here..."
            />
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            style={{ marginTop: "1rem" }}
          >
            {currentIndex < questions.length - 1 ? "Next Question" : "Submit Quiz"}
          </Button>
        </>
      )}

      {finalSubmitted && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Results</h2>
          {questions.map((q) => {
            const r = submitted[q.id];
            return (
              <div
                key={q.id}
                style={{
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              >
                <p><strong>Q:</strong> {q.question}</p>
                {q.input && <p><strong>Input:</strong> {q.input}</p>}
                <p><strong>Your Answer:</strong></p>
                <pre
                  style={{
                    background: "#f5f5f5",
                    padding: "0.75rem",
                    borderRadius: "5px",
                  }}
                >
                  {r?.userAnswer || "Not answered"}
                </pre>
                <p><strong>Expected Output:</strong> {q.expectedOutput}</p>
                <p><strong>Feedback:</strong> {r?.feedback || ""}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TechQuizPage;
