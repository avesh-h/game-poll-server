const express = require("express");
const { verificationOfEmail } = require("../controllers/authControllers");

const router = express.Router();

router.get("/verify-email/:token", verificationOfEmail);

module.exports = { authRoutes: router };
