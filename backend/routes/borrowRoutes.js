const express = require("express");
const router = express.Router();
const {
  issueBook,
  returnBook,
  getAllRecords,
  getMyRecords,
  getOverdueRecords,
  returnByQR,
  approveRequest,
  rejectRequest,
} = require("../controllers/borrowController");
const {
  isAuthenticated,
  isAdmin,
} = require("../middlewares/authMiddleware");

router.post("/issue", isAuthenticated, issueBook);
router.put("/approve/:id", isAuthenticated, isAdmin, approveRequest);
router.put("/reject/:id", isAuthenticated, isAdmin, rejectRequest);
router.put("/return/:id", isAuthenticated, returnBook);
router.put("/return-by-qr", isAuthenticated, returnByQR);
router.get("/records", isAuthenticated, isAdmin, getAllRecords);
router.get("/my-records", isAuthenticated, getMyRecords);
router.get("/overdue", isAuthenticated, isAdmin, getOverdueRecords);

module.exports = router;
