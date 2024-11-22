const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Payment = sequelize.define("Payment", {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  summa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Payment;
