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

  async saveProductsToBasket(profileId, body) {
    try {
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
