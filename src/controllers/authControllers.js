const { verifyAuth } = require("../utils/tokenVerify");
const userDao = require("../daos/userDao");

const verificationOfEmail = async (req, res, next) => {
  const { token } = req?.params;
  try {
    if (token) {
      const secret = process.env.VERIFY_SECRET;
      //Check token validity
      const decoded = await verifyAuth({ token, secret });
      if (!decoded?.payload) {
        //Then token is expired and generate new one
        return res.status(500).json({ error: decoded?.error });
      } else {
        //Check user id or email in db
        const { payload } = decoded;
        const registeredUser = await userDao?.findUserByEmail(payload?.email);
        if (registeredUser?.isVerified) {
          //Return user if already verified
          return res.redirect(
            process?.env?.NEXTAUTH_URL + "/login?message=already_verified"
          );
        }
        registeredUser.isVerified = true;
        await registeredUser.save();
        //Redirect user to the login
        return res.redirect(
          process?.env?.NEXTAUTH_URL + "/login?message=verification_successful"
        );
      }
    } else {
      //token missing
      return res.redirect(
        process?.env?.NEXTAUTH_URL + "/login?message=verification_failed"
      );
    }
  } catch (error) {
    return res.redirect(
      process?.env?.NEXTAUTH_URL + "/login?message=" + error?.message ||
        JSON.stringify(error)
    );
  }
};

module.exports = { verificationOfEmail };
