const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");
const mongoose = require("mongoose");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const calculateFine = require("../utils/fineCalculator");
const sendEmail = require("../utils/sendEmail");
const logger = require("../utils/logger");
const {
  borrowConfirmTemplate,
  returnConfirmTemplate,
} = require("../utils/emailTemplates");
const { notifyNextInWaitlist } = require("./waitlistController");
const { parsePagination } = require("../utils/helpers");
const { LOAN_DURATION_DAYS } = require("../config/constants");

const VALID_STATUSES = ["pending", "borrowed", "returned", "rejected"];

// Fire-and-forget email helper — never lets SMTP failure break the HTTP response.
const sendEmailSafe = (opts, context) =>
  sendEmail(opts).catch((err) =>
    logger.error({ err: err.message, context }, "Email delivery failed")
  );

// @desc    Request to borrow a book (pending admin approval)
// @route   POST /api/borrow/issue
// @access  Authenticated member
exports.issueBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.body;

  if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ success: false, message: "Invalid book ID" });
  }

  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  if (book.availableCopies <= 0) {
    return res.status(400).json({
      success: false,
      message: "This book is currently not available",
    });
  }

  const existingBorrow = await Borrow.findOne({
    user: req.user._id,
    book: bookId,
    status: { $in: ["borrowed", "pending"] },
  });

  if (existingBorrow) {
    return res.status(400).json({
      success: false,
      message:
        existingBorrow.status === "pending"
          ? "You already have a pending request for this book"
          : "You already have this book borrowed",
    });
  }

  const borrow = await Borrow.create({
    user: req.user._id,
    book: bookId,
    issueDate: new Date(),
    status: "pending",
  });

  res.status(201).json({
    success: true,
    message: "Borrow request submitted! Waiting for admin approval.",
    borrow,
  });
});

// @desc    Approve a borrow request (Admin)
// @route   PUT /api/borrow/approve/:id
// @access  Admin only
exports.approveRequest = catchAsyncErrors(async (req, res, next) => {
  const issueDate = new Date();
  const returnDate = new Date(
    issueDate.getTime() + LOAN_DURATION_DAYS * 24 * 60 * 60 * 1000
  );

  // Atomic: only transition pending → borrowed. Second concurrent approve
  // will see the doc already in "borrowed" and return null.
  const borrow = await Borrow.findOneAndUpdate(
    { _id: req.params.id, status: "pending" },
    { status: "borrowed", issueDate, returnDate },
    { new: true }
  ).populate("book user");

  if (!borrow) {
    return res.status(400).json({
      success: false,
      message: "Borrow request not found or already processed",
    });
  }

  const bookUpdate = await Book.findOneAndUpdate(
    { _id: borrow.book._id, availableCopies: { $gt: 0 } },
    { $inc: { availableCopies: -1 } },
    { new: true }
  );

  if (!bookUpdate) {
    // No copies left. Roll the request back to "pending" AND clear the dates
    // that approve just wrote, so the next approval starts from a clean slate.
    await Borrow.findByIdAndUpdate(borrow._id, {
      status: "pending",
      $unset: { issueDate: 1, returnDate: 1 },
    });
    return res.status(409).json({
      success: false,
      message: "All copies of this book are currently issued. Please try again.",
    });
  }

  // Fire-and-forget — never block the approval response on SMTP.
  sendEmailSafe(
    {
      email: borrow.user.email,
      subject: "Book Issued Successfully - Smart Library",
      html: borrowConfirmTemplate(borrow.user.name, borrow.book.title, issueDate, returnDate),
    },
    "borrowConfirm"
  );

  res.status(200).json({
    success: true,
    message: "Borrow request approved successfully",
    borrow,
  });
});

// @desc    Reject a borrow request (Admin)
// @route   PUT /api/borrow/reject/:id
// @access  Admin only
exports.rejectRequest = catchAsyncErrors(async (req, res, next) => {
  const borrow = await Borrow.findOneAndUpdate(
    { _id: req.params.id, status: "pending" },
    { status: "rejected" },
    { new: true }
  ).populate("book user");

  if (!borrow) {
    return res.status(400).json({
      success: false,
      message: "Borrow request not found or already processed",
    });
  }

  res.status(200).json({
    success: true,
    message: "Borrow request rejected",
    borrow,
  });
});

