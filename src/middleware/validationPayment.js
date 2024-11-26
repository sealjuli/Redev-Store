const { body } = require("express-validator");

// Middleware для валидации данных
const validateBodyCash = [
  body("orderId")
    .isInt()
    .withMessage("Идентификатор заказа должен быть числовой"),
  body("summa").isNumeric().withMessage("Сумма платежа должна быть числовой"),
];

const validateBodyOnline = [
  body("orderId")
    .isInt()
    .withMessage("Идентификатор заказа должен быть числовой"),
  body("summa").isNumeric().withMessage("Сумма платежа должна быть числовой"),
  body("billingName")
    .isLength({ min: 3 })
    .withMessage("Имя плательщика слишком короткое"),
  body("billingEmail")
    .isEmail()
    .withMessage("Емаил плательщика указан неверно"),
  body("accountNumber").isInt().withMessage("Номер счета должен быть числовой"),
  body("routingNumber")
    .isInt()
    .withMessage("Номер маршрутизации должен быть числовой"),
  body("accountHolderType")
    .isIn(["individual", "company"])
    .withMessage("Тип владельца счета указывается 'individual' либо 'company'"),
];

module.exports = {
  validateBodyCash,
  validateBodyOnline,
};
