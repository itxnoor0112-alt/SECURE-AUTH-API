const express = require("express");
const { register, login, refreshAccessToken, getMe } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const authLimiter = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh-token", authLimiter, refreshAccessToken);
router.get("/me", authenticate, getMe);

module.exports = router;
