const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register); // Đảm bảo đúng route
router.post("/login", authController.login); // Đảm bảo đúng route

module.exports = router;
