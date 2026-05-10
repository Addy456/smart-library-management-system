const express = require("express");
const router = express.Router();
const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  regenerateQR,
} = require("../controllers/bookController");
const {
  isAuthenticated,
  isAdmin,
} = require("../middlewares/authMiddleware");

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", isAuthenticated, isAdmin, addBook);
router.put("/:id", isAuthenticated, isAdmin, updateBook);
router.put("/:id/regenerate-qr", isAuthenticated, isAdmin, regenerateQR);
router.delete("/:id", isAuthenticated, isAdmin, deleteBook);

module.exports = router;
