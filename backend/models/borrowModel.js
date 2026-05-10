const mongoose = require("mongoose");

// Borrow schema - tracks book borrowing and returns.
// `timestamps: true` gives us createdAt / updatedAt, which several admin
// list queries sort on. Without it the `{ createdAt: -1 }` index below
// would never hit anything.
const borrowSchema = new mongoose.Schema(
  {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: [true, "Book is required"],
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
  },
  actualReturnDate: {
    type: Date,
  },
  fine: {
    type: Number,
    default: 0, // Fine in INR (₹5/day for overdue)
  },
  status: {
    type: String,
    enum: ["pending", "borrowed", "returned", "rejected"],
    default: "pending",
  },
  },
  { timestamps: true }
);

// Compound indexes for the queries the app actually runs
borrowSchema.index({ user: 1, status: 1 });
borrowSchema.index({ book: 1, status: 1 });
borrowSchema.index({ status: 1, returnDate: 1 }); // overdue lookup
borrowSchema.index({ createdAt: -1 }); // admin records sorted by newest

module.exports = mongoose.model("Borrow", borrowSchema);
