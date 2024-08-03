const { jwtVerify } = require("jose");

const verifyAuth = async ({ token, secret }) => {
  const encodedKey = new TextEncoder().encode(secret);
  try {
    const decoded = await jwtVerify(token, encodedKey, {});
    return decoded;
  } catch (error) {
    return { error: error?.message };
  }
};

module.exports = { verifyAuth };
