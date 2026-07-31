import { putJson, request } from "./httpClient";

export const userService = {
  fetchByDocumentId(documentId) {
    return request(`/api/user/fetch?documentId=${encodeURIComponent(documentId)}`);
  },
  update(documentId, data) {
    return putJson("/api/user/update", { documentId, data });
  },
};
