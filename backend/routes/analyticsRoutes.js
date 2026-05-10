const express = require("express");
const router = express.Router();
const {
  getMyStats,
  getMonthlyData,
  getCategoryBreakdown,
  getStreakCalendar,
  getTopAuthors,
  getAdminSummary,
} = require("../controllers/analyticsController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

router.get("/my-stats", isAuthenticated, getMyStats);
router.get("/monthly", isAuthenticated, getMonthlyData);
router.get("/categories", isAuthenticated, getCategoryBreakdown);
router.get("/streak-calendar", isAuthenticated, getStreakCalendar);
router.get("/top-authors", isAuthenticated, getTopAuthors);
router.get("/admin-summary", isAuthenticated, isAdmin, getAdminSummary);

module.exports = router;
