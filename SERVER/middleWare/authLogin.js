const bcrypt = require("bcrypt");

const connection = require("../config/db");

const authLogin = async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password can not be blank" });
  }

  let userResult;
  try {
    userResult = await connection.query(
      `SELECT id, email, password FROM users WHERE email = $1`,
      [email]
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "An error occurred while searching for users by email",
    });
  }
  if (userResult.rows.length === 0) {
    return res.status(401).json({ message: `Email or Password incorrect` });
  }
  const foundUser = userResult.rows[0];

  const isMatchPassword = await bcrypt.compare(password, foundUser.password);

  
  if (isMatchPassword) {
    req.foundUser = foundUser;
    next();
  }
  else{
    res.status(401).json({ message: "Email or Password incorrect" });
  }
};

module.exports = authLogin;
