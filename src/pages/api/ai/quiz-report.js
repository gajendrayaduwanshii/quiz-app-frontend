import { generateAIText } from "@/lib/aiClient";

const MAX_USER_CONTEXT_LENGTH = 12000;

const redactSensitiveFields = (value) => {
  if (Array.isArray(value)) return value.map(redactSensitiveFields);
  if (!value || typeof value !== "object") return value;

  return Object.entries(value).reduce((acc, [key, nestedValue]) => {
    const normalizedKey = key.toLowerCase();
    const isSensitive =
      normalizedKey.includes("password") ||
      normalizedKey.includes("token") ||
      normalizedKey.includes("otp") ||
      normalizedKey.includes("secret");

    acc[key] = isSensitive ? "[redacted]" : redactSensitiveFields(nestedValue);
    return acc;
  }, {});
};

const compactJson = (value, maxLength) => {
  const serialized = JSON.stringify(redactSensitiveFields(value || {}), null, 2);
  return serialized.length > maxLength
    ? `${serialized.slice(0, maxLength)}\n[Context truncated]`
    : serialized;
};

const getQuizStats = (quizResult) => {
  const questions = Array.isArray(quizResult?.quizQuestion)
    ? quizResult.quizQuestion
    : [];
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter(
    (question) => question.answer && question.answer === question.correctAnswer
  ).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const score = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return {
    questions,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    score,
  };
};

const getSelectedAnswerLabel = (question) => {
  return question.answer && question.answer === question.correctAnswer
    ? "Correct answer"
    : "Wrong answer";
};

const buildQuestionAnswerBlocks = (quizResult, explanationPrefix = "AI explanation") => {
  const questions = Array.isArray(quizResult?.quizQuestion)
    ? quizResult.quizQuestion
    : [];

  return questions
    .map((question, index) => {
      const selectedAnswer = question.answer || "Not answered";
      const correctAnswer = question.correctAnswer || "Not available";
      const selectedLabel = getSelectedAnswerLabel(question);
      const explanation =
        selectedAnswer === correctAnswer
          ? "Your selected answer is correct. Review the concept once more to strengthen long-term retention."
          : "Review the underlying concept carefully and compare your selected answer with the correct answer to understand the gap.";

      return `Question ${index + 1}: ${question.question || "Question text not available"}
${selectedLabel}: ${selectedAnswer}
Correct answer: ${correctAnswer}
${explanationPrefix}: ${explanation}`;
    })
    .join("\n\n");
};

const buildFallbackReport = (quizResult) => {
  const { questions, totalQuestions, correctAnswers, incorrectAnswers, score } =
    getQuizStats(quizResult);
  const weakQuestionNumbers = questions
    .map((question, index) =>
      question.answer === question.correctAnswer ? null : index + 1
    )
    .filter(Boolean);

  return `SkillSync Quiz Learning Report

Quiz Performance Summary:
Technology: ${quizResult.technology || "Not specified"}
Result: ${quizResult.result || (score >= 50 ? "pass" : "fail")}
Score: ${score}%
Correct answers: ${correctAnswers}
Incorrect answers: ${incorrectAnswers}
Total questions: ${totalQuestions}

All Questions And Answers:
${buildQuestionAnswerBlocks(quizResult)}

Weak Topic Analysis:
${weakQuestionNumbers.length
  ? `Focus on the concepts covered in question ${weakQuestionNumbers.join(", ")}. These answers were incorrect or not answered.`
  : "No weak topics were detected in this attempt. Continue practicing to maintain consistency."}

Recommended Learning Path:
1. Review every incorrect or unanswered question.
2. Revisit the relevant fundamentals for the quiz technology.
3. Create short notes for each corrected concept.
4. Practice a small hands-on example for each weak area.
5. Retake a similar quiz and compare the score.

Interview Preparation Suggestions:
Prepare concise explanations for the concepts tested in this quiz. Focus on why the correct answer is preferred, when alternatives may apply, and how the concept is used in real projects.

Note:
This report was generated from your submitted quiz data because the AI provider was temporarily unavailable.`;
};

