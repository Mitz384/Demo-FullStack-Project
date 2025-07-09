require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authUserRouter = require("./routers/User/userRoutes");

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
app.use("/users", authUserRouter);

module.exports = app;
