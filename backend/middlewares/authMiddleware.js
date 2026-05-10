const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("./catchAsyncErrors");
const User = require("../models/userModel");

// Middleware to check if the user is authenticated
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // Get token from cookies or Authorization header
  let token = req.cookies.token;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please log in to access this resource",
    });
  }

  // Verify the token — catch JWT-specific errors here so the frontend
  // gets a deterministic 401 with a clear message, preventing auth flicker.
  // We bind the token to this app via issuer/audience to prevent any other
  // service sharing JWT_SECRET from minting tokens we would accept.
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "smart-library",
      audience: "smart-library-web",
    });
  } catch (err) {
    // Clear the stale cookie so subsequent requests don't keep failing
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    const message =
      err.name === "TokenExpiredError"
        ? "Session expired. Please log in again."
        : "Invalid token. Please log in again.";

    return res.status(401).json({ success: false, message });
  }

  // Attach the user to request object
  req.user = await User.findById(decoded.id);

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User not found. Please log in again.",
    });
  }

  next();
});

// Middleware to restrict access to admin only
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
  }
  next();
};
