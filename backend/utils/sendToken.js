const jwt = require("jsonwebtoken");

// Generate JWT token, set it as an httpOnly cookie, and send response.
// NOTE: The token is intentionally NEVER returned in the JSON body.
// Doing so would force the client to store it in JS-accessible storage
// (localStorage / memory) and defeats the purpose of httpOnly cookies.
const sendToken = (user, statusCode, res, message = "Success") => {
  // Create JWT — short-lived, scoped to this app.
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
      issuer: "smart-library",
      audience: "smart-library-web",
    }
  );

  // Cookie options. COOKIE_EXPIRE is required (validated in server.js).
  const isProduction = process.env.NODE_ENV === "production";
  const cookieDays = Number(process.env.COOKIE_EXPIRE) || 7;
  const cookieOptions = {
    httpOnly: true, // JS cannot read — blocks XSS token theft
    expires: new Date(Date.now() + cookieDays * 24 * 60 * 60 * 1000),
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? "none" : "lax",
  };

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    message,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
      avatar: user.avatar,
    },
  });
};

module.exports = sendToken;
