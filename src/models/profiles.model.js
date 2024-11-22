const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Profile = sequelize.define("Profile", {
  fullname: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Profile;
