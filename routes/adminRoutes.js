const express = require("express");
const { getAllUsers } = require("../controllers/adminController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/users", authenticate, authorize("admin"), getAllUsers);

module.exports = router;
