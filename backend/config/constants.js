// Centralised business constants. Change once, applied everywhere.
module.exports = {
  // Borrow lifecycle
  LOAN_DURATION_DAYS: 14,
  FINE_PER_DAY_INR: 5,

  // OTP / email verification
  OTP_TTL_MINUTES: 10,
  OTP_RESEND_COOLDOWN_SECONDS: 60,

  // Password reset
  RESET_TOKEN_TTL_MINUTES: 15,

  // Waitlist
  WAITLIST_CLAIM_WINDOW_HOURS: 24,

  // Security
  BCRYPT_COST: 12,
  PASSWORD_MIN_LENGTH: 8,

  // File uploads
  MAX_UPLOAD_BYTES: 5 * 1024 * 1024,
  ALLOWED_IMAGE_MIMES: ["image/jpeg", "image/png", "image/webp"],

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};
