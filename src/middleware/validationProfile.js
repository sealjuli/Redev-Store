const { body } = require("express-validator");

// Middleware для валидации данных
const validateBody = [
  body("fullname")
    .isLength({ min: 3 })
    .optional()
    .withMessage("Полное имя пользователя должно содержать больше 2 символов."),
  body("address")
    .isLength({ min: 5 })
    .optional()
    .withMessage("Адрес должен содержать больше 4 символов"),
  body("phone")
    .isMobilePhone()
    .optional()
    .withMessage("Мобильный телефон указан неверно."),
];

module.exports = { validateBody };
