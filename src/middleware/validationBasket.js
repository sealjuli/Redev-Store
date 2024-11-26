const { body } = require("express-validator");

// Middleware для валидации данных
const validateBody = [
  body("productId")
    .isInt()
    .withMessage(`Идентификатор товара должен быть числовым`),
  body("count")
    .isInt()
    .optional()
    .withMessage(`Количество товара должно быть численным`),
];

module.exports = {
  validateBody,
};
