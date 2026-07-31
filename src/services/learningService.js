import { postJson } from "./httpClient";

export const learningService = {
  generatePath(user, goal, timeCommitment) {
    return postJson("/api/learning/path", { user, goal, timeCommitment });
  },
};