// @desc    Return a book
// @route   PUT /api/borrow/return/:id
// @access  Authenticated — member can return own record, admin can return any
exports.returnBook = catchAsyncErrors(async (req, res, next) => {
  const borrow = await Borrow.findById(req.params.id).populate("book user");

  if (!borrow) {
    return res.status(404).json({ success: false, message: "Borrow record not found" });
  }

  // CRITICAL: enforce ownership. Without this check a member can return
  // another member's book by guessing borrow IDs (IDOR).
  if (
    req.user.role !== "admin" &&
    borrow.user._id.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to return this record",
    });
  }

  if (borrow.status === "returned") {
    return res.status(400).json({
      success: false,
      message: "Book has already been returned",
    });
  }

  // Only "borrowed" records can be returned — prevents returning pending/rejected.
  if (borrow.status !== "borrowed") {
    return res.status(400).json({
      success: false,
      message: `Cannot return a record with status '${borrow.status}'`,
    });
  }

  const actualReturnDate = new Date();
  const fine = calculateFine(borrow.returnDate, actualReturnDate);

  borrow.status = "returned";
  borrow.actualReturnDate = actualReturnDate;
  borrow.fine = fine;
  await borrow.save();

  await Book.findByIdAndUpdate(borrow.book._id, { $inc: { availableCopies: 1 } });

  // Best-effort: notify the next person on the waitlist. Do NOT block
  // the response on it, and swallow errors.
  notifyNextInWaitlist(borrow.book._id).catch((err) =>
    logger.error({ err: err.message }, "notifyNextInWaitlist failed")
  );

  sendEmailSafe(
    {
      email: borrow.user.email,
      subject: "Book Returned Successfully - Smart Library",
      html: returnConfirmTemplate(borrow.user.name, borrow.book.title, fine),
    },
    "returnConfirm"
  );

  res.status(200).json({
    success: true,
    message: "Book returned successfully",
    fine,
    borrow,
  });
});

// @desc    Get all borrow records (Admin)
// @route   GET /api/borrow/records
// @access  Admin only
exports.getAllRecords = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  const query = {};
  if (typeof status === "string" && VALID_STATUSES.includes(status)) {
    query.status = status;
  }

  const [total, records] = await Promise.all([
    Borrow.countDocuments(query),
    Borrow.find(query)
      .populate("user", "name email")
      .populate("book", "title author ISBN")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  res.status(200).json({
    success: true,
    count: records.length,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit) || 1,
    records,
  });
});

// @desc    Get current user's borrow records
// @route   GET /api/borrow/my-records
// @access  Authenticated member
exports.getMyRecords = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  const query = { user: req.user._id };
  if (typeof status === "string" && VALID_STATUSES.includes(status)) {
    query.status = status;
  }

  const [total, records] = await Promise.all([
    Borrow.countDocuments(query),
    Borrow.find(query)
      .populate("book", "title author ISBN coverImage category")
      .sort({ issueDate: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  res.status(200).json({
    success: true,
    count: records.length,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit) || 1,
    records,
  });
});

// @desc    Get all overdue records (Admin)
// @route   GET /api/borrow/overdue
// @access  Admin only
exports.getOverdueRecords = catchAsyncErrors(async (req, res, next) => {
  const { page, limit, skip } = parsePagination(req.query);

  // Only records that actually have a returnDate set AND it's in the past.
  // Without $exists, "pending" records (returnDate: null) would be treated
  // as "less than now" and leak into the overdue list.
  const query = {
    status: "borrowed",
    returnDate: { $exists: true, $ne: null, $lt: new Date() },
  };

  const [total, records] = await Promise.all([
    Borrow.countDocuments(query),
    Borrow.find(query)
      .populate("user", "name email")
      .populate("book", "title author ISBN")
      .sort({ returnDate: 1 })
      .skip(skip)
      .limit(limit),
  ]);

  res.status(200).json({
    success: true,
    count: records.length,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit) || 1,
    records,
  });
});

// @desc    Return a book by scanning its QR code (book ID)
// @route   PUT /api/borrow/return-by-qr
// @access  Authenticated (members: own books only, admins: any)
exports.returnByQR = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.body;

  if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid book ID format",
    });
  }

  // Members: scope to own borrows. Admins: any user's borrow for this book.
  const query = { book: bookId, status: "borrowed" };
  if (req.user.role !== "admin") {
    query.user = req.user._id;
  }

  const borrow = await Borrow.findOne(query).populate("book user");
  if (!borrow) {
    return res.status(404).json({
      success: false,
      message:
        req.user.role === "admin"
          ? "No active borrow record found for this book"
          : "You do not have this book checked out",
    });
  }

  const actualReturnDate = new Date();
  const fine = calculateFine(borrow.returnDate, actualReturnDate);

  borrow.status = "returned";
  borrow.actualReturnDate = actualReturnDate;
  borrow.fine = fine;
  await borrow.save();

  await Book.findByIdAndUpdate(borrow.book._id, { $inc: { availableCopies: 1 } });
  notifyNextInWaitlist(borrow.book._id).catch((err) =>
    logger.error({ err: err.message }, "notifyNextInWaitlist failed")
  );

  sendEmailSafe(
    {
      email: borrow.user.email,
      subject: "Book Returned Successfully - Smart Library",
      html: returnConfirmTemplate(borrow.user.name, borrow.book.title, fine),
    },
    "returnConfirm"
  );

  res.status(200).json({
    success: true,
    message: "Book returned via QR successfully",
    fine,
    borrow,
  });
});
