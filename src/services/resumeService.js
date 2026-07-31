import { postJson } from "./httpClient";

export const resumeService = {
  analyze(uploadResume) {
    return postJson("/api/resume/analyze", { uploadResume });
  },
};
