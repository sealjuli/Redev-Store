const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) res.status(401).send("Unauthorized");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) res.status(401).send("invalid token");
      // next(new Error("invalid token"));
      req.userId = data.userId;
      req.query.userType = data.userType;
      next();
    });
  } catch (error) {
    res.status(403).send("Forbidden");
  }
};

module.exports = authenticateToken;
