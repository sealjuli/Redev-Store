const { validationResult } = require("express-validator");
const Sentry = require("@sentry/node");
const OrdersServices = require("../services/ordersServices");
const ProfileServices = require("../services/profilesServices");
const BasketServices = require("../services/basketsServices");
const PaymentServices = require("../services/paymentsServices");
const ProductOrdersServices = require("../services/productOrdersServices");
const productsServices = require("../services/productsServices");
const Role = require("../helpers/role");

class OrdersControllers {
  async getOrders(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (req.query.userType === Role.admin) {
        // все заказы
        let orders = await OrdersServices.getAllOrders();
        if (orders.length > 0) {
          for (const element of orders) {
            const payments = PaymentServices.getPaymentsById(element.paymentId);

            if (payments) {
              element.dataValues.paymentStatus = payments.status;
            }

            const products = await ProductOrdersServices.findProductOrderById(
              element.id
            );
            let productsResult = [];

            for (const elem of products) {
              const product = await productsServices.findProductByIdAttrs(
                elem.ProductId
              );
              productsResult.push({ product: product, count: elem.count });
            }

            element.dataValues.products = productsResult;
          }

          res.send(orders);
        } else {
          res.status(500).json({ message: "Заказов еще не было :(" });
        }
      } else {
        // заказы только текущего пользователя
        const profile = await ProfileServices.getProfile(req.userId);

        let order = await OrdersServices.getOrdersByProfileId(profile.id);
        if (order.length > 0) {
          for (const element of order) {
            const payment = await PaymentServices.getPaymentsById(
              element.paymentId
            );

            if (payment) {
              element.dataValues.paymentStatus = payment.status;
            }

            const products = await ProductOrdersServices.findProductOrderById(
              element.id
            );
            let productsResult = [];

            for (const elem of products) {
              const product = await productsServices.findProductByIdAttrs(
                elem.ProductId
              );
              productsResult.push({ product: product, count: elem.count });
            }

            element.dataValues.products = productsResult;
          }

          res.send(order);
        } else {
          res.status(500).json({ message: "Заказов еще не было :(" });
        }
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      res
        .status(500)
        .json({ message: "Ошибка получения истории заказов пользователя" });
    }
  }

  async updateStatus(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const order = await OrdersServices.getOrderById(req.params.id);

      if (order) {
        // обновляем статус заказа
        await OrdersServices.updateOrderById(req.params.id, req.body.status);
        res.send("OK");
      } else {
        res
          .status(500)
          .json({ message: "Заказа с указанным id не существует" });
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      if (error.message) {
        res.status(500).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: "Ошибка редактирования статуса заказа" });
      }
    }
  }

  async addOrder(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // проверить пустая ли корзина
      const profile = await ProfileServices.getProfile(req.userId);

      const basket = await BasketServices.getBasket(profile.id);
      if (basket.length > 0) {
        // корзина не пустая
        let summa = 0;

        for (const element of basket) {
          const product = await productsServices.findProductByIdCount({
            ProductId: element.ProductId,
            count: element.count,
          });

          if (!product) {
            throw new Error("Какой-то товар из корзины закончился в магазине");
          }

          summa = summa + element.count * product.price;
        }

        const order = await OrdersServices.saveOrder(
          req.body,
          basket[0].ProfileId,
          summa
        );

        // цикл по элементам корзины
        for (const element of basket) {
          const product = await productsServices.findProductById(element.ProductId);

          // отнимаем из товаров
          await productsServices.updateProduct(element.ProductId, {
            count: product.count - element.count,
          });

          // добавляем товары в заказ
          await ProductOrdersServices.createProductOrder(order.id, element);
        }

        // очищаем корзину
        await BasketServices.clearBasket(basket[0].ProfileId);

        if (req.body.paymentMethod === "Онлайн") {
          // создаем платеж
        }

        res.send("OK");
      } else {
        res.status(500).json({ message: "Корзина пуста" });
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      if (error.message) {
        res.status(500).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: "Ошибка сохранения запроса в базу данных" });
      }
    }
  }
}

module.exports = new OrdersControllers();
