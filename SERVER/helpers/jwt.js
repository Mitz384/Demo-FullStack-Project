const jwt = require("jsonwebtoken");

exports.createToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
