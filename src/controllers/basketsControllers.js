const { validationResult } = require("express-validator");
const Sentry = require("@sentry/node");
const BasketServices = require("../services/basketsServices");
const ProfileServices = require("../services/profilesServices");
const ProductServices = require("../services/productsServices");

class BasketsControllers {
  async getBasket(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await ProfileServices.getProfile(req.userId);

      const basket = await BasketServices.getBasket(profile.id);

      if (basket.length > 0) {
        // более подробно расписываю корзину
        let summa = 0;
        let result = [];
        if (basket.length > 0) {
          for (const element of basket) {
            const product = await ProductServices.findProductByIdAttrs(
              element.ProductId
            );

            result.push({
              product: product,
              count: element.count,
              ProductId: element.ProductId,
              ProfileId: element.ProfileId,
            });

            summa = summa + element.count * product.price;
          }
        }

        if (summa === 0) {
          res.status(500).json({ message: "Корзина пуста" });
        } else {
          res.send({ Products: result, summa: summa });
        }
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

      // проверить, есть ли столько товара в магазине
      const product = await ProductServices.findProductByIdCount(req.body);

      console.log(product)

      // если есть
      if (product) {
        await BasketServices.saveProductsToBasket(profile.id, req.body);
        res.send("OK");
      } else {
        // не хватает по количеству
        res
          .status(500)
          .json({ message: "В магазине нет такого количества данного товара" });
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

module.exports = new BasketsControllers();
