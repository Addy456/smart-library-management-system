/**
 * Shared factories for integration tests. Keeps the test files short and
 * focused on "what behaviour am I asserting" rather than "how do I build
 * a valid User". All helpers return plain objects that can be spread into
 * the real mongoose create calls.
 */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const Borrow = require("../models/borrowModel");

const DEFAULT_PASSWORD = "TestPassw0rd!";

// Create a verified member. Accepts overrides for one-off scenarios.
async function createUser(overrides = {}) {
  const password = overrides.password || DEFAULT_PASSWORD;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: overrides.name || "Test User",
    email: overrides.email || `user_${Date.now()}_${Math.random()}@example.com`,
    password: hashed,
    role: overrides.role || "member",
    verified: overrides.verified !== false,
  });
  return { user, password };
}

async function createAdmin(overrides = {}) {
  return createUser({ ...overrides, role: "admin" });
}

// Mint a JWT exactly the way the app does — so authMiddleware's iss/aud
// checks pass. Returns the cookie header value ready to be attached.
function tokenFor(user) {
  return jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
    issuer: "smart-library",
    audience: "smart-library-web",
  });
}

function authCookie(user) {
  return [`token=${tokenFor(user)}`];
}

async function createBook(overrides = {}) {
  return Book.create({
    title: overrides.title || "Test Book",
    author: overrides.author || "Test Author",
    category: overrides.category || "Fiction",
    ISBN: overrides.ISBN || `ISBN-${Date.now()}-${Math.random()}`,
    totalCopies: overrides.totalCopies ?? 3,
    availableCopies: overrides.availableCopies ?? 3,
    description: overrides.description || "",
  });
}

async function createBorrow(user, book, overrides = {}) {
  return Borrow.create({
    user: user._id,
    book: book._id,
    issueDate: overrides.issueDate || new Date(),
    returnDate: overrides.returnDate,
    status: overrides.status || "pending",
    fine: overrides.fine || 0,
    actualReturnDate: overrides.actualReturnDate,
  });
}

module.exports = {
  DEFAULT_PASSWORD,
  createUser,
  createAdmin,
  createBook,
  createBorrow,
  tokenFor,
  authCookie,
};
