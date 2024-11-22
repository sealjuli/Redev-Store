const db = require("../config/db");
const {
  Orders,
  Products,
  ProductOrders,
  Payments,
  Baskets,
} = require("../models/models");
const { Op } = require("sequelize");

class OrdersServices {
  async getOrdersByProfileId(profileId) {
    try {
      let result = await Orders.findAll({ where: { profileId: profileId } });

      if (result.length > 0) {
        for (const element of result) {
          const payments = await Payments.findAll({
            where: {
              id: element.paymentId,
            },
          });

          if (payments[0]) {
            element.dataValues.paymentStatus = payments[0].status;
          }

          const products = await ProductOrders.findAll({
            where: {
              OrderId: element.id,
            },
            attributes: ["ProductId", "count"],
          });

          let productsResult = [];

          for (const elem of products) {
            const product = await Products.findAll({
              where: {
                id: elem.ProductId,
              },
              attributes: ["name", "description", "category", "image", "price"],
            });

            productsResult.push({ product: product, count: elem.count });
          }

          element.dataValues.products = productsResult;
        }
      }

      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async getAllOrders() {
    try {
      let result = await Orders.findAll();

      if (result.length > 0) {
        for (const element of result) {
          const payments = await Payments.findAll({
            where: {
              id: element.paymentId,
            },
          });

          if (payments[0]) {
            element.dataValues.paymentStatus = payments[0].status;
          }

          const products = await ProductOrders.findAll({
            where: {
              OrderId: element.id,
            },
            attributes: ["ProductId", "count"],
          });

          let productsResult = [];

          for (const elem of products) {
            const product = await Products.findAll({
              where: {
                id: elem.ProductId,
              },
              attributes: ["name", "description", "category", "image", "price"],
            });

            productsResult.push({ product: product, count: elem.count });
          }

          element.dataValues.products = productsResult;
        }
      }
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

  async saveOrder(body, basket) {
    try {
      const basketProducts = basket.Products;
      for (const element of basketProducts) {
        const product = await Products.findAll({
          where: { id: element.ProductId, count: { [Op.gte]: element.count } },
        });

        if (!product[0]) {
          throw new Error("Какой-то товар из корзины закончился в магазине");
        }
      }

      // если все товары есть

      // создаем заказ
      const order = await Orders.create({
        ...body,
        status: "Заказ оформлен",
        profileId: basketProducts[0].ProfileId,
        summa: basket.summa,
      });

      // цикл по элементам корзины
      for (const element of basketProducts) {
        const product = await Products.findAll({
          where: { id: element.ProductId },
        });

        // отнимаем из товаров
        await Products.update(
          { count: product[0].count - element.count },
          { where: { id: element.ProductId } }
        );

        // добавляем товары в заказ
        await ProductOrders.create({
          OrderId: order.id,
          ProductId: element.ProductId,
          count: element.count,
        });
      }

      // очищаем корзину
      await Baskets.destroy({
        where: { ProfileId: basketProducts[0].ProfileId },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = new OrdersServices();