const ensureQuestionTextInReport = (report, quizResult) => {
  const questions = Array.isArray(quizResult?.quizQuestion)
    ? quizResult.quizQuestion
    : [];

  if (!questions.length) return report;

  let lines = String(report || "").split("\n");
  const answersHeaderIndex = lines.findIndex((line) =>
    /^All Questions And Answers\s*:/i.test(line)
  );
  const nextSectionIndex = lines.findIndex(
    (line, index) =>
      index > answersHeaderIndex &&
      /^(Weak Topic Analysis|Recommended Learning Path|Interview Preparation Suggestions)\s*:/i.test(line)
  );
  const questionSection = ["All Questions And Answers:", buildQuestionAnswerBlocks(quizResult)];

  if (answersHeaderIndex >= 0) {
    const deleteCount =
      nextSectionIndex > answersHeaderIndex
        ? nextSectionIndex - answersHeaderIndex
        : lines.length - answersHeaderIndex;
    lines.splice(answersHeaderIndex, deleteCount, ...questionSection, "");
  } else {
    const weakTopicIndex = lines.findIndex((line) =>
      /^Weak Topic Analysis\s*:/i.test(line)
    );

    if (weakTopicIndex >= 0) {
      lines.splice(weakTopicIndex, 0, ...questionSection, "");
    } else {
      lines.push("", ...questionSection);
    }
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user, quizResult } = req.body || {};

  if (!quizResult?.quizQuestion?.length) {
    return res.status(400).json({ error: "Quiz attempt data is required" });
  }

  try {
    const prompt = `
You are SkillSync AI. Generate a complete post-quiz learning report for the quiz attempt below.

Use this exact plain-text structure. Do not use Markdown headings, bold markers, asterisks, or code fences:

SkillSync Quiz Learning Report

Quiz Performance Summary:
Technology:
Result:
Score:
Correct answers:
Incorrect answers:

All Questions And Answers:
For every question, use this line-by-line format with one blank line between question blocks. The Question line must include the full question text:

Question 1: Full question text here
Wrong answer: User selected answer when the user's answer is incorrect
Correct answer:
AI explanation:

Question 2: Full question text here
Correct answer: User selected answer when the user's answer is correct
Correct answer:
AI explanation:

Question 3: Full question text here
Wrong answer: Not answered
Correct answer:
AI explanation:

Weak Topic Analysis:
Identify weak topics based on wrong or missing answers.

Recommended Learning Path:
Give a practical step-by-step learning path.

Interview Preparation Suggestions:
Give interview questions/topics the user should prepare next.

Rules:
- Use the actual quiz data only for selected and correct answers.
- If the user skipped an answer, say "Not answered".
- Keep explanations clear and useful for revision.
- Always write in polished, professional English.
- Avoid casual Hinglish, slang, overly familiar phrasing, and unnecessary filler.
- Do not use **bold**, markdown symbols, or decorative stars.
- Keep every Question, Wrong answer or Correct answer selected-answer line, actual Correct answer line, and AI explanation on separate lines.
- Never omit the full question text from the Question line.
- If the selected answer is incorrect or missing, label it as "Wrong answer:".
- If the selected answer is correct, label it as "Correct answer:".
- Always include the actual correct answer line after the selected answer line.

User profile context:
\`\`\`json
${compactJson(user, MAX_USER_CONTEXT_LENGTH)}
\`\`\`

Quiz attempt:
\`\`\`json
${compactJson(quizResult, 10000)}
\`\`\`
`;

    const report = await generateAIText(prompt, {
      temperature: 0.35,
      maxTokens: 4200,
    });

    return res.status(200).json({
      report: ensureQuestionTextInReport(report, quizResult),
    });
  } catch (error) {
    console.error("Error in /api/ai/quiz-report:", error);
    return res.status(200).json({
      report: buildFallbackReport(quizResult),
      warning:
        "The AI provider was temporarily unavailable, so a structured report was generated from the submitted quiz data.",
    });
  }
}
