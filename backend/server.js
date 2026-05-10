const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config({ path: "./.env" });

// ── Env validation ─────────────────────────────────────────────
const REQUIRED_ENV = [
  "MONGODB_URI",
  "JWT_SECRET",
  "JWT_EXPIRE",
  "COOKIE_EXPIRE",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "FRONTEND_URL",
];

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`FATAL: Missing required env vars: ${missing.join(", ")}`);
  console.error("Create a .env file based on .env.example and fill in all values.");
  process.exit(1);
}

// COOKIE_EXPIRE must be a positive integer number of days.
const cookieExpireDays = Number(process.env.COOKIE_EXPIRE);
if (!Number.isFinite(cookieExpireDays) || cookieExpireDays <= 0 || cookieExpireDays > 365) {
  console.error(
    `FATAL: COOKIE_EXPIRE must be a positive integer between 1 and 365 (days). Got: ${process.env.COOKIE_EXPIRE}`
  );
  process.exit(1);
}

const app = require("./app");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const notifyUsers = require("./services/notifyUsers");
const removeUnverifiedAccounts = require("./services/removeUnverifiedAccounts");
const startWaitlistProcessor = require("./services/waitlistProcessor");
const logger = require("./utils/logger");

// Configure Cloudinary for image uploads
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 4000;

// ── Startup sequence ───────────────────────────────────────────
const startServer = async () => {
  // 1. Connect to MongoDB (retries internally)
  await connectDB();

  const dbReady = mongoose.connection.readyState === 1; // 1 = connected

  // 2. Start HTTP server (always — so health checks work even if DB is down)
  const server = app.listen(PORT, () => {
    logger.info(
      { port: PORT, env: process.env.NODE_ENV || "development", db: dbReady ? "connected" : "NOT connected" },
      "Server started"
    );
  });

  // 3. Start cron jobs ONLY if DB connected
  if (dbReady) {
    notifyUsers();
    removeUnverifiedAccounts();
    startWaitlistProcessor();
    logger.info("Cron jobs started");
  } else {
    logger.warn(
      "Cron jobs NOT started because MongoDB is unavailable. Restart the server after fixing DB connectivity."
    );
  }

  // ── Graceful shutdown ──────────────────────────────────────
  const shutdown = (signal) => {
    logger.info({ signal }, "Shutting down gracefully");
    server.close(async () => {
      try {
        await mongoose.connection.close();
        logger.info("MongoDB connection closed");
      } catch (_) {
        // connection may already be closed
      }
      process.exit(0);
    });

    // Force kill after 10s if graceful shutdown stalls
    setTimeout(() => {
      logger.error("Forced shutdown after 10s timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Handle unhandled promise rejections (log but do NOT kill the server in dev)
  process.on("unhandledRejection", (err) => {
    logger.error({ err }, "Unhandled Rejection");
  });

  process.on("uncaughtException", (err) => {
    logger.fatal({ err }, "Uncaught Exception");
    shutdown("uncaughtException");
  });
};

startServer();
