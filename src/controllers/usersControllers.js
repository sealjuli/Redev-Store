const UsersServices = require("../services/usersServices");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Sentry = require("@sentry/node");

class UsersControllers {
  async userRegister(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, userType } = req.body;

      // Проверка, что пользователь с таким email не существует
      const user = await UsersServices.findUserByEmail(email);
      if (user) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким email уже существует" });
      }

      // проверка, что админ уже существует
      if (userType === "admin") {
        const admin = await UsersServices.findAdmin();
        if (admin) {
          return res
            .status(400)
            .json({ message: "Администратор уже существует" });
        }
      }

      // Хэширование пароля
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Создание нового пользователя
      const newUser = {
        email,
        password: hashedPassword,
        userType,
      };
      await UsersServices.saveUser(newUser);

      res.send("Новый пользователь зарегестрирован");
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      res.status(500).json({ message: "Ошибка регистрации пользователя" });
    }
  }

  async loginUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Поиск пользователя по email
      const user = await UsersServices.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Неверный email или password" });
      }

      // Проверка пароля
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Неверный email или password" });
      }

      // Создание JWT-токена для авторизации
      const token = jwt.sign(
        { userId: user.id, userType: user.userType },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.json({ token });
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      res.status(500).json({ message: "Ошибка входа в систему" });
    }
  }
}

module.exports = new UsersControllers();
