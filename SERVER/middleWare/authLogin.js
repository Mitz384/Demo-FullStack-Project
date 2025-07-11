const bcrypt = require("bcrypt");
const connection = require("../config/db");

const authLogin = async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password can not be blank" });
  }

  try {
    const userResult = await connection.query(
      `SELECT id, email, password FROM users WHERE email = $1`,
      [email]
    );

    let foundUser = null;
    let isMatch = false;

    if (userResult.rows.length > 0) {
      foundUser = userResult.rows[0];
      if (!foundUser.password) {
        return res.status(401).json({
          message: "This account is logged by Google, please login with Google",
        });
      }
      isMatch = await bcrypt.compare(password, foundUser.password);
    } else {
      await bcrypt.compare(
        password,
        "$2b$10$invalidsaltforsafety1234567890abcdefghi"
      );
    }

    if (!isMatch) {
      return res.status(401).json({
        message: "Email or Password incorrect",
      });
    }

    req.foundUser = foundUser;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "An error occurred while while processing login request",
    });
  }
};

module.exports = authLogin;
