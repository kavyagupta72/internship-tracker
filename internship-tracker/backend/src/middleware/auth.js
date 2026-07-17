// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.header("token");

    if (!token) {
      return res.status(401).json({ error: "Access denied" });
    }

    const secret = (process.env.JWT_SECRET || "SECRET_KEY_HERE").trim();

    const payload = jwt.verify(token, secret);

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};