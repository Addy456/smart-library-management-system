const Review = require("../models/reviewModel");
const Book = require("../models/bookModel");
const Borrow = require("../models/borrowModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { parsePagination, isString } = require("../utils/helpers");

// @desc    Add a review for a book
// @route   POST /api/reviews/:bookId
// @access  Authenticated member (must have borrowed and returned the book)
exports.addReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment } = req.body;
  const { bookId } = req.params;

  // Validate rating is a number in [1,5] — prevents NaN, strings, or junk
  // sneaking into the $avg aggregation.
  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be an integer between 1 and 5",
    });
  }

  // Cap comment length at the schema boundary so huge payloads can't get in
  // even if a client bypasses frontend validation.
  const trimmedComment = isString(comment) ? comment.slice(0, 1000) : "";

  // Verify the book exists
  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  // Ensure the user has actually returned this book
  const borrowRecord = await Borrow.findOne({
    user: req.user._id,
    book: bookId,
    status: "returned",
  });

  if (!borrowRecord) {
    return res.status(403).json({
      success: false,
      message: "You can only review books you have borrowed and returned",
    });
  }

  // Check if user has already reviewed this book
  const existing = await Review.findOne({ book: bookId, user: req.user._id });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: "You have already reviewed this book",
    });
  }

  const review = await Review.create({
    book: bookId,
    user: req.user._id,
    rating: numericRating,
    comment: trimmedComment,
  });

  // Update book's average rating and review count via $avg aggregation
  const ratingStats = await Review.aggregate([
    { $match: { book: review.book } },
    {
      $group: {
        _id: "$book",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (ratingStats.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: Math.round(ratingStats[0].averageRating * 10) / 10,
      totalReviews: ratingStats[0].totalReviews,
    });
  }

  const populatedReview = await review.populate("user", "name avatar");

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    review: populatedReview,
  });
});

// @desc    Get all reviews for a book (paginated)
// @route   GET /api/reviews/:bookId
// @access  Public
exports.getBookReviews = catchAsyncErrors(async (req, res, next) => {
  const { page, limit, skip } = parsePagination(req.query);

  const [total, reviews] = await Promise.all([
    Review.countDocuments({ book: req.params.bookId }),
    Review.find({ book: req.params.bookId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit) || 1,
    reviews,
  });
});

// @desc    Check if the current user can review a given book
// @route   GET /api/reviews/:bookId/can-review
// @access  Authenticated
exports.canReview = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;

  const borrowRecord = await Borrow.findOne({
    user: req.user._id,
    book: bookId,
    status: "returned",
  });

  const alreadyReviewed = await Review.findOne({
    book: bookId,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    canReview: !!borrowRecord && !alreadyReviewed,
    alreadyReviewed: !!alreadyReviewed,
  });
});
