const db = require("../../config/db");

exports.getAllProducts = async () => {
  const result = await db.query("SELECT * FROM products");
  return result.rows;
}