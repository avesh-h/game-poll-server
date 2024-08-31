const express = require("express");
const { authToken } = require("../middlewares/auth");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileControllers");

const router = express.Router();

router.route("/:profileId").get(getProfile).put(updateProfile);
// router.put("/:profileId", updateProfile);

module.exports = { profileRoutes: router };
