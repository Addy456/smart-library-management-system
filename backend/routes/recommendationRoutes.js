const express = require("express");
const router = express.Router();
const { getRecommendations } = require("../controllers/recommendationController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.get("/", isAuthenticated, getRecommendations);

module.exports = router;
