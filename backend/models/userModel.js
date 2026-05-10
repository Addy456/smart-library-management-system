const mongoose = require("mongoose");
const validator = require("validator");

// User schema definition
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false, // Don't return password in queries by default
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  // OTP fields for email verification — hidden from queries by default
  otp: {
    type: Number,
    select: false,
  },
  otpExpiry: {
    type: Date,
    select: false,
  },
  // Password reset fields — hidden from queries by default
  resetPasswordToken: {
    type: String,
    select: false,
  },
  resetPasswordExpiry: {
    type: Date,
    select: false,
  },
  avatar: {
    type: String,
    default: "",
  },
  // Account lockout fields — tracked to throttle brute-force login attempts.
  // `lockedUntil` is an absolute timestamp; past values mean "not locked".
  // Both are hidden from default queries so they never leak in /me responses.
  failedLoginAttempts: {
    type: Number,
    default: 0,
    select: false,
  },
  lockedUntil: {
    type: Date,
    default: null,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for common queries (email index already created by unique: true above)
userSchema.index({ verified: 1, createdAt: 1 });

module.exports = mongoose.model("User", userSchema);
