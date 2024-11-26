const express = require("express");
const router = express.Router();

const OrdersControllers = require("../controllers/ordersControllers");
const authenticateToken = require("../middleware/authentificateToken");
const validationUserMiddleware = require("../middleware/validationUser");
const validationOrderMiddleware = require("../middleware/validationOrder");

/**
 * @swagger
 * /api/store/orders:
 *   get:
 *     summary: История заказов / для админа просмотр всех заказов
 *     description: Просмотр истории заказов текущего пользователя, для админа - просмотр всех заказов
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: История заказов пользователя
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *           description: Идентификатор заказа
 *         status:
 *           type: string
 *           enum:
 *             - Оформлен
 *             - Оплачен
 *             - Доставляется
 *             - Ждет самовывоза
 *             - Выполнен
 *           example: Выполнен
 *           description: Статус заказа
 *         summa:
 *           type: number
 *           example: 500
 *           description: Сумма заказа
 *         deliveryMethod:
 *           type: string
 *           enum:
 *             - Самовывоз
 *             - Доставка
 *           example: Самовывоз
 *           description: Способ доставки
 *         paymentMethod:
 *           type: string
 *           enum:
 *             - Наличные
 *             - Карта
 *             - Online
 *           example: Online
 *           description: Способ оплаты
 *         prodileId:
 *           type: integer
 *           example: 1
 *           description: Идентификатор профиля
 *         paymentId:
 *           type: integer
 *           example: 1
 *           description: Идентификатор платежа
 */
router.get("/", authenticateToken, OrdersControllers.getOrders);

/**
 * @swagger
 * /api/store/orders:
 *    post:
 *      summary: Оформить заказ
 *      description: Добавить информацию из корзины в новый заказ
 *      tags:
 *        - Orders
 *      security:
 *       - bearerAuth: []
 *      requestBody:
 *        $ref: "#/components/requestBodies/Order"
 *      responses:
 *        200:
 *          description: Заказ успешно сформирован
 * components:
 *   schemas:
 *     ProductOrder:
 *       type: object
 *       properties:
 *         OrderId:
 *           type: integer
 *           example: 1
 *           description: Идентификатор заказа
 *         ProductId:
 *           type: integer
 *           example: 1
 *           description: Идентификатор товара в заказе
 *         count:
 *           type: integer
 *           example: 5
 *           description: Количество товара в заказе
 *   requestBodies:
 *     Order:
 *       description: Свойства запроса для оформления нового заказа
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryMethod:
 *                 type: string
 *                 example: Самовывоз
 *                 description: Способ доставки товара
 *               paymentMethod:
 *                 type: string
 *                 example: Наличные
 *                 description: Способ оплаты товара
 */
router.post(
  "/",
  authenticateToken,
  validationOrderMiddleware.validateBody,
  validationUserMiddleware.validateUser,
  OrdersControllers.addOrder
);

/**
 * @swagger
 * /api/store/orders/{id}:
 *   patch:
 *     summary: Редактирование статуса заказа
 *     description: Редактирование статуса о заказе по id
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Идентификатор заказа
 *     requestBody:
 *        $ref: "#/components/requestBodies/Status"
 *     responses:
 *       200:
 *         description: Статус заказа успешно обновлен
 * components:
 *   requestBodies:
 *     Status:
 *       description: Свойства запроса для редактирования статуса заказа
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: Доставляется
 *                 description: статус заказа
 */
router.patch(
  "/:id",
  authenticateToken,
  validationOrderMiddleware.validateBodyUpdate,
  validationOrderMiddleware.validateParamId,
  validationUserMiddleware.validateAdmin,
  OrdersControllers.updateStatus
);

module.exports = router;
