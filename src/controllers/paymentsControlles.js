const { validationResult } = require("express-validator");
const Sentry = require("@sentry/node");
const PaymentServices = require("../services/paymentsServices");
const OrderServices = require("../services/ordersServices");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class PaymentsControllers {
  async getPayments(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const data = await PaymentServices.getPayments();
      if (data.length > 0) {
        res.send(data);
      } else {
        res.status(500).json({ message: "Платежи отсутсвуют." });
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      res
        .status(500)
        .json({ message: "Ошибка получения информации о платежах" });
    }
  }

  async addPayment(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // найти заказ
      const order = await OrderServices.getOrderById(req.body.orderId);
      if (order) {
        if (!order.paymentId) {
          // проверить сумму
          if (order.summa === req.body.summa) {
            // создать платеж
            const payment = await PaymentServices.savePayment({
              ...req.body,
              status: "Оплачен.",
            });

            // поменять статус заказа
            await OrderServices.updateOrderById(
              req.body.orderId,
              "Заказ оплачен наличными."
            );

            // обновить paymentId заказа
            await OrderServices.updateOrderPaymentById(
              req.body.orderId,
              payment.id
            );

            res.send("OK");
          } else {
            res.status(500).json({ message: "Сумма указана неверно." });
          }
        } else {
          res.status(500).json({ message: "Заказ уже оплачен." });
        }
      } else {
        res.status(500).json({ message: "Заказ не найден." });
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      res
        .status(500)
        .json({ message: "Ошибка получения информации о платежах" });
    }
  }

  async createPayment(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // найти заказ
      const order = await OrderServices.getOrderById(req.body.orderId);
      if (order) {
        if (!order.paymentId) {
          // проверить сумму
          if (order.summa === req.body.summa) {
            const result = await PaymentServices.createPayment(req.body);
            res.send(result);
          } else {
            res.status(500).json({ message: "Сумма указана неверно." });
          }
        } else {
          res.status(500).json({ message: "Заказ уже оплачен." });
        }
      } else {
        res.status(500).json({ message: "Заказ не найден." });
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      res.status(500).json({ message: "Ошибка создания платежа" });
    }
  }

  async webhook(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Секрет вебхука
      const sig = req.headers["stripe-signature"];

      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        console.error("Ошибка при проверке вебхука:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      let paymentIntent = event.data.object;
      let result;
      // Обработка разных типов событий Stripe
      switch (event.type) {
        case "payment_intent.created":
          result = `Платеж успешно создан: ${paymentIntent.id}`;
          console.log(result);
          break;
        case "payment_intent.requires_action":
          result = `Платеж требует подтверждения: ${paymentIntent.id}`;
          console.log(result);
          break;
        case "payment_intent.succeeded":
          result = `Платеж успешно завершен: ${paymentIntent.id}`;
          console.log(result);
          break;
        case "payment_intent.payment_failed":
          const failedIntent = event.data.object;
          console.error(
            "Платеж не прошел:",
            failedIntent.last_payment_error?.message
          );
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      if (
        event.type === "payment_intent.requires_action" ||
        event.type === "payment_intent.succeeded"
      ) {
        // Добавить в таблицу платежей
        const payment = await PaymentServices.savePayment({
          orderId: paymentIntent.metadata.orderId,
          summa: paymentIntent.amount,
          status: result,
        });

        // поменять статус заказа
        await OrderServices.updateOrderById(
          paymentIntent.metadata.orderId,
          result
        );

        // обновить paymentId заказа
        await OrderServices.updateOrderPaymentById(
          paymentIntent.metadata.orderId,
          payment.id
        );
      }

      res.status(200).send("Received");
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      res.status(500).json({ message: "Ошибка создания online-платежа" });
    }
  }
}

module.exports = new PaymentsControllers();
