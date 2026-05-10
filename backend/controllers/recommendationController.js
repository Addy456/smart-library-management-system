const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// In-memory recommendation cache (userId -> { data, expiresAt })
const recCache = new Map();
const REC_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Weights for the hybrid scoring engine
const WEIGHT_CATEGORY = 0.4;
const WEIGHT_POPULARITY = 0.3;
const WEIGHT_RECENCY = 0.15;
const WEIGHT_AUTHOR = 0.15;
const COLLABORATIVE_BONUS = 0.15;

// @desc    Get AI-powered book recommendations (hybrid collaborative + content-based)
// @route   GET /api/recommendations
// @access  Authenticated
//
// Scoring: category 40%, popularity 30%, recency 15%, author 15%
// + collaborative bonus when similar users also borrowed the book
exports.getRecommendations = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const cacheKey = userId.toString();

  // Return cached result if fresh
  const cached = recCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return res.status(200).json(cached.data);
  }

  // Step 1: Build the current user's content profile
  const myBorrows = await Borrow.find({ user: userId }).select("book");
  const myBookIds = myBorrows.map((b) => b.book.toString());

  // New user fallback — return popular books
  if (myBookIds.length === 0) {
    const popular = await Book.find({ availableCopies: { $gt: 0 } })
      .sort({ averageRating: -1, totalReviews: -1, createdAt: -1 })
      .limit(10);

    const fallback = popular.map((b) => ({
      ...b.toObject(),
      matchScore: 0,
      whyRecommended: "Popular in the library",
    }));

    return res.status(200).json({
      success: true,
      count: fallback.length,
      favouriteCategories: [],
      recommendations: fallback,
    });
  }

  const myBooks = await Book.find({ _id: { $in: myBookIds } }).select(
    "category author"
  );
  const myCategories = [...new Set(myBooks.map((b) => b.category))];
  const myAuthors = [...new Set(myBooks.map((b) => b.author))];

  // Step 2: Collaborative filtering — find similar users
  const similarUserBorrows = await Borrow.find({
    book: { $in: myBookIds },
    user: { $ne: userId },
  }).select("user book");

  // Count overlap per user
  const overlapCount = {};
  similarUserBorrows.forEach((b) => {
    const uid = b.user.toString();
    overlapCount[uid] = (overlapCount[uid] || 0) + 1;
  });

  // Similar users = anyone sharing ≥1 book; weight by overlap fraction
  const similarUserIds = Object.keys(overlapCount);

  // Books that similar users borrowed but the current user has not
  const collabBookIds = new Set();
  if (similarUserIds.length > 0) {
    const collabBorrows = await Borrow.find({
      user: { $in: similarUserIds },
      book: { $nin: myBookIds },
    }).select("book");
    collabBorrows.forEach((b) => collabBookIds.add(b.book.toString()));
  }

  // Step 3: Fetch candidate books (not already borrowed, available)
  const candidates = await Book.find({
    _id: { $nin: myBookIds },
    availableCopies: { $gt: 0 },
  });

  if (candidates.length === 0) {
    return res.status(200).json({
      success: true,
      count: 0,
      favouriteCategories: myCategories,
      recommendations: [],
    });
  }

  // Global max values for normalisation
  const maxRating = 5;
  const maxReviews = Math.max(...candidates.map((b) => b.totalReviews || 0), 1);
  const now = Date.now();
  const oldestCreated = Math.min(...candidates.map((b) => new Date(b.createdAt).getTime()));
  const timeSpan = Math.max(now - oldestCreated, 1);

  // Convert arrays to Sets for O(1) lookups during scoring
  const myCategoriesSet = new Set(myCategories);
  const myAuthorsSet = new Set(myAuthors);

  // Step 4: Score every candidate
  const scored = candidates.map((book) => {
    const obj = book.toObject();

    // Category score (1 if matches a preferred category, 0 otherwise)
    const categoryScore = myCategoriesSet.has(book.category) ? 1 : 0;

    // Popularity score (normalised rating × review volume)
    const ratingNorm = (book.averageRating || 0) / maxRating;
    const reviewNorm = (book.totalReviews || 0) / maxReviews;
    const popularityScore = ratingNorm * 0.6 + reviewNorm * 0.4;

    // Recency score (newer books score higher)
    const age = now - new Date(book.createdAt).getTime();
    const recencyScore = 1 - age / timeSpan;

    // Author score (1 if matches a preferred author)
    const authorScore = myAuthorsSet.has(book.author) ? 1 : 0;

    // Base content-based score
    let score =
      WEIGHT_CATEGORY * categoryScore +
      WEIGHT_POPULARITY * popularityScore +
      WEIGHT_RECENCY * recencyScore +
      WEIGHT_AUTHOR * authorScore;

    // Collaborative bonus
    if (collabBookIds.has(book._id.toString())) {
      score += COLLABORATIVE_BONUS;
    }

    // Build "why recommended" label
    const reasons = [];
    if (categoryScore > 0) reasons.push(`Matches your favourite category: ${book.category}`);
    if (authorScore > 0) reasons.push(`By an author you enjoy: ${book.author}`);
    if (collabBookIds.has(book._id.toString())) reasons.push("Readers like you also borrowed this");
    if (popularityScore > 0.7) reasons.push("Highly rated");
    if (recencyScore > 0.8) reasons.push("Recently added");
    if (reasons.length === 0) reasons.push("Popular in the library");

    return {
      ...obj,
      matchScore: Math.min(Math.round(score * 100), 99),
      whyRecommended: reasons[0],
    };
  });

  // Sort by score descending, take top 10
  scored.sort((a, b) => b.matchScore - a.matchScore);
  const recommendations = scored.slice(0, 10);

  const response = {
    success: true,
    count: recommendations.length,
    favouriteCategories: myCategories,
    recommendations,
  };

  // Cache for 5 minutes
  recCache.set(cacheKey, { data: response, expiresAt: Date.now() + REC_CACHE_TTL });

  res.status(200).json(response);
});
