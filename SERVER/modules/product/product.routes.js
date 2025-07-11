const express = require("express");
const { getAllProducts } = require("./product.controller");
const router = express.Router();

router.get("/get-all-products", getAllProducts);

module.exports = router;
