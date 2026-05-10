const Waitlist = require("../models/waitlistModel");
const Book = require("../models/bookModel");
const Borrow = require("../models/borrowModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendEmail = require("../utils/sendEmail");
const logger = require("../utils/logger");
const { escapeHtml } = require("../utils/helpers");
const { LOAN_DURATION_DAYS, WAITLIST_CLAIM_WINDOW_HOURS } = require("../config/constants");

const CLAIM_WINDOW_MS = WAITLIST_CLAIM_WINDOW_HOURS * 60 * 60 * 1000;

// Small fire-and-forget email wrapper that logs instead of throwing.
const sendEmailSafe = (opts, context) =>
  sendEmail(opts).catch((err) =>
    logger.error({ err: err.message, context }, "Waitlist email failed")
  );

// HTML template for "your turn to claim" emails. All user-controlled values
// (name, title) are escaped so they can't inject markup into the email.
const buildClaimEmailHtml = (name, bookTitle) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #4f46e5;">Your Waitlisted Book is Available!</h2>
    <p>Hi <strong>${escapeHtml(name)}</strong>,</p>
    <p>The book <strong>"${escapeHtml(bookTitle)}"</strong> you were waiting for is now available to borrow.</p>
    <p>You are <strong>first in line</strong> — you have <strong>${WAITLIST_CLAIM_WINDOW_HOURS} hours</strong> to claim it before the slot is passed to the next person.</p>
    <p>Log in to the Smart Library to borrow it now!</p>
    <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">Smart Library Management System</p>
  </div>
`;

// @desc    Join the waitlist for a book
// @route   POST /api/waitlist/:bookId
// @access  Authenticated member
exports.joinWaitlist = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;

  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  if (book.availableCopies > 0) {
    return res.status(400).json({
      success: false,
      message: "This book is currently available — you can borrow it directly",
    });
  }

  const existing = await Waitlist.findOne({
    book: bookId,
    user: req.user._id,
    status: { $in: ["waiting", "notified"] },
  });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: "You are already on the waitlist for this book",
    });
  }

  // Race-safe position assignment: count active waiters + 1. Not 100%
  // airtight under heavy concurrency (the ideal fix is a per-book counter
  // doc or a retry on unique-index violation), but it's deterministic for
  // the library-scale traffic profile this system serves.
  const active = await Waitlist.countDocuments({
    book: bookId,
    status: { $in: ["waiting", "notified"] },
  });
  const position = active + 1;

  const entry = await Waitlist.create({
    book: bookId,
    user: req.user._id,
    position,
    status: "waiting",
  });

  res.status(201).json({
    success: true,
    message: `You have joined the waitlist at position #${position}`,
    position,
    entry,
  });
});

// @desc    Leave the waitlist for a book
// @route   DELETE /api/waitlist/:bookId
// @access  Authenticated member
exports.leaveWaitlist = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;

  const entry = await Waitlist.findOne({
    book: bookId,
    user: req.user._id,
    status: { $in: ["waiting", "notified"] },
  });

  if (!entry) {
    return res.status(404).json({
      success: false,
      message: "You are not on the waitlist for this book",
    });
  }

  const wasNotified = entry.status === "notified";
  const leavingPosition = entry.position;

  entry.status = "cancelled";
  await entry.save();

  await Waitlist.updateMany(
    { book: bookId, position: { $gt: leavingPosition }, status: { $in: ["waiting", "notified"] } },
    { $inc: { position: -1 } }
  );

  if (wasNotified && leavingPosition === 1) {
    const next = await Waitlist.findOne({
      book: bookId,
      status: "waiting",
      position: 1,
    })
      .populate("user", "name email")
      .populate("book", "title");

    if (next) {
      next.status = "notified";
      next.expiresAt = new Date(Date.now() + CLAIM_WINDOW_MS);
      await next.save();

      sendEmailSafe(
        {
          email: next.user.email,
          subject: `"${next.book.title}" is now available for you — Smart Library`,
          html: buildClaimEmailHtml(next.user.name, next.book.title),
        },
        "waitlistAdvance"
      );
    }
  }

  res.status(200).json({
    success: true,
    message: "You have been removed from the waitlist",
  });
});

