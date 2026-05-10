const express = require("express");
const router = express.Router();
const {
  register,
  verifyOTP,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  resendOTP,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
// Logout must be reachable even if the user's token is stale/invalid,
// otherwise a logged-out client with a bad cookie can never clear it.
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/me", isAuthenticated, getMe);
router.put("/update-profile", isAuthenticated, updateProfile);
router.put("/change-password", isAuthenticated, changePassword);

module.exports = router;
