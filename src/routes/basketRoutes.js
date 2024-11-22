const express = require("express");
const router = express.Router();

const BasketsControllers = require("../controllers/basketsControllers");
const authenticateToken = require("../middleware/authentificateToken");
const validationBasketMiddleware = require("../middleware/validationBasket");
const validationUserMiddleware = require("../middleware/validationUser");

/**
 * @swagger
 * /api/store/baskets:
 *   get:
 *     summary: Просмотр корзины
 *     description: Просмотр коризны текущего пользователя
 *     tags:
 *       - Basket
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Корзина пользователя
 * components:
 *   schemas:
 *     Basket:
 *       type: object
 *       properties:
 *         ProfileId:
 *           type: integer
 *           example: 1
 *           description: Идентификатор профиля
 *         ProductId:
 *           type: integer
 *           example: 1
 *           description: Идентификатор товара
 *         count:
 *           type: integer
 *           example: 50
 *           description: Количество товара в корзине
 */
router.get(
  "/",
  authenticateToken,
  validationUserMiddleware.validateUser,
  BasketsControllers.getBasket
);

/**
 * @swagger
 * /api/store/baskets:
 *    post:
 *      summary: Добавить товар в корзину
 *      description: Добавить в корзину товар
 *      tags:
 *        - Basket
 *      security:
 *       - bearerAuth: []
 *      requestBody:
 *        $ref: "#/components/requestBodies/Basket"
 *      responses:
 *        200:
 *          description: Товар успешно добавлен в корзину
 * components:
 *   requestBodies:
 *     Basket:
 *       description: Свойства запроса для добавления товара в корзину
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ProductId:
 *                 type: integer
 *                 example: 1
 *                 description: Идентификатор товара
 *               count:
 *                 type: integer
 *                 example: 5
 *                 description: Количество товара
 */
router.post(
  "/",
  authenticateToken,
  validationUserMiddleware.validateUser,
  validationBasketMiddleware.validateBody,
  BasketsControllers.addProductToBasket
);

module.exports = router;
