const db = require("../config/db");
const { Baskets, Products } = require("../models/models");
const { Op } = require("sequelize");

class BasketsServices {
  async getBasket(profileId) {
    try {
      const basket = await Baskets.findAll({ where: { ProfileId: profileId } });

      let summa = 0;
      let result = [];
      if (basket.length > 0) {
        for (const element of basket) {
          const product = await Products.findAll({
            where: {
              id: element.ProductId,
            },
            attributes: [
              "id",
              "name",
              "description",
              "category",
              "image",
              "price",
            ],
          });

          result.push({
            product: product[0],
            count: element.count,
            ProductId: element.ProductId,
            ProfileId: element.ProfileId,
          });

          summa = summa + element.count * product[0].price;
        }
      }
      return (summa = 0 ? null : { Products: result, summa: summa });
    } catch (err) {
      console.log(err);
    }
  }

  async saveProductsToBasket(profileId, body) {
    try {
      // есть ли столько товара в магазине
      const product = await Products.findAll({
        where: { id: body.ProductId, count: { [Op.gte]: body.count } },
      });

      // если есть
      if (product[0]) {
        // добавляем в корзину
        // ищем есть ли товар в корзине
        const basket = await Baskets.findAll({
          where: {
            ProfileId: profileId,
            ProductId: body.ProductId,
          },
        });

        if (basket[0]) {
          // если запись уже существует, то добавляем к существующей
          Baskets.update(
            { count: basket[0].count + body.count },
            { where: { ProductId: body.ProductId, ProfileId: profileId } }
          );
        } else {
          // если такого товара в корзине еще нет
          await Baskets.create({ ProfileId: profileId, ...body });
        }
      } else {
        // не хватает по количеству
        throw new Error("В магазине нет такого количества данного товара");
      }

      //
      //return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = new BasketsServices();
