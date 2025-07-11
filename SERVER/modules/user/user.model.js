const db = require("../../config/db");

exports.findUserByEmail = async (email) => {
  const result = await db.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return result.rows[0];
};

exports.insertUserWithPassword = async ({
  firstName,
  lastName,
  email,
  phoneNumber,
  password,
}) => {
  const result = await db.query(
    `INSERT INTO users (first_name, last_name, email, phone_number, password) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [firstName, lastName, email, phoneNumber, password]
  );
  return result.rows[0];
};

exports.insertUserWithGoogle = async ({ firstName, lastName, email }) => {
  const result = await db.query(
    `INSERT INTO users (first_name, last_name, email) 
     VALUES ($1, $2, $3) RETURNING *`,
    [firstName, lastName, email]
  );
  return result.rows[0];
};

exports.updateUserStatus = async (id, status) => {
  await db.query(`UPDATE users SET user_status = $1 WHERE id = $2`, [
    status,
    id,
  ]);
};

exports.findUserById = async (id) => {
  const result = await db.query(
    `SELECT first_name, last_name, email, phone_number FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};
