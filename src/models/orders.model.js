const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define("Order", {
  /*
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  */
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  summa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  deliveryMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  paymentId: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Order;
