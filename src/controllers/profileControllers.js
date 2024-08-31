const User = require("../schema/userSchema");
const { httpStatusCode } = require("../utils/httpStatusCodes");
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
  const { profileId } = req?.params;
  try {
    if (profileId) {
      const profileData = await User.findOne(
        { _id: profileId },
        { password: 0, _id: 0, games: 0, isVerified: 0 }
      );
      if (!profileData) {
        // not found
        return res
          .status(httpStatusCode.NOT_FOUND)
          .json({ message: "User Not found!", status: "failed" });
      }
      return res
        .status(httpStatusCode.OK)
        .json({ profileData, status: "success" });
    } else {
      //Wrong route??
    }
  } catch (error) {
    console.log("Errrrrrr", error);
  }
};

//Update profile
const updateProfile = async (req, res, next) => {
  const { profileId } = req?.params;
  const { oldPassword, newPassword } = req?.body;
  try {
    if (profileId) {
      const existedUser = await User.findOne({ _id: profileId });
      if (!existedUser) {
        return res
          .status(httpStatusCode.NOT_FOUND)
          .json({ error: "User Not found!", status: "failed" });
      }
      let hashedPassword;
      if (oldPassword && newPassword) {
        const isPasswordCorrect = await bcrypt.compare(
          oldPassword,
          existedUser?.password
        );
        if (!isPasswordCorrect) {
          return res
            .status(httpStatusCode.BAD_REQUEST)
            .json({ error: "Password not match!", status: "failed" });
        }
        //Hash password
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(newPassword, salt);
      }
      const update = await User.updateOne(
        { _id: profileId },
        {
          $set: {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            phone: req?.body?.phone,
            ...(hashedPassword ? { password: hashedPassword } : {}),
          },
        }
      );
      if (update?.acknowledged) {
        return res.status(httpStatusCode.OK).json({
          message: "Profile successfully updated!",
          status: "success",
        });
      }
    }
  } catch (error) {
    console.log("Errrrrrrr", error);
  }
};

module.exports = { getProfile, updateProfile };
