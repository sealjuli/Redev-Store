const { ProductOrders } = require("../models/models");

class OrdersServices {
  async findProductOrderById(OrderId) {
    try {
      return await ProductOrders.findAll({
        where: { OrderId },
        attributes: ["ProductId", "count"],
      });
    } catch (err) {
      console.log(err);
    }
  }

  async createProductOrder(OrderId, element) {
    try {
      await ProductOrders.create({
        OrderId,
        ProductId: element.ProductId,
        count: element.count,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new OrdersServices();
