const User = require("../models/user");
const bcrypt = require("bcrypt");

module.exports = class UserService {
  async findAll(txn) {
    const users = await User.query(txn);
    console.log(users, "txn users");
    return users;
  }

  async createUsers(details) {
    const pass = await bcrypt.hash(details.password, 5);
    details["password"] = pass;
    return await User.query().insertGraph(details);
  }

  async emailChecking(email) {
    const userDetails = await User.query().findOne({
      email: email,
    });
    return userDetails;
  }

  async PassChecking(userInfo, Pass) {
    return await bcrypt.compare(Pass, userInfo.password);
  }

  async findById(userId) {
    console.log(userId, "service");
    const id = await User.query().findById(userId);
    if (id === undefined) {
      return { sorry: `id-${userId} isn't exist in db!` };
    }
    return id;
  }
};
