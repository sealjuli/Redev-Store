const express = require("express");
const router = express.Router();

const PaymentsControllers = require("../controllers/paymentsControlles");
const authenticateToken = require("../middleware/authentificateToken");
const validationUserMiddleware = require("../middleware/validationUser");
const validationPaymentMiddleware = require("../middleware/validationPayment");

/**
 * @swagger
 * /api/store/payments:
 *   get:
 *     summary: История платежей
 *     description: для админа - просмотр всех платежей
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: История платежей
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *           description: Идентификатор платежа
 *         orderId:
 *           type: integer
 *           example: 1
 *           description: Идентификатор заказа
 *         summa:
 *           type: number
 *           example: 500
 *           description: Сумма заказа
 *         status:
 *           type: string
 *           example: Оплачен
 *           description: Статус платежа
 */
router.get(
  "/",
  authenticateToken,
  validationUserMiddleware.validateAdmin,
  PaymentsControllers.getPayments
);

/**
 * @swagger
 * /api/store/payments:
 *    post:
 *      summary: Создать платеж (оплата оффлайн на месте)
 *      description: Добавить платеж в бд
 *      tags:
 *        - Payments
 *      security:
 *       - bearerAuth: []
 *      requestBody:
 *        $ref: "#/components/requestBodies/Payment"
 *      responses:
 *        200:
 *          description: Платеж успешно добавлен
 * components:
 *   requestBodies:
 *     Payment:
 *       description: Свойства запроса для добавления нового платежа
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: integer
 *                 example: 1
 *                 description: Идентификатор заказа
 *               summa:
 *                 type: integer
 *                 example: 500
 *                 description: Сумма оплаты
 */
router.post(
  "/",
  authenticateToken,
  validationUserMiddleware.validateAdmin,
  validationPaymentMiddleware.validateBodyCash,
  PaymentsControllers.addPayment
);

/**
 * @swagger
 * /api/store/payments/online:
 *    post:
 *      summary: Отправить онлайн платеж (оплата со счета)
 *      description: Добавить платеж в бд
 *      tags:
 *        - Payments
 *      security:
 *       - bearerAuth: []
 *      requestBody:
 *        $ref: "#/components/requestBodies/PaymentOnline"
 *      responses:
 *        200:
 *          description: Платеж успешно добавлен
 * components:
 *   requestBodies:
 *     PaymentOnline:
 *       description: Свойства запроса для добавления нового платежа
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: integer
 *                 example: 1
 *                 description: Идентификатор заказа
 *               summa:
 *                 type: integer
 *                 example: 500
 *                 description: Сумма оплаты
 *               billingName:
 *                 type: string
 *                 example: user
 *                 description: Имя для платежа
 *               billingEmail:
 *                 type: string
 *                 example: user@example.com
 *                 description: Почта для платежа
 *               accountNumber:
 *                 type: string
 *                 example: "000123456789"
 *                 description: Номер счета
 *               routingNumber:
 *                 type: string
 *                 example: 110000000
 *                 description: Номер маршрутизации
 *               accountHolderType:
 *                 type: string
 *                 example: individual
 *                 description: Тип владельца счета
 */
router.post(
  "/online",
  authenticateToken,
  validationPaymentMiddleware.validateBodyOnline,
  PaymentsControllers.createPayment
);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentsControllers.webhook
);

module.exports = router;
