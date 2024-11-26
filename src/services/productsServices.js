const { Products } = require("../models/models");
const { Op } = require("sequelize");

class ProductsServices {
  async getProducts(query) {
    try {
      const order = [];
      const where = {};

      if (query.sortByPrice) {
        order.push(["price", query.sortByPrice]);
      }

      if (query.sortByDate) {
        order.push(["createdAt", query.sortByDate]);
      }

      if (query.category) {
        where["category"] = query.category;
      }

      if (query.price) {
        where["price"] = query.price;
      }

      if (query.availability) {
        where["count"] = { [Op.gt]: 0 };
      }

      const result = await Products.findAll({
        where: Object.keys(where).length > 0 ? where : undefined,
        order: order.length > 0 ? order : undefined,
      });

      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async saveProducts(body) {
    try {
      const result = await Products.create(body);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteProduct(id) {
    try {
      await Products.destroy({ where: { id } });
    } catch (err) {
      console.log(err);
    }
  }

  async findProductById(id) {
    try {
      const result = await Products.findAll({
        where: { id },
      });
      return result[0];
    } catch (err) {
      console.log(err);
    }
  }

  async findProductByIdAttrs(id) {
    try {
      const result = await Products.findAll({
        where: { id },
        attributes: ["name", "description", "category", "image", "price"],
      });

      return result[0];
    } catch (err) {
      console.log(err);
    }
  }

  async updateProduct(id, body) {
    try {
      await Products.update({ ...body }, { where: { id } });
    } catch (err) {
      console.log(err);
    }
  }

  async findProductByIdCount(body) {
    try {
      const result = await Products.findAll({
        where: { id: body.productId, count: { [Op.gte]: body.count } },
      });

      return result[0];
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new ProductsServices();
