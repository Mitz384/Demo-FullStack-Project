const passport = require("passport");
const {
  createUserWithEmail,
  updateUserStatus,
  getUserInfo,
} = require("../services/userService");
const jwt = require("jsonwebtoken");
const { createToken } = require("../helpers/jwt");

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  try {
    const token = await createUserWithEmail({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
    return res.status(200).json({
      success: true,
      message: "Register successfully",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  const { id, email } = req.foundUser;

  try {
    const token = createToken({ id, email });
    await updateUserStatus(id, "online");

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

exports.logoutUser = async (req, res) => {
  const { id } = req.payloadDecoded;
  try {
    await updateUserStatus(id, "offline");
    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  const { id } = req.payloadDecoded;

  try {
    const user = await getUserInfo(id);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.googleLoginCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user || !user.token) {
      const errorMessage = encodeURIComponent(
        err?.message || "Token missing or user not found"
      );
      return res.redirect(`http://localhost:5173/?error=${errorMessage}`);
    }

    return res.redirect(`http://localhost:5173/profile?token=${user.token}`);
  })(req, res, next);
};
