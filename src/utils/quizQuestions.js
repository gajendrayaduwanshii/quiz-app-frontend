const OPTION_PREFIX = /^\s*([A-Z])\s*[\.\)\-:]\s*/i;

const toText = (value) => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }

  if (!value || typeof value !== "object") return "";

  const knownValue = [
    value.option,
    value.text,
    value.label,
    value.value,
    value.answer,
    value.content,
  ].find((item) => typeof item === "string" || typeof item === "number");

  if (knownValue !== undefined) return String(knownValue).trim();

  const primitiveValue = Object.values(value).find(
    (item) => typeof item === "string" || typeof item === "number"
  );
  return primitiveValue === undefined ? "" : String(primitiveValue).trim();
};

export const cleanOptionText = (option) =>
  toText(option).replace(OPTION_PREFIX, "").trim();

const normalizeAnswer = (answer, rawOptions, options) => {
  const rawAnswer = toText(answer);
  if (!rawAnswer) return "";

  const letterMatch = rawAnswer.match(/^\s*([A-Z])(?:\s*[\.\)\-:]?\s*)$/i);
  if (letterMatch) {
    const optionIndex = letterMatch[1].toUpperCase().charCodeAt(0) - 65;
    return options[optionIndex] || "";
  }

  const cleanedAnswer = cleanOptionText(rawAnswer);
  const matchingIndex = rawOptions.findIndex((option) => {
    const rawOption = toText(option);
    return (
      rawOption.toLowerCase() === rawAnswer.toLowerCase() ||
      cleanOptionText(rawOption).toLowerCase() === cleanedAnswer.toLowerCase()
    );
  });

  return matchingIndex >= 0 ? options[matchingIndex] : cleanedAnswer;
};

export const normalizeQuizQuestion = (question, index = 0) => {
  if (!question || typeof question !== "object") return null;

  const questionText = toText(
    question.question ?? question.questionText ?? question.text
  );
  const rawOptions = Array.isArray(question.options)
    ? question.options
    : Array.isArray(question.choices)
      ? question.choices
      : [];
  const options = rawOptions.map(cleanOptionText).filter(Boolean);
  const answer = normalizeAnswer(
    question.answer ?? question.correctAnswer,
    rawOptions,
    rawOptions.map(cleanOptionText)
  );

  if (!questionText || options.length < 2 || !answer || !options.includes(answer)) {
    return null;
  }

  return {
    ...question,
    id: question.id || String(index + 1),
    question: questionText,
    options,
    answer,
  };
};

export const normalizeQuizQuestions = (questions) =>
  (Array.isArray(questions) ? questions : [])
    .map(normalizeQuizQuestion)
    .filter(Boolean);
