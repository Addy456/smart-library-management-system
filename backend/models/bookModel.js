const mongoose = require("mongoose");

// Book schema definition
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter book title"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Please enter book author"],
  },
  category: {
    type: String,
    required: [true, "Please enter book category"],
  },
  ISBN: {
    type: String,
    required: [true, "Please enter ISBN"],
    unique: true,
  },
  totalCopies: {
    type: Number,
    default: 1,
    min: [0, "Total copies cannot be negative"],
  },
  availableCopies: {
    type: Number,
    default: 1,
    min: [0, "Available copies cannot be negative"],
  },
  coverImage: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  qrCode: {
    type: String,
    default: "",
  },
  // Average rating from reviews (0-5)
  averageRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Text index for fast search across title, author, category
bookSchema.index({ title: "text", author: "text", category: "text" });
// Compound index for catalog queries (filter by availability, sort by date)
bookSchema.index({ availableCopies: 1, createdAt: -1 });

module.exports = mongoose.model("Book", bookSchema);
