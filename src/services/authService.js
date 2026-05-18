export const authService = {
  getStoredUser() {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  },
  setStoredUser(user) {
    if (typeof window === "undefined") return;
    localStorage.setItem("user", JSON.stringify(user));
  },
  clearStoredUser() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("user");
  },
};
