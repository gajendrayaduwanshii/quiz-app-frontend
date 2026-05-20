export const authService = {
  getStoredUser() {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error("Invalid stored user data:", error);
      localStorage.removeItem("user");
      return null;
    }
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
