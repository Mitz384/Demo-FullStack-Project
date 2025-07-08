const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.split(" ")[1];

  if (accessToken == null) {
    return res
      .status(401)
      .json({ message: "Access denied. No authentication token" });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res
      .status(403)
      .json({ message: "The authentication token is invalid or expired" });
  }
};

module.exports = authenticateToken