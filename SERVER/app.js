require("dotenv").config();
require("module-alias/register");

const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const authUserRouter = require(path.join(__dirname, "routers", "User", "userRoutes"));
const productRouter = require(path.join(__dirname, "routers", "Product", "productRoutes"));

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use("/api/users", authUserRouter);
app.use("/api/products", productRouter);
app.use("/images", express.static(path.join(__dirname, "./public/images")));

module.exports = app;
