import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import App from "./App.jsx";
import store from "./redux/store.js";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { setAuthErrorHandler } from "./utils/api.js";
import "./index.css";

// When the API signals 401 on anything other than a login attempt,
// clear auth state so ProtectedRoute redirects the user to /login.
setAuthErrorHandler(() => {
  store.dispatch({ type: "auth/forceLogout" });
});

// Initialize dark class before render to prevent flash
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark" || !savedTheme) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      {/* Redux Provider wraps the entire app */}
      <Provider store={store}>
        {/* LazyMotion reduces framer-motion bundle by ~60% */}
        <LazyMotion features={domAnimation} strict>
        {/* BrowserRouter for client-side routing */}
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </BrowserRouter>
        </LazyMotion>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
