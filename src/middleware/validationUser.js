const { body, query } = require("express-validator");

// Middleware для валидации данных
const validateBodyUser = [
  body("email")
    .isEmail()
    .withMessage("Email пользователя имеет неверный формат."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Пароль должен содержать больше 5 символов"),
  body("userType")
    .isIn(["admin", "user"])
    .optional()
    .withMessage("Тип пользователя должен быть либо admin либо user"),
];

const validateAdmin = [
  query("userType")
    .equals("admin")
    .withMessage("Данное действие может выполнить только администратор."),
];

const validateUser = [
  query("userType")
    .equals("user")
    .optional()
    .withMessage("Данное действие может выполнить только пользователь."),
];

module.exports = { validateBodyUser, validateAdmin, validateUser };
