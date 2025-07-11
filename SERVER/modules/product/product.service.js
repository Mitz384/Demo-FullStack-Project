const productModel = require("./product.model");

exports.getAllProducts = async () => {
  const allProductsResult = await productModel.getAllProducts();

  if (allProductsResult.length === 0) {
    const error = new Error("Không có sản phẩm");
    error.status = 404;
    throw error;
  }

  return allProductsResult;
};
