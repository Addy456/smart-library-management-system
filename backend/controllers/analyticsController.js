const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");
const Review = require("../models/reviewModel");
const mongoose = require("mongoose");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// @desc    Get overall reading stats for the logged-in member
// @route   GET /api/analytics/my-stats
// @access  Authenticated
//
// Replaces a previous implementation that loaded every borrow into memory
// and then ran ~6 JavaScript filter/reduce passes. This version pushes all
// aggregations into a single Mongo $facet pipeline so the DB returns the
// shaped result in one round-trip.
exports.getMyStats = catchAsyncErrors(async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [result] = await Borrow.aggregate([
    { $match: { user: userId } },
    {
      $lookup: {
        from: "books",
        localField: "book",
        foreignField: "_id",
        as: "bookDoc",
      },
    },
    {
      $addFields: {
        bookDoc: { $arrayElemAt: ["$bookDoc", 0] },
      },
    },
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalBorrowed: { $sum: 1 },
              totalReturned: {
                $sum: { $cond: [{ $eq: ["$status", "returned"] }, 1, 0] },
              },
              currentlyBorrowed: {
                $sum: { $cond: [{ $eq: ["$status", "borrowed"] }, 1, 0] },
              },
              totalFines: { $sum: { $ifNull: ["$fine", 0] } },
              onTimeReturns: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status", "returned"] },
                        { $ne: ["$actualReturnDate", null] },
                        { $lte: ["$actualReturnDate", "$returnDate"] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
        booksPerMonth: [
          {
            $match: {
              status: "returned",
              actualReturnDate: { $gte: twelveMonthsAgo },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$actualReturnDate" },
                month: { $month: "$actualReturnDate" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ],
        categoryDistribution: [
          { $match: { "bookDoc.category": { $exists: true, $ne: null } } },
          { $group: { _id: "$bookDoc.category", value: { $sum: 1 } } },
          { $project: { _id: 0, name: "$_id", value: 1 } },
          { $sort: { value: -1 } },
        ],
        recentActivity: [
          { $sort: { issueDate: -1 } },
          { $limit: 5 },
          {
            $project: {
              bookTitle: { $ifNull: ["$bookDoc.title", "Unknown"] },
              bookAuthor: { $ifNull: ["$bookDoc.author", ""] },
              bookCover: { $ifNull: ["$bookDoc.coverImage", ""] },
              category: { $ifNull: ["$bookDoc.category", ""] },
              issueDate: 1,
              returnDate: 1,
              actualReturnDate: 1,
              status: 1,
              fine: 1,
            },
          },
        ],
      },
    },
  ]);

  const t = (result && result.totals[0]) || {
    totalBorrowed: 0,
    totalReturned: 0,
    currentlyBorrowed: 0,
    totalFines: 0,
    onTimeReturns: 0,
  };

  // Build the 12-month grid on the server so the client can render without
  // filling in gaps itself.
  const monthMap = {};
  (result?.booksPerMonth || []).forEach((m) => {
    const key = `${m._id.year}-${m._id.month}`;
    monthMap[key] = m.count;
  });
  const booksPerMonth = [];
  for (let i = 11; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    booksPerMonth.push({
      month: d.toLocaleString("default", { month: "short", year: "2-digit" }),
      count: monthMap[key] || 0,
    });
  }

  // Streak = consecutive months (counting backwards from current) with >=1 return.
  let streak = 0;
  for (let i = booksPerMonth.length - 1; i >= 0; i -= 1) {
    if (booksPerMonth[i].count > 0) streak += 1;
    else break;
  }

  const categoryDistribution = result?.categoryDistribution || [];
  const onTimeRate =
    t.totalReturned > 0 ? Math.round((t.onTimeReturns / t.totalReturned) * 100) : 100;

  res.status(200).json({
    success: true,
    stats: {
      totalBorrowed: t.totalBorrowed,
      totalReturned: t.totalReturned,
      currentlyBorrowed: t.currentlyBorrowed,
      totalFines: t.totalFines,
      onTimeRate,
      favouriteCategory: categoryDistribution[0]?.name || null,
      readingStreak: streak,
      booksPerMonth,
      categoryDistribution,
      recentActivity: result?.recentActivity || [],
    },
  });
});

// @desc    Get 12-month bar data for current user
// @route   GET /api/analytics/monthly
// @access  Authenticated
exports.getMonthlyData = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const monthlyData = await Borrow.aggregate([
    {
      $match: {
        user: userId,
        status: "returned",
        actualReturnDate: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$actualReturnDate" },
          month: { $month: "$actualReturnDate" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.status(200).json({ success: true, monthlyData });
});

// @desc    Get category breakdown for current user
// @route   GET /api/analytics/categories
// @access  Authenticated
exports.getCategoryBreakdown = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  const borrows = await Borrow.find({ user: userId }).populate("book", "category");
  const categoryMap = {};
  borrows.forEach((b) => {
    if (b.book && b.book.category) {
      categoryMap[b.book.category] = (categoryMap[b.book.category] || 0) + 1;
    }
  });

  const categories = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  res.status(200).json({ success: true, categories });
});

// @desc    Get 365-day streak calendar (daily borrow counts for heatmap)
// @route   GET /api/analytics/streak-calendar
// @access  Authenticated
exports.getStreakCalendar = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const dailyCounts = await Borrow.aggregate([
    {
      $match: {
        user: userId,
        issueDate: { $gte: oneYearAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$issueDate" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Build a map: date string → count
  const calendarMap = {};
  dailyCounts.forEach((d) => {
    calendarMap[d._id] = d.count;
  });

  // Generate full 365-day grid
  const calendar = [];
  for (let i = 364; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    calendar.push({
      date: dateStr,
      count: calendarMap[dateStr] || 0,
    });
  }

  res.status(200).json({ success: true, calendar });
});

// @desc    Get top authors for current user
// @route   GET /api/analytics/top-authors
// @access  Authenticated
exports.getTopAuthors = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  const borrows = await Borrow.find({ user: userId }).populate("book", "author");
  const authorMap = {};
  borrows.forEach((b) => {
    if (b.book && b.book.author) {
      authorMap[b.book.author] = (authorMap[b.book.author] || 0) + 1;
    }
  });

  const topAuthors = Object.entries(authorMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  res.status(200).json({ success: true, topAuthors });
});

// @desc    Get admin-level analytics summary (all users)
// @route   GET /api/analytics/admin-summary
// @access  Admin only
exports.getAdminSummary = catchAsyncErrors(async (req, res, next) => {
  // Run all independent queries in parallel instead of sequentially
  const [
    totalBooks,
    availableBooks,
    totalBorrows,
    activeBorrows,
    overdueCount,
    ratingAgg,
    topBorrowed,
  ] = await Promise.all([
    Book.countDocuments(),
    Book.countDocuments({ availableCopies: { $gt: 0 } }),
    Borrow.countDocuments(),
    Borrow.countDocuments({ status: "borrowed" }),
    // Guard with $exists/$ne so pending requests (returnDate: null) don't
    // silently match as overdue.
    Borrow.countDocuments({
      status: "borrowed",
      returnDate: { $exists: true, $ne: null, $lt: new Date() },
    }),
    Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
    ]),
    Borrow.aggregate([
      { $group: { _id: "$book", borrowCount: { $sum: 1 } } },
      { $sort: { borrowCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      { $unwind: "$bookInfo" },
      {
        $project: {
          borrowCount: 1,
          title: "$bookInfo.title",
          author: "$bookInfo.author",
        },
      },
    ]),
  ]);

  // ratingAgg returns [] when there are no reviews yet — default safely.
  const avgRating = ratingAgg[0]?.avgRating
    ? Math.round(ratingAgg[0].avgRating * 10) / 10
    : 0;
  const totalReviews = ratingAgg[0]?.totalReviews || 0;

  res.status(200).json({
    success: true,
    summary: {
      totalBooks,
      availableBooks,
      totalBorrows,
      activeBorrows,
      overdueCount,
      avgRating,
      totalReviews,
      topBorrowed,
    },
  });
});
