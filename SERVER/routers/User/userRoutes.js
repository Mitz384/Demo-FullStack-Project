const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  googleLoginCallback,
} = require("../../controllers/userController");
const authLogin = require("../../middleWare/authLogin");
const authenticateToken = require("../../middleWare/authenticateToken");

require("../../config/auth");

router.post("/register", registerUser);
router.post("/login", authLogin, loginUser);
router.post("/logout", authenticateToken, logoutUser);
router.get("/me", authenticateToken, getCurrentUser);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get("/auth/google/callback", googleLoginCallback);

module.exports = router;
