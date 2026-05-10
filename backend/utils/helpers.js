// Small helpers shared across controllers.

const { MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE } = require("../config/constants");

// Escape regex special characters so user input cannot become a pattern.
exports.escapeRegex = (s) =>
  String(s ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// HTML-escape a string before interpolating it into an email template.
// Prevents stored HTML injection via user-controlled names/titles.
const ENTITY_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
exports.escapeHtml = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ENTITY_MAP[c]);

// Parse and cap pagination query params.
// Returns { page, limit, skip } with safe defaults and an enforced MAX_PAGE_SIZE.
exports.parsePagination = (query) => {
  const pageRaw = Number(query?.page);
  const limitRaw = Number(query?.limit);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const limitCandidate =
    Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : DEFAULT_PAGE_SIZE;
  const limit = Math.min(limitCandidate, MAX_PAGE_SIZE);
  return { page, limit, skip: (page - 1) * limit };
};

// Reject payloads where an expected string field is actually an object.
// Catches NoSQL operator injection even before mongo-sanitize strips keys.
exports.isString = (v) => typeof v === "string" && v.length > 0;
