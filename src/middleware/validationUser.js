const { body, query } = require("express-validator");
const Role = require("../helpers/role");

// Middleware для валидации данных
const validateBodyUser = [
  body("email")
    .isEmail()
    .withMessage("Email пользователя имеет неверный формат."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Пароль должен содержать больше 5 символов"),
  body("userType")
    .isIn([Role.admin, Role.user])
    .optional()
    .withMessage("Тип пользователя должен быть либо admin либо user"),
];

const validateAdmin = [
  query("userType")
    .equals(Role.admin)
    .withMessage("Данное действие может выполнить только администратор."),
];

const validateUser = [
  query("userType")
    .equals(Role.user)
    .optional()
    .withMessage("Данное действие может выполнить только пользователь."),
];

module.exports = { validateBodyUser, validateAdmin, validateUser };
