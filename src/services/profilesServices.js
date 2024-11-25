const { Profiles } = require("../models/models");

class ProfilesServices {
  async getAllProfiles() {
    try {
      const result = await Profiles.findAll();
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async getProfile(userId) {
    try {
      const result = await Profiles.findAll({ where: { id: userId } });
      return result[0].dataValues;
    } catch (err) {
      console.log(err);
    }
  }

  async updateProfile(userId, body) {
    try {
      const result = await Profiles.update({ ...body }, { where: { userId } });
      return result[0];
    } catch (err) {
      console.log(err);
    }
  }

  async createProfile(userId) {
    try {
      await Profiles.create({ userId });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new ProfilesServices();
