import axios from "axios";

// Axios instance with base configuration.
// Auth is carried entirely by an httpOnly cookie issued by the backend.
// We never touch the token in JavaScript — this prevents XSS-based
// token theft even if some downstream component renders user-controlled HTML.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://smart-library-backend-u957.onrender.com/api",
  withCredentials: true, // Send cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// Global 401 handler — wired in main.jsx via setAuthErrorHandler(store).
// Avoids importing the Redux store here (circular dep).
let onAuthError = null;
export const setAuthErrorHandler = (handler) => {
  onAuthError = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    // Only treat as a session-expired signal if it's NOT a login attempt.
    // Otherwise wrong credentials would trigger a redirect loop.
    const isAuthAttempt = url.includes("/auth/login") || url.includes("/auth/verify-otp");
    if (status === 401 && !isAuthAttempt && typeof onAuthError === "function") {
      onAuthError();
    }
    return Promise.reject(error);
  }
);

export default api;
