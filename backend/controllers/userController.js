const User = require("../models/userModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { escapeRegex, parsePagination, isString } = require("../utils/helpers");

// @desc    Get all users
// @route   GET /api/users
// @access  Admin only
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const { search } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  const query = {};
  if (isString(search)) {
    const safe = escapeRegex(search.slice(0, 80));
    query.$or = [
      { name: { $regex: safe, $options: "i" } },
      { email: { $regex: safe, $options: "i" } },
    ];
  }

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
  ]);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit) || 1,
    users,
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Admin only
exports.getUserById = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, user });
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Admin only
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.body;

  if (!isString(role) || !["admin", "member"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid role (admin or member)",
    });
  }

  // Prevent an admin from locking themselves out by self-demotion.
  if (req.params.id === req.user._id.toString() && role === "member") {
    return res.status(400).json({
      success: false,
      message: "You cannot demote your own admin account",
    });
  }

  const target = await User.findById(req.params.id);
  if (!target) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Prevent demoting the LAST admin — otherwise the system becomes unmanageable.
  if (target.role === "admin" && role === "member") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return res.status(400).json({
        success: false,
        message: "Cannot demote the last remaining admin. Promote another user first.",
      });
    }
  }

  target.role = role;
  await target.save();

  res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    user: target,
  });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Admin only
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  // Admins must not delete themselves — frontend has no re-auth flow.
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: "You cannot delete your own account",
    });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Refuse to delete the last admin — same reasoning as updateUserRole.
  if (user.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the last remaining admin.",
      });
    }
  }

  await user.deleteOne();
  res.status(200).json({ success: true, message: "User deleted successfully" });
});
