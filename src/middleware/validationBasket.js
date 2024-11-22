const { body } = require("express-validator");

// Middleware для валидации данных
const validateBody = [
  body("ProductId")
    .isInt()
    .withMessage(`Идентификатор товара должен быть числовым`),
  body("count").isInt().withMessage(`Количество товара должно быть численным`),
];

module.exports = {
  validateBody,
};
