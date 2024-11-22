const express = require("express");

const UsersControllers = require("../controllers/usersControllers");
const validationMiddleware = require("../middleware/validationUser");
const storeRoutes = require("./storeRoutes");

const router = express.Router();

router.use("/store", storeRoutes);

/**
 * @swagger
 * /api/register:
 *    post:
 *      summary: Регистрация
 *      description: Зарегестрировать нового пользователя
 *      tags:
 *        - Users
 *      requestBody:
 *        $ref: "#/components/requestBodies/Users"
 *      responses:
 *        200:
 *          description: Пользователь успешно зарегестрирован
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 3f1f954a-b756-4c6e-84fe-7d428a6ccaff
 *         email:
 *           type: string
 *           example: shemplehova@gmail.com
 *         password:
 *           type: string
 *           example: 111111
 *         userType:
 *           type: string
 *           enum:
 *             - user
 *             - admin
 *           example: admin
 *           description: Тип пользователя
 *   requestBodies:
 *     Users:
 *       description: Свойства пользователя, который был зарегестрирован
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *                 description: Email пользователя
 *               password:
 *                 type: string
 *                 example: 111111
 *                 description: Пароль пользователя
 *               userType:
 *                 type: string
 *                 example: admin
 *                 description: Тип пользователя
 */
router.post(
  "/register",
  validationMiddleware.validateBodyUser,
  UsersControllers.userRegister
);

/**
 * @swagger
 * /api/login:
 *    post:
 *      summary: Аутентификация
 *      description: Идентификация пользователя в приложении
 *      tags:
 *        - Users
 *      requestBody:
 *        $ref: "#/components/requestBodies/Login"
 *      responses:
 *        200:
 *          description: Пользователь успешно аутентифицирован
 * components:
 *   requestBodies:
 *     Login:
 *       description: Свойства пользователя для аутентификации
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: shemplehova@gmail.com
 *                 description: Email пользователя
 *               password:
 *                 type: string
 *                 example: 111111
 *                 description: Пароль пользователя
 */
router.post(
  "/login",
  validationMiddleware.validateBodyUser,
  UsersControllers.loginUser
);

module.exports = router;