// @desc    Get current user's waitlist position for a book
// @route   GET /api/waitlist/:bookId/position
// @access  Authenticated
exports.getMyPosition = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;

  const entry = await Waitlist.findOne({
    book: bookId,
    user: req.user._id,
    status: { $in: ["waiting", "notified"] },
  });

  if (!entry) {
    return res.status(200).json({
      success: true,
      onWaitlist: false,
      position: null,
      status: null,
    });
  }

  const totalWaiting = await Waitlist.countDocuments({
    book: bookId,
    status: { $in: ["waiting", "notified"] },
  });

  res.status(200).json({
    success: true,
    onWaitlist: true,
    position: entry.position,
    status: entry.status,
    expiresAt: entry.expiresAt,
    totalWaiting,
  });
});

// @desc    Get current user's full waitlist
// @route   GET /api/waitlist/my-waitlist
// @access  Authenticated
exports.getMyWaitlist = catchAsyncErrors(async (req, res, next) => {
  const entries = await Waitlist.find({
    user: req.user._id,
    status: { $in: ["waiting", "notified"] },
  })
    .populate("book", "title author coverImage category ISBN totalCopies availableCopies")
    .sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    count: entries.length,
    waitlist: entries,
  });
});

// @desc    Claim a notified waitlist slot
// @route   POST /api/waitlist/:bookId/claim
// @access  Authenticated member
exports.claimWaitlistSlot = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;

  const entry = await Waitlist.findOne({
    book: bookId,
    user: req.user._id,
    status: "notified",
  });

  if (!entry) {
    return res.status(404).json({
      success: false,
      message: "No notified waitlist entry found for this book",
    });
  }

  if (entry.expiresAt && new Date() > entry.expiresAt) {
    entry.status = "expired";
    await entry.save();
    return res.status(400).json({
      success: false,
      message: "Your claim window has expired",
    });
  }

  const issueDate = new Date();
  const returnDate = new Date(issueDate.getTime() + LOAN_DURATION_DAYS * 24 * 60 * 60 * 1000);

  // Claim the copy FIRST — if that fails, the waitlist entry is left intact
  // for the user to try again. Reversing this order caused a race where the
  // entry got marked "fulfilled" but the book update failed and we rolled
  // back to "notified" — an unnecessary round-trip.
  const bookUpdate = await Book.findOneAndUpdate(
    { _id: bookId, availableCopies: { $gt: 0 } },
    { $inc: { availableCopies: -1 } },
    { new: true }
  );

  if (!bookUpdate) {
    return res.status(409).json({
      success: false,
      message: "No copies currently available. Please try again shortly.",
    });
  }

  entry.status = "fulfilled";
  await entry.save();

  const borrow = await Borrow.create({
    user: req.user._id,
    book: bookId,
    issueDate,
    returnDate,
    status: "borrowed",
  });

  res.status(200).json({
    success: true,
    message: "Book claimed and borrowed successfully",
    borrow,
  });
});

// Internal helper: notify the next person in the waitlist when a book is returned
exports.notifyNextInWaitlist = async (bookId) => {
  const next = await Waitlist.findOne({
    book: bookId,
    position: 1,
    status: "waiting",
  })
    .populate("user", "name email")
    .populate("book", "title");

  if (!next) return;

  next.status = "notified";
  next.expiresAt = new Date(Date.now() + CLAIM_WINDOW_MS);
  await next.save();

  sendEmailSafe(
    {
      email: next.user.email,
      subject: `Good news! "${next.book.title}" is now available — Smart Library`,
      html: buildClaimEmailHtml(next.user.name, next.book.title),
    },
    "waitlistNotify"
  );
};
