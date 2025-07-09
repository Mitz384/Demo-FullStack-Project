const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (token == null) {
    return res
      .status(401)
      .json({ message: "Access denied. No authentication token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) { 
      const message =
        err.name === "TokenExpiredError"
          ? "Token expired"
          : "Invalid authentication token";
      return res.status(403).json({ message });
    }

    req.payloadDecoded = payload;
    next();
  });
};

module.exports = authenticateToken;
