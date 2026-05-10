// Centralised pino logger. In dev we pretty-print; in prod we emit JSON
// suitable for log aggregators (Render, CloudWatch, Loki, etc.).
const pino = require("pino");

const isProduction = process.env.NODE_ENV === "production";

const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  base: undefined, // don't spam every log with pid/hostname
  transport: isProduction
    ? undefined
    : {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "HH:MM:ss", ignore: "pid,hostname" },
      },
});

module.exports = logger;
