const express = require("express");
const router = express.Router();
const {
  addReview,
  getBookReviews,
  canReview,
} = require("../controllers/reviewController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.get("/:bookId/can-review", isAuthenticated, canReview);
router.get("/:bookId", getBookReviews);
router.post("/:bookId", isAuthenticated, addReview);

module.exports = router;
