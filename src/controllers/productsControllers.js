const { validationResult } = require("express-validator");
const Sentry = require("@sentry/node");
const ProductServices = require("../services/productsServices");

class ProductsControllers {
  async getProducts(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const data = await ProductServices.getProducts(req.query);
      if (data.length > 0) {
        res.send(data);
      } else {
        res.status(500).json({ message: "Товары отсутсвуют." });
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      res
        .status(500)
        .json({ message: "Ошибка получения информации о товарах" });
    }
  }

  async saveProducts(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await ProductServices.saveProducts(req.body);
      res.send("OK");
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      res
        .status(500)
        .json({ message: "Ошибка сохранения запроса в базу данных" });
    }
  }

  async deleteProduct(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await ProductServices.deleteProduct(req.params.id);
      res.send("OK");
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      res
        .status(500)
        .json({ message: "Ошибка удаления товара из базу данных" });
    }
  }

  async updateProduct(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await ProductServices.findProductById(req.params.id);
      if (result) {
        await ProductServices.updateProduct(req.params.id, req.body);
        res.send("OK");
      } else {
        res.send("Товар с указанным идентификатором не найден");
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      res
        .status(500)
        .json({ message: "Ошибка удаления товара из базу данных" });
    }
  }
}

module.exports = new ProductsControllers();
