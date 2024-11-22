const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Basket = sequelize.define("Basket", {
  count: DataTypes.INTEGER,
});

module.exports = Basket;
