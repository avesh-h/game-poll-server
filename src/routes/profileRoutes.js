const express = require("express");
// const { authToken } = require("../middlewares/auth");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileControllers");
const { upload } = require("../middlewares/multer.middleware");

const router = express.Router();

router
  .route("/:profileId")
  .get(getProfile)
  .put(upload.single("profileImage"), updateProfile);

module.exports = { profileRoutes: router };
