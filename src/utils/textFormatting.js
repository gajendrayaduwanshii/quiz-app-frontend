export const normalizeAIText = (value = "") => {
  return String(value)
    .replace(/\r\n/g, "\n")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*\*\s+/gm, "- ")
    .replace(/^\s*•\s+/gm, "- ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

export const formatReportText = (value = "") => {
  return normalizeAIText(value)
    .replace(/\n(?=Question\s+\d+\s*:)/gi, "\n\n")
    .replace(/\n(?=Question\s*:)/gi, "\n\n")
    .replace(/\n(?=User selected answer\s*:)/gi, "\n")
    .replace(/\n(?=Wrong answer\s*:)/gi, "\n")
    .replace(/\n(?=Correct answer\s*:)/gi, "\n")
    .replace(/\n(?=AI explanation\s*:)/gi, "\n")
    .replace(/\n(?=Weak topic analysis\s*:)/gi, "\n\n")
    .replace(/\n(?=Recommended learning path\s*:)/gi, "\n\n")
    .replace(/\n(?=Interview preparation suggestions\s*:)/gi, "\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};
