const { Users } = require("../models/models");

class UsersServices {
  async findUserByEmail(email) {
    const user = await Users.findOne({ where: { email } });
    return user;
  }

  async findAdmin() {
    const user = await Users.findOne({ where: { userType: "admin" } });
    return user;
  }

  async saveUser(user) {
    const newUser = await Users.create(user);
    return newUser;
  }
}

module.exports = new UsersServices();
