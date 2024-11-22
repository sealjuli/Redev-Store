const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProductOrder = sequelize.define("ProductOrder", {
  count: DataTypes.INTEGER,
});

module.exports = ProductOrder;
