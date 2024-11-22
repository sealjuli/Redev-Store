const { validationResult } = require("express-validator");
const Sentry = require("@sentry/node");
const OrdersServices = require("../services/ordersServices");
const ProfileServices = require("../services/profilesServices");
const BasketServices = require("../services/basketsServices");

class OrdersControllers {
  async getOrders(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (req.query.userType === "admin") {
        // все заказы
        const order = await OrdersServices.getAllOrders();
        if (order.length > 0) {
          res.send(order);
        } else {
          res.status(500).json({ message: "Заказов еще не было :(" });
        }
      } else {
        // заказы только текущего пользователя
        const profile = await ProfileServices.getProfile(req.userId);

        const order = await OrdersServices.getOrdersByProfileId(profile.id);
        if (order.length > 0) {
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
      if (basket) {
        // корзина не пустая

        const order = await OrdersServices.saveOrder(req.body, basket);

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
