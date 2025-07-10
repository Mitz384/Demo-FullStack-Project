const { getAllProducts } = require("../services/productService");
const crypto = require("crypto");

let cachedETag = null;

exports.getAllProducts = async (req, res) => {
  try {
    // Nếu đã cache rồi, chỉ dùng lại ETag cũ để kiểm tra
    if (req.headers["if-none-match"] === cachedETag) {
      return res.sendStatus(304);
    }

    const products = await getAllProducts();

    const host = `${req.protocol}://${req.get("host")}`;
    const productsFullImagesURL = products.map((product) => ({
      ...product,
      image: product.image ? `${host}${product.image}` : null,
    }));

    // -------------HTTP Headers Caching-------------
    const json = JSON.stringify(productsFullImagesURL);
    const newEtag = crypto.createHash("md5").update(json).digest("hex");

    cachedETag = newEtag;

    console.log("ETag:", cachedETag);

    // Gửi dữ liệu với ETag và Cache-Control
    res.setHeader("Cache-Control", "public, max-age=300");
    res.setHeader("ETag", cachedETag);
    res.setHeader("Content-Type", "application/json");
    res.send(json);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Error fetching products" });
  }
};
