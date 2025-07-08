const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const connection = require("../../config/db");
const authLogin = require("../../middleWare/authLogin");
const authenticateToken = require("../../middleWare/authenticateToken");
require("../../config/auth");

const app = express();
const router = express.Router();
app.use(passport.initialize());

const standardizePhoneNumber = (phoneNumber) => {
  return phoneNumber.replace(/\s+/g, "");
};
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const standardizedPhoneNumber = standardizePhoneNumber(phoneNumber);

  try {
    const existedEmail = await connection.query(
      `SELECT id FROM users WHERE email=$1`,
      [email]
    );
    if (existedEmail.rows.length > 0) {
      return res.status(401).json({ message: "Email existed" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        "An error occurs while checking existed user from the 'users' table",
    });
  }

  try {
    const userResult = await connection.query(
      `INSERT INTO users(first_name, last_name, email, phone_number, password) VALUES
      ($1, $2, $3, $4, $5) RETURNING id`,
      [firstName, lastName, email, standardizedPhoneNumber, hashedPassword]
    );

    const userId = userResult.rows[0].id;
    const payload = { id: userId, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Register and Login successfully", token });
  } catch (err) {
    return res.status(500).json({
      message: "An error occurs while inserting new user to the 'users' table",
    });
  }
});

router.post("/login", authLogin, async (req, res) => {
  const foundUser = req.foundUser;

  try {
    await connection.query(
      `UPDATE users SET user_status = 'online' WHERE id = $1`,
      [foundUser.id]
    );

    const payload = {
      id: foundUser.id,
      email: foundUser.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ message: "Login successfully", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "An error occurs while updating value of user_status column",
    });
  }
});

router.post("/logout", authenticateToken, async (req, res) => {
  const { id } = req.user;
  try {
    await connection.query(
      `UPDATE users SET user_status = 'offline' WHERE id = $1`,
      [id]
    );
    return res.status(200).json({ message: "Logout successfully" });
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái đăng xuất của người dùng:", err);
    res.status(500).json({
      message: "An error occurs while updating value of user_status column",
    });
  }
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/?error=email-existed",
//     session: false,
//   }),
//   (req, res) => {
//     if (req.token) {
//       res.redirect(`http://localhost:5173/profile?token=${req.token}`);
//     } else {
//       res.redirect("http://localhost:5173/?error=token_generation_failed");
//     }
//   }
// );

router.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err) {
      const errorMessage = encodeURIComponent(err.message);
      return res.redirect(`http://localhost:5173/?error=${errorMessage}`);
    }

    if (!user || !user.token) {
      return res.redirect(
        "http://localhost:5173/?error=Token missing or user not found"
      );
    }

    return res.redirect(`http://localhost:5173/profile?token=${user.token}`);
  })(req, res, next);
});

router.get("/me", authenticateToken, async (req, res) => {
  const { id, exp } = req.user;

  if (exp * 1000 < Date.now()) {
    return res
      .status(403)
      .json({ message: "The authentication token is invalid or expired" });
  }

  let userResult;
  try {
    userResult = await connection.query(
      `SELECT first_name, last_name, email, phone_number FROM users WHERE id = $1`,
      [id]
    );
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occurs while finding user" });
  }
  if (userResult.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  const user = userResult.rows[0];
  res.status(200).json(user);
});

module.exports = router;
