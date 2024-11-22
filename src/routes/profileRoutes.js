const express = require("express");
const router = express.Router();

const ProfilesControllers = require("../controllers/profilesControllers");
const authenticateToken = require("../middleware/authentificateToken");
const validationProfileMiddleware = require("../middleware/validationProfile");

/**
 * @swagger
 * /api/store/profiles:
 *   get:
 *     summary: Просмотр профиля / для админа просмотр всех профилей
 *     description: Просмотр профиля текущего пользователя, для админа - просмотр всех профилей
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профиль пользователя
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 3f1f954a-b756-4c6e-84fe-7d428a6ccaff
 *           description: Идентификатор профиля
 *         fullname:
 *           type: string
 *           example: Иванован Иван Иванович
 *           description: ФИО
 *         address:
 *           type: string
 *           example: г. Минск
 *           description: адрес
 *         phone:
 *           type: integer
 *           example: 375291803526
 *           description: Номер телефона
 */
router.get("/", authenticateToken, ProfilesControllers.getProfile);

/**
 * @swagger
 * /api/store/profiles:
 *   patch:
 *     summary: Редактирование профиля
 *     description: Редактирование профиля текущего пользователя
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *        $ref: "#/components/requestBodies/Profile"
 *     responses:
 *       200:
 *         description: Профиль успешно обновлен
 * components:
 *   requestBodies:
 *     Profile:
 *       description: Свойства запроса для обновления профиля
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: Иванован Иван Иванович
 *                 description: ФИО
 *               address:
 *                 type: string
 *                 example: г. Минск
 *                 description: адрес
 *               phone:
 *                 type: integer
 *                 example: 375291803526
 *                 description: Номер телефона
 */
router.patch(
  "/",
  authenticateToken,
  validationProfileMiddleware.validateBody,
  ProfilesControllers.updateProfile
);

module.exports = router;
