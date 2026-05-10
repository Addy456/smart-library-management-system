// Centralized error handling middleware
// Converts internal errors into sanitized HTTP responses. Never leaks stack
// traces, Mongo internals, or other implementation details to clients in
// production — those only appear in the server logs.

const logger = require("../utils/logger");

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose CastError → bad ObjectId or similar
  if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 400;
  }

  // Mongoose ValidationError → aggregate field messages
  if (err.name === "ValidationError") {
    message = Object.values(err.errors || {})
      .map((val) => val.message)
      .join(", ") || "Validation failed";
    statusCode = 400;
  }

  // Mongo duplicate key (E11000)
  if (err.code === 11000) {
    const key = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate ${key} entered`;
    statusCode = 400;
  }

  if (err.name === "JsonWebTokenError") {
    message = "Authentication token is invalid. Please log in again.";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Authentication token has expired. Please log in again.";
    statusCode = 401;
  }

  // Log server errors with full context; clients only get a sanitized message.
  if (statusCode >= 500) {
    logger.error(
      {
        err: { message: err.message, name: err.name, stack: err.stack },
        method: req.method,
        url: req.originalUrl,
        userId: req.user && req.user._id,
      },
      "Unhandled server error"
    );
    // In production, don't leak raw exception messages (they can reveal
    // library names, SQL fragments, file paths, etc.). Dev keeps the
    // original message so engineers can debug quickly.
    if (process.env.NODE_ENV === "production") {
      message = "Internal Server Error";
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorMiddleware;
