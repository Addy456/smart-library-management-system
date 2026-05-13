const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const pinoHttp = require("pino-http");
const errorMiddleware = require("./middlewares/errorMiddleware");
const csrfProtection = require("./middlewares/csrfMiddleware");
const logger = require("./utils/logger");

const app = express();

const isProduction = process.env.NODE_ENV === "production";

// Structured request logger (JSON in prod, pretty in dev).
// Also stamps a `req.id` correlation header for tracing.
app.use(
  pinoHttp({
    logger,
    // Quieten health checks
    autoLogging: {
      ignore: (req) => req.url === "/health" || req.url === "/",
    },
  })
);

// Security headers. CSP is explicit so Cloudinary images + the frontend
// origin are allowed; inline styles permitted for Tailwind runtime classes.
app.use(
  helmet({
    contentSecurityPolicy: isProduction
      ? {
          useDefaults: true,
          directives: {
            "default-src": ["'self'"],
            "img-src": ["'self'", "data:", "https://res.cloudinary.com"],
            "script-src": ["'self'"],
            "style-src": ["'self'", "'unsafe-inline'"],
            "connect-src": ["'self'", process.env.FRONTEND_URL || "'self'"],
            "frame-ancestors": ["'none'"],
          },
        }
      : false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Gzip/Brotli response compression
app.use(compression());

// Body parser middleware — cap payload to prevent JSON bombs.
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Cookie parser
app.use(cookieParser());

// Strip any Mongo query operators ($gt, $ne, etc.) from req.body/query/params.
// This neutralises NoSQL operator injection on every endpoint at once.
app.use(mongoSanitize({ replaceWith: "_" }));

// CORS configuration - allow requests from all configured frontend origins.
// FRONTEND_URL can be a comma-separated list (e.g. "http://localhost:5173,http://10.49.206.86:5173")
const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      // Allow requests with no origin (Postman, cURL, server-to-server)
      if (!incomingOrigin) return callback(null, true);
      if (allowedOrigins.includes(incomingOrigin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${incomingOrigin} not allowed`));
    },
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// CSRF protection - validates Origin header on state-changing requests
app.use(csrfProtection);

// Rate limiting — general API limiter (300 requests per 15 minutes per IP)
// Tuned for real usage: admin dashboard alone fires 4+ concurrent calls
// In the test env we disable it so the suite can fire many requests quickly
// without tripping the limiter in ways unrelated to what's being tested.
const skipInTest = () => process.env.NODE_ENV === "test";
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
});

// Stricter rate limit for auth routes (20 requests per 15 minutes per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many authentication attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
});

// Apply rate limiters
app.use("/api/", apiLimiter);
app.use("/api/auth/", authLimiter);

// File upload middleware (for book cover images).
// - Hard 5 MB cap prevents disk/bandwidth DoS on the free tier.
// - abortOnLimit returns 413 instead of silently truncating.
// - safeFileNames strips path traversal characters.
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: require("os").tmpdir(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    abortOnLimit: true,
    safeFileNames: true,
    preserveExtension: 4,
  })
);

// Import routes
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const borrowRoutes = require("./routes/borrowRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const waitlistRoutes = require("./routes/waitlistRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Library Management System API is running",
  });
});

// Deep health check — reports DB connectivity for monitoring/load-balancers
const mongoose = require("mongoose");
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState; // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const healthy = dbState === 1;
  res.status(healthy ? 200 : 503).json({
    status: healthy ? "healthy" : "degraded",
    db: ["disconnected", "connected", "connecting", "disconnecting"][dbState],
    uptime: Math.floor(process.uptime()),
  });
});

// Centralized error handler (must be after routes)
app.use(errorMiddleware);

module.exports = app;
