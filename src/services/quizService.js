import { postJson } from "./httpClient";

export const quizService = {
  generateQuestions(user, tech) {
    return postJson("/api/quiz", { user, tech });
  },
};
