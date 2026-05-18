import { postJson } from "./httpClient";

export const aiService = {
  userSummary(user) {
    return postJson("/api/user/summary", { user });
  },
  skillAssessment(user, skillName) {
    return postJson("/api/skills/assess", { user, skillName });
  },
  interviewPrep(user, jobRole, companyType) {
    return postJson("/api/interview/prepare", { user, jobRole, companyType });
  },
};
