const bcrypt = require("bcrypt");
const { createToken } = require("../../helpers/jwt");
const { standardizePhoneNumber } = require("../../helpers/phoneFormatter");
const { userResponse } = require("../../helpers/response");
const userModel = require("./user.model");

exports.createUserWithEmail = async ({
  firstName,
  lastName,
  email,
  phoneNumber,
  password,
}) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const standardizedPhoneNumber = standardizePhoneNumber(phoneNumber);

  // Kiểm tra email đã tồn tại hay chưa
  const existedUser = await userModel.findUserByEmail(email);
  if (existedUser) {
    const error = new Error("Email existed");
    error.status = 401;
    throw error;
  }

  // Thêm mới user vào Database
  const newUser = await userModel.insertUserWithPassword({
    firstName,
    lastName,
    email,
    phoneNumber: standardizedPhoneNumber,
    password: hashedPassword,
  });

  // Tạo JWT
  return createToken({ id: newUser.id, email });
};

exports.updateUserStatus = async (id, status) => {
  await userModel.updateUserStatus(id, status);
};

exports.getUserInfo = async (id) => {
  const user = await userModel.findUserById(id);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  return user;
};

exports.createUserWithGoogle = async ({ firstName, lastName, email, done }) => {
  try {
    const existedUser = await userModel.findUserByEmail(email);

    // Nếu đã tồn tại email nhưng không tồn tại password thì đăng nhập luôn bằng google
    if (existedUser) {
      if (existedUser.password) {
        return done(
          new Error(
            "This mail has already been registered with email/password. Please log in using that method"
          ),
          null
        );
      }
      return done(null, userResponse(existedUser));
    }

    // Tạo người dùng mới khi chưa tồn tại trong hệ thống
    const newUser = await userModel.insertUserWithGoogle({
      firstName,
      lastName,
      email,
    });

    if (!newUser) {
      return done(new Error(`Insert user failed`), null);
    }

    return done(null, userResponse(newUser));
  } catch (err) {
    console.error(err);
    return done(err, null);
  }
};
