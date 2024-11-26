const { body, param, query } = require("express-validator");

// Middleware для валидации данных
const validateQuery = [
  query("sortByPrice")
    .isIn(["asc", "desc"])
    .optional()
    .withMessage(`Сортировка по цене может быть asc или desc`),

  query("sortByDate")
    .isIn(["asc", "desc"])
    .optional()
    .withMessage(`Сортировка по дате добавления может быть asc или desc`),

  query("category")
    .isLength({ min: 2 })
    .optional()
    .withMessage(`Категория товара должна содержать больше одного символов`),

  query("price")
    .isNumeric()
    .optional()
    .withMessage(`Цена товара должно быть численной`),

  query("availability")
    .equals("1")
    .optional()
    .withMessage(`Отбор по наличию на складе: поставьте 1`),
];

const validateBody = [
  body("name")
    .isLength({ min: 3 })
    .withMessage(`Наименование товара должно содержать больше двух символов`),
  body("description")
    .isLength({ min: 3 })
    .withMessage(`Описание товара должно содержать больше двух символов`),
  body("category")
    .isLength({ min: 3 })
    .withMessage(`Категория товара должно содержать больше двух символов`),
  body("image").isLength({ min: 2 }).withMessage(`Изображение указано неверно`),
  body("price").isNumeric().withMessage(`Цена товара должно быть численной`),
  body("count").isInt().withMessage(`Количество товара должно быть численным`),
];

const validateBodyUpdate = [
  body("name")
    .isLength({ min: 3 })
    .optional()
    .withMessage(`Наименование товара должно содержать больше двух символов`),
  body("description")
    .isLength({ min: 3 })
    .optional()
    .withMessage(`Описание товара должно содержать больше двух символов`),
  body("category")
    .isLength({ min: 3 })
    .optional()
    .withMessage(`Категория товара должно содержать больше двух символов`),
  //body("image").optional().withMessage(`Изображение`),
  body("price")
    .isNumeric()
    .optional()
    .withMessage(`Цена товара должно быть численной`),
  body("count")
    .isInt()
    .optional()
    .withMessage(`Количество товара должно быть численным`),
];

const validateParamId = [
  param("id").isLength({ min: 1 }).withMessage("Id продукта слишком короткий."),
];

module.exports = {
  validateBody,
  validateParamId,
  validateBodyUpdate,
  validateQuery,
};
