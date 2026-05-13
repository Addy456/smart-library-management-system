// CSRF protection middleware
// For REST APIs using SameSite cookies + CORS, we validate the Origin header
// to prevent cross-site request forgery attacks on state-changing endpoints.

// Parse allowed origins once at startup. FRONTEND_URL supports a
// comma-separated list (e.g. "http://localhost:5173,http://10.49.206.86:5173")
// so that the same backend can be tested from both localhost and a local IP.
const allowedOrigins = [
  "http://localhost:5173",

  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean),
];

/**
 * Validates the Origin header on state-changing requests (POST, PUT, DELETE, PATCH).
 * In production, requests with no Origin AND no Referer are BLOCKED to prevent
 * attackers from stripping headers to bypass CSRF checks.
 * In development, such requests are allowed for Postman/cURL convenience.
 */
const csrfProtection = (req, res, next) => {
  // Only check state-changing methods
  const unsafeMethods = ["POST", "PUT", "DELETE", "PATCH"];
  if (!unsafeMethods.includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const isProduction = process.env.NODE_ENV === "production";

  // If both Origin and Referer are missing:
  // - In production: BLOCK (prevents header-stripping attacks)
  // - In development: ALLOW (for Postman, cURL, mobile testing)
  if (!origin && !referer) {
    if (isProduction) {
      return res.status(403).json({
        success: false,
        message: "CSRF validation failed: missing origin",
      });
    }
    return next();
  }

  // Validate origin or referer against allowed origins
  let requestOrigin = origin;
  if (!requestOrigin && referer) {
    try {
      requestOrigin = new URL(referer).origin;
    } catch {
      return res.status(403).json({
        success: false,
        message: "CSRF validation failed: malformed referer",
      });
    }
  }

  // Strip trailing slash for comparison
  const normalizedRequest = requestOrigin ? requestOrigin.replace(/\/$/, "") : "";

  if (!normalizedRequest || !allowedOrigins.includes(normalizedRequest)) {
    return res.status(403).json({
      success: false,
      message: "CSRF validation failed: invalid origin",
    });
  }

  next();
};

module.exports = csrfProtection;
