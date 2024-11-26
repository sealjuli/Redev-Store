const { Baskets } = require("../models/models");

class BasketsServices {
  async getBasket(profileId) {
    try {
      const basket = await Baskets.findAll({ where: { ProfileId: profileId } });
      return basket;
    } catch (err) {
      console.log(err);
    }
  }

  async getBasketByProductId(profileId, productId) {
    try {
      const basket = await Baskets.findAll({
        where: { ProfileId: profileId, ProductId: productId },
      });
      return basket;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteProductsFromBasket(profileId, body) {
    try {
      // ищем товар в корзине
      const basket = await Baskets.findAll({
        where: {
          ProfileId: profileId,
          ProductId: body.productId,
        },
      });

      if (basket[0]) {
        if (!body.count) {
          // если count не указан, то полностью
          await Baskets.destroy({
            where: { ProfileId: profileId, ProductId: body.productId },
          });
        } else {
          if (basket[0].count - body.count <= 0) {
            // если count указано больше, чем есть, то полностью
            await Baskets.destroy({
              where: { ProfileId: profileId, ProductId: body.productId },
            });
          } else {
            // если count указан, то удалить указанное количество
            Baskets.update(
              { count: basket[0].count - body.count },
              { where: { ProductId: body.productId, ProfileId: profileId } }
            );
          }
        }
      }

      return basket;
    } catch (err) {
      console.log(err);
    }
  }

  async saveProductsToBasket(profileId, body) {
    try {
      // ищем есть ли товар в корзине
      const basket = await Baskets.findAll({
        where: {
          ProfileId: profileId,
          ProductId: body.productId,
        },
      });

      if (basket[0]) {
        // если запись уже существует, то добавляем к существующей
        Baskets.update(
          { count: basket[0].count + body.count },
          { where: { ProductId: body.productId, ProfileId: profileId } }
        );
      } else {
        // если такого товара в корзине еще нет
        await Baskets.create({
          ...body,
          ProductId: body.productId,
          ProfileId: profileId,
        });
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async clearBasket(ProfileId) {
    try {
      await Baskets.destroy({
        where: { ProfileId },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = new BasketsServices();
