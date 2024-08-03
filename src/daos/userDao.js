const User = require("../schema/userSchema");

class UserDao {
  async findUserByEmail(email) {
    return await User.findOne({ email });
  }
  async findUserById(userId) {
    return await User.findById(userId);
  }
  async addGameIntoUserById(userId, gameId) {
    return await User.updateOne({ _id: userId }, { $push: { games: gameId } });
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
module.exports = new UserDao();
