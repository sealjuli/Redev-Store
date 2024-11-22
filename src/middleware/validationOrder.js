const { body, param } = require("express-validator");

// Middleware для валидации данных
const validateBody = [
  body("deliveryMethod")
    .isIn(["Самовывоз", "Доставка"])
    .withMessage(
      `Способ доставки должен быть одним из перечисленных: 'Самовывоз', 'Доставка'`
    ),
  body("paymentMethod")
    .isIn(["Наличные", "Карта", "Online"])
    .withMessage(
      `Платежный метод должен быть одним из перечисленных: 'Наличные', 'Карта', 'Online'`
    ),
];

const validateBodyUpdate = [
  body("status").isIn([
    "Оформлен",
    "Оплачен",
    "Доставляется",
    "Ждет самовывоза",
    "Выполнен",
  ])
    .withMessage(`Статус должен быть одним из перечисленных: 'Оформлен', 'Оплачен', 'Доставляется',
    'Ждет самовывоза', 'Выполнен'`),
];

const validateParamId = [
  param("id").isLength({ min: 1 }).withMessage("Id задания слишком короткий."),
];

module.exports = {
  validateBody,
  validateParamId,
  validateBodyUpdate,
};
