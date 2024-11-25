const sequelize = require("../config/db");

const Users = require("./users.model");
const Profiles = require("./profiles.model");
const Orders = require("./orders.model");
const Products = require("./products.model");
const Payments = require("./payments.model");
const ProductOrders = require("./productOrders.model");
const Baskets = require("./baskets.model");

Users.hasOne(Profiles, { foreignKey: "userId" });
Profiles.belongsTo(Users, { foreignKey: "userId" });

Profiles.hasMany(Orders, { foreignKey: "profileId" });
Orders.belongsTo(Profiles, { foreignKey: "profileId" });

Products.belongsToMany(Orders, { through: ProductOrders });
Orders.belongsToMany(Products, { through: ProductOrders });

Profiles.belongsToMany(Products, { through: Baskets });
Products.belongsToMany(Profiles, { through: Baskets });

Orders.hasOne(Payments, { foreignKey: "orderId" });
Payments.belongsTo(Orders, { foreignKey: "orderId" });


(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Tables synced");
  } catch (error) {
    console.error("Error syncing tables:", error);
  }
})();


module.exports = {
  Users,
  Profiles,
  Orders,
  Products,
  Payments,
  ProductOrders,
  Baskets,
};
