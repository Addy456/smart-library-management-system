const mongoose = require("mongoose");

// Waitlist schema - queues users for unavailable books
const waitlistSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: [true, "Book is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  // Position in the waitlist queue (1 = first in line)
  position: {
    type: Number,
    required: true,
  },
  // Status tracks the lifecycle: waiting → notified → fulfilled/expired/cancelled
  status: {
    type: String,
    enum: ["waiting", "notified", "fulfilled", "expired", "cancelled"],
    default: "waiting",
  },
  // 24h claim window after notification
  expiresAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a user can only be on the waitlist for a book once
waitlistSchema.index({ book: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Waitlist", waitlistSchema);
