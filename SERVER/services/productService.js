const connection = require("../config/db");

exports.getAllProducts = async () => {
  const allProductsResult = await connection.query(`SELECT id, name, description, price, image FROM products`);

  if (allProductsResult.rows.length === 0) {
    const error = new Error("Không có sản phẩm");
    error.status = 404;
    throw error;
  }

  return allProductsResult.rows;
};
