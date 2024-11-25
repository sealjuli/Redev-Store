const { validationResult } = require("express-validator");
const Sentry = require("@sentry/node");
const ProfileServices = require("../services/profilesServices");
const Role = require("../helpers/role");

class ProfileControllers {
  async getProfile(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (req.query.userType === Role.admin) {
        const data = await ProfileServices.getAllProfiles();
        if (data.length > 0) {
          res.send(data);
        } else {
          throw new Error("Профили не найдены.");
        }
      } else {
        const data = await ProfileServices.getProfile(req.userId);
        if (data) {
          res.send(data);
        } else {
          throw new Error("Профиль не найден.");
        }
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      res
        .status(500)
        .json({ message: "Ошибка получения профиля пользователя" });
    }
  }

  async updateProfile(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await ProfileServices.updateProfile(req.userId, req.body);
      if (result) {
        res.send("OK");
      } else {
        throw new Error("Профиль не найден.");
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      res.status(500).json({ message: "Ошибка обновления профиля" });
    }
  }
}

module.exports = new ProfileControllers();
