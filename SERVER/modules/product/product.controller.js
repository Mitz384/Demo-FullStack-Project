const { getAllProducts } = require("./product.service");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await getAllProducts();

    const host = `${req.protocol}://${req.get("host")}`;
    const productsFullImagesURL = products.map((product) => ({
      ...product,
      image: product.image ? `${host}${product.image}` : null,
    }));

    res.setHeader("Cache-Control", "public, max-age=600");
    res.json(productsFullImagesURL)
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Error fetching products" });
  }
};
