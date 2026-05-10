const cloudinary = require("cloudinary").v2;
const QRCode = require("qrcode");
const fs = require("fs").promises;
const Book = require("../models/bookModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const logger = require("../utils/logger");
const { escapeRegex, parsePagination, isString } = require("../utils/helpers");
const { ALLOWED_IMAGE_MIMES, MAX_UPLOAD_BYTES } = require("../config/constants");

// Shared helper: upload a cover image to Cloudinary after validating type/size.
// Returns the secure URL on success, throws a 400-shaped error otherwise.
const uploadCover = async (file) => {
  if (!ALLOWED_IMAGE_MIMES.includes(file.mimetype)) {
    const err = new Error("Cover image must be JPEG, PNG or WEBP");
    err.statusCode = 400;
    throw err;
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    const err = new Error("Cover image exceeds the 5MB size limit");
    err.statusCode = 400;
    throw err;
  }

  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "smart-library/books",
      resource_type: "image", // Prevents arbitrary file types even if mime is spoofed
      transformation: [
        { width: 600, height: 800, crop: "limit", quality: "auto", fetch_format: "auto" },
      ],
    });
    return result.secure_url;
  } finally {
    // Always clean up the temp file so disk doesn't fill up on repeated uploads.
    if (file.tempFilePath) {
      fs.unlink(file.tempFilePath).catch(() => {});
    }
  }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Admin only
exports.addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, category, ISBN, description, totalCopies } = req.body;

  if (!isString(title) || !isString(author) || !isString(category) || !isString(ISBN)) {
    return res.status(400).json({
      success: false,
      message: "Please provide title, author, category and ISBN",
    });
  }

  let coverImage = "";
  if (req.files && req.files.coverImage) {
    coverImage = await uploadCover(req.files.coverImage);
  }

  const copies = totalCopies && Number(totalCopies) > 0 ? Number(totalCopies) : 1;

  const book = await Book.create({
    title: title.trim(),
    author: author.trim(),
    category: category.trim(),
    ISBN: ISBN.trim(),
    description: isString(description) ? description : "",
    coverImage,
    totalCopies: copies,
    availableCopies: copies,
  });

  try {
    const qrCode = await QRCode.toDataURL(book._id.toString());
    book.qrCode = qrCode;
    await book.save();
  } catch (err) {
    logger.error({ err: err.message }, "QR code generation failed");
  }

  res.status(201).json({
    success: true,
    message: "Book added successfully",
    book,
  });
});

// @desc    Get all books with search and pagination
// @route   GET /api/books
// @access  Public
exports.getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const { search } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  // Build search query. User input is length-capped and regex-escaped to
  // neutralise ReDoS patterns like "((a+)+)+". We still use $regex (not $text)
  // because the frontend expects partial-substring matches on title/author.
  let query = {};
  if (isString(search)) {
    const safe = escapeRegex(search.slice(0, 80));
    query = {
      $or: [
        { title: { $regex: safe, $options: "i" } },
        { author: { $regex: safe, $options: "i" } },
        { category: { $regex: safe, $options: "i" } },
      ],
    };
  }

  // Short-lived client cache for the catalog listing. Reduces DB pressure
  // and lets CDNs share the list between anonymous visitors. Must stay
  // "private" (not public) because the UI may include per-user hints later.
  res.set("Cache-Control", "private, max-age=30");

  const [totalBooks, books] = await Promise.all([
    Book.countDocuments(query),
    Book.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
  ]);

  res.status(200).json({
    success: true,
    totalBooks,
    currentPage: page,
    totalPages: Math.ceil(totalBooks / limit) || 1,
    books,
  });
});

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }
  res.status(200).json({ success: true, book });
});

// @desc    Update book details
// @route   PUT /api/books/:id
// @access  Admin only
exports.updateBook = catchAsyncErrors(async (req, res, next) => {
  let book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  // Whitelist only the fields an admin is allowed to update.
  // Prevents injection of averageRating, totalReviews, qrCode, etc.
  const allowedFields = ["title", "author", "category", "ISBN", "description", "totalCopies"];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  // If totalCopies is being changed, adjust availableCopies proportionally.
  // Guard: totalCopies can never drop below the number currently checked out.
  if (updates.totalCopies !== undefined) {
    const newTotal = Number(updates.totalCopies);
    if (!Number.isFinite(newTotal) || newTotal < 0) {
      return res.status(400).json({ success: false, message: "totalCopies must be a non-negative number" });
    }
    const checkedOut = book.totalCopies - book.availableCopies;
    if (newTotal < checkedOut) {
      return res.status(400).json({
        success: false,
        message: `Cannot set totalCopies below the number currently checked out (${checkedOut}).`,
      });
    }
    const diff = newTotal - book.totalCopies;
    updates.totalCopies = newTotal;
    updates.availableCopies = Math.max(0, book.availableCopies + diff);
  }

  if (req.files && req.files.coverImage) {
    updates.coverImage = await uploadCover(req.files.coverImage);
  }

  book = await Book.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    book,
  });
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Admin only
exports.deleteBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }
  await book.deleteOne();
  res.status(200).json({ success: true, message: "Book deleted successfully" });
});

// @desc    Regenerate QR code for an existing book
// @route   PUT /api/books/:id/regenerate-qr
// @access  Admin only
exports.regenerateQR = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  try {
    const qrCode = await QRCode.toDataURL(book._id.toString());
    book.qrCode = qrCode;
    await book.save();
  } catch (err) {
    logger.error({ err: err.message }, "Failed to regenerate QR code");
    return res.status(500).json({ success: false, message: "Failed to regenerate QR code" });
  }

  res.status(200).json({
    success: true,
    message: "QR code regenerated successfully",
    qrCode: book.qrCode,
  });
});
