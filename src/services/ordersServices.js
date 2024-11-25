const { Orders } = require("../models/models");

class OrdersServices {
  async getOrdersByProfileId(profileId) {
    try {
      const result = await Orders.findAll({ where: { profileId: profileId } });
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async getAllOrders() {
    try {
      const result = await Orders.findAll();
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async getOrderById(id) {
    try {
      let result = await Orders.findAll({ where: { id } });
      return result[0];
    } catch (err) {
      console.log(err);
    }
  }

  async updateOrderById(id, status) {
    try {
      await Orders.update({ status }, { where: { id } });
    } catch (err) {
      console.log(err);
    }
  }

  async updateOrderPaymentById(id, paymentId) {
    try {
      await Orders.update({ paymentId }, { where: { id } });
    } catch (err) {
      console.log(err);
    }
  }

  async saveOrder(body, profileId, summa) {
    try {
      const order = await Orders.create({
        ...body,
        status: "Заказ оформлен",
        profileId,
        summa,
      });

      return order;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = new OrdersServices();
