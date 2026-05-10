const mongoose = require("mongoose");

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Connect to MongoDB with retry logic
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("FATAL: MONGODB_URI is not defined in environment variables.");
    process.exit(1);
  }

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4, // Force IPv4 — avoids IPv6 DNS issues on Windows
  };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(uri, options);
      console.log(`MongoDB Connected: ${conn.connection.host}`);

      // Connection event listeners for runtime issues
      mongoose.connection.on("error", (err) => {
        console.error("MongoDB runtime error:", err.message);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected. Mongoose will auto-reconnect.");
      });

      mongoose.connection.on("reconnected", () => {
        console.log("MongoDB reconnected successfully.");
      });

      return; // success
    } catch (error) {
      console.error(
        `MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`
      );

      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await sleep(RETRY_DELAY_MS);
      } else {
        console.error(
          "All MongoDB connection attempts failed. Server will start without DB — health check will report unhealthy."
        );
        // Do NOT process.exit — let the server stay up so health checks / diagnostics work
      }
    }
  }
};

module.exports = connectDB;
