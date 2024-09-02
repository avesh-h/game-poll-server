const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //Where i want to store my file in local directory
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // We can modify file name if we want.
    cb(null, req?.params?.profileId + "-" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = { upload };
