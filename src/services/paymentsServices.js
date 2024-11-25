const { Payments } = require("../models/models");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class PaymentsServices {
  async getPayments() {
    try {
      const payments = await Payments.findAll();
      return payments;
    } catch (err) {
      console.log(err);
    }
  }

  async getPaymentsById(id) {
    try {
      const payments = await Payments.findAll({ id });
      return payments[0];
    } catch (err) {
      console.log(err);
    }
  }

  async savePayment(body) {
    try {
      const payment = await Payments.create(body);
      return payment;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async createPayment(body) {
    try {
      // создание платежного намерения
      const paymentIntent = await stripe.paymentIntents.create({
        amount: body.summa,
        currency: "usd",
        metadata: {
          orderId: body.orderId,
        },
        payment_method_types: ["us_bank_account"],
      });

      const paymentMethod = await stripe.paymentMethods.create({
        type: "us_bank_account",
        billing_details: {
          name: body.billingName,
          email: body.billingEmail,
        },
        us_bank_account: {
          account_number: body.accountNumber,
          routing_number: body.routingNumber,
          account_holder_type: body.accountHolderType,
        },
      });

      const confirmIntent = await stripe.paymentIntents.confirm(
        paymentIntent.id,
        {
          payment_method: paymentMethod.id,
          mandate_data: {
            customer_acceptance: {
              type: "online",
              online: {
                ip_address: "192.168.1.1", // IP-адрес клиента
                user_agent: "Mozilla/5.0...", // User-Agent клиента
              },
            },
          },
        }
      );

      return `Платеж требует подтверждения. Ваш секретный ключ ${paymentIntent.client_secret}`;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = new PaymentsServices();
