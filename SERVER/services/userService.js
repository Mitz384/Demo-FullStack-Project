const bcrypt = require("bcrypt");
const connection = require("../config/db");
const { createToken } = require("../helpers/jwt");
const standardizePhoneNumber = (phoneNumber) => phoneNumber.replace(/\s+/g, "");

const userPayloadReturned = ({ id, first_name, last_name, email }) => {
  return {
    first_name,
    last_name,
    email,
    token: createToken({ id, email }),
  };
};

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
  const existedEmail = await connection.query(
    `SELECT id FROM users WHERE email=$1`,
    [email]
  );
  if (existedEmail.rows.length > 0) {
    throw { status: 401, message: "Email existed" };
  }

  // Thêm mới user vào Database
  const newUser = await connection.query(
    `INSERT INTO users(first_name, last_name, email, phone_number, password) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [firstName, lastName, email, standardizedPhoneNumber, hashedPassword]
  );

  // Tạo JWT
  const id = newUser.rows[0].id;
  return createToken({ id, email });
};

exports.updateUserStatus = async (id, status) => {
  await connection.query(`UPDATE users SET user_status = $1 WHERE id = $2`, [
    status,
    id,
  ]);
};

exports.getUserInfo = async (id) => {
  const userResult = await connection.query(
    `SELECT first_name, last_name, email, phone_number FROM users WHERE id = $1`,
    [id]
  );

  if (userResult.rows.length === 0)
    throw { status: 404, message: "User not found" };

  return userResult.rows[0];
};

exports.createUserWithGoogle = async ({ firstName, lastName, email, done }) => {
  try {
    const existedEmail = await connection.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    // Nếu đã tồn tại email nhưng không tồn tại password thì đăng nhập luôn bằng google
    if (existedEmail.rows.length > 0) {
      const existedUser = existedEmail.rows[0];
      if (existedUser.password) {
        return done(
          new Error(
            "This mail has already been registered with email/password. Please log in using that method"
          ),
          null
        );
      }
      return done(null, userPayloadReturned(existedUser));
    }

    // Tạo người dùng mới khi chưa tồn tại trong hệ thống
    const newUser = await connection.query(
      `INSERT INTO users(first_name, last_name, email) VALUES ($1, $2, $3) RETURNING *`,
      [firstName, lastName, email]
    );

    if (newUser.rows.length === 0) {
      return done(new Error(`Insert user failed`), null);
    }

    return done(null, userPayloadReturned(newUser.rows[0]));
  } catch (err) {
    console.error(err);
    return done(err, null);
  }
};
