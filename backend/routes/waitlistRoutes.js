const express = require("express");
const router = express.Router();
const {
  joinWaitlist,
  leaveWaitlist,
  getMyPosition,
  getMyWaitlist,
  claimWaitlistSlot,
} = require("../controllers/waitlistController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.get("/my-waitlist", isAuthenticated, getMyWaitlist);
router.post("/:bookId", isAuthenticated, joinWaitlist);
router.post("/:bookId/claim", isAuthenticated, claimWaitlistSlot);
router.delete("/:bookId", isAuthenticated, leaveWaitlist);
router.get("/:bookId/position", isAuthenticated, getMyPosition);

module.exports = router;
