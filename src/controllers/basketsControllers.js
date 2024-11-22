const { validationResult } = require("express-validator");
const Sentry = require("@sentry/node");
const BasketServices = require("../services/basketsServices");
const ProfileServices = require("../services/profilesServices");

class BasketsControllers {
  async getBasket(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await ProfileServices.getProfile(req.userId);

      const result = await BasketServices.getBasket(profile.id);
      if (result) {
        res.send(result);
      } else {
        res.status(500).json({ message: "Корзина пуста" });
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      res
        .status(500)
        .json({ message: "Ошибка получения корзины пользователя" });
    }
  }

  async addProductToBasket(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await ProfileServices.getProfile(req.userId);

      await BasketServices.saveProductsToBasket(profile.id, req.body);
      res.send("OK");
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

module.exports = new BasketsControllers();
