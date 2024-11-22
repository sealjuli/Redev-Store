const express = require("express");
const router = express.Router();

const ProductsControllers = require("../controllers/productsControllers");
const authenticateToken = require("../middleware/authentificateToken");
const validationUserMiddleware = require("../middleware/validationUser");
const validationProductMiddleware = require("../middleware/validationProduct");

/**
 * @swagger
 * /api/store/products:
 *   get:
 *     summary: Вывод информации о товарах
 *     description: Просмотр всех товаров из в бд
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: sortByPrice
 *         required: false
 *         schema:
 *           type: string
 *         description: Сортировка по цене (asc/desc)
 *       - in: query
 *         name: sortByDate
 *         required: false
 *         schema:
 *           type: string
 *         description: Сортировка по дате добавления (ASC/DESC)
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Поиск по категории
 *       - in: query
 *         name: price
 *         required: false
 *         schema:
 *           type: string
 *         description: Поиск по цене
 *       - in: query
 *         name: availability
 *         required: false
 *         schema:
 *           type: integer
 *         description: Поиск по наличию на складе
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о товарах
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *           description: Идентификатор товара
 *         name:
 *           type: string
 *           example: ноутбук
 *           description: Название товара
 *         description:
 *           type: string
 *           example: HP 2024
 *           description: Описание товара
 *         category:
 *           type: string
 *           example: техника
 *           description: Категория товара
 *         image:
 *           type: string
 *           example: hp.img
 *           description: Изображение
 *         price:
 *           type: integer
 *           example: 50
 *           description: Цена
 *         count:
 *           type: integer
 *           example: 50
 *           description: Количество на складе
 */
router.get("/", authenticateToken, ProductsControllers.getProducts);

/**
 * @swagger
 * /api/store/products:
 *    post:
 *      summary: Добавить новый товар
 *      description: Добавить в базу новый товар
 *      tags:
 *        - Products
 *      security:
 *       - bearerAuth: []
 *      requestBody:
 *        $ref: "#/components/requestBodies/Product"
 *      responses:
 *        200:
 *          description: Товар успешно добавлен
 * components:
 *   requestBodies:
 *     Product:
 *       description: Свойства запроса для сохранения
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: ноутбук
 *                 description: Название товара
 *               description:
 *                 type: string
 *                 example: HP 2024
 *                 description: Описание товара
 *               category:
 *                 type: string
 *                 example: техника
 *                 description: Категория товара
 *               image:
 *                 type: string
 *                 example: hp.img
 *                 description: Изображение
 *               price:
 *                 type: integer
 *                 example: 50
 *                 description: Цена
 *               count:
 *                 type: integer
 *                 example: 50
 *                 description: Количество на складе
 */

router.post(
  "/",
  authenticateToken,
  validationProductMiddleware.validateBody,
  validationUserMiddleware.validateAdmin,
  ProductsControllers.saveProducts
);

/**
 * @swagger
 * /api/store/products/{id}:
 *   delete:
 *     summary: Удаление товара по id
 *     description: Удаление товара из базы данных по id
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Идентификатор товара
 *     responses:
 *       200:
 *         description: Товар успешно удален
 */
router.delete(
  "/:id",
  authenticateToken,
  validationUserMiddleware.validateAdmin,
  validationProductMiddleware.validateParamId,
  ProductsControllers.deleteProduct
);

/**
 * @swagger
 * /api/store/products/{id}:
 *   patch:
 *     summary: Редактирование информации о товаре
 *     description: Редактирование информации о товаре в бд
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Идентификатор товара
 *     requestBody:
 *        $ref: "#/components/requestBodies/Product"
 *     responses:
 *       200:
 *         description: Информация о товаре успешно обновлена
 */
router.patch(
  "/:id",
  authenticateToken,
  validationProductMiddleware.validateBodyUpdate,
  validationProductMiddleware.validateParamId,
  validationUserMiddleware.validateAdmin,
  ProductsControllers.updateProduct
);

module.exports = router;
